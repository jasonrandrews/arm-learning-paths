---
title: Create a C version of Adler32
weight: 3

### FIXED, DO NOT MODIFY
layout: learningpathall
---

## How can I generate a C function for adler32?

Create a new directory and enter the empty directory:

```console
mkdir adler32 && cd adler32
```

Start Amazon Q CLI:

```console
q chat
```

Copy and past the instructions below to the Q CLI:

```console
Write a basic C implementation of the adler32 checksum function. 
Write the function in a file named adler32-simple.c that can be called from another C file. 
Don't create a C main function yet.
```

{{% notice Note %}}
Before writing new files Amazon Q will ask for your permission. You should review the proposed changes and enter `y` to confirm.
{{% /notice %}}

Here is the output:

```output
I'll create a basic C implementation of the Adler-32 checksum function for you. 
Let me write this in a file named adler32-simple.c.



[Tool Request] Write to filesystem
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Path: /home/jasand01/adler32/adler32-simple.c

+     1: /**
+     2:  * adler32-simple.c
+     3:  * A simple implementation of the Adler-32 checksum algorithm
+     4:  */
+     5: 
+     6: #include <stdint.h>
+     7: #include <stddef.h>
+     8: 
+     9: /**
+    10:  * Calculate the Adler-32 checksum of a data buffer
+    11:  *
+    12:  * @param data Pointer to the data buffer
+    13:  * @param len Length of the data buffer in bytes
+    14:  * @return The Adler-32 checksum
+    15:  */
+    16: uint32_t adler32(const void *data, size_t len) {
+    17:     const uint8_t *buf = (const uint8_t *)data;
+    18:     
+    19:     // Adler-32 parameters
+    20:     const uint32_t MOD_ADLER = 65521; // Largest prime number less than 2^16
+    21:     
+    22:     // Initialize Adler-32 parts
+    23:     uint32_t a = 1;    // Sum of all bytes
+    24:     uint32_t b = 0;    // Sum of all 'a' values
+    25:     
+    26:     // Process each byte of the data buffer
+    27:     for (size_t i = 0; i < len; i++) {
+    28:         a = (a + buf[i]) % MOD_ADLER;
+    29:         b = (b + a) % MOD_ADLER;
+    30:     }
+    31:     
+    32:     // Combine the two 16-bit values into a 32-bit Adler-32 checksum
+    33:     return (b << 16) | a;
+    34: }



Allow this action? Use 't' to trust (always allow) this tool for the session. [y/n/t]:

> y

Writing to filesystem...
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Creating: /home/jasand01/adler32/adler32-simple.c

🟢 Completed in 0.0s


I've created the file adler32-simple.c with a basic implementation of the Adler-
32 checksum algorithm. Here's what the implementation includes:

• A function named adler32 that takes a data buffer and its length as parameters
• Proper handling of the Adler-32 algorithm with the modulo value of 65521
• The two parts of the checksum (a and b) are properly calculated and combined
• Appropriate type definitions using standard C types (uint32_t, uint8_t)
• Documentation comments explaining the function and its parameters

The function can be called from another C file by including this file and 
declaring the function prototype. The implementation follows the standard Adler-
32 algorithm:

1. Initialize a = 1 and b = 0
2. For each byte in the data:
   • Update a = (a + byte) % MOD_ADLER
   • Update b = (b + a) % MOD_ADLER
3. Return the combined value (b << 16) | a

This implementation doesn't include a main function as requested, so it's ready 
to be used as a library function from another C file.

```

You now have a C function for adler32 in the file `adler32-simple.c`. 

Continue to the next section to create the test application.