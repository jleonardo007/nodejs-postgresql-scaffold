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
  checkProjectPath,
  buildStructure,
  createStructure,
  createConfigFiles,
  runCliContext,
} from '#lib';

async function main() {
  try {
    console.log(
      chalk.cyan.bold('\n  Backend Scaffold  ') + chalk.dim('Node · TypeScript · PostgreSQL\n')
    );

    const metadata = {
      name: await input({
        message: 'Project name:',
        validate: (value) => value.trim() !== '' || 'Project name is required',
        filter: (value) => value.trim(),
      }),
      version: await input({
        message: 'Version:',
        default: DEFAULTS.version,
      }),
      description: await input({ message: 'Description:' }),
      author: await input({ message: 'Author:' }),
      license: await input({
        message: 'License:',
        default: DEFAULTS.license,
      }),
    };

    const extras = await checkbox({
      message: 'Extend your scaffold:',
      choices: [
        {
          name: `${chalk.cyan('Docker')} ${chalk.dim(
            'Dockerfile · docker-compose · .dockerignore'
          )}`,
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

    const ctx = {
      metadata,
      projectPath,
      flags: {
        addDocker,
        addGitHooks,
      },
    };

    checkNodeVersion();
    checkProjectPath(projectPath);
    checkExistingProject(projectPath);

    fs.mkdirSync(projectPath, { recursive: true });

    await runCliContext(ctx, () => {
      const structure = buildStructure();
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

      createConfigFiles();
    });

    const excecOptions = { cwd: projectPath, stdio: 'inherit' };

    execSync('git init', excecOptions);
    console.log(chalk.cyan.bold('📦 Installing dependencies...'));
    execSync('npm install', excecOptions);
    console.log(chalk.green.bold('📦 Dependencies installed'));

    execSync('npm run format', excecOptions);
    execSync('git branch -M main', excecOptions);
    execSync('git add .', excecOptions);
    execSync('git commit -m "chore: initial commit"', excecOptions);

    console.log(chalk.green.bold('✅ Git repo created'));
    console.log(`
    ${chalk.green.bold('✅ Project created')}
    ${chalk.dim('Name')} ${chalk.white.bold(metadata.name)}
    ${chalk.dim('Path')} ${chalk.white(projectPath)}
    ${addDocker ? chalk.cyan('🐳 Docker enabled') : ''}
    ${addGitHooks ? chalk.cyan('🪝 Git Hooks enabled') : ''}

    ${chalk.bold('Next steps:')}
    ${chalk.cyan('$')} cd ${metadata.name} && npm install ${
      addGitHooks ? `${chalk.dim('# prepare script runs husky install automatically')}` : ''
    }
`);
  } catch (error) {
    console.error(chalk.red('\n✖ Error:'), error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(console.error);
