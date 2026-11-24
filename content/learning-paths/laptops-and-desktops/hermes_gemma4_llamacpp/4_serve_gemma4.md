---
title: Serve Gemma 4 E4B with a 64K context window
description: Launch llama-server with Gemma 4 E4B, a 64K context window, Flash Attention, and a quantized KV cache, then validate the OpenAI-compatible API.
weight: 5

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Configure llama-server for Hermes Agent

Hermes Agent communicates with local models over an OpenAI-compatible HTTP API (`/v1/chat/completions`) and needs a minimum 64K context window (`-c 65536`) to accommodate tool definitions, workspace context, and multi-turn execution traces.

Start `llama-server` with `gemma-4-E4B-it-Q4_0.gguf`. Set `GEN_THREADS` (`-t`) to the thread count that gave the highest `tg128` speed in your `llama-bench` run, and set `BATCH_THREADS` (`-tb`) to the thread count that gave the highest `pp512` speed (often up to `$(nproc)` within a single NUMA node) to speed up Hermes Agent's ~11K-token initial prompt prefill:

```bash
GEN_THREADS=8    # Replace with your best tg128 thread count from llama-bench
BATCH_THREADS=$(nproc)

./build/bin/llama-server \
  -m ./models/gemma-4-E4B-it-Q4_0.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  -c 65536 \
  -t "$GEN_THREADS" \
  -tb "$BATCH_THREADS" \
  -np 1 \
  --jinja \
  -fa on \
  --cache-type-k q8_0 \
  --cache-type-v q8_0
```

{{% notice Tip %}}
On 32–64+ core Arm64 systems, token generation (`-t`) typically peaks at 50–75% of physical cores in a single NUMA node (for example, 16–32 on a 64-core system), while prompt processing (`-tb`) can use more cores. On heterogeneous Arm64 laptops or desktops (big.LITTLE), set `-t` to the number of performance cores so generation threads don't stall on efficiency cores.
{{% /notice %}}

### Understanding the server flags

Each flag is tuned for single-user autonomous agent reliability on an Arm64 Linux system:

| Flag | Purpose |
|---|---|
| `--host 127.0.0.1 --port 8080` | Binds the OpenAI-compatible server locally on port 8080 |
| `-c 65536` | Allocates a 64K token context window, meeting Hermes Agent's minimum context requirement |
| `-t "$GEN_THREADS"` | Sets token-generation threads; tune from `llama-bench` `tg128` results rather than using all cores on high-core or big.LITTLE systems |
| `-tb "$BATCH_THREADS"` | Sets prompt-processing batch threads; scales well with higher core counts for faster long-context prefill |
| `-np 1` | Reserves the full 64K context for a single parallel slot rather than splitting memory across slots |
| `--jinja` | Enables Jinja chat template rendering needed for Gemma 4 E4B structured tool calling |
| `-fa on` | Enables Flash Attention to reduce memory overhead and improve long-context performance |
| `--cache-type-k q8_0 --cache-type-v q8_0` | Quantizes the 64K K and V caches to 8-bit so weights and context fit comfortably in 16 GB or more of RAM |

The output is similar to:

```output
0.00.002.121 I srv  llama_server: initializing ...
0.00.005.570 I cmn  common_param: common_params_print_info: verbosity = 3 (adjust with the `-lv N` CLI arg)
0.00.009.619 W srv  server_setup: security: no API key is set and CORS allows all origins (see https://github.com/ggml-org/llama.cpp/pull/25655)
0.00.016.052 I srv    load_model: loading model './models/gemma-4-E4B-it-Q4_0.gguf'
```

## Validate the OpenAI-compatible endpoint

Leave `llama-server` running in its terminal, then open a second terminal to verify the API.

Check the `/v1/models` endpoint:

```bash
curl -s http://127.0.0.1:8080/v1/models | python3 -m json.tool
```

The output is similar to:

```output
{
    "models": [
        {
            "name": "./models/gemma-4-E4B-it-Q4_0.gguf",
            "model": "./models/gemma-4-E4B-it-Q4_0.gguf",
            ...
        }
    ],
    "object": "list",
    "data": [
        {
            "id": "./models/gemma-4-E4B-it-Q4_0.gguf",
            "object": "model",
            "owned_by": "llamacpp",
            "meta": {
                "vocab_type": 2,
                "n_vocab": 262144,
                "n_ctx": 65536,
                "n_ctx_train": 131072,
                "n_embd": 2560,
                "n_params": 7463013674,
                "size": 4574983336,
                "ftype": "Q4_0"
            }
        }
    ]
}
```

Send a quick `/v1/chat/completions` request to confirm inference works end-to-end:

```bash
curl -s http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "./models/gemma-4-E4B-it-Q4_0.gguf",
    "messages": [
      {"role": "user", "content": "What is 2 + 2? Reply with the number only."}
    ],
    "max_tokens": 256
  }' | python3 -m json.tool
```

The output is similar to:

```output
{
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "4"
            }
        }
    ],
    "created": 1795213640,
    "model": "./models/gemma-4-E4B-it-Q4_0.gguf",
    "system_fingerprint": "b12595-e46069c40",
    "object": "chat.completion",
    "usage": {
        "completion_tokens": 2,
        "prompt_tokens": 30,
        "total_tokens": 32,
        "prompt_tokens_details": {
            "cached_tokens": 0
        }
    },
    "id": "chatcmpl-IRRzchttY4Z50IE511n4ALccDwkATmWE",
    "timings": {
        "cache_n": 0,
        "prompt_n": 30,
        "prompt_ms": 290.332,
        "prompt_per_token_ms": 9.677733333333332,
        "prompt_per_second": 103.32998084951022,
        "predicted_n": 2,
        "predicted_ms": 53.042,
        "predicted_per_token_ms": 53.042,
        "predicted_per_second": 18.852984427434862
    }
}
```

Confirm that the JSON response contains a valid `choices[0].message.content` reply and `usage` token counts. Note the exact `id` reported by `/v1/models`. You'll use it when configuring Hermes Agent in the next step.

## What you've accomplished and what's next

You've launched `llama-server` with a 64K context window, Flash Attention, and an 8-bit KV cache, and verified its local OpenAI-compatible API.

Next, you'll install Nous Research Hermes Agent and configure it to use your local `llama-server` endpoint.
