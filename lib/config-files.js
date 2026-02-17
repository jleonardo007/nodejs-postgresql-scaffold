export const setPackageJson = ({ name, version, description, author, license, addGitHooks }) => {
  return {
    name: `${name}`,
    version: `${version}`,
    description: `${description}`,
    author: `${author}`,
    license: `${license}`,
    main: 'dist/server.js',
    scripts: {
      dev: "nodemon --watch src --ext ts --exec 'ts-node -r tsconfig-paths/register src/server.ts'",
      build: 'rimraf dist && tsc',
      start: 'node -r tsconfig-paths/register dist/server.js',
      'start:prod': 'cross-env NODE_ENV=production node -r tsconfig-paths/register dist/server.js',
      typeorm: 'ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js',
      'migration:generate': 'npm run typeorm -- migration:generate -d src/database/data-source.ts',
      'migration:create': 'npm run typeorm -- migration:create',
      'migration:run': 'npm run typeorm -- migration:run -d src/database/data-source.ts',
      'migration:revert': 'npm run typeorm -- migration:revert -d src/database/data-source.ts',
      'migration:show': 'npm run typeorm -- migration:show -d src/database/data-source.ts',
      seed: 'ts-node -r tsconfig-paths/register src/scripts/seed.ts',
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
      ...(addGitHooks ? { prepare: 'husky' } : {}),
    },
    dependencies: {
      bcrypt: '6.0.0',
      bullmq: '5.69.1',
      compression: '1.8.1',
      cors: '2.8.6',
      'date-fns': '4.1.0',
      dotenv: '17.3.1',
      express: '5.2.1',
      'express-rate-limit': '8.2.1',
      helmet: '8.1.0',
      jsonwebtoken: '9.0.3',
      'node-cron': '4.2.1',
      pg: '8.18.0',
      'reflect-metadata': '0.2.2',
      'swagger-jsdoc': '6.2.8',
      'swagger-ui-express': '5.0.1',
      typeorm: '0.3.28',
      uuid: '13.0.0',
      winston: '3.19.0',
      'winston-daily-rotate-file': '5.0.0',
      zod: '4.3.6',
    },
    devDependencies: {
      '@faker-js/faker': '10.3.0',
      '@types/bcrypt': '6.0.0',
      '@types/compression': '1.8.1',
      '@types/cors': '2.8.19',
      '@types/express': '5.0.6',
      '@types/jest': '30.0.0',
      '@types/jsonwebtoken': '9.0.10',
      '@types/node': '24.10.13',
      '@types/node-cron': '3.0.11',
      '@types/supertest': '6.0.3',
      '@types/swagger-jsdoc': '6.0.4',
      '@types/swagger-ui-express': '4.1.8',
      '@typescript-eslint/eslint-plugin': '8.55.0',
      '@typescript-eslint/parser': '8.55.0',
      'cross-env': '10.1.0',
      eslint: '9.39.2',
      'eslint-config-prettier': '9.1.2',
      'eslint-plugin-prettier': '5.5.5',
      jest: '30.2.0',
      nodemon: '3.1.11',
      prettier: '3.8.1',
      rimraf: '6.1.2',
      supertest: '7.2.2',
      'ts-jest': '29.4.6',
      'ts-node': '10.9.2',
      'tsconfig-paths': '^4.2.0',
      typescript: '5.9.3',
      'typescript-eslint': '8.55.0',
      ...(addGitHooks
        ? {
            '@commitlint/cli': '20.4.1',
            '@commitlint/config-conventional': '20.4.1',
            'lint-staged': '16.2.7',
            husky: '9.1.7',
            commitlint: '20.4.1',
          }
        : {}),
    },
    overrides: {
      glob: '13.0.3',
    },
    engines: {
      node: '>=20.0.0',
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
      '@constants/*': ['src/constants/*'],
      '@controllers/*': ['src/controllers/*'],
      '@database/*': ['src/database/*'],
      '@decorators/*': ['src/decorators/*'],
      '@entities/*': ['src/entities/*'],
      '@exceptions/*': ['src/exceptions/*'],
      '@jobs/*': ['src/jobs/*'],
      '@middlewares/*': ['src/middlewares/*'],
      '@queues/*': ['src/queues/*'],
      '@repositories/*': ['src/repositories/*'],
      '@routes/*': ['src/routes/*'],
      '@services/*': ['src/services/*'],
      '@types/*': ['src/types/*'],
      '@utils/*': ['src/utils/*'],
      '@validators/*': ['src/validators/*'],
    },
  },
};

export const tsconfigdev = {
  extends: './tsconfig.json',
  include: ['src/**/*', 'scripts/**/*', 'tests/**/*'],
  exclude: ['node_modules', 'dist'],
  compilerOptions: {
    rootDir: '.',
    noEmit: true,
    incremental: false,
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

export const jestConfig = `module.exports = {
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

export const eslintConfig = `const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = tseslint.config(
  // Ignored files
  {
    ignores: [
      'eslint.config.js',
      'jest.config.js',
      '.lintstagedrc.js',
      'commitlint.config.js',
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended, // No type-checking, fast

  // TypeScript files
  {
    files: ['src/**/*.ts', 'scripts/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
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

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Migrations and seeds — relaxed rules
  {
    files: ['src/database/migrations/**/*.ts', 'src/database/seeds/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Tests — relaxed rules
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  prettierConfig
);

`;

export const env = `# Environment
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

export const gitignore = `# Dependencies
node_modules/

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

export const lintstaged = `export default {
  '*.ts': (filenames) => [
    \`eslint --fix --max-warnings=0 \${filenames.join(' ')}\`,
    'tsc --noEmit --project tsconfig.dev.json',
  ],
  '*.{js,cjs,mjs}': ['eslint --fix --max-warnings=0 --no-warn-ignored'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
`;

export const commitlint = `module.exports = {
  extends: ['@commitlint/config-conventional'],
};
`;

export const dockerfile = `FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
`;

export const dockerCompose = `services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - .env
    depends_on:
      database:
        condition: service_healthy

  database:
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER} -d \${DB_NAME}']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
`;

export const dockerIgnore = `node_modules
.env
.git
*.log
`;

export const huskyConfigCommitMsg = 'npx --no -- commitlint --edit "$1"';
export const huskyConfigPreCommit = 'npx lint-staged';
