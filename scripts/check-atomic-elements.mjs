#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAstroTemplate } from './atomic-validator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

/**
 * Recursively find all .astro files in a directory
 * @param {string} dir
 * @returns {string[]}
 */
function findAstroFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findAstroFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      results.push(fullPath);
    }
  }

  return results;
}

const astroFiles = findAstroFiles(srcDir);
let totalViolations = 0;

console.log(
  `Checking ${astroFiles.length} Astro files for atomic typography compliance...`
);

for (const filePath of astroFiles) {
  const relativePath = path.relative(projectRoot, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = validateAstroTemplate(content, relativePath);

  if (violations.length > 0) {
    totalViolations += violations.length;
    console.error(`\n❌ ${relativePath}:`);
    for (const v of violations) {
      console.error(`   Line ${v.line}: [${v.rule}] ${v.message}`);
    }
  }
}

if (totalViolations > 0) {
  console.error(
    `\nFound ${totalViolations} atomic design violation(s). Please use <Paragraph> and <Heading> components.`
  );
  process.exit(1);
} else {
  console.log(
    `✅ All ${astroFiles.length} Astro files conform to atomic typography standards.`
  );
  process.exit(0);
}
