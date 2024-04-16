---
title: "Setup an example application" 
weight: 3
layout: "learningpathall"
---

## Linux setup

You should have an Arm Linux computer with Perf installed, and you should be able to SSH to the computer.

## Copy tools

Copy the Gator daemon to your Arm Linux computer. There are multiple Gator daemons in the Performance Studio installtion, use the `arm64` version.

```console
scp <installation-dir>/Arm_Performance_Studio_2024.0/streamline/bin/linux/arm64/gatord <user>@<remote-ip-address>:~/
```

Copy the tools for function specific metrics from your local Arm Performance Studio installation to the Arm Linux computer. 

Arm_Performance_Studio_2024.0/streamline/prototypes/utils to the Arm Linux target machine.

```console
scp -r <installation-dir>/Arm_Performance_Studio_2024.0/streamline/utils <user>@<remote-ip-address>:~/
```

You should now have `gatord` and the `utils` directory in the home directory of the Arm Linux computer. 

## Cache example

Copy the example application from your local Arm Performance Studio instalation to the Arm Linux computer:

```console
scp -r <installation-dir>/Arm_Performance_Studio_2024.0/streamline/examples/linux/Streamline_cache_test  <user>@<remote-ip-address>:~/
```

You now have the `Streamline_cache_test` directory in the home directory of the Arm Linux computer. 

The C code for the example you just copied is below. 

Study the 2 functions, `xy_loop()` and `yx_loop()`. 

Each function provides the same behavior, but loops through the allocated data arrays in different order. This results in different cache characteristics.

```C
/*
 *  Streamline Cache Test Example
 *
 * Copyright (C) 2015-2023 by Arm Limited (or its affiliates). All rights reserved.
 * Use, modification and redistribution of this file is subject to your possession of a
 * valid End User License Agreement for the Arm Product of which these examples are part of
 * and your compliance with all applicable terms and conditions of such license agreement.
 */

/* cache-test.c
 *
 * Performs a fairly meaningless calculation, setting each element in the 1D
 * destination array to the sum of all elements in the corresponding row of the
 * 2D source array.
 * The main purpose of this is to perform calculations using large amounts of
 * data with high spatial locality, and demonstrate how the order this data is
 * accessed affects how efficiently the cache can operate.
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define ANNOTATE_ON

#ifdef ANNOTATE_ON
#include "streamline_annotate.h"
#endif

/* Globals. */
int* sum_1d;
int* src_2d;

/* Returns current time in milliseconds. */
static double now_ms (void)
{
    struct timespec res;
    clock_gettime(CLOCK_REALTIME, &res);
    return 1000.0*res.tv_sec + (double)res.tv_nsec/1e6;
}

/* The data is stored in row-major order. In this case we loop through the data
 * in row-major order (x first, then y). This is the optimal way to access this
 * data, accessing the 2D array in the order it is stored internally.
 */
void xy_loop (unsigned int iterations)
{
    unsigned int x, y;
    for (y = 0; y < iterations; y++)
    {
        for (x = 0; x < iterations; x++)
        {
            sum_1d[y] += src_2d[(y * iterations) + x];
        }
    }
}

/* The data is stored in row-major order. In this case we loop through the data
 * in column-major order (y first, then x). This is a sub-optimal way to access
 * this data, accessing the 2D array out-of-order, with data being read at
 * staggered intervals throughout the array.
 */
void yx_loop (unsigned int iterations)
{
    unsigned int x, y;
    for (x = 0; x < iterations; x++)
    {
        for (y = 0; y < iterations; y++)
        {
            sum_1d[y] += src_2d[(y * iterations) + x];
        }
    }
}

int main (int argc, char* argv[])
{
    double t0, t1, xy_time, yx_time;
    unsigned int iterations = 5000;
    unsigned int x, y;

#ifdef ANNOTATE_ON
    ANNOTATE_SETUP;
#endif

    /* If a command line is provided, use that for the number of iterations. */
    if (argc > 1)
        iterations = atoi(argv[1]);

    /* Allocate the arrays. */
#ifdef ANNOTATE_ON
    ANNOTATE_COLOR(ANNOTATE_RED, "Array allocation");
#endif
    sum_1d = (int*) malloc(sizeof(int) * iterations);
    src_2d = (int*) malloc(sizeof(int) * iterations * iterations);
    /* Fill the arrays with some random data. */
    /* This step does potentially mean the data passes through the cache first,
     * but as this is merely an example it's not that important. The loop can be
     * commented out if this isn't desired. */
    for (y = 0; y < iterations; y++)
    {
        sum_1d[y] = 0;
        for (x = 0; x < iterations; x++)
            src_2d[(y * iterations) + x] = x + y;   // this could be rand()
    }
    printf("Starting loop addition with %d iterations...\n", iterations);

    /* Perform sum in row-major ordering. */
#ifdef ANNOTATE_ON
    ANNOTATE_COLOR(ANNOTATE_GREEN, "row-major ordering");
#endif
    t0 = now_ms();
    xy_loop(iterations);
    t1 = now_ms();
    xy_time = t1 - t0;
    printf("row-major ordering: took %.2f ms\n", xy_time);

    /* Perform sum in col-major ordering. */
#ifdef ANNOTATE_ON
    ANNOTATE_COLOR(ANNOTATE_CYAN, "col-major ordering");
#endif
    t0 = now_ms();
    yx_loop(iterations);
    t1 = now_ms();
    yx_time = t1 - t0;
    printf("col-major ordering: took %.2f ms (%.1fx slower)\n", yx_time, yx_time/xy_time);

    /* Clean-up and return. */
    free(sum_1d);
    free(src_2d);

    return 0;
}

```

## Build and the example

Compile the example using the GNU compiler:

``` bash
make CROSS_COMPILE=
```

Run the application:

``` console
 ./cache_test
 ```

The output will be similar to:

 ```output
 streamline_annotate.c/gator_func:548 [ERROR] Warning : Not connected to gatord, the application will run normally but Streamline will not collect annotations. To collect annotations, please verify you are running gatord 5.24 or later and that SELinux is disabled.
 
Starting loop addition with 5000 iterations...
row-major ordering: took 85.08 ms
col-major ordering: took 129.71 ms (1.5x slower)
```

Depending on your computer, the time values may be different from the output above.

You see the second implementation is slower than the first one. 
