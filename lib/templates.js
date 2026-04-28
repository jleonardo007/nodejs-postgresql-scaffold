export const logger = `import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
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
      title: 'express-ts backend scaffold',
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

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const entityFiles = globSync(path.join(__dirname, '../entities/**/*.entity.ts'));
const migrationFiles = globSync(path.join(__dirname, '../database/migrations/**/*.ts')).sort(); // Sort migrations alphabetically to ensure correct execution order based on timestamp prefix

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
  entities: entityFiles,
  migrations: migrationFiles,
});
`;

export const datasourceApp = `import path from 'path';
import { sync as globSync } from 'glob';
import { DataSource } from 'typeorm';
import { env } from './environment';
import { SnakeNamingStrategy } from '@utils';

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

export const app = `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from '@routes/index';
import { errorHandler } from '@middlewares/index';
import { logger } from '@config/logger';
import { env } from '@config/environment';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(\`\${req.method} \${req.path}\`);
  next();
});

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

const startServer = async () => {
  try {
    // Init Database
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

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

export const _middlewares = `export * from './error-handler';
export * from './dto-validation';
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

export const errorHandlerMiddleware = `import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { BaseException } from '../exceptions';

export const errorHandler = (
  error: Error | BaseException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (error instanceof BaseException) {
    return res.status(error.httpCode).json(error.toJSON());
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'UNHANDLED_SERVER_ERROR',
      message: error.message,
    },
  });
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

export const testSetup = `import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
`;
