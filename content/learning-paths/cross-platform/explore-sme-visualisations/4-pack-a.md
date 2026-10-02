---
title: Pack matrix A for GEMM
description: Use the Arm SME visualization to pack matrix A and see how ZA rearranges its values for GEMM.
weight: 5

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Prepare A for matrix multiplication

Packing changes the order of values in memory so a matrix multiplication kernel can load the groups it needs. This view takes **Input Matrix A**, moves its values through ZA, and writes **Output Packed Data**. Packing changes the layout of A; it does not calculate the matrix product.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step or the **leftmost double-arrow button (⏪)** to go back one step. The **middle Play/Pause button** runs or pauses the sequence. Use single steps to compare the highlighted input, ZA slice, and packed output.

## Track one group of A values

Follow a group from input to packed output:

1. Advance until a highlighted group is loaded from **Input Matrix A** into ZA.
2. Follow that group when the visualization reads ZA in the other orientation and writes **Output Packed Data**.
3. Compare neighboring values in the input and packed output. Notice how the output groups values for the later GEMM view.

<iframe src="/apps/sme-visualisations/#/sme/pack32-a" title="Interactive packing of 32-bit matrix A" style="width: 100%; height: 900px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the Pack A visualization in a full browser tab](/apps/sme-visualisations/#/sme/pack32-a) if you need more space or the embedded view does not load.

## What you've accomplished

You have traced a change in A's memory layout. The packed GEMM view later in this path begins with this kind of prepared A data. First, prepare its other operand, B.

The [preprocessing example in the SME2 matrix multiplication Learning Path](/learning-paths/cross-platform/multiplying-matrices-with-sme2/5-outer-product/#preprocessing-with-preprocess_l) shows how a C kernel prepares its left-hand matrix. Its precise layout belongs to that implementation.
