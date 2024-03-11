#!/usr/bin/env bash

 # delete vim backup files
# rm -r **/.*.un~
find . -type f -name '.*.un~' -exec rm {} +

## delete build directories
# rm -r c-do/build node-do/build go-do/build

find . \( -type d \( -name 'build' -o -name 'node_modules' -o -name '.nvm' -o -name '.npm' \) \) -exec echo "Deleting {}" \; -exec rm -r {} \;


