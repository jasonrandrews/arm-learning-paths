---
title: Interleave matrix A
description: Interleave matrix A through ZA in the Arm SME visualization to see how its memory order changes for GEMM.
weight: 9

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Arrange A for adjacent loads

Interleaving is another preparation step for A. This view rearranges **Input Matrix** into **Interleaved Matrix** through ZA. It places values needed together by the following GEMM into a different memory order.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step. The **middle Play/Pause button** runs or pauses the sequence. The **leftmost double-arrow button (⏪) is disabled** here; reload the page or full-tab view to restart. Use single steps when the first values are written into **Interleaved Matrix**.

## Follow the new layout

Compare where one group of values appears in each matrix:

1. Identify a group of values in **Input Matrix** and follow its highlighted cells into ZA.
2. Watch where the same values are written in **Interleaved Matrix**. Compare their order with the input.
3. Explain why arranging those values together could change the loads needed by a later kernel.

<iframe src="/apps/sme-visualisations/#/sme/pack32-2x2-a" title="Interactive transpose and interleave of matrix A" style="width: 100%; height: 950px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the A interleave visualization in a full browser tab](/apps/sme-visualisations/#/sme/pack32-2x2-a) if you need more space or the embedded view does not load.

## What you've accomplished

You have followed the preparation of interleaved A data. Next, compare a GEMM that starts with this layout against the gather-load view.
