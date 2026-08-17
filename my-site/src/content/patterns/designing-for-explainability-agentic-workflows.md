---
title: "Designing for Explainability in Agentic Workflows"
description: "Explainability in agentic systems is a record-keeping problem, not an interpretability problem. A design pattern for capturing evidence during a run and publishing it to three different audiences."
pubDate: 2026-08-16
tags: ["explainability", "agentic-systems", "governance", "observability", "architecture-patterns"]
---

*Part 2 of 2 — see [Designing for Explainability: Building Trustworthy AI Systems](/patterns/designing-for-explainability/) for the general pattern (interpretable models, post-hoc explanation, model cards). This piece is about the specific failure mode that shows up once "the model" becomes "a multi-step agent run."*

Most explainability tooling was built for a world with one model and one prediction. You had a scoring function, a feature vector, and a question — why this output for this input? SHAP and LIME answered it by perturbing inputs and measuring what moved. The explanation was computed after the fact, from a model that would give the same answer tomorrow.

Agentic workflows break every assumption in that sentence.

A single agent run is a trajectory, not a prediction. It retrieves documents, calls tools, evaluates intermediate results, retries failures, sometimes pauses for a human, and produces an outcome shaped as much by what it encountered along the way as by the model at its center. There is no feature vector to perturb. The interesting causal work happened in the sequence.

Worse, you cannot re-run it to find out. The model version has changed, the retrieval corpus has been reindexed, the downstream API returns different data than it did in March, and the sampling is stochastic anyway. **A trajectory that was not captured while it happened is gone.** This is the structural fact that should drive the architecture: explainability in agentic systems is a record-keeping problem before it is an interpretability problem.

## Capture and publish are two different systems

The most common design error is treating explainability as one concern. It is two, and they have almost nothing in common.

**Capture** runs inside the request path, is high-volume, structured, machine-written, and never seen by a human in its raw form. Its job is completeness — record enough that any future question can be answered, without knowing which questions will be asked.

**Publish** runs at read time, is low-volume, human-facing, redacted, and derived. Its job is selection — answer one reader's question at their level of authority and comprehension, and answer it consistently every time it is asked.

Conflating them produces the two failure modes you see most often in production. Teams that build only capture end up with terabytes of traces nobody can interrogate, and an auditor's question takes four days of engineering time. Teams that build only publishing generate explanations at read time from a summary — which means the explanation is a plausible reconstruction rather than a record of what occurred, and it can change between readings of the same decision.

Draw the boundary explicitly:

```
  request path                  │  read path
                                │
  agent run                     │
    ├─ emits events ─────────┐  │
    └─ returns response      │  │
                             ▼  │
                    ┌──────────────────┐
                    │ evidence store   │  append-only, hashed
                    │ (decision record)│  long retention
                    └────────┬─────────┘
                             │        │
                    ┌────────▼─────────┐
                    │ publishing layer │  redact · translate · scope
                    └────────┬─────────┘
                             │        │
              operator ◄─────┼────► auditor ◄────► subject
```

The evidence store is written once and never updated. Everything a human reads is a projection of it.

## Three readers, one run

The publishing layer exists because three distinct people need an explanation of the same run, and giving any of them another's view is a mistake.

**The operator**, debugging within the hour, needs the full trajectory at maximum fidelity: prompts, tool arguments, raw responses, latencies, stack traces. Retention can be short — days. Access is broad within the engineering team.

**The reviewer or auditor**, arriving three months to seven years later, needs something different in kind. Not the transcript, but the decision: what inputs were in play, which policy applied, what alternatives existed, what was chosen, who approved it, and — critically — the state of the world *as of that moment*. Retention is long, immutability matters, and the record must remain interpretable after the system that produced it has been rewritten twice.

**The subject** — the person or business affected by the outcome — needs a short, plain-language justification and a route to challenge it. They need it now, in the interface where the outcome appeared. They must not receive internal reasoning, competitor-visible logic, or other people's data.

One capture schema, three projections. If your design has only one output format, you have implicitly chosen one reader and failed the other two.

## What belongs in a decision record

The transcript is not the record. The transcript is evidence *for* the record. What survives long-term should be small, structured, and self-describing:

```jsonc
{
  "run_id": "…",              // stable, referenceable forever
  "parent_run_id": "…",       // for nested / delegated agents
  "occurred_at": "…",

  // the bill of materials — what the system WAS at this moment
  "composition": {
    "agent_version": "…",
    "prompt_template_ids": ["…"],   // versioned, content-hashed
    "model": { "id": "…", "version": "…" },
    "tools": [{ "name": "…", "version": "…" }],
    "policy_bundle_version": "…"
  },

  // resolved inputs, not references that will drift
  "inputs": { "values": {…}, "content_hash": "…" },

  // what was retrieved, pinned to versions
  "evidence": [
    { "source_id": "…", "version": "…", "hash": "…", "span": [start, end] }
  ],

  // the decision points that actually mattered
  "decisions": [
    {
      "step": 3,
      "question": "…",
      "options_considered": ["…"],
      "chosen": "…",
      "basis": ["evidence_id", "…"],
      "score": 0.0
    }
  ],

  "guardrails": [{ "check": "…", "result": "pass|fail|override" }],
  "human_actions": [{ "actor": "…", "action": "…", "at": "…" }],
  "outcome": { "value": "…", "confidence": …, "deferred": false },
  "transcript_ref": "…"        // pointer to the verbose, short-lived blob
}
```

Two fields in that structure carry most of the weight.

**`composition`** is the bill of materials. When an auditor asks why two identical cases got different answers eight months apart, this is the field that answers it, and no amount of transcript will substitute. Version everything that can change independently — prompts especially, since they change far more often than models and are almost never versioned in practice.

**`evidence`** must pin retrieved content to a version and hash, not just an identifier. A record that says "consulted policy document 4471" is worthless if document 4471 has been revised three times since. This is the same *as-of* problem that master data management has always had, and the same solution applies: either snapshot the value or make the pointer version-specific. Anything else produces a record that appears complete and silently lies.

## Six principles for the capture layer

**Instrument the system, not the narrative.** Do not ask the model to explain why it did something and store the answer as your audit trail. Self-reported reasoning is a plausible account generated after the fact; it is not causally connected to the computation that produced the output. Capture what the system *did* — which documents were retrieved, which tool returned what, which threshold was crossed. Chain-of-thought is a useful debugging artifact and a terrible evidentiary one.

**Emit out-of-band.** Evidence writes should not sit in the latency path of the response, and a failure in the evidence store should not fail the user's request. Buffer and ship asynchronously. But make the failure loud — a silently degraded capture layer is worse than none, because you will believe you have coverage.

**Make it append-only and content-addressed.** Ordinary application logs are mutable by anyone with operational access, which is exactly why they don't satisfy scrutiny. Hash each record and chain the hashes so tampering is detectable. This matters more than it sounds: the value of an audit trail is entirely a function of whether anyone believes it wasn't edited.

**Separate the small record from the big blob.** The decision record is kilobytes and lives for years. The transcript is megabytes and lives for weeks. Storing them together forces you to choose between a ruinous storage bill and losing the thing you actually needed.

**Capture the negative space.** What the agent considered and rejected, where confidence was low, where it deferred to a human, which guardrail fired. These are the fields reviewers reach for first and the ones almost nobody records, because they're invisible in a happy-path trace.

**Capture human interventions as first-class events.** When someone overrides an agent, that override *is* the decision, and the record should show who, when, what changed, and what reason they gave. Systems that log agent actions but not human corrections produce records that misattribute the outcome.

## The publishing layer

Publishing is a translation and authorization problem. Four properties are worth designing for deliberately:

**Progressive disclosure.** One sentence of justification, expandable to an evidence summary, expandable to the full trajectory — with each tier gated by role. Most readers stop at tier one, and that is the design working correctly.

**Stable citation.** Every published claim should link to an evidence identifier that resolves for the lifetime of the record. If your explanation says a determination was based on a specific policy, the reader should be able to click through to the version of that policy that was actually in force. This single property does more for trust than any amount of narrative polish.

**Derived, never raw.** Raw traces contain regulated personal data, third-party content, your prompts as intellectual property, and internal reasoning that is often embarrassing out of context. The publishing layer redacts by construction — it builds from a whitelist of fields rather than filtering a blacklist out of the transcript.

**Determinism.** The same run, published twice, must produce the same explanation. If your publishing layer uses a model to write the narrative, either cache the generated text as part of the record or accept that your explanation is itself unexplainable.

## Retention, integrity, and the regulatory floor

If any part of your workflow is in scope for the EU AI Act, this stops being an architectural preference. [Article 12](https://artificialintelligenceact.eu/article/12/) requires that high-risk AI systems technically allow for the automatic recording of events over the system's lifetime, and manual recording does not satisfy it — the system itself must generate the records without operator intervention.

The compliance timeline moved after this pattern was first drafted. The [June 2026 Digital Omnibus amendments](https://www.traverssmith.com/knowledge/knowledge-container/eu-agrees-to-delay-key-ai-act-compliance-deadlines/) pushed the Annex III high-risk obligations — where Article 12 lives — out to 2 December 2027, with embedded (Annex I) systems following on 2 August 2028. Article 50's transparency duties and the Commission's GPAI enforcement powers stayed on the original 2 August 2026 date. The delay moves the deadline, not the destination: "the standards aren't final yet" is a better reason to start the capture layer early than to wait.

Two things are worth noting about how Article 12 itself is written. It defines outcomes without specifying implementation, and the technical standards that would fill the gap — prEN 18229-1 and ISO/IEC DIS 24970 — are still in draft. And it does not name a retention period, though regulators read the tamper-evidence requirement into the phrase about logs being appropriate to the system's intended purpose. Building to a defensible interpretation now is considerably cheaper than retrofitting once the standards land.

## Anti-patterns

- **Transcript as lineage.** Storing full conversation logs and calling it explainability. You have the words, not the causal chain, and you cannot query it.
- **Read-time generation.** Producing the explanation by summarizing a stored outcome. This generates a story consistent with the answer rather than a record of how it was reached, and it varies between readings.
- **Self-explanation as evidence.** Covered above, and worth repeating because it is the single most common design in the wild.
- **Unversioned prompts.** The fastest-changing component in the system, almost never captured, and the usual answer to "why did this change?"
- **One view for everyone.** Handing an operator's trace to a subject leaks; handing a subject's one-liner to an auditor fails.
- **Retention set by the logging tool.** The most avoidable failure on this list.

## Where to start

You do not need the full architecture to get most of the value. Three moves, in order:

1. **Define the decision record schema before instrumenting anything.** Thirty minutes of schema design determines whether the next two years of captured data can answer questions. Start with `composition`, `evidence`, and `decisions`.
2. **Version and hash your prompts.** Cheapest high-value change available, and it makes the most common audit question answerable immediately.
3. **Write one publishing projection — the subject-facing one.** It is the hardest of the three because it forces you to discover what you can actually justify in a sentence. Whatever it can't source is a gap in your capture layer, surfaced early.

The reframe worth carrying: in a deterministic system, you can explain a decision by re-deriving it. In an agentic one, you can only explain a decision you had the foresight to witness. Design the witness first.
