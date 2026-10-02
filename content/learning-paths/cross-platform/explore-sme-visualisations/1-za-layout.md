---
title: Explore the ZA tile layout
description: Explore ZA tile views in the Arm SME visualization to see how element size and streaming vector length shape the array.
weight: 2

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## See ZA as an array of tiles

Arm Scalable Matrix Extension (SME) adds **ZA**, a two-dimensional register array. Its width and height each equal the streaming vector length (SVL) in bytes. A matrix operation can keep partial results in ZA while it processes input vectors. SME2 builds on this programming model with additional multi-vector operations.

The interactive view shows the same ZA storage as a full array and as typed tiles. It runs in your browser, so you do not need an SME2 device for this exercise. The values and colors illustrate register layout; the browser is not executing SME2 instructions. This first view has no playback buttons: use the selectors and interact directly with the grid.

## Change the view of ZA

Use the selectors and grid to compare two tile views:

1. In **Data Type**, select `int32`. In **Scalable Vector Length**, select `256-bit`.
2. Compare the full ZA array on the left with the four 32-bit tile views on the right. At 256 bits, each side of ZA is 32 bytes, so a row holds eight 32-bit elements.
3. Move the pointer over a cell to highlight its tile or slice in both views. Select a cell to switch between horizontal and vertical orientation. On a touch screen, tap the cell.
4. Select `128-bit`. Observe how the array dimensions change while the tile view still refers to the same ZA storage.

<iframe src="/apps/sme-visualisations/#/sme/layout" title="Interactive ZA tile layout visualization" style="width: 100%; height: 800px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the ZA layout visualization in a full browser tab](/apps/sme-visualisations/#/sme/layout) if you need more space or the embedded view does not load.

## What you've learned

ZA is one scalable array with several typed tile views. Changing SVL changes its dimensions, and changing element size changes how many elements fit in each row. Next, use those tile views to follow a transpose.
