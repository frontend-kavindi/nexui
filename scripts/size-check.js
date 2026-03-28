#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run size-limit
try {
  const output = execSync('pnpm size-limit', { encoding: 'utf8' });
  
  // Save output for GitHub Actions to read
  fs.writeFileSync('.size-check-output.txt', output);
  
  console.log('Bundle size check completed successfully');
  console.log(output);
} catch (error) {
  console.error('Bundle size check failed:');
  console.error(error.stdout || error.message);
  
  // Save error output
  fs.writeFileSync('.size-check-output.txt', error.stdout || error.message);
  
  process.exit(1);
}
