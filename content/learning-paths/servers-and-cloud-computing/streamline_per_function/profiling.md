---
title: "Profiling methods"
weight: 2
layout: "learningpathall"
---

## Before you begin

You need Arm Performance Studio installed to access the required tools and example software. Use the [Arm Performance Studio](/install-guides/ams/) install guide to download and install it on your local computer. You can do this on a Windows or macOS computer. You are not going to run any tools on your local computer, only copy data from the installation to your Arm Linux computer. 

On your Arm Linux computer you need to instal Linux Perf and the GNU compiler. Use the [Perf for Linux on Arm](/install-guides/perf/) install guide and the [GNU Compiler](/install-guides/gcc/native/) install guide to install each tool. 

If you have Arm Performance Studio on your local computer and Linux Perf on the remote Arm Linux computer you are ready to begin.

## Periodic and event-based profiling 

Software profiling tools work by collecting samples of a running program and presenting the collected data. They help you determine what to change in the program to improve performance. 

The samples are collected at regular time intervals (periodic sampling) or when specified events occur (event-based sampling). A sample is a capture of the program details such as the current instruction at the sample time.

Periodic sampling is done at intervals such as 1000 samples/sec. Event-based sampling is done at intervals such as every 1000 cache refills.

Periodic sampling shows where time is spent by highlighting the program location when a sample is taken. Frequently executed code is more likely to be running when samples are taken. Periodic sampling is a performance compromise because tracing every instruction of an application would be too slow.

Unfortunately, periodic sampling doesn't provide any information about of the efficiency of the code or explain how the hardware is being utilized. For example, it does not report if the code has a high cache miss rate or poor branch prediction near the sample. 

Event-based sampling identifies areas of code where a specific hardware event is occurring. If cache misses are occurring in a particular function it might mean that the function is operating inefficiently, but it may be hard to tell if increasing cache utilization will have any impact on the entire program runtime. 

## Function attributed metrics

Function attributed metrics provide a way to combine periodic sampling with a set of performance metrics that can be attributed to individual functions. This allows the identification of the most commonly used functions within an application, and provides per function metrics you can use to identify different CPU performance bottlenecks. 

Function attributed metrics make it possible to identify both the percentage of time spent in a function and the significance of hardware events, such as cache misses, on function performance.

## Function attributed command line tools

Arm Performance Studio provides a set of prototype tools for inspecting and analyzing captures from the Linux command line. 

You can use the Gator daemon, a program for collecting traces, and the `analyze_capture` tool to process the traces and generate function attributed metrics.

You will learn how to do this in the next sections.





