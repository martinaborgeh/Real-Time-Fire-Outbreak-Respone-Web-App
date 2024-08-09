#!/bin/bash

# Recreate config file
rm -rf ./public/env-config-prod.js
touch ./public/env-config-prod.js

# Add assignment 
echo "window._env_ = {" >> ./public/env-config-prod.js

# Read each line in .env file
# Each line represents key=value pairs
while IFS='=' read -r varname varvalue || [ -n "$varname" ]; do
  # Ensure the line contains a variable assignment
  if [ -n "$varvalue" ]; then
    # Trim any whitespace or newlines from varvalue
    varvalue=$(echo "$varvalue" | tr -d '\r\n')
    
    # Read value of current variable if it exists as an Environment variable
    value=$(printf '%s\n' "${!varname}")
    
    # Otherwise, use the value from .env file
    [ -z "$value" ] && value=$varvalue
    
    # Append configuration property to JS file
    echo "  $varname: \"$value\"," >> ./public/env-config-prod.js
  fi
done < .env.prod

echo "}" >> ./public/env-config-prod.js
