---
title: Download and benchmark Gemma 4 E4B on Arm64
description: Download Gemma 4 E4B GGUF weights from Hugging Face and benchmark CPU performance on Arm64 Linux with llama-bench.
weight: 4

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Download the Gemma 4 E4B GGUF model

From inside your `llama.cpp` directory, create a `./models` directory and set up a Python virtual environment for the Hugging Face CLI:

```bash
mkdir -p models
python3 -m venv .venv
source .venv/bin/activate
pip install -U "huggingface_hub[cli]"
```

Download Gemma 4 E4B (`Q4_0` quantization, ~4.3 GB), which delivers fast prompt prefill, low RAM usage, and tool-calling capability for everyday code-fixing tasks:

```bash
hf download ggml-org/gemma-4-E4B-it-GGUF \
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

## Benchmark Gemma 4 E4B on Arm64

Run `llama-bench` to confirm that Gemma 4 E4B loads and runs cleanly on your Arm64 CPU, and to find the fastest thread counts for your hardware.

Build a thread sweep up to your available core count from `nproc` (starting with 4 and 8, adding 16 or 32 when available, and including `$(nproc)` for non-power-of-two counts such as 12-core or 24-core systems):

```bash
CORES=$(nproc)
THREADS="4,8"
[ "$CORES" -ge 16 ] && THREADS="$THREADS,16"
[ "$CORES" -ge 32 ] && THREADS="$THREADS,32"
[ "$CORES" -gt 8 ] && [ "$CORES" -lt 32 ] && [ "$CORES" -ne 16 ] && THREADS="$THREADS,$CORES"

./build/bin/llama-bench \
  -m ./models/gemma-4-E4B-it-Q4_0.gguf \
  -t "$THREADS" -r 1 \
  -p 512 -n 128
```

For reference, here is an example result from an Arm64 Linux system running Gemma 4 E4B across 4, 8, and 12 threads:

| Model | Threads (`-t`) | Prompt Processing `pp512` (tok/s) | Token Generation `tg128` (tok/s) |
|---|---|---|---|
| Gemma 4 E4B | 4 | 87.41 | 20.58 |
| Gemma 4 E4B | 8 | 103.41 | 21.54 |
| Gemma 4 E4B | 12 | 202.47 | 22.68 |

### Interpreting prefill and token generation results

The two tests measure different phases of LLM inference, and they scale differently as you add CPU threads.

Prompt processing (`pp512`, also called prefill) measures how fast the model processes a 512-token input prompt in parallel. Because prefill is CPU compute-bound, adding threads improves throughput significantly, jumping from 87.41 to 202.47 tok/s between 4 and 12 threads in the example table. Fast prefill matters for Hermes Agent because the first turn sends an ~11K-token system prompt and tool schema.

Token generation (`tg128`, also called decode) measures how fast the model produces 128 output tokens one at a time. Each generated token must stream the model weights from RAM, making decode memory-bandwidth bound. After enough threads saturate your memory channels, adding more threads yields small gains (such as 20.58 to 22.68 tok/s across 4 to 12 threads) and can slow generation down on high-core-count or big.LITTLE Arm64 systems due to synchronization overhead and cache contention.

In the next step, you'll use these results to set separate thread counts in `llama-server`: `-t` for token generation and `-tb` for prompt processing.

## What you've accomplished and what's next

You've downloaded Gemma 4 E4B from Hugging Face and benchmarked it with `llama-bench` to confirm its CPU performance on Arm64.

Next, you'll launch `llama-server` with a 64K context window and verify its OpenAI-compatible API endpoint.
