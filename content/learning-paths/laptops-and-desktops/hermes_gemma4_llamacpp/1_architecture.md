---
title: Explore the local agent architecture on Arm64
description: Understand the local architecture and memory budget for running Nous Research Hermes Agent with llama.cpp and Gemma 4 E4B on an Arm64 Linux system.
weight: 2

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Local autonomous agent capabilities

You'll build a fully local autonomous coding and workspace agent on an Arm64 Linux system. Instead of relying on cloud APIs, you'll run Gemma 4 E4B using a llama.cpp server compiled from source and connect Nous Research Hermes Agent to it for fast, practical tasks such as inspecting workspaces, diagnosing and fixing code or syntax errors, and running verification commands.

Autonomous agents place different demands on local inference than simple chat sessions. Each user request can trigger multiple back-and-forth tool calls (such as listing directories, reading files, editing code, and running verification commands) that need:

- Large context windows: Hermes Agent needs at least a 64K context window to hold system prompts, tool schemas, file contents, and multi-step conversation history.
- Fast prompt prefill: Hermes Agent sends an ~11K-token system prompt and tool schema on the first turn of a session, making a compact model such as Gemma 4 E4B responsive on CPU-only hardware.
- Predictable memory usage: Using Gemma 4 E4B with a quantized 64K KV cache keeps total system RAM usage around 12 GiB, leaving plenty of headroom even on 16 GB–32 GB Arm64 systems.

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
|  - Arm64 CPU build (-DGGML_NATIVE=ON -DGGML_OPENMP=ON)                |
|  - 64K context (-c 65536), Flash Attention, q8_0 KV cache             |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       System RAM (16 GB or more)                      |
|  - Gemma 4 E4B GGUF weights (~4.3 GB)                                 |
|  - 64K quantized KV cache (q8_0)                                      |
+-----------------------------------------------------------------------+
```

Because `llama-server` exposes an OpenAI-compatible `/v1` API, Hermes Agent doesn't need to know how or where the model runs. You can adjust CPU thread counts or server settings without changing your agent workflow.

## Memory budget with a 64K context window

Fitting an agent model alongside a 64K context window in system RAM means sizing both the model weights and the KV cache. Using 4-bit quantized model weights (`Q4_0`) together with an 8-bit quantized KV cache (`q8_0`) and Flash Attention (`-fa on`) keeps memory growth compact while preserving long-context accuracy.

| Component | Gemma 4 E4B | Notes |
|---|---|---|
| Model weights | ~4.3 GB | Loaded into system RAM |
| 64K KV cache (`q8_0`) | ~2–3 GB | Scales with layer count and grouped-query attention (GQA) configuration |
| OS, desktop, and Hermes Agent | ~4–5 GB | Leaves headroom for build tools and test tasks |
| **Total estimated RAM** | **~11–13 GB** | Fits comfortably on 16 GB or larger Arm64 systems |

## What you've learned and what's next

You've reviewed the local agent architecture and the memory budget for running Gemma 4 E4B with a 64K context window on Arm64 Linux.

Next, you'll verify your Arm64 Linux environment and compile llama.cpp from source.
