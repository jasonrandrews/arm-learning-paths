---
title: Download Gemma 4 and benchmark CPU performance on Arm64
description: Download Gemma 4 E4B (and optionally 26B-A4B MoE and 31B Dense) GGUF weights and benchmark CPU performance and thread scaling on Arm64 Linux with llama-bench.
weight: 4

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Download the Gemma 4 GGUF model

From inside your `llama.cpp` directory, create a `./models` directory and set up a Python virtual environment for the Hugging Face CLI:

```bash
mkdir -p models
python3 -m venv .venv
source .venv/bin/activate
pip install -U "huggingface_hub[cli]"
```

Download **Gemma 4 E4B** (`Q4_0` quantization, ~4.3 GB), which gives you the best balance of fast prompt prefill, low RAM usage, and tool-calling capability for everyday code-fixing tasks:

```bash
hf download ggml-org/gemma-4-E4B-it-GGUF \
  --include "*Q4_0*.gguf" \
  --local-dir ./models
```

*(Optional)* If you have 64 GB RAM and want to compare the larger **Gemma 4 26B-A4B (MoE)** and **Gemma 4 31B (Dense)** models, download them as well:

```bash
hf download ggml-org/gemma-4-26B-A4B-it-GGUF \
  --include "*Q4_0*.gguf" \
  --local-dir ./models

hf download ggml-org/gemma-4-31B-it-GGUF \
  --include "*Q4_0*.gguf" \
  --local-dir ./models
```

Verify the downloaded `.gguf` file is present in `./models/`:

```bash
ls -lh ./models/gemma-4-E4B-it-Q4_0.gguf
```

The output is similar to:

```output
-rw-rw-r-- 1 user user 4.3G Nov 20 16:19 ./models/gemma-4-E4B-it-Q4_0.gguf
```

## Benchmark Gemma 4 on Arm64

On many-core Arm64 systems, using every available core does not always produce the highest token-generation speed. Once enough threads saturate the memory channels, adding more threads increases synchronization overhead and cross-cache traffic without increasing memory bandwidth.

Benchmark **Gemma 4 E4B** (adjust `-t` to match your system's core count or test a sweep such as `-t 8,16,32`):

```bash
./build/bin/llama-bench \
  -m ./models/gemma-4-E4B-it-Q4_0.gguf \
  -t $(nproc) -r 1 \
  -p 512 -n 128
```

Record your observed prompt processing (`pp512`) and token generation (`tg128`) speeds in the table below. For reference, here are baseline results from a 64-core Arm64 DDR4 workstation comparing **Gemma 4 E4B**, **Gemma 4 26B-A4B (MoE)**, and **Gemma 4 31B (Dense)**:

| Model | Threads (`-t`) | Prompt Processing `pp512` (tok/s) | Token Generation `tg128` (tok/s) |
|---|---|---|---|
| **Gemma 4 E4B** | **32** | **219.17** | **18.45** |
| Gemma 4 26B-A4B (MoE) | 16 | 113.91 | 21.49 |
| Gemma 4 26B-A4B (MoE) | 32 | 210.43 | 22.56 |
| Gemma 4 26B-A4B (MoE) | 64 | 312.82 | 9.27 |
| Gemma 4 31B (Dense) | 32 | 38.30 | 4.53 |

## Choose the right model for your agent

- **Use Gemma 4 E4B** for fast, everyday CPU-only agentic tasks—such as diagnosing syntax errors, patching Python/shell scripts, and running verification commands. It delivers fast prompt processing (`219.17 tok/s`), requires only `~4.3 GB` of weights, and cuts cold-start prefill time more than in half compared to 26B-A4B.
- **Use Gemma 4 26B-A4B (MoE)** when you have 64 GB RAM and need stronger multi-file reasoning while keeping `~22.6 tok/s` generation speed.
- **Consider Gemma 4 31B (Dense)** only for offline batch tasks where higher dense reasoning capacity outweighs `~4.5 tok/s` generation latency.

For the remaining sections, you'll serve and configure **Gemma 4 E4B**.

## What you've accomplished and what's next

You've downloaded Gemma 4 E4B and reviewed how E4B, 26B-A4B (MoE), and 31B (Dense) scale on Arm64 CPUs.

Next, you'll launch `llama-server` with a 64K context window and verify its OpenAI-compatible API endpoint.
