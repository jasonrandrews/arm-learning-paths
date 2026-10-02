---
title: Transpose an incomplete edge
description: Trace a 32-bit transpose with a two-element edge to see how a partial block moves through ZA into output memory.
weight: 4

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Handle a partial block

Real matrices do not always divide evenly into vector-sized blocks. This example adds a two-element edge beyond the complete 32-bit blocks. It separates **Input Matrix Data** from **Output Matrix Data** so you can follow the remaining values without losing sight of the original input.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step or the **leftmost double-arrow button (⏪)** to go back one step. The **middle Play/Pause button** runs or pauses the sequence. Pause near the edge to inspect which input cells are active. Reload the page to return to the initial state.

## Follow the edge values

Compare a complete group with the final partial group:

1. Start with a complete group of highlighted input values and follow it through a ZA tile into the output.
2. Continue to the final, shorter group. Compare how many cells are active with the earlier group.
3. Check where those last values appear in **Output Matrix Data**. Explain why the operation must account for the incomplete edge.

<iframe src="/apps/sme-visualisations/#/sme/transpose32-overflow2" title="Interactive 32-bit transpose with a two-element edge" style="width: 100%; height: 900px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the incomplete-edge transpose visualization in a full browser tab](/apps/sme-visualisations/#/sme/transpose32-overflow2) if you need more space or the embedded view does not load.

## What you've learned

The final block can contain fewer valid elements than a full tile. Following active cells matters more than assuming every load and store spans the whole vector. Next, prepare matrix A for multiplication.
