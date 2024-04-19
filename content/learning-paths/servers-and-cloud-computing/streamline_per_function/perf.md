---
title: "Use Perf for sample and event-based profiling"
weight: 4
layout: "learningpathall"
---

{{% notice Note %}}
Before using Perf make sure to enable access to hardware counters.
```console
sudo sysctl -w kernel.perf_event_paranoid=2
```
{{% /notice %}}

## Sample based profiling with Perf

You can use Perf to find out where time is spent in the cache example.

Run it with Perf:

```console
perf record ./cache_test
```

A file `perf.data` will be saved.

To see the data run:

```console
perf report
```

You will see a larger amount of time spend in  `yx_loop()` compared to `xy_loop()`. 

Perf report will show data similar to:

```output
Samples: 968  of event 'cycles:Pu', Event count (approx.): 494336736
Overhead  Command         Shared Object          Symbol
  68.28%  cache_test      cache_test             [.] yx_loop 
  25.33%  cache_test      cache_test             [.] xy_loop
   5.42%  cache_test      cache_test             [.] main
   0.94%  cache_test      [unknown]              [k] 0xffffd96b723240d8
   0.02%  cache_test      ld-linux-aarch64.so.1  [.] 0x00000000000096f8
   0.01%  cache_test      ld-linux-aarch64.so.1  [.] 0x000000000000969c
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] 0x0000000000003064
   0.00%  gator-annotate  libc.so.6              [.] clock_nanosleep 
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] 0x0000000000015990
   0.00%  gator-annotate  libc.so.6              [.] _IO_file_xsputn 
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] 0x0000000000017098
```

You can use the down arrow key to highlight `yx_loop` and select `Annotate yx_loop` to see function details.

The number of samples and the sampling frequency of 4000 Hz is shown.

```output
Samples: 968  of event 'cycles:Pu', 4000 Hz, Event count (approx.): 494336736
yx_loop  /home/ubuntu/Streamline_cache_test/cache_test [Percent: local period]
Percent│    ↓ cbz   w0, 50
       │      ubfiz x7, x0, #2, #32
       │      mov   w8, #0x0                        // #0
       │    {
       │    for (y = 0; y < iterations; y++)
       │    {
       │    sum_1d[y] += src_2d[(y * iterations) + x];
       │      adrp  x5, __data_start
       │      add   x5, x5, #0x60
       │    {
       │14:   mov   w3, w8
       │      mov   x1, #0x0                        // #0
       │    sum_1d[y] += src_2d[(y * iterations) + x];
  1.05 │1c:   ldr   x4, [x5]
  0.69 │      ldr   x6, [x5, #8]
  0.87 │      ldr   w2, [x4, x1]
  1.57 │      ldr   w6, [x6, w3, uxtw #2]
 93.21 │      add   w2, w2, w6
  1.05 │      str   w2, [x4, x1]
       │    for (y = 0; y < iterations; y++)
  0.35 │      add   x1, x1, #0x4
  0.18 │      add   w3, w3, w0
  1.04 │      cmp   x7, x1
       │    ↑ b.ne  1c
       │    for (x = 0; x < iterations; x++)
       │      add   w8, w8, #0x1
       │      cmp   w0, w8
       │    ↑ b.ne  14
       │    }
       │    }
       │    }
       │50: ← ret 
```

Do the same thing for the `xy_loop` function. 

Everything is nearly the same. 

```output
Samples: 968  of event 'cycles:Pu', 4000 Hz, Event count (approx.): 494336736

Percent│      ubfiz x9, x0, #2, #32
       │      mov   w7, w0
       │      mov   x4, #0x0                        // #0
       │      mov   w8, #0x0                        // #0
       │    {
       │    for (x = 0; x < iterations; x++)
       │    {
       │    sum_1d[y] += src_2d[(y * iterations) + x];
       │      adrp  x5, __data_start
       │      add   x5, x5, #0x60
       │    {
       │1c:   mov   w1, w8
       │    sum_1d[y] += src_2d[(y * iterations) + x];
  2.88 │20:   ldr   x3, [x5]
  4.81 │      ldr   x6, [x5, #8]
  1.44 │      ldr   w2, [x3, x4]
 87.54 │      ldr   w6, [x6, w1, uxtw #2]
       │      add   w2, w2, w6
  1.44 │      str   w2, [x3, x4]
       │    for (x = 0; x < iterations; x++)
  0.48 │      add   w1, w1, #0x1
  1.40 │      cmp   w7, w1
       │    ↑ b.ne  20
       │    for (y = 0; y < iterations; y++)
       │      add   w8, w8, w0
       │      add   x4, x4, #0x4
       │      add   w7, w7, w0
       │      cmp   x4, x9
       │    ↑ b.ne  1c
       │    }
       │    }
       │    }
       │58: ← ret
```

Your numbers and the exact line where the majority of time is spend will be slightly different depending on the type of Neoverse processor you are using. 

## Event based profiling with Perf

You can use event-based profiling to capture cache misses.

Run Perf with the cache misses event:

```console
perf record -e cache-misses  ./cache_test
```

To see the results run:

```console
perf report
```

The results show the number of samples and confirm `yx_loop` has many more cache misses. 

```output
Samples: 996  of event 'cache-misses:u', Event count (approx.): 26544074
Overhead  Command         Shared Object          Symbol
  95.85%  cache_test      cache_test             [.] yx_loop
   2.59%  cache_test      cache_test             [.] xy_loop
   1.55%  cache_test      cache_test             [.] main
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] _dl_relocate_object
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] dl_main
   0.00%  gator-annotate  ld-linux-aarch64.so.1  [.] _dl_fixup
   0.00%  cache_test      ld-linux-aarch64.so.1  [.] _dl_start
   0.00%  cache_test      cache_test             [.] .plt
   0.00%  cache_test      libc.so.6              [.] __aarch64_swp4_acq
   0.00%  cache_test      libc.so.6              [.] start_thread
   0.00%  cache_test      [unknown]              [k] 0xffffd00084cf7a10
   0.00%  cache_test      [unknown]              [k] 0xffffd00084cf80f8
```

This example is easy because there are only 3 functions. You can imagine in a large program there are cache misses from many more functions. 

Some functions are long and some are short and you would not have the knowledge of comparing 2 versions with the same functionality. 

In this case, it would be hard to know if the number of cache misses in a particular function was high because the misses are not connected to the total number of instructions.

Event-based profiling tells us that most of the cache misses in the program are from `yx_loop()`. This a percentage of all cache misses. 

You can use the down arrow key to select the function and annotate the code as before to see where the cache misses are coming from.


