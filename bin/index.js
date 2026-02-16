#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { input, checkbox } from '@inquirer/prompts';
import {
  DEFAULTS,
  checkNodeVersion,
  checkExistingProject,
  setPackageJson,
  tsconfig,
  nodemonConfig,
  prettierConfig,
  jestConfig,
  eslintConfig,
  env,
  gitignore,
  structure,
  tsconfigdev,
  lintstaged,
  commitlint,
  dockerfile,
  dockerCompose,
  dockerIgnore,
  huskyConfigCommitMsg,
  huskyConfigPreCommit,
} from '../lib/index.js';

function createStructure(basePath, struct) {
  for (const [key, value] of Object.entries(struct)) {
    if (key === '_files') {
      // Create files in current directory, not a folder
      value.forEach((item) => {
        fs.writeFileSync(path.join(basePath, item.file), item.template, 'utf8');
      });
    } else if (Array.isArray(value)) {
      // Create directory with files
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      value.forEach((item) => {
        fs.writeFileSync(path.join(dirPath, item.file), item.template, 'utf8');
      });
    } else if (typeof value === 'object' && value !== null) {
      // Create subdirectory and recurse
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      createStructure(dirPath, value);
    }
  }
}

function createConfigFiles({ projectPath, metadata, addDocker, addGitHooks }) {
  const packageJson = setPackageJson({ ...metadata, addGitHooks });

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.dev.json'),
    JSON.stringify(tsconfigdev, null, 2),
  );
  fs.writeFileSync(path.join(projectPath, 'nodemon.json'), JSON.stringify(nodemonConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, '.prettierrc'), JSON.stringify(prettierConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'jest.config.js'), jestConfig);
  fs.writeFileSync(path.join(projectPath, 'eslint.config.js'), eslintConfig);
  fs.writeFileSync(path.join(projectPath, '.env.example'), env);
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  if (addDocker) {
    fs.writeFileSync(path.join(projectPath, 'Dockerfile'), dockerfile);
    fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
    fs.writeFileSync(path.join(projectPath, '.dockerignore'), dockerIgnore);
  }

  if (addGitHooks) {
    fs.writeFileSync(path.join(projectPath, 'commitlint.config.js'), commitlint);
    fs.writeFileSync(path.join(projectPath, 'lint-staged.config.js'), lintstaged);

    const huskyDir = path.join(projectPath, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    fs.writeFileSync(path.join(huskyDir, 'commit-msg'), huskyConfigCommitMsg, { mode: 0o755 });
    fs.writeFileSync(path.join(huskyDir, 'pre-commit'), huskyConfigPreCommit, { mode: 0o755 });
  }
}

async function main() {
  try {
    console.log(
      chalk.cyan.bold('\n  Backend Scaffold  ') + chalk.dim('Node · TypeScript · PostgreSQL\n'),
    );

    const metadata = {
      name: await input({
        message: 'Project name:',
        validate: (value) => value.trim() !== '' || 'Project name is required',
        filter: (value) => value.trim(),
      }),
      version: await input({ message: 'Version:', default: DEFAULTS.version }),
      description: await input({ message: 'Description:' }),
      author: await input({ message: 'Author:' }),
      license: await input({ message: 'License:', default: DEFAULTS.license }),
    };

    const extras = await checkbox({
      message: 'Extend your scaffold:',
      choices: [
        {
          name: `${chalk.cyan('Docker')} ${chalk.dim('Dockerfile · docker-compose · .dockerignore')}`,
          value: 'docker',
        },
        {
          name: `${chalk.cyan('Git Hooks')} ${chalk.dim('Husky · commitlint · lint-staged')}`,
          value: 'githooks',
        },
      ],
    });

    const projectPath = path.join(process.cwd(), metadata.name);
    const addDocker = extras.includes('docker');
    const addGitHooks = extras.includes('githooks');

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

    createConfigFiles({ projectPath, metadata, addDocker, addGitHooks });

    process.chdir(projectPath);
    execSync('git init', { stdio: 'inherit' });
    console.log(chalk.green.bold('✅ Git repo created'));

    console.log(`
    ${chalk.green.bold('✅ Project created')}
    ${chalk.dim('Name')} ${chalk.white.bold(metadata.name)}
    ${chalk.dim('Path')} ${chalk.white(projectPath)}
    ${addDocker ? chalk.cyan('🐳 Docker enabled') : ''}
    ${addGitHooks ? chalk.cyan('🪝 Git Hooks enabled') : ''}

    ${chalk.bold('Next steps:')}
    ${chalk.cyan('$')} cd ${metadata.name} && npm install ${addGitHooks ? `${chalk.dim('# prepare script runs husky install automatically')}` : ''}
`);
  } catch (error) {
    console.error(chalk.red('\n✖ Error:'), error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(console.error);
