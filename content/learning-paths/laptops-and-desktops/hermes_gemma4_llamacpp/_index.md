---
title: Run Hermes Agent locally with Gemma 4 and llama.cpp on Arm64 Linux

description: Build llama.cpp on Arm64 Linux, serve Gemma 4 E4B locally, and connect Hermes Agent to fix code and run CLI tasks without cloud APIs.

minutes_to_complete: 45

who_is_this_for: This is an advanced topic for developers who want to run an autonomous AI agent locally on Arm64 Linux workstations, using llama.cpp and Gemma 4 E4B to diagnose and fix code without cloud API dependencies.

learning_objectives:
    - Compile llama.cpp natively on an Arm64 Linux workstation with CPU optimizations.
    - Benchmark Gemma 4 E4B against Gemma 4 26B-A4B (MoE) and 31B (Dense) on memory-bandwidth-bound Arm64 CPUs.
    - Serve Gemma 4 E4B with a 64K context window and quantized KV cache using llama-server.
    - Configure Nous Research Hermes Agent to use a local OpenAI-compatible endpoint and validate autonomous code-fixing workflows.

prerequisites:
    - An Arm64 Linux system running Ubuntu or Debian `aarch64` with at least 16 GB RAM (64 GB if also benchmarking the 26B-A4B and 31B models)
    - At least 15 GB of free disk space for building llama.cpp and storing Gemma 4 E4B (40 GB if downloading all three models)
    - Familiarity with the Linux command line, CMake builds, and basic LLM inference concepts

author: Jason Andrews

### Tags
skilllevels: Advanced
subjects: Agentic AI
armips:
    - Neoverse
operatingsystems:
    - Linux
tools_software_languages:
    - llama.cpp
    - Hermes Agent
    - CMake
    - C++

further_reading:
    - resource:
        title: llama.cpp GitHub repository
        link: https://github.com/ggml-org/llama.cpp
        type: website
    - resource:
        title: Nous Research Hermes Agent
        link: https://hermes-agent.nousresearch.com/
        type: website
    - resource:
        title: Orchestrate a local Hermes AI agent on NVIDIA DGX Spark
        link: /learning-paths/laptops-and-desktops/dgx_persistent_agent/
        type: Learning Path
    - resource:
        title: Unlock quantized LLM performance on Arm-based NVIDIA DGX Spark
        link: /learning-paths/laptops-and-desktops/dgx_spark_llamacpp/
        type: Learning Path

### FIXED, DO NOT MODIFY
# ================================================================================
weight: 1                       # _index.md always has weight of 1 to order correctly
layout: "learningpathall"       # All files under learning paths have this same wrapper
learning_path_main_page: "yes"  # This should be surfaced when looking for related content. Only set for _index.md of learning path content.
---
