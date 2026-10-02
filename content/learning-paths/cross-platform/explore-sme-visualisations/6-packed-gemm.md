---
title: Trace packed GEMM through ZA
description: Step through packed 32-bit GEMM to follow prepared operands through Z registers, ZA accumulation, and output memory.
weight: 7
aliases:
    - /learning-paths/cross-platform/explore-sme-visualisations/2-matrix-multiplication/

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Follow a packed matrix product

You have seen how the previous views prepare A and B. This packed 32-bit GEMM view starts with **A Packed Data** and **B Padded Data** already in memory. GEMM means general matrix multiplication. The visualization follows values through vector registers into ZA, where contributions accumulate before the result is stored.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step and read the current-step description. The **middle Play/Pause button** runs or pauses the sequence. The **leftmost double-arrow button (⏪) is disabled** in this view. Reload the page or the full-tab view to start again.

## Step through the example

Follow one input contribution through accumulation and storage:

1. Find **A Packed Data**, **B Padded Data**, the Z vector registers, the ZA tiles, and **Output Matrix Data**.
2. Advance one step at a time. For each load, match the highlighted input cells to the highlighted Z register.
3. When the description names an outer product, observe which ZA tile changes. Continue until the accumulated values are stored in the output matrix.
4. Reload the visualization and use Play and Pause to review the full sequence.

<iframe src="/apps/sme-visualisations/#/sme/gemm32-packed" title="Interactive packed 32-bit GEMM visualization" style="width: 100%; height: 1000px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the GEMM visualization in a full browser tab](/apps/sme-visualisations/#/sme/gemm32-packed) if you need more space or the embedded view does not load.

## What you've accomplished

You have traced loads, accumulation, and stores in a GEMM that uses prepared operands. Next, compare a version that loads A from a different layout. These animations model data movement; they do not measure performance or prove which instructions a processor executes.

For executable code built around the same outer-product idea, see [matrix multiplication using SME2 intrinsics in C](/learning-paths/cross-platform/multiplying-matrices-with-sme2/7-sme2-matmul-intr/). It uses its own FP32 data layout and instruction sequence.
