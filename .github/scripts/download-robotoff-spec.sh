#!/bin/bash
set -e

echo "Downloading Robotoff OpenAPI specification..."
mkdir -p specfiles-json

# Download YAML spec from Robotoff API
ROBOTOFF_URL="https://raw.githubusercontent.com/openfoodfacts/robotoff/main/doc/references/api.yml"

downloaded=false
echo "Trying: $ROBOTOFF_URL"
if curl -s -f -m 30 "$ROBOTOFF_URL" -o "specfiles-json/robotoff-openapi.yaml"; then
  echo "Successfully downloaded Robotoff spec"
  # Convert YAML to JSON using Node.js
  echo "Converting YAML to JSON..."
  node -e "
    const yaml = require('yaml');
    const fs = require('fs');
    const yamlPath = 'specfiles-json/robotoff-openapi.yaml';
    const jsonPath = 'specfiles-json/robotoff-openapi.json';

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
  echo "Failed to download from $ROBOTOFF_URL"
fi

if [ "$downloaded" = false ]; then
  echo "Warning: Could not download Robotoff specification"
  echo "Continuing with existing specifications..."
fi
