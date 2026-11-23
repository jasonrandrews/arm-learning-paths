---
title: Explore the local agent architecture on Arm64
description: Understand the local architecture for running Nous Research Hermes Agent with llama.cpp and Gemma 4 on a 64 GB Arm64 Linux workstation, including memory budgets and MoE versus Dense trade-offs.
weight: 2

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Local autonomous agent capabilities

You'll build a fully local autonomous coding and workspace agent on an Arm64 Linux system. Instead of relying on cloud APIs, you'll run **Gemma 4 E4B** (`gemma-4-E4B-it-Q4_0.gguf`, ~4.3 GB) through a natively compiled `llama.cpp` server and connect **Nous Research Hermes Agent** to it for fast, practical tasks such as inspecting workspaces, diagnosing and fixing code or syntax errors, and running verification commands.

Autonomous agents place different demands on local inference than simple chat sessions. Each user request can trigger multiple back-and-forth tool calls—listing directories, reading files, editing code, and running verification commands—requiring:

- **Large context windows:** Hermes Agent requires at least a **64K context window** (`-c 65536`) to hold system prompts, tool schemas, file contents, and multi-step conversation history.
- **Fast prompt prefill:** Hermes Agent sends a ~11K-token system prompt and tool schema on the first turn of a session, making a compact model like Gemma 4 E4B much more responsive on CPU-only hardware than 26B–31B models.
- **Predictable memory usage:** Using Gemma 4 E4B with a quantized `q8_0` 64K KV cache keeps total system RAM usage around `12 GiB`, leaving plenty of headroom even on 16 GB–32 GB Arm64 systems.

## System architecture

The runtime consists of two local processes communicating over loopback HTTP:

```text
+-----------------------------------------------------------------------+
|                         User Terminal (CLI)                           |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                   Nous Research Hermes Agent                          |
|  - Autonomous planning & multi-step tool loop                         |
|  - Built-in tools: shell, filesystem, skills                          |
+-----------------------------------+-----------------------------------+
                                    |
                                    | OpenAI-compatible HTTP API
                                    | http://127.0.0.1:8080/v1
                                    v
+-----------------------------------------------------------------------+
|                    llama-server (llama.cpp)                           |
|  - Native Arm64 CPU build (-DGGML_NATIVE=ON -DGGML_OPENMP=ON)         |
|  - 64K context (-c 65536), Flash Attention, q8_0 KV cache             |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       System RAM (16 GB–64 GB DDR4)                   |
|  - Gemma 4 E4B GGUF weights (~4.3 GB)                                 |
|  - 64K quantized KV cache (q8_0)                                      |
+-----------------------------------------------------------------------+
```

Because `llama-server` exposes an OpenAI-compatible `/v1` API, Hermes Agent does not need to know how or where the model is executed. You can swap between Gemma 4 models or adjust CPU thread counts without changing your agent workflow.

## Memory budget with a 64K context window

Fitting an agent model alongside a 64K context window in system RAM requires sizing both the model weights and the KV cache. Quantizing the KV cache to `q8_0` and enabling Flash Attention (`-fa on`) keeps memory growth compact while preserving accuracy.

| Component | Gemma 4 E4B (`Q4_0`) | Gemma 4 26B-A4B (MoE, `Q4_0`) | Notes |
|---|---|---|---|
| Model weights | ~4.3 GB | ~13.6 GiB | Loaded into system RAM |
| 64K KV cache (`q8_0`) | ~2–3 GB | ~4–6 GB | Scales with layer count and GQA configuration |
| OS, desktop & Hermes Agent | ~4–5 GB | ~4–6 GB | Leaves headroom for build tools and test tasks |
| **Total estimated RAM** | **~11–13 GB** | **~22–26 GB** | E4B fits comfortably on 16 GB+ workstations |

## Choosing the right Gemma 4 size for Arm64 CPUs

CPU LLM inference is **memory-bandwidth bound** during token generation and **compute/bandwidth bound** during long-context prompt prefill. While larger models have a higher reasoning ceiling, compact models like **Gemma 4 E4B** are ideal for everyday agent tasks such as fixing syntax errors, patching small scripts, and running CLI checks:

| Characteristic | Gemma 4 E4B (`Q4_0`) | Gemma 4 26B-A4B (MoE, `Q4_0`) | Gemma 4 31B (Dense, `Q4_0`) |
|---|---|---|---|
| Effective / active parameters | **4.5B** (7.5B total) | **4B** active (25.2B total) | **30.7B** active |
| Quantized GGUF size | ~4.3 GB | ~13.6 GiB | ~16.7 GiB |
| Cold 11K-token prefill feel | Fast (~1m 20s) | Moderate (~3m) | Slow (10m+) |
| Best use case on Arm64 CPU | Fast code fixes, file inspection, CLI tasks | Deeper multi-file reasoning | Offline batch reasoning |

## What you've accomplished and what's next

You've reviewed the local agent architecture, the memory budget for a 64K context window, and why **Gemma 4 E4B** is well suited for fast, everyday CPU-only agentic tasks on Arm64.

Next, you'll verify your Arm64 Linux environment and compile `llama.cpp` natively from source.
