#!/bin/bash
set -e

echo "Downloading Open Prices OpenAPI specification..."
mkdir -p specfiles-json

# Download YAML spec from Open Prices API
OPEN_PRICES_URL="https://prices.openfoodfacts.org/api/schema"

downloaded=false
echo "Trying: $OPEN_PRICES_URL"
if curl -s -f -m 30 "$OPEN_PRICES_URL" -o "specfiles-json/open-prices-openapi.yaml"; then
  echo "Successfully downloaded Open Prices spec"
  # Convert YAML to JSON using Node.js
  echo "Converting YAML to JSON..."
  node -e "
    const yaml = require('yaml');
    const fs = require('fs');
    const yamlPath = 'specfiles-json/open-prices-openapi.yaml';
    const jsonPath = 'specfiles-json/open-prices-openapi.json';

    try {
      const yamlContent = fs.readFileSync(yamlPath, 'utf8');
      const data = yaml.parse(yamlContent);
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
      fs.unlinkSync(yamlPath); // Remove YAML file after conversion
      console.log('YAML converted to JSON successfully');
      process.exit(0);
    } catch (error) {
      console.log('Error converting YAML to JSON:', error.message);
      process.exit(1);
    }
  "
  downloaded=true
else
  echo "Failed to download from $OPEN_PRICES_URL"
fi

if [ "$downloaded" = false ]; then
  echo "Warning: Could not download Open Prices specification"
  echo "Continuing with existing specifications..."
fi
