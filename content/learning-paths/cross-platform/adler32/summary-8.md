---
title: Summarize the project with a README.md file
weight: 8

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## What's next

```console
create a README.md file that describes the background and overview of the project. Explain the two implementations of the adler32 checksum. Add the performance results recorded on the Neoverse N1 processor. Add a table comparing clang and gcc.
```

Here is the created README.md file

# Adler-32 Checksum Implementation

## Background

Adler-32 is a checksum algorithm invented by Mark Adler in 1995. It's a modification of the Fletcher checksum that provides a more reliable error detection capability while maintaining computational efficiency. Adler-32 is used in the zlib compression library and is part of the PNG image format specification.

The algorithm works by calculating two 16-bit checksums (s1 and s2) and combining them into a single 32-bit value. It's designed to be fast while providing reasonable error detection capabilities.

## Project Overview

This project provides two implementations of the Adler-32 checksum algorithm:

1. A simple C implementation (`adler32-simple.c`)
2. An Arm NEON-optimized implementation (`adler32-neon.c`)

The goal is to demonstrate how SIMD (Single Instruction, Multiple Data) instructions available in Arm's NEON technology can significantly accelerate checksum calculations on Arm-based processors like the Neoverse N1.

## Implementation Details

### Simple Implementation

The simple implementation follows the standard Adler-32 algorithm:

```c
uint32_t adler32(const void *data, size_t len) {
    const uint8_t *buf = (const uint8_t *)data;
    uint32_t a = 1;  // First component
    uint32_t b = 0;  // Second component
    
    for (size_t i = 0; i < len; i++) {
        a = (a + buf[i]) % 65521;
        b = (b + a) % 65521;
    }
    
    return (b << 16) | a;
}
```

Key characteristics:
- Processes one byte at a time
- Uses modulo operations to prevent overflow (65521 is the largest prime number less than 2^16)
- Simple to understand and implement

### NEON-Optimized Implementation

The NEON implementation leverages Arm's SIMD instructions to process multiple bytes in parallel:

- Uses NEON intrinsics to load 16 bytes at a time
- Processes data in blocks of 5552 bytes to avoid overflow
- Applies modulo operations at appropriate intervals
- Carefully manages data to ensure correctness while maximizing throughput

The NEON implementation demonstrates how to use vector processing capabilities to accelerate checksum calculations, achieving significant performance improvements over the simple implementation.

## Performance Results on Neoverse N1

The performance was measured on an Arm Neoverse N1 processor with both implementations and two different compilers (GCC and Clang).

### GCC Compiler Results

| Data Size | Simple Throughput | NEON Throughput | Speedup |
|-----------|------------------|-----------------|---------|
| 1 KB      | 195.31 MB/s      | 976.56 MB/s     | 5.00x   |
| 10 KB     | 187.08 MB/s      | 1,109.73 MB/s   | 5.93x   |
| 100 KB    | 176.98 MB/s      | 1,188.03 MB/s   | 6.71x   |
| 1 MB      | 216.96 MB/s      | 1,433.49 MB/s   | 6.61x   |
| 10 MB     | 296.77 MB/s      | 1,802.32 MB/s   | 6.07x   |

### Clang Compiler Results

| Data Size | Simple Throughput | NEON Throughput | Speedup |
|-----------|------------------|-----------------|---------|
| 1 KB      | 195.31 MB/s      | 2,441.41 MB/s   | 12.50x  |
| 10 KB     | 196.10 MB/s      | 2,219.46 MB/s   | 11.32x  |
| 100 KB    | 187.87 MB/s      | 2,271.08 MB/s   | 12.09x  |
| 1 MB      | 216.53 MB/s      | 2,759.38 MB/s   | 12.74x  |
| 10 MB     | 295.55 MB/s      | 3,448.51 MB/s   | 11.67x  |

### Compiler Comparison for NEON Implementation

| Data Size | GCC Throughput | Clang Throughput | Clang vs GCC |
|-----------|----------------|------------------|--------------|
| 1 KB      | 976.56 MB/s    | 2,441.41 MB/s    | 2.50x better |
| 10 KB     | 1,109.73 MB/s  | 2,219.46 MB/s    | 2.00x better |
| 100 KB    | 1,188.03 MB/s  | 2,271.08 MB/s    | 1.91x better |
| 1 MB      | 1,433.49 MB/s  | 2,759.38 MB/s    | 1.92x better |
| 10 MB     | 1,802.32 MB/s  | 3,448.51 MB/s    | 1.91x better |

## Key Findings

1. **NEON Acceleration**: The NEON implementation provides a 5-12x speedup over the simple implementation, demonstrating the power of SIMD instructions for checksum calculations.

2. **Compiler Impact**: Clang produces significantly faster code for the NEON implementation compared to GCC, with approximately 2x better performance. This highlights the importance of compiler selection when optimizing for specific architectures.

3. **Scaling with Data Size**: Both implementations show improved throughput with larger data sizes, with the NEON implementation reaching over 3 GB/s for 10 MB data when compiled with Clang.

## Building and Running

The project includes a Makefile optimized for the Neoverse N1 architecture. To build and run:

```bash
# Build and run with default compiler (GCC)
make run

# Build and run with GCC
make run-gcc

# Build and run with Clang
make run-clang

# Compare GCC and Clang performance
make compare

# Clean build artifacts
make clean
```

## Optimization Flags

The code is specifically optimized for the Neoverse N1 architecture with the following compiler flags:
- `-mcpu=neoverse-n1`: Target the Neoverse N1 CPU
- `-march=armv8.2-a+crypto`: Use ARMv8.2-A architecture with crypto extensions
- `-mtune=neoverse-n1`: Tune code for Neoverse N1
- `-O3`: Aggressive optimization
- `-ftree-vectorize`: Enable vectorization
- `-ffast-math`: Enable fast math operations
- `-flto`: Enable link-time optimization

