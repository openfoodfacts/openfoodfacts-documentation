#!/usr/bin/env node

const fs = require('fs');

console.log('Preprocessing Robotoff OpenAPI spec...');

const specPath = './specfiles-json/robotoff-openapi.json';

if (!fs.existsSync(specPath)) {
  console.log('Robotoff spec not found, skipping preprocessing');
  process.exit(0);
}

try {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

  let fixedCount = 0;

  // Fix empty content objects in responses
  function fixEmptyContent(obj) {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
      if (
        key === 'content' &&
        typeof obj[key] === 'object' &&
        Object.keys(obj[key]).length === 0
      ) {
        // Replace empty content with a proper application/json response
        obj[key] = {
          'application/json': {
            schema: {
              type: 'object',
              description: 'Response data',
            },
          },
        };
        fixedCount++;
      } else if (typeof obj[key] === 'object') {
        fixEmptyContent(obj[key]);
      }
    }
  }

  fixEmptyContent(spec);

  // Write the fixed spec back
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));

  console.log(
    `Robotoff spec preprocessing completed. Fixed ${fixedCount} empty content objects.`
  );
} catch (error) {
  console.error('Error preprocessing Robotoff spec:', error.message);
  process.exit(1);
}
