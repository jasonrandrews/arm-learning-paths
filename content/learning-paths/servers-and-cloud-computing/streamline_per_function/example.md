---
title: "Setup the tools and an example application" 
weight: 3
layout: "learningpathall"
---

You should have an Arm Linux computer with Perf installed, and you should be able to [SSH](/install-guides/ssh/) to the computer. You will use SSH to copy the required tools and example code from you local computer to the Arm Linux computer. 

## Copy the required tools

To get ready for function attributed metrics, copy the Gator daemon to your Arm Linux computer. 

There are multiple Gator daemons in the Performance Studio installation, use the `arm64` version.

Replace `installation-dir` with the location of your Performance Studio installation. For example, the default location on macOS is `/Applications/Arm_Performance_Studio_2024.0`. 

Substitute your user name and the IP address of the Arm Linux computer. 

Use `ssh` to copy the `gatord` executable (with your substitutions):

```console
scp <installation-dir>/Arm_Performance_Studio_2024.0/streamline/bin/linux/arm64/gatord <user>@<remote-ip-address>:~/
```

Next, copy the tools for function attributed metrics from your local Performance Studio installation to the Arm Linux computer. 

The tools are located in `/Applications/Arm_Performance_Studio_2024.0/streamline/prototypes/utils` and remember to substitute your user name and IP address:

```console
scp -r <installation-dir>/Arm_Performance_Studio_2024.0/streamline/prototypes/utils <user>@<remote-ip-address>:~/
```

You should now have `gatord` and the `utils` directory in the home directory of the Arm Linux computer. 

{{% notice Note %}}
This is a prototype feature of Arm Performance Studio which may change in the future. 
{{% /notice %}}

## Cache example code

You can use an example application from the Performance Studio installation to learn how to collect function attributed metrics.

The example is called `Streamline_cache_test`. 

Copy the example application from your local Performance Studio installation to the Arm Linux computer:

```console
scp -r <installation-dir>/Arm_Performance_Studio_2024.0/streamline/examples/linux/Streamline_cache_test  <user>@<remote-ip-address>:~/
```

You now have the `Streamline_cache_test` directory in the home directory of the Arm Linux computer. 

The C code for the example is below. 

Study the 2 functions, `xy_loop()` and `yx_loop()`. 

Each function provides the same behavior, but loops through the allocated data arrays in different order. You will notice the inner and outer loops are reversed in the functions.

This results in different cache characteristics, and you can use function attributed metrics to compare the impact.

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

SSH to the Arm Linux computer. You should know be at the `$HOME` directory on the Arm Linux computer.

## Build and the example

Change to the example application:

``` bash
cd Streamline_cache_test
```

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
row-major ordering: took 48.18 ms
col-major ordering: took 129.11 ms (2.7x slower)
```

Depending on your computer, the time values may be different from the output above.

Notice the second implementation (`yx_loop()`) is significantly slower than the first one (`xy_loop()`). 
