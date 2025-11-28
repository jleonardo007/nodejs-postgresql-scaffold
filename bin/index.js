#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import {
  DEFAULTS,
  checkNodeVersion,
  checkExistingProject,
  question,
  setPackageJson,
  tsconfig,
  nodemonConfig,
  prettierConfig,
  jestConfig,
  eslintConfig,
  env,
  gitignore,
  structure,
} from '../lib/index.js';

function createStructure(basePath, struct) {
  for (const [key, value] of Object.entries(struct)) {
    if (key === '_files') {
      // Create files in current directory, not a folder
      value.forEach((file) => {
        fs.writeFileSync(path.join(basePath, file), '', 'utf8');
      });
    } else if (Array.isArray(value)) {
      // Create directory with files
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      value.forEach((file) => {
        fs.writeFileSync(path.join(dirPath, file), '', 'utf8');
      });
    } else if (typeof value === 'object' && value !== null) {
      // Create subdirectory and recurse
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      createStructure(dirPath, value);
    }
  }
}

function createConfigFiles({ projectPath, metadata }) {
  const packageJson = setPackageJson(metadata);

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'nodemon.json'), JSON.stringify(nodemonConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, '.prettierrc'), JSON.stringify(prettierConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'jest.config.js'), jestConfig);
  fs.writeFileSync(path.join(projectPath, 'eslintrc.config.js'), eslintConfig);
  fs.writeFileSync(path.join(projectPath, '.env.example'), env);
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
}

async function main() {
  const metadata = {
    name: await question('Project name: '),
    version: (await question('Version (1.0.0): ')) || DEFAULTS.version,
    description: await question('Description: '),
    author: await question('Author: '),
    license: (await question('License (MIT): ')) || DEFAULTS.license,
  };

  const projectPath = path.join(process.cwd(), metadata.name);

  checkNodeVersion();
  checkExistingProject(projectPath);

  fs.mkdirSync(projectPath, { recursive: true });

  // Create first level directories manually to avoid duplication
  for (const [key, value] of Object.entries(structure)) {
    const dirPath = path.join(projectPath, key);
    fs.mkdirSync(dirPath, { recursive: true });

    if (typeof value === 'object' && !Array.isArray(value)) {
      createStructure(dirPath, value);
    } else if (Array.isArray(value)) {
      value.forEach((file) => {
        fs.writeFileSync(path.join(dirPath, file), '', 'utf8');
      });
    }
  }

  createConfigFiles({ projectPath, metadata });
  process.exit(1);
}

main().catch(console.error);
