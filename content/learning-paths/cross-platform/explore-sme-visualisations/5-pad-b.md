---
title: Pad matrix B for GEMM
description: Use the Arm SME visualization to pad matrix B and identify the zero-filled positions at a partial edge.
weight: 6

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Prepare B's partial edge

The B input in this example has a partial edge. Padding adds zero values where the prepared layout needs a complete group. The view follows values from **Input Matrix B** through ZA into **Output Padded Data**.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step or the **leftmost double-arrow button (⏪)** to go back one step. The **middle Play/Pause button** runs or pauses the sequence. Pause when the highlighted group reaches the edge to inspect the zero-filled positions.

## Inspect the padded result

Compare a complete group with one at the edge:

1. Follow a complete input group through ZA into **Output Padded Data**.
2. Continue to a shorter group at the edge. Find the zeros added to complete the prepared group.
3. Compare the useful B values before and after preparation. Identify which positions are padding rather than input data.

<iframe src="/apps/sme-visualisations/#/sme/pad32-b" title="Interactive padding of 32-bit matrix B" style="width: 100%; height: 900px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the Pad B visualization in a full browser tab](/apps/sme-visualisations/#/sme/pad32-b) if you need more space or the embedded view does not load.

## What you've accomplished

You have seen how the example prepares a partial B block with zeros. The next view starts with packed A and padded B, then multiplies them into an output matrix.
