---
title: "LangChain: Orchestrating AI Applications"
description: "Build production AI apps with LangChain, LCEL, and LangGraph"
pubDate: 2024-08-15
updatedDate: 2026-08-16
category: "Frameworks"
url: "https://www.langchain.com"
tags: ["frameworks", "orchestration", "python", "javascript", "langgraph"]
---

## What is LangChain?

LangChain is a framework for developing applications powered by language models. Since this article was first published, the ecosystem has split into two complementary layers, and it's important to know which one you actually need:

- **LangChain** (with LCEL) — composable chains, RAG pipelines, and rapid prototyping
- **LangGraph** — the recommended orchestration layer for production-grade, stateful agents

Both reached **v1.0 in October 2025**, marking the framework's first stable major release after several years of rapid, breaking-change iteration.

## Core Concepts

### Chains and LCEL
LangChain Expression Language (LCEL) is the modern, standard way to compose chains — connecting prompts, models, and parsers with a pipe operator:

```python
chain = prompt | model | output_parser
```

LCEL supports streaming and parallel execution out of the box. The older `LLMChain` class it replaced is deprecated — if you see it in a tutorial, treat that tutorial as outdated.

### Agents vs. Graphs
Simple, linear agent behavior can still be expressed directly in LangChain. But once an agent needs persistent memory across sessions, conditional branching, multi-agent coordination, or human-in-the-loop approval steps, that's **LangGraph's** job, not LangChain's. LangGraph models the agent as an explicit graph of nodes and edges, which is what makes things like audit trails and rollback points tractable in production — the same reason it's become the default choice at companies like Uber, LinkedIn, Klarna, and Elastic.

### Memory
Persist and retrieve conversation history:
- Conversation buffer
- Summary memory
- Entity memory
- LangGraph's persistent checkpointing (for anything beyond a single session)

### Tools
Integrate external capabilities:
- APIs and webhooks
- Database queries
- File operations
- Search and retrieval

## LangChain vs Alternatives

| Feature | LangChain + LangGraph | CrewAI | Microsoft Agent Framework | LlamaIndex |
|---------|------------------------|--------|-----------------------------|-----------|
| **Language Support** | Python, JS | Python | Python, .NET | Python, JS |
| **Focus** | General orchestration + stateful agents | Role-based multi-agent prototyping | Unified enterprise agent platform | Indexing & retrieval |
| **Learning Curve** | Moderate–higher (two-layer model) | Low | Moderate | Moderate |
| **Production maturity** | High (v1.0, widest enterprise adoption) | Growing, lighter production controls | High (Azure-native governance) | Growing |
| **Best For** | Complex, stateful production agents | Fast multi-agent prototypes | Microsoft/Azure-standardized shops | RAG-heavy systems |

A note on that "Microsoft Agent Framework" column: as of October 2025, Microsoft merged **AutoGen** and **Semantic Kernel** into a single unified framework, with general availability targeted for early 2026. AutoGen as a standalone project is now in maintenance mode (security patches only) — if you're evaluating it today, evaluate Microsoft Agent Framework instead.

## Key Features

### 1. Multiple Model Support
LangChain's unified model interface lets you swap providers (OpenAI, Anthropic, Google, open-weight models via Ollama and others) with minimal code changes, and configure fallback chains across them. Avoid hardcoding specific model version strings in your architecture docs — that's the part of this ecosystem that changes fastest; pin versions in config, not in prose.

### 2. Built-in Components
- Chat memory management
- Output parsing (including structured/JSON-schema output)
- Prompt templates
- Document loaders

### 3. Integration Ecosystem
- Hundreds of third-party integrations
- **LangSmith** for tracing, evaluation, and deployment (see below)

## When to Use LangChain (and When You Need LangGraph Too)

✅ **LangChain alone is enough for:**
- RAG pipelines and retrieval-heavy applications
- Rapid prototyping
- Simple, linear multi-step chains

✅ **Add LangGraph when you need:**
- Stateful, long-running agents
- Multi-agent coordination
- Human-in-the-loop approval steps
- Production requirements around auditability and recovery

❌ **Overkill for:**
- Simple single LLM calls
- Lightweight applications
- When minimizing dependencies matters

## Getting Started

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LCEL: compose a chain with the pipe operator
prompt = ChatPromptTemplate.from_template(
    "What is a good company name for {company}?"
)
model = ChatOpenAI(model="gpt-4o", temperature=0.9)
chain = prompt | model | StrOutputParser()

result = chain.invoke({"company": "AI consulting"})
```

## LangSmith: Observability, Evaluation, and Deployment

LangSmith has grown well beyond a tracing tool into a full agent operations platform:

- **Tracing** — step-by-step visibility into every chain and agent run
- **Evaluation** — offline datasets plus online, multi-turn, LLM-as-judge evaluators
- **LangSmith Fleet** — agent identity, sharing, and permissions for managing agents across a company (formerly "Agent Builder")
- **Unified cost view** across an entire agent workflow, not just individual LLM calls
- **OpenTelemetry support** — any OTel-compatible app can export traces to LangSmith
- **Deployment** — what used to be a separate product called LangGraph Platform is now part of LangSmith, branded as **LangSmith Deployment**

## Deployment: LangServe Is Deprecated

If you've seen older guides recommend **LangServe** for exposing chains as REST APIs — that project was archived in May 2026 and is no longer accepting feature development. For new projects, deploy through **LangSmith Deployment** (formerly LangGraph Platform) instead, which adds persistence, human-in-the-loop workflows, cron scheduling, webhooks, and streaming support out of the box.

## Best Practices

1. **Default to LCEL, not the old chain classes** — anything still using `LLMChain` should be migrated.
2. **Reach for LangGraph deliberately, not by default** — it solves real problems (state, coordination, auditability) but adds real complexity. Don't add it to a simple RAG pipeline that doesn't need it.
3. **Cache when possible** — reduce API calls.
4. **Version your prompts** — track changes over time.
5. **Use LangSmith's evaluation tooling before shipping changes** — regressions in agent behavior are easy to miss without a dataset-backed eval step.

## Integration Examples

- **Databases:** SQLAlchemy, Chroma, Pinecone
- **Search:** Google Search, DuckDuckGo
- **Communication:** Slack, Email
- **APIs:** OpenWeather, News, Stock APIs

## Production Considerations

- **Cost monitoring** — LangSmith's unified cost view covers full workflows, not just individual calls
- **Latency** — cache and optimize chains
- **Error handling and fallbacks** — model and service redundancy
- **Observability** — LangSmith tracing, or OpenTelemetry export to your existing stack
- **State and recovery** — for anything long-running, this is a LangGraph concern, not something to bolt onto plain LangChain

## Resources

- [Official Documentation](https://python.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangSmith Docs](https://docs.smith.langchain.com/)
- [GitHub Repository](https://github.com/langchain-ai/langchain)

## Conclusion

LangChain remains a strong default for teams building production AI applications, but the honest 2026 picture is a two-layer one: LangChain plus LCEL for composition and RAG, LangGraph for anything stateful or multi-agent, and LangSmith across both for observability, evaluation, and deployment. Treat any guide (including older versions of this one) that only talks about LangChain in isolation as incomplete.

**Best suited for:** Teams building complex, stateful AI systems who are willing to learn the LangChain/LangGraph split rather than treating LangChain as a single monolithic framework.
