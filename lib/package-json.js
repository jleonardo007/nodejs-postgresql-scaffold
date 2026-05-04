import { useCliContext } from '#lib/context.js';

const gitHooksDeps = {
  husky: '9.1.7',
  commitlint: '20.4.1',
  '@commitlint/cli': '20.4.1',
  '@commitlint/config-conventional': '20.4.1',
  'lint-staged': '16.2.7',
};

const eslintScripts = {
  lint: 'eslint . --ext .ts',
  'lint:fix': 'eslint . --ext .ts --fix',
  format: 'prettier --write "scripts/**/*.ts" "src/**/*.ts" "tests/**/*.ts"',
  'format:check': 'prettier --check "scripts/**/*.ts" "src/**/*.ts" "tests/**/*.ts"',
};

const biomeScripts = {
  lint: 'biome lint .',
  'lint:fix': 'biome lint --write .',
  format: 'biome format --write .',
  'format:check': 'biome format .',
};

const eslintDeps = {
  eslint: '9.39.2',
  'eslint-plugin-unicorn': '64.0.0',
  '@typescript-eslint/eslint-plugin': '8.55.0',
  '@typescript-eslint/parser': '8.55.0',
  'eslint-config-prettier': '9.1.2',
  'typescript-eslint': '8.55.0',
};

const biomeDeps = {
  '@biomejs/biome': '2.4.13',
};

const jestScripts = {
  test: 'cross-env NODE_ENV=test jest',
  'test:coverage': 'cross-env NODE_ENV=test jest --coverage',
  'test:watch': 'cross-env NODE_ENV=test jest --watch',
  'test:unit': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/unit',
  'test:integration': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/integration',
  'test:e2e': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/e2e',
};

const vitestScripts = {
  test: 'cross-env NODE_ENV=test vitest run',
  'test:coverage': 'cross-env NODE_ENV=test vitest run --coverage',
  'test:watch': 'cross-env NODE_ENV=test vitest',
  'test:unit': 'cross-env NODE_ENV=test vitest run tests/unit',
  'test:integration': 'cross-env NODE_ENV=test vitest run tests/integration',
  'test:e2e': 'cross-env NODE_ENV=test vitest run tests/e2e',
};

const jestDeps = {
  jest: '30.2.0',
  '@types/jest': '30.0.0',
  'ts-jest': '29.4.6',
};

const vitestDeps = {
  vitest: '4.1.5',
  'vite-tsconfig-paths': '6.1.1',
  '@vitest/coverage-v8': '4.1.5',
};

const npmScripts = {
  validate: 'npm run lint && npm run format:check && npm run type-check',
  prebuild: 'npm run clean',
};

const yarnScripts = {
  validate: 'yarn lint && yarn format:check && yarn type-check',
  prebuild: 'yarn clean',
};

const pnpmScripts = {
  validate: 'pnpm lint && pnpm format:check && pnpm type-check',
  prebuild: 'pnpm clean',
};

export function buildPackageJson() {
  const { metadata, flags } = useCliContext();
  return {
    name: `${metadata.name}`,
    version: `${metadata.version}`,
    description: `${metadata.description}`,
    author: `${metadata.author}`,
    license: `${metadata.license}`,
    main: 'dist/server.js',
    scripts: {
      cli: 'ts-node -r tsconfig-paths/register scripts/cli/index.ts',
      dev: "nodemon --watch src --ext ts --exec 'ts-node -r tsconfig-paths/register src/server.ts'",
      build: 'rimraf dist && tsc',
      start: 'node -r tsconfig-paths/register dist/server.js',
      'start:prod': 'cross-env NODE_ENV=production node -r tsconfig-paths/register dist/server.js',
      typeorm: 'ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js',
      seed: 'ts-node -r tsconfig-paths/register src/scripts/seeds.ts',
      'type-check': 'tsc --noEmit',
      clean: 'rimraf dist coverage logs/*.log',
      ...(flags.packageManager === 'yarn'
        ? yarnScripts
        : flags.packageManager === 'pnpm'
          ? pnpmScripts
          : npmScripts),
      ...(flags.testRunner === 'vitest' ? vitestScripts : jestScripts),
      ...(flags.linter === 'biome' ? biomeScripts : eslintScripts),
      ...(flags.addGitHooks ? { prepare: 'husky' } : {}),
    },
    dependencies: {
      bcrypt: '6.0.0',
      bullmq: '5.69.1',
      compression: '1.8.1',
      'cookie-parser': '1.4.7',
      cors: '2.8.6',
      'date-fns': '4.1.0',
      dotenv: '17.3.1',
      express: '5.2.1',
      'express-rate-limit': '8.4.1',
      helmet: '8.1.0',
      jsonwebtoken: '9.0.3',
      'node-cron': '4.2.1',
      pg: '8.18.0',
      'reflect-metadata': '0.2.2',
      'swagger-jsdoc': '6.2.8',
      'swagger-ui-express': '5.0.1',
      typeorm: '0.3.28',
      uuid: '14.0.0',
      winston: '3.19.0',
      'winston-daily-rotate-file': '5.0.0',
      yargs: '18.0.0',
      zod: '4.3.6',
    },
    devDependencies: {
      '@faker-js/faker': '10.3.0',
      '@types/bcrypt': '6.0.0',
      '@types/compression': '1.8.1',
      '@types/cookie-parser': '1.4.10',
      '@types/cors': '2.8.19',
      '@types/express': '5.0.6',
      '@types/jsonwebtoken': '9.0.10',
      '@types/node': '24.10.13',
      '@types/node-cron': '3.0.11',
      '@types/supertest': '6.0.3',
      '@types/swagger-jsdoc': '6.0.4',
      '@types/swagger-ui-express': '4.1.8',
      '@types/yargs': '17.0.35',
      'cross-env': '10.1.0',
      'dotenv-cli': '11.0.0',
      nodemon: '3.1.11',
      prettier: '3.8.1',
      rimraf: '6.1.2',
      supertest: '7.2.2',
      'ts-node': '10.9.2',
      'tsconfig-paths': '4.2.0',
      typescript: '5.9.3',
      ...(flags.testRunner === 'vitest' ? vitestDeps : jestDeps),
      ...(flags.linter === 'biome' ? biomeDeps : eslintDeps),
      ...(flags.addGitHooks && gitHooksDeps),
    },
    overrides: {
      glob: '13.0.3',
    },
    engines: {
      node: '>=22.0.0',
      npm: '>=9.0.0',
    },
  };
}
