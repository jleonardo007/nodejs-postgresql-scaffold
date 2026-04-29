export const logger = `import winston from 'winston';

const { combine, timestamp, errors, printf, json, colorize } = winston.format;

const pretty = printf(({ level, message, timestamp, stack, ...meta }) => {
  return JSON.stringify(
    {
      timestamp,
      level,
      message: stack || message,
      ...meta,
    },
    null,
    2
  );
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true })),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), process.env.NODE_ENV !== 'production' ? pretty : json()),
    }),
  ],
});
`;

export const logging = `export * from './adapters/typeorm.logger';
export * from './context/async-context';
export * from './context/get-request-id';
export * from './errors/error-handler';
export * from './logger/logger-wrapper';
export * from './middleware/context.middleware';
export * from './middleware/logging.middleware';
`;

export const asyncContext = `import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<{
  requestId: string;
}>();
`;

export const getRequestId = `import { asyncLocalStorage } from './async-context';

export const getRequestId = () => asyncLocalStorage.getStore()?.requestId;
`;

export const loggerWrapper = `import { logger } from '@config/logger';
import { getRequestId } from '../context/get-request-id';

export const log = {
  info: (message: string, meta = {}) => {
    logger.info(message, {
      requestId: getRequestId(),
      ...meta,
    });
  },

  error: (message: string, meta = {}) => {
    logger.error(message, {
      requestId: getRequestId(),
      ...meta,
    });
  },

  warn: (message: string, meta = {}) => {
    logger.warn(message, {
      requestId: getRequestId(),
      ...meta,
    });
  },

  debug: (message: string, meta = {}) => {
    logger.debug(message, {
      requestId: getRequestId(),
      ...meta,
    });
  },
};
`;

export const contextMiddleware = `import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { asyncLocalStorage } from '../context/async-context';

export const contextMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();

  asyncLocalStorage.run({ requestId }, () => {
    res.locals.requestId = requestId;
    next();
  });
};
`;

export const loggingMiddleware = `import { Request, Response, NextFunction } from 'express';
import { env } from '@config/environment';
import { log } from '../logger/logger-wrapper';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    log.info('HTTP Request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      ...(env.NODE_ENV === 'production'
        ? {}
        : { body: req.body, query: req.query, params: req.params }),
    });
  });

  next();
};
`;

export const errorHandler = `import { Request, Response, NextFunction } from 'express';
import { env } from '@config/environment';
import { BaseException } from '@exceptions';
import { log } from '../logger/logger-wrapper';

export const errorHandler = (
  error: Error | BaseException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  log.error('HTTP Error', {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
    ...(env.NODE_ENV === 'production'
      ? {}
      : { body: req.body, query: req.query, params: req.params }),
  });

  if (error instanceof BaseException) {
    return res.status(error.httpCode).json({
      ...error.toJSON(),
      requestId: res.locals.requestId,
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'UNHANDLED_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    },
    requestId: res.locals.requestId,
  });
};
`;

export const typeormLogger = `import { Logger, QueryRunner } from 'typeorm';
import { log } from '../logger/logger-wrapper';

const formatQuery = (query: string) => {
  return query.replace(/\\s+/g, ' ').trim();
};

export class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: unknown[]) {
    log.debug('DB Query', {
      query: formatQuery(query),
      parameters,
    });
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    log.error('DB Query Error', {
      error,
      query: formatQuery(query),
      parameters,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    log.warn('Slow Query', {
      time: \`\${time}ms\`,
      query: formatQuery(query),
      parameters,
    });
  }

  log(level: 'log' | 'info' | 'warn', message: unknown) {
    const mappedLevel = level === 'log' ? 'info' : level;

    log[mappedLevel]('TypeORM', {
      message,
    });
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    log.info('Schema Build', { message });
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    log.info('Migration', { message });
  }
}
`;

export const environment = `import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from './logger';

// Helper to parse comma-separated strings into arrays
const commaSeparated = z.string().transform((val) => val.split(',').map((s) => s.trim()));

const booleanString = z
  .string()
  .transform((val) => val === 'true')
  .pipe(z.boolean());

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),

  // Project
  PROJECT_NAME: z.string().min(1),

  // Server
  PORT: z.coerce.number().int().positive(),
  API_PREFIX: z.string(),
  API_VERSION: z.string(),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_TEST_NAME: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().regex(/^\\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),

  // Cookie Config
  COOKIE_HTTP_ONLY: booleanString,
  COOKIE_SECURE: booleanString,
  COOKIE_DOMAIN: z.string(),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']),
  ACCESS_COOKIE_MAX_AGE: z.coerce.number().int().positive(),
  REFRESH_COOKIE_MAX_AGE: z.coerce.number().int().positive(),

  // CORS
  CORS_ORIGIN: commaSeparated,
  CORS_CREDENTIALS: booleanString,

  // Hashing
  SALT_ROUNDS: z.coerce.number().int().positive(),

  // Pagination
  DEFAULT_PAGE_SIZE: z.coerce.number().int().positive(),
  MAX_PAGE_SIZE: z.coerce.number().int().positive(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).optional(),
  LOG_FILE_ERROR: z.string().optional(),
  LOG_FILE_COMBINED: z.string().optional(),
  LOG_FILE_ACCESS: z.string().optional(),

  // File Upload
  MAX_FILE_SIZE: z.coerce.number().int().positive().optional(),
  ALLOWED_FILE_TYPES: commaSeparated.optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().optional(),

  // Feature Flags
  ENABLE_SWAGGER: booleanString.optional(),
  ENABLE_RATE_LIMITING: booleanString.optional(),
  ENABLE_CACHING: booleanString.optional(),
  ENABLE_AUDIT_LOG: booleanString.optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  dotenv.config();
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => \`\${issue.path.join('.')}: \${issue.message}\`)
      .join('\\n');

    logger.error('\\nInvalid environment variables:\\n');
    logger.error(\`\\n\${errors}\\n\`);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
`;

export const swaggerConfig = `import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '@config/environment';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'express-ts backend',
      version: '1.0.0',
      description: '',
      contact: {
        name: 'API Support',
        email: 'support@api.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: \`http://localhost:\${env.PORT}/api\`,
        description: 'Development server',
      },
    ],
    components: {},
    security: [],
  },
  apis: ['./src/routes/**/*.ts', './src/docs/schemas/**/*.ts'],
};

export default swaggerJsdoc(options);
`;

export const datasourceCLI = `import 'reflect-metadata';
import path from 'path';
import { sync as globSync } from 'glob';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from '@utils';
import { TypeOrmLogger } from '@logging';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const entityFiles = globSync(path.join(__dirname, '../entities/**/*.entity.ts'));
const migrationFiles = globSync(path.join(__dirname, '../database/migrations/**/*.ts')).sort(); // Sort migrations alphabetically to ensure correct execution order based on timestamp prefix

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  logger: new TypeOrmLogger(),
  entities: entityFiles,
  migrations: migrationFiles,
});
`;

export const datasourceApp = `import path from 'path';
import { sync as globSync } from 'glob';
import { DataSource } from 'typeorm';
import { env } from './environment';
import { SnakeNamingStrategy } from '@utils';
import { TypeOrmLogger } from '@logging';

const entityFiles = globSync(path.join(__dirname, '../entities/**/*.entity.ts'));
const migrationFiles = globSync(path.join(__dirname, '../database/migrations/**/*.ts')).sort(); // Sort migrations alphabetically to ensure correct execution order based on timestamp prefix

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  logger: new TypeOrmLogger(),
  entities:
    env.NODE_ENV === 'production'
      ? [path.join(__dirname, '../entities/**/*.entity.js')]
      : entityFiles,
  migrations:
    env.NODE_ENV === 'production'
      ? [path.join(__dirname, '../database/migrations/**/*.js')]
      : migrationFiles,
});
`;

export const app = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from '@routes/index';
import { errorHandler, contextMiddleware, loggingMiddleware } from '@logging';
import { env } from '@config/environment';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@docs/swagger.config';

const app = express();

// Global middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: env.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Swagger docs
if (env.ENABLE_SWAGGER) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Logging
app.use(contextMiddleware);
app.use(loggingMiddleware);

// Routes
app.use(env.API_PREFIX, routes);

// Error handler
app.use(errorHandler);

export default app;
`;

export const server = `import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '@config/database';
import { env } from '@config/environment';
import { logger } from '@config/logger';
import { startJobs } from '@jobs';

const startServer = async () => {
  try {
    // Init Database
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database connected successfully');
    }

    // Start cron jobs
    startJobs();

    // Init Server
    app.listen(env.PORT, () => {
      logger.info(\`Server running on port \${env.PORT}\`);
      logger.info(\`Environment: \${env.NODE_ENV}\`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
`;

export const routes = `import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

router.use('/V1', v1Routes);
export default router;
`;

export const v1Routes = `import { Router } from 'express';

const router = Router();
export default router;
`;

export const _exception = `export * from './base-exception';
export * from './validation-exception';
export * from './unauthorized-exception';
export * from './forbidden-exception';
export * from './conflict-exception';
export * from './notfound-exception';
export * from './bad-request-exception';
`;

export const baseException = `export class BaseException extends Error {
  public code: string;
  public httpCode: number;

  constructor(message: string, httpCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.httpCode = httpCode;
    this.code = code;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
      },
    };
  }
}
`;

export const validationException = `import { BaseException } from './base-exception';

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: unknown;
}

export class ValidationException extends BaseException {
  public errors: ValidationError[];

  constructor(message: string = 'Validation error', errors: ValidationError[] = []) {
    super(message, 422, 'VALIDATION_ERROR');
    this.errors = errors;
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
        errors: this.errors,
      },
    };
  }
}
`;

export const unauthorizedException = `import { BaseException } from './base-exception';

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Not authorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
`;

export const forbiddenException = `import { BaseException } from './base-exception';

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}
`;

export const notfoundException = `import { BaseException } from './base-exception';

export class NotFoundException extends BaseException {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}
`;

export const conflictException = `import { BaseException } from './base-exception';

export class ConflictException extends BaseException {
  constructor(message: string = 'Resource is in a conflicting state') {
    super(message, 409, 'CONFLICT');
  }
}
`;

export const badRequestException = `import { BaseException } from './base-exception';

export class BadRequestException extends BaseException {
  constructor(message: string = 'Invalid request') {
    super(message, 400, 'BAD_REQUEST');
  }
}
`;

export const _middlewares = `export * from './dto-validation';
`;

export const validationMiddleware = `import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ValidationException, ValidationError } from '../exceptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: PropertyKey[]): unknown {
  return path.reduce((current, key) => {
    return current?.[key];
  }, obj);
}

export const validateDTO = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      res.locals.validatedDto = validated;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.length > 0 ? getNestedValue(req, err.path) : undefined,
        }));

        return next(new ValidationException('DTO validation error', formattedErrors));
      } else {
        return next(error);
      }
    }
  };
};
`;

export const runSeeds = `import { AppDataSource } from '../data-source';
import { logger } from '@config/logger';

export const runSeeds = async (dataSource: typeof AppDataSource = AppDataSource) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    logger.info('Database connected successfully, seeds can run');
  }

  /*
    logger.info('Running seeds...');
    Add your seeds here
    logger.info('All seeds executed successfully');
  */ 
};
`;

export const seedScript = `import 'reflect-metadata';
import { logger } from '@config/logger';
import { runSeeds } from '@database/seeds';

runSeeds().catch((error) => {
  logger.error('Error running seeds:', error);
  process.exit(1);
});
`;

export const expressTypes = `
declare global {
  namespace Express {
    interface Locals {
      validatedDto: Record<string, unknown>;
      requestId: string;
    }
  }
}
`;

export const utils = `export * from './database';`;

export const databaseUtils = `import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return customName ?? snakeCase(embeddedPrefixes.concat(propertyName).join('_'));
  }

  tableName(targetName: string, customName: string): string {
    return customName ?? snakeCase(targetName);
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
`;

export const testSetup = `import 'tsconfig-paths/register';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { beforeAll, afterAll } from '@jest/globals';
import { AppDataSource } from '../src/config/database';
import { runSeeds } from '../src/database/seeds';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    await runSeeds(AppDataSource);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  }
});
`;

export const databaseCliCmd = `type ExecFn = (command: string) => void;

export function drop(exec: ExecFn): void {
  exec('npm run typeorm -- schema:drop -d src/database/data-source.ts');
}

export function sync(exec: ExecFn): void {
  exec('npm run typeorm -- schema:sync -d src/database/data-source.ts');
}

export function reset(exec: ExecFn): void {
  exec('npm run db:drop');
  exec('npm run migration:run');
  exec('npm run seed');
}
`;

export const migrationCliCmd = `type ExecFn = (command: string) => void;

export function run(exec: ExecFn) {
  exec('npm run typeorm -- migration:run -d src/database/data-source.ts');
}

export function revert(exec: ExecFn) {
  exec('npm run typeorm -- migration:revert -d src/database/data-source.ts');
}

export function show(exec: ExecFn) {
  exec('npm run typeorm -- migration:show -d src/database/data-source.ts');
}

export function generate(exec: ExecFn, name: string) {
  exec(
    \`npm run typeorm -- migration:generate src/database/migrations/\${name} -d src/database/data-source.ts\`
  );
}

export function create(exec: ExecFn, name: string) {
  exec(\`npm run typeorm -- migration:create src/database/migrations/\${name}\`);
}
`;

export const seedCliCmd = `type ExecFn = (command: string) => void;

export function runSeed(exec: ExecFn): void {
  exec('npm run seed');
}
`;

export const exec = `import { execSync } from 'node:child_process';

/**
 * Execute shell command and inherit stdio
 */
export function run(command:string) {
  execSync(command, {
    stdio: 'inherit',
  });
}`;

export const dockerizedExcec = `import { execSync } from 'child_process';

/**
 * Ensures that a Docker container exists and is currently running.
 * Exits the process if the container is missing or stopped.
 */
function ensureContainerRunning(container: string): void {
  try {
    const result = execSync(\`docker inspect -f '{{.State.Running}}' \${container}\`, {
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    if (result !== 'true') {
      console.error(\`Container "\${container}" exists but is not running.\`);
      process.exit(1);
    }
  } catch {
    console.error(\`Container "\${container}" does not exist.\`);
    process.exit(1);
  }
}

/**
 * Executes a command inside a running Docker container.
 */
export function run(command: string): void {
  const projectName = process.env.PROJECT_NAME;
  const container = \`\${projectName}\`;

  if (!projectName) {
    console.error('PROJECT_NAME is not defined in .env');
    process.exit(1);
  }

  ensureContainerRunning(container);
  execSync(\`docker exec -i \${container} \${command}\`, {
    stdio: 'inherit',
  });
}
`;

export const cli = `import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { run } from './utils/excec';

import * as db from './commands/db';
import * as migration from './commands/migration';
import * as seed from './commands/seed';

yargs(hideBin(process.argv))
  .scriptName('cli')

  // --- DB ---
  .command('db <command>', 'Database commands', (y) =>
    y
      .command('drop', 'Drop schema', {}, () => {
        db.drop(run);
      })
      .command('sync', 'Sync schema', {}, () => {
        db.sync(run);
      })
      .command('reset', 'Reset database', {}, () => {
        db.reset(run);
      })
  )

  // --- MIGRATIONS ---
  .command('migration <command>', 'Migration commands', (y) =>
    y
      .command(
        'generate <name>',
        'Generate a migration',
        (y) =>
          y.positional('name', {
            type: 'string',
            demandOption: true,
            describe: 'Migration name',
          }),
        (argv) => {
          migration.generate(run, argv.name as string);
        }
      )
      .command(
        'create <name>',
        'Create empty migration',
        (y) =>
          y.positional('name', {
            type: 'string',
            demandOption: true,
            describe: 'Migration name',
          }),
        (argv) => {
          migration.create(run, argv.name as string);
        }
      )
      .command('run', 'Run migrations', {}, () => {
        migration.run(run);
      })
      .command('revert', 'Revert last migration', {}, () => {
        migration.revert(run);
      })
      .command('show', 'Show migrations', {}, () => {
        migration.show(run);
      })
  )

  // --- SEED ---
  .command('seed', 'Run seeders', {}, () => {
    seed.runSeed(run);
  })

  .demandCommand(1, 'You must provide a valid command')
  .strict()
  .help()
  .parse();
`;

export const cronJobs = `import { ScheduledTask } from 'node-cron';
import { logger } from '@config/logger';

type Job = {
  name: string;
  instance: ScheduledTask;
};

const jobs: Job[] = [];

export const startJobs = (): void => {
  if (jobs.length === 0) {
    logger.info('No jobs scheduled');
    return;
  }

  jobs.forEach(({ name, instance }) => {
    instance.start();
    logger.info(\`Job scheduled: \${name}\`);
  });
};
`;
