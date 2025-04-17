---
title: Write NEON intrinsics using the Amazon Developer Q CLI and improve Adler32 performance

minutes_to_complete: 45

who_is_this_for: This is an introductory topic for C/C++ developers who are interested in using the Amazon Q Developer CLI to improve performance using NEON intrinsics.

learning_objectives: 
    - Use the Amazon Q Developer CLI to write NEON intrinsics to improve performance of the Adler32 checksum algorithm.

prerequisites:
    - An Arm computer running Linux and with the GNU compiler (gcc) installed.
    - Amazon Q Developer CLI installed. For instructions read the [Q CLI](/install-guides/aws-q-cli/) install guide.

author: Jason Andrews

### Tags
skilllevels: Introductory
subjects: Performance and Architecture
armips:
    - Neoverse
    - Cortex-A
tools_software_languages:
    - GCC
    - Runbook

operatingsystems:
    - Linux
shared_path: true
shared_between:
    - servers-and-cloud-computing
    - laptops-and-desktops
    - mobile-graphics-and-gaming


further_reading:
    - resource:
        title: An update on GNU performance
        link: https://community.arm.com/arm-community-blogs/b/tools-software-ides-blog/posts/update-on-gnu-performance
        type: blog


### FIXED, DO NOT MODIFY
# ================================================================================
weight: 1                       # _index.md always has weight of 1 to order correctly
layout: "learningpathall"       # All files under learning paths have this same wrapper
learning_path_main_page: "yes"  # This should be surfaced when looking for related content. Only set for _index.md of learning path content.
---
