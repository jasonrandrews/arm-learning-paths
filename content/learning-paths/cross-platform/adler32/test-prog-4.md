---
title: Create a test program
weight: 4

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## How can I create a test program to verify adler32 works and measure performance?

To create a test program enter this prompt at the Q CLI:

```console
Create a C file named adler32-test.c which includes a main() function and calls the adler32 function in adler32-simple.c 
Add code around the adler32 calls to measure the performance of the adler32 checksum function. 
Generate a simple test to make sure the adler32 generates the expected checksum. 
Add randomly generated test data of various sizes: 1 kb, 10 kb, 100 kb, 1 mb, and 10 mb. 
Add code to run all test data with different sizes and measure performance.
```

The output is below:

```output
I'll create a comprehensive test file for the Adler-32 implementation with 
performance measurements and validation tests.



[Tool Request] Write to filesystem
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Path: /home/jasand01/adler32/adler32-test.c

+      1: /**
+      2:  * adler32-test.c
+      3:  * Test program for the Adler-32 checksum implementation
+      4:  */
+      5: 
+      6: #include <stdio.h>
+      7: #include <stdlib.h>
+      8: #include <stdint.h>
+      9: #include <string.h>
+     10: #include <time.h>
+     11: #include <sys/time.h>
+     12: 
+     13: // Include the adler32 function declaration
+     14: uint32_t adler32(const void *data, size_t len);
+     15: 
+     16: // Function to generate random data
+     17: void generate_random_data(uint8_t *buffer, size_t size) {
+     18:     for (size_t i = 0; i < size; i++) {
+     19:         buffer[i] = rand() & 0xFF;
+     20:     }
+     21: }
+     22: 
+     23: // Function to measure execution time
+     24: double measure_time(uint32_t (*func)(const void*, size_t), const void *data, size_t len) {
+     25:     struct timeval start, end;
+     26:     
+     27:     gettimeofday(&start, NULL);
+     28:     func(data, len);
+     29:     gettimeofday(&end, NULL);
+     30:     
+     31:     return (end.tv_sec - start.tv_sec) + (end.tv_usec - start.tv_usec) / 1000000.0;
+     32: }
+     33: 
+     34: // Function to run performance test
+     35: void run_performance_test(size_t size) {
+     36:     uint8_t *data = (uint8_t *)malloc(size);
+     37:     if (!data) {
+     38:         fprintf(stderr, "Failed to allocate %zu bytes\n", size);
+     39:         return;
+     40:     }
+     41:     
+     42:     generate_random_data(data, size);
+     43:     
+     44:     // Run the test multiple times to get a more accurate measurement
+     45:     const int num_runs = 5;
+     46:     double total_time = 0.0;
+     47:     uint32_t checksum = 0;
+     48:     
+     49:     for (int i = 0; i < num_runs; i++) {
+     50:         double time_taken = measure_time(adler32, data, size);
+     51:         total_time += time_taken;
+     52:         
+     53:         // Save the checksum from the last run
+     54:         if (i == num_runs - 1) {
+     55:             checksum = adler32(data, size);
+     56:         }
+     57:     }
+     58:     
+     59:     double avg_time = total_time / num_runs;
+     60:     double throughput = (size / (1024.0 * 1024.0)) / avg_time; // MB/s
+     61:     
+     62:     printf("Size: %8zu bytes | Checksum: 0x%08x | Time: %8.6f sec | Throughput: %8.2f MB/s\n", 
+     63:            size, checksum, avg_time, throughput);
+     64:     
+     65:     free(data);
+     66: }
+     67: 
+     68: // Function to verify the adler32 implementation with known test vectors
+     69: void verify_adler32() {
+     70:     // Test vector 1: Empty string
+     71:     const uint8_t test1[] = "";
+     72:     uint32_t expected1 = 0x00000001; // Adler-32 of empty string is 1
+     73:     uint32_t result1 = adler32(test1, 0);
+     74:     
+     75:     // Test vector 2: "abc"
+     76:     const uint8_t test2[] = "abc";
+     77:     uint32_t expected2 = 0x024d0127; // Known Adler-32 of "abc"
+     78:     uint32_t result2 = adler32(test2, 3);
+     79:     
+     80:     // Test vector 3: "Wikipedia"
+     81:     const uint8_t test3[] = "Wikipedia";
+     82:     uint32_t expected3 = 0x11E60398; // Known Adler-32 of "Wikipedia"
+     83:     uint32_t result3 = adler32(test3, 9);
+     84:     
+     85:     printf("Verification Tests:\n");
+     86:     printf("Test 1 (empty string): %s (0x%08x)\n", 
+     87:            result1 == expected1 ? "PASSED" : "FAILED", result1);
+     88:     printf("Test 2 (\"abc\"): %s (0x%08x)\n", 
+     89:            result2 == expected2 ? "PASSED" : "FAILED", result2);
+     90:     printf("Test 3 (\"Wikipedia\"): %s (0x%08x)\n", 
+     91:            result3 == expected3 ? "PASSED" : "FAILED", result3);
+     92:     printf("\n");
+     93: }
+     94: 
+     95: int main() {
+     96:     // Seed the random number generator
+     97:     srand(time(NULL));
+     98:     
+     99:     // Verify the implementation
+    100:     verify_adler32();
+    101:     
+    102:     // Run performance tests with different data sizes
+    103:     printf("Performance Tests:\n");
+    104:     run_performance_test(1 * 1024);        // 1 KB
+    105:     run_performance_test(10 * 1024);       // 10 KB
+    106:     run_performance_test(100 * 1024);      // 100 KB
+    107:     run_performance_test(1024 * 1024);     // 1 MB
+    108:     run_performance_test(10 * 1024 * 1024); // 10 MB
+    109:     
+    110:     return 0;
+    111: }



Allow this action? Use 't' to trust (always allow) this tool for the session. [y/n/t]:

> y

Writing to filesystem...
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Creating: /home/jasand01/adler32/adler32-test.c

🟢 Completed in 0.0s


I've created the adler32-test.c file with a complete test harness for your Adler
-32 implementation. Here's what the test program includes:

1. Verification Tests:
   • Tests the implementation against known Adler-32 checksums:
     • Empty string (should be 0x00000001)
     • "abc" (should be 0x024d0127)
     • "Wikipedia" (should be 0x11E60398)

2. Performance Testing:
   • Generates random data of various sizes:
     • 1 KB
     • 10 KB
     • 100 KB
     • 1 MB
     • 10 MB
   • Measures execution time using gettimeofday() for high precision
   • Runs each test multiple times (5 runs) to get more accurate measurements
   • Calculates and displays throughput in MB/s

3. Helper Functions:
   • generate_random_data(): Creates random test data
   • measure_time(): Times the execution of the Adler-32 function
   • run_performance_test(): Runs the performance test for a specific data size

The program outputs:
• Results of verification tests (PASSED/FAILED)
• For each data size:
  • Size in bytes
  • Resulting checksum (in hex)
  • Average execution time (in seconds)
  • Throughput (in MB/s)

To compile and run this test program, you'll need to compile both C files 
together:
gcc -o adler32-test adler32-simple.c adler32-test.c
./adler32-test


This will give you a comprehensive view of both the correctness and performance 
characteristics of your Adler-32 implementation across different data sizes.

```

Continue to the next section to run the test program and see the results.

