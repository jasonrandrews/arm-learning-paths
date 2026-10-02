---
title: Compare a GEMM with gather loads
description: Compare gather loads with packed GEMM in the Arm SME visualization and identify the streaming-mode feature constraint.
weight: 8

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## Compare noncontiguous loads

The previous GEMM began with packed A. This view instead selects A values from separated memory locations and gathers them into a Z vector before an outer-product update. It helps show why an input layout affects the loads a kernel needs.

The app marks **Gather Load** with a warning. Its tooltip explains that gather loads in streaming mode depend on the optional `FEAT_SME_FA64` capability. Treat this view as a conditional programming example, not as an instruction sequence available on every SME device.

## Use the playback controls

Select the **rightmost double-arrow button (⏩)** to advance one step. The **middle Play/Pause button** runs or pauses the sequence. The **leftmost double-arrow button (⏪) is disabled** in this view; reload the page or full-tab view to restart. Use single steps to follow the separated A values during a gather load.

## Compare the input path

Focus on how A reaches a Z register:

1. Find **A Input Data**, **B Input Data**, the Z registers, ZA, and **Output Matrix Data**.
2. Advance to a gather load. Notice that A values come from nonadjacent memory positions before appearing together in a Z register.
3. Continue to an outer-product update and the output store. Compare the A load with the contiguous loads from the packed GEMM view.

<iframe src="/apps/sme-visualisations/#/sme/gemm32-2x2" title="Interactive GEMM with a gather-load example" style="width: 100%; height: 1100px; border: 1px solid #999;" loading="lazy"></iframe>

[Open the gather-load GEMM visualization in a full browser tab](/apps/sme-visualisations/#/sme/gemm32-2x2) if you need more space or the embedded view does not load.

## What you've learned

The mathematical update can be the same while the input layout changes how A reaches the vector register. Next, rearrange A in memory so the later GEMM can load adjacent values.
