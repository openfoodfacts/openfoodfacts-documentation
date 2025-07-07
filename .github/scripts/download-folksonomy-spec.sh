#!/bin/bash
set -e

echo "Downloading Folksonomy OpenAPI specification..."
mkdir -p specfiles-json

# Download JSON spec from Folksonomy API
FOLKSONOMY_URL="https://api.folksonomy.openfoodfacts.org/openapi.json"

downloaded=false
echo "Trying: $FOLKSONOMY_URL"
if curl -s -f -m 30 "$FOLKSONOMY_URL" -o "specfiles-json/folksonomy-openapi.json"; then
  echo "Successfully downloaded Folksonomy spec"
  # Validate it's a valid JSON
  if command -v jq >/dev/null 2>&1 && jq '.info.title' specfiles-json/folksonomy-openapi.json > /dev/null 2>&1; then
    echo "Valid OpenAPI specification downloaded"
    downloaded=true
  elif node -e "JSON.parse(require('fs').readFileSync('specfiles-json/folksonomy-openapi.json', 'utf8'))" 2>/dev/null; then
    echo "Valid OpenAPI specification downloaded"
    downloaded=true
  else
    echo "Downloaded file is not valid OpenAPI JSON"
    rm -f specfiles-json/folksonomy-openapi.json
  fi
else
  echo "Failed to download from $FOLKSONOMY_URL"
fi

if [ "$downloaded" = false ]; then
  echo "Warning: Could not download Folksonomy specification"
  echo "Continuing with existing specifications..."
else
  # Pretty-print the JSON file for better readability
  echo "Formatting downloaded JSON file..."
  node -e "
    const fs = require('fs');
    const filePath = 'specfiles-json/folksonomy-openapi.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  "
  echo "JSON file formatted successfully"
fi
