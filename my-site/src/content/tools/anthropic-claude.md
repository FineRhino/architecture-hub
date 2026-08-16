---
title: "Anthropic Claude"
description: "Claude's model family, context windows, and where it fits alongside other LLM providers"
pubDate: 2024-08-18
category: "LLM Providers"
url: "https://www.anthropic.com"
tags: ["llm", "anthropic", "claude", "function-calling"]
---

## Overview

Anthropic's Claude models are built with a strong emphasis on reliability, instruction-following, and safety. Claude is a common choice for agentic and tool-use workloads, long-document analysis, and code generation.

## Model Lineup

Anthropic organizes models along a speed/capability spectrum, refreshed periodically:

- **Haiku tier** — fastest, cheapest, best for high-volume simple tasks
- **Sonnet tier** — balanced default for most production workloads, strong coding and agentic performance
- **Opus tier** — highest capability, best for the hardest reasoning and analysis tasks

All tiers share a 200K-token context window, which is large enough to fit substantial codebases or document sets directly in context rather than requiring retrieval.

## Key Features

### Tool Use (Function Calling)
Claude supports structured tool calling with multi-turn tool loops, well suited to agentic architectures:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[{
        "name": "search_docs",
        "description": "Search internal documentation",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    }],
    messages=[{"role": "user", "content": "Find our RAG architecture guidelines"}],
)
```

### Extended Thinking
For complex reasoning tasks, Claude can allocate additional internal reasoning tokens before producing a final answer — useful for architecture decisions, debugging, and multi-step planning.

### Prompt Caching
Cache large, reused context (system prompts, documents, few-shot examples) to cut cost and latency on repeated calls — high-value for agent loops that resend the same context on every turn.

### Computer Use / Agentic Tooling
Claude supports agentic workflows that interact with a computer environment (screenshots, mouse/keyboard actions), useful for browser and desktop automation agents.

## Claude vs Alternatives

| Feature | Claude | OpenAI | Open weights |
|---------|--------|--------|---------------|
| **Context window** | 200K (all tiers) | Up to 128K | Varies |
| **Agentic/tool-use focus** | Strong | Strong | Varies widely |
| **Prompt caching** | Yes | Yes | Implementation-dependent |
| **Self-hosting** | No (available via cloud partners) | No | Yes |
| **Safety/alignment focus** | Core design principle | Present | Varies |

## When to Use Claude

✅ **Good for:**
- Agentic systems with multi-step tool use
- Long-document or large-codebase analysis (200K context)
- Code generation and review
- Workloads where instruction-following reliability matters

❌ **Consider alternatives when:**
- You need the widest third-party integration ecosystem
- Self-hosting or on-prem deployment is required
- Extremely latency-sensitive, low-tokens-per-request workloads (Haiku tier narrows this gap significantly)

## Cost Considerations

- Model tiers differ substantially in price — match tier to task complexity rather than defaulting to the top tier
- Prompt caching can cut costs significantly for agent loops that repeat large system prompts or tool definitions
- Batch processing is available for asynchronous workloads at a discount

## Production Considerations

- Available directly via Anthropic's API, and through AWS Bedrock and Google Cloud Vertex AI for teams standardized on those platforms
- Monitor token usage per tier — it's easy to over-provision Opus-tier calls for tasks Haiku or Sonnet would handle
- Extended thinking increases latency; reserve it for tasks that need it rather than enabling it universally

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Developer Platform](https://console.anthropic.com/)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)

## Key Takeaways

1. Sonnet tier is the default starting point for most production agentic workloads
2. 200K context across all tiers reduces the need for retrieval in many document-analysis use cases
3. Prompt caching is worth implementing early for any agent loop with repeated context
4. Match model tier to task complexity — don't default to the top tier
