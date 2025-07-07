# GitHub Actions Scripts

This directory contains utility scripts used by the GitHub Actions workflows for automated OpenAPI
documentation updates.

## Scripts

### download-kpanels-spec.sh

Downloads the Knowledge Panels FastAPI OpenAPI specification from the facets service.

- **Source**: `https://facets-kp.openfoodfacts.org/openapi.json`
- **Output**: `specfiles-json/kPanels-openapi.json`
- **Features**:
  - Tries multiple endpoints for resilience
  - Validates downloaded JSON
  - Pretty-prints the output

### download-open-prices-spec.sh

Downloads the Open Prices OpenAPI specification from the prices service.

- **Source**: `https://prices.openfoodfacts.org/api/schema`
- **Output**: `specfiles-json/open-prices-openapi.json`
- **Features**:
  - Downloads YAML format
  - Converts to JSON automatically
  - Pretty-prints the output
  - Cleans up temporary files

## Usage

These scripts are automatically executed by the GitHub Actions workflow but can also be run
manually:

```bash
# Download Knowledge Panels spec
./.github/scripts/download-kpanels-spec.sh

# Download Open Prices spec
./.github/scripts/download-open-prices-spec.sh
```

## Requirements

- Node.js (for JSON processing and YAML conversion)
- curl (for downloading specifications)
- The `yaml` npm package (for YAML to JSON conversion)
