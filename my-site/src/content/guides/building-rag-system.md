---
title: "Building Your First RAG System"
description: "A step-by-step guide to building a retrieval-augmented generation pipeline, from document ingestion to grounded answers"
pubDate: 2024-08-21
tags: ["guides", "implementation", "rag"]
---

## What You'll Build

A working RAG pipeline that answers questions grounded in your own documents: ingest documents, chunk and embed them, store them in a vector database, retrieve relevant context at query time, and generate a grounded answer. See [RAG Architecture](/patterns/rag-architecture/) for the conceptual background this guide implements.

```
Documents → Chunk → Embed → Vector Store
                                  │
Query → Embed → Retrieve ────────┘
                   │
                   ▼
          Augment Prompt → Generate → Answer
```

## Step 1: Ingest & Chunk Documents

Split documents into chunks small enough to embed meaningfully but large enough to retain context. 300–500 tokens with some overlap is a reasonable starting point.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)

with open("architecture_guidelines.md") as f:
    text = f.read()

chunks = splitter.split_text(text)
print(f"Split into {len(chunks)} chunks")
```

**Key decision:** fixed-size chunking is simple and fast to start with. If retrieval quality is poor later, revisit with semantic chunking (splitting on headings/paragraphs) before tuning anything else.

## Step 2: Generate Embeddings

Convert each chunk into a vector using an embedding model:

```python
from openai import OpenAI

client = OpenAI()

def embed(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding

embeddings = [embed(chunk) for chunk in chunks]
```

For production, batch these calls rather than embedding one chunk at a time — most embedding APIs accept a list of inputs per request.

## Step 3: Store in a Vector Database

Index the chunks and their embeddings for similarity search. This example uses Chroma for a lightweight local setup — see [Vector Databases](/tools/vector-databases/) for production alternatives.

```python
import chromadb

chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="architecture_docs")

collection.add(
    documents=chunks,
    embeddings=embeddings,
    ids=[f"chunk_{i}" for i in range(len(chunks))],
)
```

## Step 4: Retrieve Relevant Context

At query time, embed the user's question and retrieve the nearest chunks:

```python
def retrieve(query: str, top_k: int = 4) -> list[str]:
    query_embedding = embed(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )
    return results["documents"][0]

context_chunks = retrieve("How should we structure our agent memory?")
```

**Key decision:** `top_k` trades recall against context bloat. Start with 3–5 chunks; too few misses relevant context, too many drowns the model in noise and inflates cost.

## Step 5: Augment the Prompt

Assemble retrieved context with the user's question into a single prompt:

```python
def build_prompt(query: str, context_chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(context_chunks)
    return f"""Answer the question using only the context below. If the context
doesn't contain the answer, say so explicitly rather than guessing.

Context:
{context}

Question: {query}"""
```

Explicitly instructing the model to admit when context is insufficient is one of the highest-leverage lines in a RAG prompt — it directly reduces hallucination.

## Step 6: Generate the Answer

```python
import anthropic

anthropic_client = anthropic.Anthropic()

def answer(query: str) -> str:
    context_chunks = retrieve(query)
    prompt = build_prompt(query, context_chunks)

    response = anthropic_client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text

print(answer("How should we structure our agent memory?"))
```

## Step 7: Evaluate Retrieval Quality

RAG quality problems are usually retrieval problems, not generation problems — measure retrieval separately from the final answer:

```python
def evaluate_retrieval(query: str, expected_doc_id: str, top_k: int = 4) -> bool:
    query_embedding = embed(query)
    results = collection.query(query_embeddings=[query_embedding], n_results=top_k)
    return expected_doc_id in results["ids"][0]

test_cases = [
    ("How should we structure our agent memory?", "chunk_12"),
    ("What vector databases are recommended?", "chunk_3"),
]

hits = sum(evaluate_retrieval(q, doc_id) for q, doc_id in test_cases)
print(f"Retrieval accuracy: {hits}/{len(test_cases)}")
```

Build a small labeled test set (query → expected source chunk) early — it's the fastest way to catch retrieval regressions as you tune chunk size, `top_k`, or swap embedding models.

## Common Pitfalls

- **Chunking too large** — dilutes embedding relevance; the vector represents an average of unrelated ideas
- **Chunking too small** — fragments context so retrieved chunks don't carry enough meaning to answer the question
- **No "I don't know" instruction** — without it, the model will confidently answer from retrieved noise or its own training data instead of admitting the context is insufficient
- **Ignoring retrieval metrics** — teams often tune the generation prompt when the actual failure is retrieval missing the right chunk entirely
- **Skipping metadata** — storing only text without source/date metadata makes it impossible to filter stale documents or cite sources later

## Next Steps

1. Add metadata filtering (date, source, category) to narrow retrieval for multi-document collections
2. Add hybrid retrieval (keyword + vector) if exact-term queries perform poorly
3. Add reranking for higher-precision retrieval on critical queries
4. Move from Chroma to a production vector database once scale or uptime requirements exceed a local setup — see [Vector Databases](/tools/vector-databases/)
5. Track hallucination rate and citation accuracy in production, not just at build time

## Resources

- [RAG Architecture](/patterns/rag-architecture/)
- [Vector Databases](/tools/vector-databases/)
- [LangChain RAG Documentation](https://python.langchain.com/docs/use_cases/question_answering/)
