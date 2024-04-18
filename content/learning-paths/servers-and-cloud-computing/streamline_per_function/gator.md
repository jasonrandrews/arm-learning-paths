---
title: "Collect per function metrics"
weight: 5
layout: "learningpathall"
---

Use gator and analyze_capture to get per function metrics.

## Collect function attributed metrics

Function attributed metrics combine the sample-based profiling and the event-based profiling so you can see the number of cache misses in the function. o

Instead of Perf, the Gator daemon is used to collect the data. 

Run the program under the control of `gatord` and create capture data in the `capture.apc` directory:

```console
sudo ~/gatord -I no -o capture.apc -A ./cache_test
```

You will see a new directory created `capture.apc` which contains the sample data.


To convert the data to readable text file in CSV format run:

```console
sudo ~/utils/bin/linux/arm64/analyze_capture --collect-images --csv-results results.csv --no-print-results ./capture.apc
```

{{% notice Note %}}
If you get an error running `analyze_capture` similar to `locale::facet::_S_create_c_locale name not valid` you adjust the environment variables:
```console
export LC_ALL=C; unset LANGUAGE
```
{{% /notice %}}

The processed output is now stored in the `results.csv` directory.


