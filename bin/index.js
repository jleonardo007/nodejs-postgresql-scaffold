#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { input, checkbox, select } from '@inquirer/prompts';

import {
  DEFAULTS,
  checkNodeVersion,
  checkExistingProject,
  checkProjectPath,
  buildStructure,
  createStructure,
  createConfigFiles,
  runCliContext,
  validateProjectName,
  sanitizeProjectName,
  validateVersion,
  validateDescription,
  validateAuthor,
  validateLicense,
  sanitizeText,
} from '#lib';

const installCmds = {
  npm: 'npm install',
  yarn: 'yarn',
  pnpm: 'pnpm install',
};

const installPmCmds = {
  yarn: 'npm install -g yarn',
  pnpm: 'npm install -g pnpm',
};

async function main() {
  try {
    console.log(
      chalk.cyan.bold('\n  Backend Scaffold  ') + chalk.dim('Node · TypeScript · PostgreSQL\n')
    );

    const metadata = {
      name: await input({
        message: 'Project name:',
        validate: validateProjectName,
        filter: sanitizeProjectName,
      }),

      version: await input({
        message: 'Version (e.g. 1.0.0):',
        default: DEFAULTS.version,
        validate: validateVersion,
        filter: (v) => v.trim(),
      }),

      description: await input({
        message: 'Description:',
        validate: validateDescription,
        filter: sanitizeText,
      }),

      author: await input({
        message: 'Author:',
        validate: validateAuthor,
        filter: sanitizeText,
      }),

      license: await input({
        message: 'License (e.g. MIT):',
        default: DEFAULTS.license,
        validate: validateLicense,
        filter: (v) => v.trim(),
      }),
    };

    const linter = await select({
      message: 'Linter / Formatter:',
      choices: [
        {
          name: `${chalk.cyan('ESLint + Prettier')} ${chalk.dim('eslint · prettier · typescript-eslint')}`,
          value: 'eslint',
        },
        {
          name: `${chalk.cyan('Biome')} ${chalk.dim('all-in-one formatter + linter')}`,
          value: 'biome',
        },
      ],
    });

    const testRunner = await select({
      message: 'Jest or Vitest:',
      choices: [
        {
          name: `${chalk.cyan('Jest')} ${chalk.dim('jest')}`,
          value: 'jest',
        },
        {
          name: `${chalk.cyan('Vitest')} ${chalk.dim('vitest')}`,
          value: 'vitest',
        },
      ],
    });

    const packageManager = await select({
      message: 'Package manager:',
      choices: [
        { name: chalk.cyan('npm'), value: 'npm' },
        { name: chalk.cyan('yarn'), value: 'yarn' },
        { name: chalk.cyan('pnpm'), value: 'pnpm' },
      ],
    });

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
        linter,
        testRunner,
        packageManager,
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

    // Install package manager if needed
    if (packageManager !== 'npm') {
      try {
        execSync(`${packageManager} --version`, { stdio: 'ignore' });
      } catch {
        console.log(chalk.yellow(`\n⚠ ${packageManager} is not installed. Installing...`));
        execSync(installPmCmds[packageManager], { stdio: 'inherit' });
        console.log(chalk.green(`✅ ${packageManager} installed`));
      }
    }

    execSync('git init', excecOptions);
    console.log(chalk.cyan.bold('📦 Installing dependencies...'));
    execSync(installCmds[packageManager], excecOptions);
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
    ${linter === 'eslint' ? chalk.cyan('🔍 ESLint + Prettier enabled') : chalk.cyan('🔍 Biome enabled')}
    ${testRunner === 'jest' ? chalk.cyan('🧪 Jest enabled') : chalk.cyan('🧪 Vitest enabled')}
    ${chalk.cyan(packageManager === 'yarn' ? '📦 Yarn enabled' : packageManager === 'pnpm' ? '📦 Pnpm enabled' : '📦 Npm enabled')}
    ${addDocker ? chalk.cyan('🐳 Docker enabled') : ''}
    ${addGitHooks ? chalk.cyan('🪝 Git Hooks enabled') : ''}

`);
  } catch (error) {
    console.error(chalk.red('\n✖ Error:'), error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(console.error);
