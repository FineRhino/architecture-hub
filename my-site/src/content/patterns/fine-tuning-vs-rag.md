---
title: "Fine-Tuning vs. RAG: A Decision Framework"
description: "How to decide between fine-tuning, retrieval-augmented generation, or both"
pubDate: 2024-08-20
tags: ["patterns", "fine-tuning", "rag", "decision-framework"]
---

## The Question Behind the Question

"Should we fine-tune or use RAG?" usually hides a more specific question: *what kind of gap are we trying to close between the base model and what we need?* Fine-tuning and RAG close different gaps, and conflating them leads to expensive dead ends — most commonly, teams fine-tune to "teach" the model facts that change weekly, when what they needed was retrieval.

## What Each Approach Actually Changes

### RAG: Changes what the model knows
Retrieval injects external information into the prompt at request time. The model's underlying behavior, style, and reasoning ability are unchanged — it's simply given better material to reason over.

### Fine-Tuning: Changes how the model behaves
Fine-tuning adjusts model weights based on example input/output pairs. It changes tone, format adherence, task-specific reasoning patterns, and domain vocabulary — not the model's access to facts.

## Decision Framework

Ask these questions in order:

### 1. Does the information change frequently?
- **Yes → RAG.** Fine-tuning bakes knowledge in at training time; anything that changes daily/weekly will be stale before you finish training.
- **No** → continue to question 2.

### 2. Is the problem "the model doesn't know X" or "the model doesn't behave like Y"?
- **Doesn't know X** (facts, documents, proprietary data) → **RAG.**
- **Doesn't behave like Y** (wrong tone, ignores output format, doesn't reason the way your domain requires) → **fine-tuning.**

### 3. Do you need source attribution?
- **Yes → RAG.** Fine-tuned knowledge has no citation trail; retrieved documents do.
- **No** → either could work; move to cost/effort considerations.

### 4. Is the required behavior expressible in a system prompt?
- **Yes → try prompting first.** It's cheaper and faster to iterate than either RAG or fine-tuning, and often sufficient.
- **No, prompting has plateaued** → fine-tuning becomes worth the investment.

## Common Scenarios

| Scenario | Recommended Approach | Why |
|----------|----------------------|-----|
| Customer support bot needs current product docs | RAG | Docs change constantly; need citations |
| Model should always respond in a specific JSON schema | Prompting + structured outputs first, fine-tune if that plateaus | Format adherence is often promptable |
| Domain-specific jargon and reasoning style (legal, medical) | Fine-tuning | Behavioral change, not a knowledge gap |
| Proprietary internal knowledge base | RAG | Frequently updated, needs attribution |
| Consistent persona/voice across thousands of interactions | Fine-tuning | Style consistency is a behavioral pattern |
| Model needs to reason about a niche coding framework's conventions | Fine-tuning, sometimes combined with RAG for API references | Reasoning pattern + factual lookup, split by concern |

## Combining Both

These aren't mutually exclusive. A common production pattern:

```
Fine-tuned model (domain reasoning, tone, format)
        +
RAG (current facts, proprietary documents, citations)
        =
Domain-specialized system grounded in current knowledge
```

Fine-tune for the behavioral layer, retrieve for the factual layer.

## Cost & Effort Comparison

| Factor | RAG | Fine-Tuning |
|--------|-----|--------------|
| **Setup cost** | Moderate (vector DB, embedding pipeline) | High (training data curation, training runs, eval) |
| **Update cost** | Low (re-index documents) | High (retrain or continue-train) |
| **Iteration speed** | Fast | Slow |
| **Data requirements** | Documents to index | Labeled example pairs (hundreds to thousands) |
| **Failure mode** | Retrieval misses relevant docs | Overfitting, catastrophic forgetting of general ability |

## When Neither Is the Answer

Before committing to either, check whether a better system prompt, few-shot examples, or structured output constraints solve the problem — see [Prompt Engineering](/patterns/prompt-engineering/). Both RAG and fine-tuning add real operational cost; they're worth it only once prompting has genuinely plateaued.

## Getting Started

1. Classify the gap: knowledge gap or behavior gap (or both)
2. If knowledge gap → prototype with RAG first; it's faster to validate
3. If behavior gap → exhaust prompting options before fine-tuning
4. If both → build RAG first, then evaluate whether remaining behavioral gaps justify fine-tuning
5. Re-evaluate periodically — a "fine-tuning problem" today can become a RAG problem if the domain starts changing faster

## Resources

- [OpenAI Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Anthropic: When to Fine-tune](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [A Survey on Retrieval-Augmented Text Generation](https://arxiv.org/abs/2202.01110)
