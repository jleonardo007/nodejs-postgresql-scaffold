export function setPackageJson({
  name,
  version,
  description,
  author,
  license,
  addGitHooks,
  addDocker,
}) {
  const databaseScripts = addDocker
    ? {
        'db:drop':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- schema:drop -d src/database/data-source.ts',
        'db:sync':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- schema:sync -d src/database/data-source.ts',
        'db:reset':
          "dotenv -e .env -- sh -c 'docker exec -it $PROJECT_NAME-api npm run db:drop && docker exec -it $PROJECT_NAME-api npm run migration:run && docker exec -it $PROJECT_NAME-api npm run seed'",
        'migration:generate':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- migration:generate src/database/migrations/$npm_config_name -d src/database/data-source.ts --',
        'migration:create':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- migration:create src/database/migrations/$npm_config_name --',
        'migration:run':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- migration:run -d src/database/data-source.ts',
        'migration:revert':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- migration:revert -d src/database/data-source.ts',
        'migration:show':
          'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run typeorm -- migration:show -d src/database/data-source.ts',
        seed: 'ts-node -r tsconfig-paths/register src/scripts/seeds.ts',
        'seed:run': 'dotenv -e .env -- docker exec -it $PROJECT_NAME-api npm run seed',
      }
    : {
        'migration:generate':
          'npm run typeorm -- migration:generate src/database/migrations/$npm_config_name -d src/database/data-source.ts --',
        'migration:create':
          'npm run typeorm -- migration:create src/database/migrations/$npm_config_name --',
        'migration:run': 'npm run typeorm -- migration:run -d src/database/data-source.ts',
        'migration:revert': 'npm run typeorm -- migration:revert -d src/database/data-source.ts',
        'migration:show': 'npm run typeorm -- migration:show -d src/database/data-source.ts',
        'db:drop': 'npm run typeorm -- schema:drop -d src/database/data-source.ts',
        'db:sync': 'npm run typeorm -- schema:sync -d src/database/data-source.ts',
        'db:reset': 'npm run db:drop && npm run migration:run && npm run seed',
        seed: 'ts-node -r tsconfig-paths/register src/scripts/seeds.ts',
      };

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
      ...databaseScripts,
      test: 'cross-env NODE_ENV=test jest',
      'test:coverage': 'cross-env NODE_ENV=test jest --coverage',
      'test:watch': 'cross-env NODE_ENV=test jest --watch',
      'test:unit': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/unit',
      'test:integration': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/integration',
      'test:e2e': 'cross-env NODE_ENV=test jest --testPathPatterns=tests/e2e',
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
      'cookie-parser': '1.4.7',
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
      '@types/cookie-parser': '1.4.10',
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
      'dotenv-cli': '11.0.0',
      eslint: '9.39.2',
      'eslint-config-prettier': '9.1.2',
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
      node: '>=22.0.0',
      npm: '>=9.0.0',
    },
  };
}

export const tsconfig = {
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist', 'tests', '**/*.spec.ts', '**/*.test.ts'],
  compilerOptions: {
    target: 'es2024',
    module: 'nodenext',
    lib: ['ES2024'],
    outDir: './dist',
    rootDir: './src',
    removeComments: true,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'nodenext',
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
    paths: {
      '@appTypes': ['./src/types/index'],
      '@appTypes/*': ['./src/types/*'],
      '@config': ['./src/config/index'],
      '@config/*': ['./src/config/*'],
      '@constants': ['./src/constants/index'],
      '@constants/*': ['./src/constants/*'],
      '@controllers': ['./src/controllers/index'],
      '@controllers/*': ['./src/controllers/*'],
      '@database': ['./src/database/index'],
      '@database/*': ['./src/database/*'],
      '@decorators': ['./src/decorators/index'],
      '@decorators/*': ['./src/decorators/*'],
      '@docs': ['./src/docs/index'],
      '@docs/*': ['./src/docs/*'],
      '@dtos': ['./src/dtos/index'],
      '@dtos/*': ['./src/dtos/*'],
      '@entities': ['./src/entities/index'],
      '@entities/*': ['./src/entities/*'],
      '@exceptions': ['./src/exceptions/index'],
      '@exceptions/*': ['./src/exceptions/*'],
      '@jobs': ['./src/jobs/index'],
      '@jobs/*': ['./src/jobs/*'],
      '@middlewares': ['./src/middlewares/index'],
      '@middlewares/*': ['./src/middlewares/*'],
      '@queues': ['./src/queues/index'],
      '@queues/*': ['./src/queues/*'],
      '@repositories': ['./src/repositories/index'],
      '@repositories/*': ['./src/repositories/*'],
      '@routes': ['./src/routes/index'],
      '@routes/*': ['./src/routes/*'],
      '@services': ['./src/services/index'],
      '@services/*': ['./src/services/*'],
      '@scripts': ['./src/scripts/index'],
      '@scripts/*': ['./src/scripts/*'],
      '@utils': ['./src/utils/index'],
      '@utils/*': ['./src/utils/*'],
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
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.dev.json',
        isolatedModules: false,
        diagnostics: false,
      },
    ],
  },
  workerThreads: false,
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
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
    '^@config$': '<rootDir>/src/config/index',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@constants$': '<rootDir>/src/constants/index',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@controllers$': '<rootDir>/src/controllers/index',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@database$': '<rootDir>/src/database/index',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@decorators$': '<rootDir>/src/decorators/index',
    '^@decorators/(.*)$': '<rootDir>/src/decorators/$1',
    '^@entities$': '<rootDir>/src/entities/index',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@exceptions$': '<rootDir>/src/exceptions/index',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@jobs$': '<rootDir>/src/jobs/index',
    '^@jobs/(.*)$': '<rootDir>/src/jobs/$1',
    '^@middlewares$': '<rootDir>/src/middlewares/index',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@queues$': '<rootDir>/src/queues/index',
    '^@queues/(.*)$': '<rootDir>/src/queues/$1',
    '^@repositories$': '<rootDir>/src/repositories/index',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@routes$': '<rootDir>/src/routes/index',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@services$': '<rootDir>/src/services/index',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@appTypes$': '<rootDir>/src/types/index',
    '^@appTypes/(.*)$': '<rootDir>/src/types/$1',
    '^@utils$': '<rootDir>/src/utils/index',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@dtos$': '<rootDir>/src/dtos/index',
    '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
    '^@docs$': '<rootDir>/src/docs/swagger.config',
    '^@docs/(.*)$': '<rootDir>/src/docs/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
`;

export const eslintConfig = `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.js',
      'jest.config.js',
      'commitlint.config.mjs',
      'lint-staged.config.mjs',
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts', 'scripts/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2024,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
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
NODE_ENV= # development | test | staging | production

# Project
PROJECT_NAME= # Project name used for Docker container naming e.g. my-api

# Server
PORT=        # Server port e.g. 3000
API_PREFIX=  # API prefix e.g. /api
API_VERSION= # API version e.g. V1

# Database
DB_HOST=      # Database host e.g. localhost
DB_PORT=      # PostgreSQL port e.g. 5432
DB_USER=      # Database user
DB_PASSWORD=  # Database password
DB_NAME=      # Database name
DB_TEST_NAME= # Test database name

# JWT
JWT_SECRET=             # Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=         # Access token expiration e.g. 24h | 7d | 60s
JWT_REFRESH_SECRET=     # Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_REFRESH_EXPIRES_IN= # Refresh token expiration e.g. 7d | 30d

# Cookie Config
COOKIE_HTTP_ONLY=       # true | false
COOKIE_SECURE=          # true in production (requires HTTPS)
COOKIE_DOMAIN=          # Cookie domain e.g. example.com
COOKIE_SAME_SITE=       # strict | lax | none
ACCESS_COOKIE_MAX_AGE=  # Access token cookie max age e.g. 1h → 1 * 60 * 60 * 1000
REFRESH_COOKIE_MAX_AGE= # Refresh token cookie max age e.g. 30d → 30 * 24 * 60 * 60 * 1000

# CORS
CORS_ORIGIN=      # Allowed origins separated by comma e.g. http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS= # true | false

# Hashing
SALT_ROUNDS= # bcrypt rounds (10-12 recommended)

# Pagination
DEFAULT_PAGE_SIZE= # Default page size e.g. 20
MAX_PAGE_SIZE=     # Maximum page size e.g. 100

# Logging
LOG_LEVEL=         # error | warn | info | http | verbose | debug | silly
LOG_FILE_ERROR=    # Path to error log file e.g. logs/error.log
LOG_FILE_COMBINED= # Path to combined log file e.g. logs/combined.log
LOG_FILE_ACCESS=   # Path to access log file e.g. logs/access.log

# File Upload
MAX_FILE_SIZE=      # Maximum file size in bytes e.g. 5242880 (5MB)
ALLOWED_FILE_TYPES= # Allowed file types separated by comma e.g. image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=    # Time window in milliseconds e.g. 900000 (15 minutes)
RATE_LIMIT_MAX_REQUESTS= # Maximum requests per window e.g. 100

# Feature Flags
ENABLE_SWAGGER=       # true | false
ENABLE_RATE_LIMITING= # true | false
ENABLE_CACHING=       # true | false
ENABLE_AUDIT_LOG=     # true | false
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

export const commitlint = `export default {
  extends: ['@commitlint/config-conventional'],
};
`;

export const dockerfile = `# Stage 1: Base
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]
`;

export const dockerCompose = `services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: \${PROJECT_NAME:?PROJECT_NAME is not set in .env file}-api
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
    container_name: \${PROJECT_NAME:?PROJECT_NAME is not set in .env file}-db
    environment:
      POSTGRES_USER: \${DB_USER:?DB_USER is not set in .env file}
      POSTGRES_PASSWORD: \${DB_PASSWORD:?DB_PASSWORD is not set in .env file}
      POSTGRES_DB: \${DB_NAME:?DB_NAME is not set in .env file}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER} -d \${DB_NAME}']
      interval: 10s
      timeout: 5s
      retries: 5

  database_test:
    container_name: \${PROJECT_NAME:?PROJECT_NAME is not set in .env file}-db-test
    image: postgres:18-alpine
    env_file:
      - .env.test
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_TEST_NAME:?DB_TEST_NAME is not set in .env file}
    ports:
      - '5433:5432'
    volumes:
      - postgres-test-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER} -d \${DB_TEST_NAME}']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
  postgres-test-data:
`;

export const dockerIgnore = `node_modules
.env
.git
*.log
`;

export const huskyConfigCommitMsg = 'npx --no -- commitlint --edit "$1"';
export const huskyConfigPreCommit = 'npx lint-staged';
