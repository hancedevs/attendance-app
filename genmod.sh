#!/bin/bash

filename=".modules"

# Read the file line by line
while IFS= read -r line
do
  # Skip empty lines
  [ -z "$line" ] && continue

  # Execute the NestJS commands for each line
  echo "Generating module, service, and controller for: $line"
  nest g module "$line"
  nest g service "$line"
  nest g controller "$line"
done < "$filename"
