#!/bin/bash
set -e

echo "Downloading FastAPI OpenAPI specification..."
mkdir -p specfiles-json

# Try multiple possible FastAPI OpenAPI endpoints
FACETS_BASE_URL="https://facets-kp.openfoodfacts.org"
ENDPOINTS=("/openapi.json" "/docs/openapi.json" "/api/openapi.json" "/v1/openapi.json")

downloaded=false
for endpoint in "${ENDPOINTS[@]}"; do
  echo "Trying: $FACETS_BASE_URL$endpoint"
  if curl -s -f -m 30 "$FACETS_BASE_URL$endpoint" -o "specfiles-json/kPanels-openapi.json"; then
    echo "Successfully downloaded FastAPI spec from $endpoint"
    # Validate it's a valid JSON
    if command -v jq >/dev/null 2>&1 && jq '.info.title' specfiles-json/kPanels-openapi.json > /dev/null 2>&1; then
      echo "Valid OpenAPI specification downloaded"
      downloaded=true
      break
    elif node -e "JSON.parse(require('fs').readFileSync('specfiles-json/kPanels-openapi.json', 'utf8'))" 2>/dev/null; then
      echo "Valid OpenAPI specification downloaded"
      downloaded=true
      break
    else
      echo "Downloaded file is not valid OpenAPI JSON"
      rm -f specfiles-json/kPanels-openapi.json
    fi
  else
    echo "Failed to download from $endpoint"
  fi
done

if [ "$downloaded" = false ]; then
  echo "Warning: Could not download FastAPI specification from any endpoint"
  echo "Continuing with existing specifications..."
else
  # Pretty-print the JSON file for better readability
  echo "Formatting downloaded JSON file..."
  node -e "
    const fs = require('fs');
    const filePath = 'specfiles-json/kPanels-openapi.json';
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  "
  echo "JSON file formatted successfully"
fi
