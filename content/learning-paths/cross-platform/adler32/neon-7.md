---
title: Create a NEON version of Adler32
weight: 7

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## How can I create a NEON version of Adler32 to see if performance improves?

To create a NEON version enter the prompt:

```console
Add a second implementation of adler32 that processes data in blocks to avoid too frequent modulo operations and create it in adler32-block.c 
For inputs less than 16 bytes use a standard implementation. 
Update the Makefile and other files to add this new version and compare performance. Print out the speedup from the block version.
```

```console
Add a third implementation of adler32 checksum function that uses Arm NEON intrinsics and write it in a file adler32-neon.c
Update the Makefile and other files to run all 3 versions and compare performance. 
```

The output is:

```outout

```

In the next section you can try the Clang compiler and check the performance compared to GCC.