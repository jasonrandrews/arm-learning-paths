---
title: Follow a 32-bit transpose
description: Step through an Arm SME transpose to trace 32-bit values from memory into ZA and back in a new order.
weight: 3

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## See how ZA transposes values

A transpose exchanges rows and columns. ZA can help move a vector of values into one tile orientation and read those values back in the other. This view uses one **Matrix Data** area for both the original values and the transposed result.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step at a time. The **leftmost double-arrow button (⏪)** goes back one step. The **middle Play/Pause button** runs or pauses the sequence. Read the current-step description after each step; the highlights show the memory and ZA locations involved.

## Trace the change

Follow one group from memory into ZA and back:

1. Advance through the first few steps. Notice that consecutive values from **Matrix Data** enter horizontal ZA rows.
2. Continue until values begin returning to memory. Watch which vertical ZA slices are read.
3. Compare the final arrangement in **Matrix Data** with the starting arrangement. Identify one value that moved from a row position to a column position.

<iframe src="/apps/sme-visualisations/#/sme/transpose32" title="Interactive 32-bit matrix transpose visualization" style="width: 100%; height: 850px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the 32-bit transpose visualization in a full browser tab](/apps/sme-visualisations/#/sme/transpose32) if you need more space or the embedded view does not load.

## What you've learned

The tile provides different row and column views of stored values, so the example can change their layout as it copies them back to memory. Next, see what changes when the matrix extends beyond a complete tile.

For a related C example, see [Optimize memory layout with transposition](/learning-paths/cross-platform/multiplying-matrices-with-sme2/5-outer-product/#optimize-memory-layout-with-transposition). That kernel prepares a matrix operand for multiplication; it does not reproduce this animation step for step.
