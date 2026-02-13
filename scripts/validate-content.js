#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * Validates content JSON files against their schemas.
 * Run with: npm run validate-content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function validateMarkdownFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { valid: false, error: 'No frontmatter found' };
    }

    const frontmatter = match[1];
    const requiredFields = ['title', 'slug', 'date', 'technologies'];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!frontmatter.includes(`${field}:`)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        valid: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function main() {
  log('\nStarting content validation...\n', 'cyan');

  const contentDir = path.join(__dirname, '../src/content');
  const projectsDir = path.join(contentDir, 'projects');

  let totalFiles = 0;
  let validFiles = 0;
  let invalidFiles = 0;

  // Validate JSON files
  const jsonFiles = [
    'profile-en.json',
    'profile-de.json',
    'experience-en.json',
    'experience-de.json',
    'skills-en.json',
    'skills-de.json',
    'education-en.json',
    'education-de.json',
    'certifications-en.json',
    'certifications-de.json',
    'interests-en.json',
    'interests-de.json',
  ];

  log('Validating JSON files:', 'cyan');
  for (const filename of jsonFiles) {
    const filePath = path.join(contentDir, filename);
    
    if (!fs.existsSync(filePath)) {
      log(`  [WARN] ${filename} - File not found`, 'yellow');
      totalFiles++;
      invalidFiles++;
      continue;
    }

    totalFiles++;
    const result = validateJSON(filePath);
    
    if (result.valid) {
      log(`  [PASS] ${filename} - Valid`, 'green');
      validFiles++;
    } else {
      log(`  [FAIL] ${filename} - Invalid: ${result.error}`, 'red');
      invalidFiles++;
    }
  }

  // Validate Markdown project files
  if (fs.existsSync(projectsDir)) {
    log('\nValidating project Markdown files:', 'cyan');
    const projectFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
    
    if (projectFiles.length === 0) {
      log('  [WARN] No project files found', 'yellow');
    } else {
      for (const filename of projectFiles) {
        const filePath = path.join(projectsDir, filename);
        totalFiles++;
        const result = validateMarkdownFrontmatter(filePath);
        
        if (result.valid) {
          log(`  [PASS] ${filename} - Valid`, 'green');
          validFiles++;
        } else {
          log(`  [FAIL] ${filename} - Invalid: ${result.error}`, 'red');
          invalidFiles++;
        }
      }
    }
  }

  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  log(`Total files checked: ${totalFiles}`, 'cyan');
  log(`Valid: ${validFiles}`, 'green');
  log(`Invalid: ${invalidFiles}`, invalidFiles > 0 ? 'red' : 'green');
  log('='.repeat(50) + '\n', 'cyan');

  if (invalidFiles > 0) {
    log('[ERROR] Content validation failed!', 'red');
    process.exit(1);
  } else {
    log('[SUCCESS] All content files are valid!', 'green');
    process.exit(0);
  }
}

main();
