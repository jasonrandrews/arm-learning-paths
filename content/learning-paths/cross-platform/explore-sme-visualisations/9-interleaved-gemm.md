---
title: Trace GEMM with interleaved A
description: Trace GEMM with interleaved A to compare its loads with the gather-load view and follow accumulation in ZA.
weight: 10

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Compare input layouts in GEMM

This final view begins with A in an interleaved layout. It loads input values into Z registers, accumulates outer products in ZA, and writes the output matrix. Compare its A loads with the separated addresses used in the gather-load view.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step. The **middle Play/Pause button** runs or pauses the sequence. The **leftmost double-arrow button (⏪) is disabled** here. Reload the page or full-tab view to repeat the sequence, then pause at the A loads to compare them with the previous GEMM.

## Compare the three GEMM views

Look for changes in the A loads and similarities in the ZA updates:

1. Advance until values from **A Input Data** are loaded into Z registers. Observe which values appear together.
2. Continue through an outer-product update to ZA and a store to **Output Matrix Data**.
3. Recall the packed and gather-load views. Identify what changed in A's memory layout and load pattern, and what stayed the same about accumulation in ZA.

<iframe src="/apps/sme-visualisations/#/sme/gemm32-2x2-interleave" title="Interactive GEMM with interleaved matrix A" style="width: 100%; height: 1100px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the interleaved GEMM visualization in a full browser tab](/apps/sme-visualisations/#/sme/gemm32-2x2-interleave) if you need more space or the embedded view does not load.

## What you've accomplished

You have followed ZA layout, transposition, operand preparation, and three GEMM input strategies. These visualizations illustrate data movement; they do not benchmark the strategies or verify executable SME2 instructions. To write and validate a kernel, continue with [Accelerate matrix multiplication performance with SME2](/learning-paths/cross-platform/multiplying-matrices-with-sme2/).
