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

To see the results in a comma separated file:

```console
more results.csv/functions-capture-bt.csv
```

The first row of the file list columns for the data and each subsequent row represents the per function metrics.

```output
"Periodic Samples: Periodic Samples","Counters: Instructions (Speculated): All","Counters: Branch Predictor:
 Possible Predictions","Counters: Branch Predictor: Mispredictions","Counters: Instructions (Executed): All"
,"Counters: L1 Data Cache: Access","Counters: L1 Data Cache: Refill","Counters: Cycles: CPU Cycles",uid,imag
e,symbol,inlined from
96,2.51412e+08,2.51613e+07,5146,2.51314e+08,1.2578e+08,2.54434e+07,2.26803e+08,7,"cache_test","yx_loop"
67,1.50018e+08,2.49386e+07,7211,1.48851e+08,4.97964e+07,398044,4.68261e+07,1,"cache_test","main"
58,2.24281e+08,2.49704e+07,5108,2.2404e+08,1.24201e+08,682816,1.3655e+08,6,"cache_test","xy_loop"
1,1.00443e+06,100706,114,1.00158e+06,500484,102006,973388,8,"libc.so.6","__GI___munmap"
1,1666,262,25,1014,477,83,10799,10,"libc.so.6","__GI___futex_abstimed_wait_cancelable64"
```

The values are in scientific notation.

You can open the file using a spreadsheet program. Below is a screenshot of LibreOffice Calc.

put the picture here. 

You can also write simple scripts to process the CSV files.

Use a text editor to save the code below to a file named `report.py`.

```python
import csv

# Open the CSV file
with open('test.csv', 'r') as file:
    # Read the CSV file
    reader = csv.reader(file)
    headers = next(reader)

    # Find the indices of the columns of interest
    access_index = headers.index("Counters: L1 Data Cache: Access")
    refill_index = headers.index("Counters: L1 Data Cache: Refill")
    inlined_from_index = headers.index("symbol")

    for row in reader:
        # Convert scientific notation to regular numbers
        access = float(row[access_index])
        refill = float(row[refill_index])
        ratio = (refill / access) * 100.0
        func = row[inlined_from_index]

        # Print the values
        print("\nFunction: ", func)
        print("\t L1D cache accesses:  {:<10.1f}".format(access))
        print("\t L1D cache refills :  {:<10.1f}".format(refill))
        print("\t L1D data ratio    :  {:<10.1f}".format(ratio))
```

Run the Python code:

```console
python ./report.py
```

The level 1 data cache metrics are printed for each function:

```output
Function:  yx_loop
	 L1D cache accesses:  125780000.0
	 L1D cache refills :  25443400.0
	 L1D data ratio    :  20.2      

Function:  main
	 L1D cache accesses:  49796400.0
	 L1D cache refills :  398044.0  
	 L1D data ratio    :  0.8       

Function:  xy_loop
	 L1D cache accesses:  124201000.0
	 L1D cache refills :  682816.0  
	 L1D data ratio    :  0.5       

Function:  __GI___munmap
	 L1D cache accesses:  500484.0  
	 L1D cache refills :  102006.0  
	 L1D data ratio    :  20.4      

Function:  __GI___futex_abstimed_wait_cancelable64
	 L1D cache accesses:  477.0     
	 L1D cache refills :  83.0      
	 L1D data ratio    :  17.4      
```

Function attributed metrics are useful because they provide hardware metrics for each function. This makes it easier to understand if a function is utilizing the hardware well or there may be opportunities for improvement. 
