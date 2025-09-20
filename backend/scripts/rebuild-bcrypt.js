#!/usr/bin/env node

// Script to rebuild bcrypt for the current platform
// This fixes the "invalid ELF header" error when deploying to Render

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Rebuilding bcrypt for current platform...');

try {
  // Check if bcrypt directory exists
  const bcryptPath = path.join(__dirname, '..', 'node_modules', 'bcrypt');
  
  if (fs.existsSync(bcryptPath)) {
    console.log('Rebuilding bcrypt...');
    execSync('npm rebuild bcrypt --update-binary', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('bcrypt rebuilt successfully!');
  } else {
    console.log('bcrypt not found, installing...');
    execSync('npm install bcrypt', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('bcrypt installed successfully!');
  }
} catch (error) {
  console.error('Error rebuilding bcrypt:', error.message);
  console.log('Continuing with deployment...');
}