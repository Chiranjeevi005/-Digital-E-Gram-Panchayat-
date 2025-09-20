#!/usr/bin/env node

// Script to rebuild bcrypt and sharp for the current platform
// This fixes the "invalid ELF header" error when deploying to Render

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Rebuilding native modules for current platform...');

try {
  // Check if node_modules directory exists
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    console.log('Rebuilding bcrypt and sharp...');
    execSync('npm rebuild bcrypt sharp --update-binary', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('Native modules rebuilt successfully!');
  } else {
    console.log('node_modules not found, installing dependencies...');
    execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('Dependencies installed successfully!');
  }
} catch (error) {
  console.error('Error rebuilding native modules:', error.message);
  console.log('Continuing with deployment...');
}