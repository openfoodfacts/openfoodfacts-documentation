#!/bin/bash
set -e

echo "Downloading Nutripatrol OpenAPI specification..."
mkdir -p specfiles-json

# Download JSON spec from Nutripatrol API
NUTRIPATROL_URL="https://nutripatrol.openfoodfacts.org/api/openapi.json"

downloaded=false
echo "Trying: $NUTRIPATROL_URL"
if curl -s -f -m 30 "$NUTRIPATROL_URL" -o "specfiles-json/nutripatrol-openapi.json"; then
  echo "Successfully downloaded Nutripatrol spec"
  # Validate it's a valid JSON
  if command -v jq >/dev/null 2>&1 && jq '.info.title' specfiles-json/nutripatrol-openapi.json > /dev/null 2>&1; then
    echo "Valid OpenAPI specification downloaded"
    downloaded=true
  elif node -e "JSON.parse(require('fs').readFileSync('specfiles-json/nutripatrol-openapi.json', 'utf8'))" 2>/dev/null; then
    echo "Valid OpenAPI specification downloaded"
    downloaded=true
  else
    echo "Downloaded file is not valid OpenAPI JSON"
    rm -f specfiles-json/nutripatrol-openapi.json
  fi
else
  echo "Failed to download from $NUTRIPATROL_URL"
fi

if [ "$downloaded" = false ]; then
  echo "Warning: Could not download Nutripatrol specification"
  echo "Continuing with existing specifications..."
else
  # Pretty-print the JSON file for better readability
  echo "Formatting downloaded JSON file..."
  node -e "
    const fs = require('fs');
    const filePath = 'specfiles-json/nutripatrol-openapi.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  "
  echo "JSON file formatted successfully"
fi
