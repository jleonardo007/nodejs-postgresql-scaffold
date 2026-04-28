export const tsconfig = {
  include: ['src/**/*', 'scripts/**/*'],
  exclude: ['node_modules', 'dist', 'tests', '**/*.spec.ts', '**/*.test.ts'],
  compilerOptions: {
    target: 'es2024',
    module: 'nodenext',
    lib: ['ES2024'],
    outDir: './dist',
    rootDir: '.',
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
        tsconfig: '<rootDir>/tsconfig.json',
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
DB_HOST=      # Database host e.g. localhost or database container name defined in docker-compose.yml
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
    'tsc --noEmit --project tsconfig.json',
  ],
  '*.{js,cjs,mjs}': ['eslint --fix --max-warnings=0 --no-warn-ignored'],
  '*.{json,md,yml,yaml,ts,js,cjs,mjs}': ['prettier --write'],
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
    container_name: \${PROJECT_NAME:?PROJECT_NAME is not set in .env file}
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
    container_name: \${DB_NAME:?DB_NAME is not set in .env file}
    environment:
      POSTGRES_USER: \${DB_USER:?DB_USER is not set in .env file}
      POSTGRES_PASSWORD: \${DB_PASSWORD:?DB_PASSWORD is not set in .env file}
      POSTGRES_DB: \${DB_NAME:?DB_NAME is not set in .env file}
    volumes:
      - postgres-data:/var/lib/postgresql
    ports:
      - '5432:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER} -d \${DB_NAME}']
      interval: 10s
      timeout: 5s
      retries: 5

  database_test:
    container_name: \${DB_TEST_NAME:?DB_TEST_NAME is not set in .env file}
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_TEST_NAME:?DB_TEST_NAME is not set in .env file}
    ports:
      - '5433:5432'
    volumes:
      - postgres-test-data:/var/lib/postgresql
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
