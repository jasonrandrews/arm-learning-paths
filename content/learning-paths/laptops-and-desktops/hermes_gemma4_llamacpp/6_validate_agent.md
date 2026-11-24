---
title: Validate autonomous tool-calling workflows
description: Test Nous Research Hermes Agent on a local Python bug-fixing task with Gemma 4 E4B and observe tool-calling reliability, self-correction, and system memory usage.
weight: 7

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Create a local test workspace

Create a small sandbox directory containing a Python script with a deliberate bug so you can evaluate Hermes Agent's end-to-end tool-calling loop in a repeatable way:

```bash
mkdir -p ~/hermes-test-workspace
cd ~/hermes-test-workspace
```

Create `metrics_parser.py` with an intentional off-by-one and key-name bug:

```bash
cat <<'EOF' > ~/hermes-test-workspace/metrics_parser.py
def average_latency(records):
    if not records:
        return 0.0
    total = sum(r["latency"] for r in records)
    return total / (len(records) - 1)

if __name__ == "__main__":
    sample = [
        {"endpoint": "/v1/models", "latency_ms": 12.0},
        {"endpoint": "/v1/chat/completions", "latency_ms": 48.0},
    ]
    print(f"Average latency: {average_latency(sample):.2f} ms")
EOF
```

Running it directly reveals both bugs (`KeyError: 'latency'` and a division by `len(records) - 1` that fails on single-item lists and skews averages):

```bash
python3 metrics_parser.py
```

The output is similar to:

```output
Traceback (most recent call last):
  File "/home/user/hermes-test-workspace/metrics_parser.py", line 12, in <module>
    print(f"Average latency: {average_latency(sample):.2f} ms")
                              ^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/user/hermes-test-workspace/metrics_parser.py", line 4, in average_latency
    total = sum(r["latency"] for r in records)
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/user/hermes-test-workspace/metrics_parser.py", line 4, in <genexpr>
    total = sum(r["latency"] for r in records)
                ~^^^^^^^^^^^
KeyError: 'latency'
```

## Run the multi-step agent prompt

Run Hermes Agent inside `~/hermes-test-workspace` with Gemma 4 E4B active on `llama-server` (you can run interactively with `hermes` or pass the prompt directly with `hermes chat --cli`):

```bash
hermes chat --cli -q "Inspect the current directory, read metrics_parser.py, diagnose any bugs, fix metrics_parser.py, and run python3 metrics_parser.py to verify the output." --oneshot
```

{{% notice Note %}}
On the first turn of a new session, Hermes Agent sends an ~11K-token system prompt and tool schemas, which takes ~1–1.5 minutes to prefill on CPU with Gemma 4 E4B. Subsequent tool-calling turns and follow-up prompts reuse the `llama-server` KV cache and complete quickly.
{{% /notice %}}

Observe how the agent runs the full tool loop:

1. Finds and reads `metrics_parser.py`.
2. Patches the `len(records) - 1` divisor bug and runs `python3 metrics_parser.py`.
3. Sees the `KeyError: 'latency'` failure, self-corrects `r["latency"]` to `r["latency_ms"]`, and re-runs `python3 metrics_parser.py`.
4. Confirms the verified `Average latency: 30.00 ms` output.

The output is similar to:

```output
Query: Inspect the current directory, read metrics_parser.py, diagnose any bugs,
fix metrics_parser.py, and run python3 metrics_parser.py to verify the output.
🔎 Find metrics_parser.py  0.4s
📖 Read metrics_parser.py
🔧 Patch metrics_parser.py
│ metrics_parser.py
│ @@ -2,7 +2,7 @@
│      if not records:
│          return 0.0
│      total = sum(r["latency"] for r in records)
│ -    return total / (len(records) - 1)
│ +    return total / len(records)
│
✗ $ python3 metrics_parser.py  0.2s [exit 1]
🔧 Patch metrics_parser.py
│ metrics_parser.py
│ @@ -1,7 +1,7 @@
│  def average_latency(records):
│      if not records:
│          return 0.0
│ -    total = sum(r["latency"] for r in records)
│ +    total = sum(r["latency_ms"] for r in records)
│      return total / len(records)
│
💻 $ python3 metrics_parser.py  0.2s

────────────────────────────────────────
☤ Hermes
The following actions were taken:
1. Inspected Directory: Verified metrics_parser.py exists.
2. Diagnosed Bugs: Replaced (len(records) - 1) with len(records) and updated "latency" to "latency_ms".
3. Verification: Executed python3 metrics_parser.py -> Average latency: 30.00 ms.
────────────────────────────────────────

Session:        local-d7a3527370a0b248161eae52ba68c33f6aaff9686396dc296d81293d718af3ee
Duration:       4m 2s
Messages:       14 (1 user, 12 tool calls)
```

## Monitor system resources during execution

In a separate terminal while `llama-server` and Hermes Agent are running, check system memory usage:

```bash
free -h
```

With Gemma 4 E4B, the 64K context window, and `q8_0` KV cache active, total system RAM usage is typically around 12 GiB (0 B swap), fitting comfortably on Arm64 systems with 16 GB or more of RAM.

## Summary of observed agentic performance

The following table summarizes the observed run for Gemma 4 E4B on the debugging task:

| Metric | Gemma 4 E4B (`Q4_0`) |
|---|---|
| Tool-call format reliability | Clean tool calls (`Find`, `Read`, `Patch`, `Terminal`) |
| Self-correction loop | Detected `KeyError` after first patch and fixed both bugs |
| Total wall-clock completion time | 4m 2s (cold prefill + 12 tool calls across 14 messages) |
| Total system RAM used (`free -h`) | ~12 GiB (0 B swap) |

## What you've accomplished and where to go next

You built a completely local autonomous AI agent stack on Arm64 Linux without relying on cloud APIs:

- Compiled llama.cpp from source for Arm64 (`-DGGML_NATIVE=ON -DGGML_OPENMP=ON -DGGML_CPU_KLEIDIAI=ON`).
- Downloaded Gemma 4 E4B from Hugging Face and benchmarked its prompt-processing and token-generation speed on Arm64.
- Served Gemma 4 E4B with a 64K context window, Flash Attention, `q8_0` KV cache, and `--jinja` tool-calling templates in about 12 GiB of total system RAM.
- Connected Nous Research Hermes Agent to `http://127.0.0.1:8080/v1` and verified end-to-end autonomous bug diagnosis, patching, and verification.

From here, you can extend this setup by:

- **Running `llama-server` as a `systemd` service:** Create a user or system `systemd` unit so your local inference server starts automatically on boot and restarts cleanly if needed.
- **Connecting local MCP servers to Hermes Agent:** Extend Hermes Agent's capabilities by attaching Model Context Protocol (MCP) servers for local Git repositories, databases, or documentation search.
- **Experimenting with speculative decoding:** Test llama.cpp speculative decoding or draft and multi-token prediction (MTP) heads to further accelerate token generation on memory-bandwidth-bound Arm64 CPUs.
