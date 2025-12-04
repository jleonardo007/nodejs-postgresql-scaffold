export const setPackageJson = ({ name, version, description, author, license }) => {
  return {
    name: `${name}`,
    version: `${version}`,
    description: `${description}`,
    author: `${author}`,
    license: `${license}`,
    main: 'dist/server.js',
    scripts: {
      dev: 'ts-node-dev --respawn --transpile-only --exit-child src/server.ts',
      'dev:watch': 'nodemon --watch src --ext ts --exec ts-node src/server.ts',
      build: 'rimraf dist && tsc',
      start: 'node dist/server.js',
      'start:prod': 'cross-env NODE_ENV=production node dist/server.js',

      typeorm: 'typeorm-ts-node-commonjs',
      'migration:generate': 'npm run typeorm -- migration:generate -d src/database/data-source.ts',
      'migration:create': 'npm run typeorm -- migration:create',
      'migration:run': 'npm run typeorm -- migration:run -d src/database/data-source.ts',
      'migration:revert': 'npm run typeorm -- migration:revert -d src/database/data-source.ts',
      'migration:show': 'npm run typeorm -- migration:show -d src/database/data-source.ts',

      seed: 'ts-node src/scripts/seed.ts',

      'db:drop': 'npm run typeorm -- schema:drop -d src/database/data-source.ts',
      'db:sync': 'npm run typeorm -- schema:sync -d src/database/data-source.ts',
      'db:reset': 'npm run db:drop && npm run migration:run && npm run seed',

      test: 'cross-env NODE_ENV=test jest --coverage --verbose',
      'test:watch': 'cross-env NODE_ENV=test jest --watch',
      'test:unit': 'cross-env NODE_ENV=test jest --testPathPattern=tests/unit',
      'test:integration': 'cross-env NODE_ENV=test jest --testPathPattern=tests/integration',
      'test:e2e': 'cross-env NODE_ENV=test jest --testPathPattern=tests/e2e',
      'test:coverage': 'cross-env NODE_ENV=test jest --coverage --coverageDirectory=coverage',

      lint: 'eslint . --ext .ts',
      'lint:fix': 'eslint . --ext .ts --fix',
      format: 'prettier --write "src/**/*.ts" "tests/**/*.ts"',
      'format:check': 'prettier --check "src/**/*.ts" "tests/**/*.ts"',

      'type-check': 'tsc --noEmit',
      validate: 'npm run lint && npm run format:check && npm run type-check',

      clean: 'rimraf dist coverage logs/*.log',
      prebuild: 'npm run clean',
      prepare: 'husky install',
    },
    dependencies: {
      '@types/bcrypt': '^6.0.0',
      '@types/cors': '^2.8.19',
      '@types/express': '^5.0.6',
      '@types/jsonwebtoken': '^9.0.10',
      '@types/node': '^24.10.1',
      '@types/swagger-jsdoc': '^6.0.4',
      '@types/swagger-ui-express': '^4.1.8',
      '@types/uuid': '^11.0.0',
      bcrypt: '^6.0.0',
      bull: '^4.16.5',
      compression: '^1.8.1',
      cors: '^2.8.5',
      'date-fns': '^4.1.0',
      dotenv: '^17.2.3',
      express: '^5.2.1',
      'express-rate-limit': '^8.2.1',
      helmet: '^8.1.0',
      jsonwebtoken: '^9.0.2',
      'node-cron': '^4.2.1',
      pg: '^8.16.3',
      'reflect-metadata': '^0.2.2',
      'swagger-jsdoc': '^6.2.8',
      'swagger-ui-express': '^5.0.1',
      typeorm: '^0.3.28',
      typescript: '^5.9.3',
      uuid: '^13.0.0',
      winston: '^3.18.3',
      'winston-daily-rotate-file': '^5.0.0',
      zod: '^4.1.13',
    },
    devDependencies: {
      '@faker-js/faker': '^10.1.0',
      '@types/compression': '^1.8.1',
      '@types/jest': '^30.0.0',
      '@types/node-cron': '^3.0.11',
      '@types/supertest': '^6.0.3',
      '@typescript-eslint/eslint-plugin': '^8.48.1',
      '@typescript-eslint/parser': '^8.48.1',
      'cross-env': '^10.1.0',
      eslint: '^9.39.1',
      'eslint-config-prettier': '^10.1.8',
      'eslint-plugin-prettier': '^5.1.3',
      husky: '^9.1.7',
      jest: '^30.2.0',
      nodemon: '^3.1.11',
      prettier: '^3.7.4',
      rimraf: '^6.1.2',
      supertest: '^7.1.4',
      'ts-jest': '^29.4.6',
      'ts-node': '^10.9.2',
      'ts-node-dev': '^2.0.0',
      'tsconfig-paths': '^4.2.0',
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=9.0.0',
    },
  };
};

export const tsconfig = {
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist', 'tests', '**/*.spec.ts', '**/*.test.ts'],
  compilerOptions: {
    target: 'ES2022',
    module: 'commonjs',
    lib: ['ES2022'],
    outDir: './dist',
    rootDir: './src',
    removeComments: true,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'node',
    resolveJsonModule: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    strictPropertyInitialization: false,
    sourceMap: true,
    declaration: true,
    declarationMap: true,
    incremental: true,
    noImplicitAny: true,
    noImplicitThis: true,
    alwaysStrict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    baseUrl: '.',
    paths: {
      '@config/*': ['src/config/*'],
      '@entities/*': ['src/entities/*'],
      '@services/*': ['src/services/*'],
      '@controllers/*': ['src/controllers/*'],
      '@middlewares/*': ['src/middlewares/*'],
      '@utils/*': ['src/utils/*'],
      '@types/*': ['src/types/*'],
      '@repositories/*': ['src/repositories/*'],
      '@validators/*': ['src/validators/*'],
      '@exceptions/*': ['src/exceptions/*'],
      '@decorators/*': ['src/decorators/*'],
    },
  },
};

export const prettierConfig = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  quoteProps: 'as-needed',
};

export const nodemonConfig = {
  watch: ['src'],
  ext: 'ts,json',
  ignore: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'node_modules'],
  exec: 'ts-node -r tsconfig-paths/register src/server.ts',
  env: {
    NODE_ENV: 'development',
  },
  restartable: 'rs',
  delay: 1000,
};

export const jestConfig = `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/types/**',
    '!src/database/migrations/**',
    '!src/database/seeds/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@decorators/(.*)$': '<rootDir>/src/decorators/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
`;

export const eslintConfig = `
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'dist', 'node_modules', 'coverage'],
  rules: {
    // TypeScript rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    
    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Prettier
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
`;

export const env = `
# Environment
NODE_ENV=development

# Server
PORT=3000
API_PREFIX=/api
API_VERSION=V1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FILE_ERROR=logs/error.log
LOG_FILE_COMBINED=logs/combined.log
LOG_FILE_ACCESS=logs/access.log

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Encryption
ENCRYPTION_KEY=your-encryption-key-32-characters
ENCRYPTION_ALGORITHM=aes-256-cbc

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Feature Flags
ENABLE_SWAGGER=true
ENABLE_RATE_LIMITING=true
ENABLE_CACHING=true
ENABLE_AUDIT_LOG=true
`;

export const gitignore = `
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
pids
*.pid
*.seed
*.pid.lock

# Testing
coverage/
.nyc_output/
*.lcov

# IDEs and editors
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
*.sublime-workspace
*.sublime-project

# OS
Thumbs.db
.DS_Store
.AppleDouble
.LSOverride

# Temporary files
tmp/
temp/
*.tmp
.cache/

# Database
*.sqlite
*.db

# Docker
docker-compose.override.yml

# Misc
.husky/_
`;
