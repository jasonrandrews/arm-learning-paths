---
title: Build llama.cpp from source for Arm64
description: Verify your Arm64 Linux environment, install build dependencies, and compile llama.cpp from source with Arm64 CPU optimizations.
weight: 3

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Verify your Arm64 environment

Before compiling llama.cpp, confirm your CPU architecture, core count, and available memory.

Check the CPU architecture and core topology:

```bash
uname -m
lscpu | grep -E "Model name|CPU\(s\)|Thread|Core|Socket"
```

Confirm that `uname -m` prints `aarch64` and note your core count from `lscpu` so you can tune `llama-server` thread counts later.

Check available system memory:

```bash
free -h
```

Confirm that your system has at least 16 GiB of available RAM for Gemma 4 E4B.

## Install build prerequisites

Update your package index and install the compiler toolchain, CMake, Git, `libcurl` development headers (needed for `llama-server` and Hugging Face downloads), and Python virtual environment tools:

```bash
sudo apt update
sudo apt install -y build-essential cmake git libcurl4-openssl-dev python3-venv python3-pip
```

## Clone and build llama.cpp

Create a dedicated project directory and clone the official llama.cpp repository:

```bash
mkdir -p ~/hermes-gemma4 && cd ~/hermes-gemma4
git clone https://github.com/ggml-org/llama.cpp.git
cd llama.cpp
```

Configure the CMake build with Arm64 CPU optimizations. Pass `-DGGML_NATIVE=ON` to enable Arm64 SIMD instructions (such as NEON and dot-product extensions supported by your CPU), `-DGGML_OPENMP=ON` for multi-threaded execution, and `-DGGML_CPU_KLEIDIAI=ON` to enable Arm KleidiAI microkernels where supported:

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release -DGGML_NATIVE=ON -DGGML_OPENMP=ON -DGGML_CPU_KLEIDIAI=ON
```

Compile llama.cpp across all available cores:

```bash
cmake --build build --config Release -j $(nproc)
```

## Validate the compiled binaries

Verify that `llama-server` and `llama-bench` built cleanly and report their version and options:

```bash
./build/bin/llama-server --version
./build/bin/llama-bench --help | head -n 20
```

The output is similar to:

```output
version: 1.0.0-dev (build 12595, commit e46069c40)
built with GNU 13.3.0 for Linux aarch64
usage: ./build/bin/llama-bench [options]

options:
  -h, --help
  --version                                   show version and build info
  --numa <distribute|isolate|numactl>         numa mode (default: disabled)
  -r, --repetitions <n>                       number of times to repeat each test (default: 5)
  --prio <-1|0|1|2|3>                         process/thread priority (default: 0)
  --delay <0...N> (seconds)                   delay between each test (default: 0)
  -o, --output <csv|json|jsonl|md|sql>        output format printed to stdout (default: md)
  -oe, --output-err <csv|json|jsonl|md|sql>   output format printed to stderr (default: none)
  --list-devices                              list available devices and exit
  -v, --verbose                               verbose output
  --progress                                  print test progress indicators
  --no-warmup                                 skip warmup runs before benchmarking
  -fitt, --fit-target <MiB>                   fit model to device memory with this margin per device in MiB (default: off)
  -fitc, --fit-ctx <n>                        minimum ctx size for --fit-target (default: 0)

test parameters:
  -m, --model <filename>                            (default: models/7B/ggml-model-q4_0.gguf)
```

If both commands print without errors, your Arm64 llama.cpp binaries are ready.

## What you've accomplished and what's next

You've verified your Arm64 Linux system, installed the required build tools, and compiled llama.cpp from source.

Next, you'll download the Gemma 4 E4B GGUF model from Hugging Face and benchmark it with `llama-bench` to confirm it works on your Arm64 CPU.
