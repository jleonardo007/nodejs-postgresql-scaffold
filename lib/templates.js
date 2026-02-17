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

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('/api'),
  API_VERSION: z.string().default('V1'),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().regex(/^\\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\\d+[smhd]$/, 'Invalid format, e.g: 24h, 7d, 60s'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_FILE_ERROR: z.string().default('logs/error.log'),
  LOG_FILE_COMBINED: z.string().default('logs/combined.log'),
  LOG_FILE_ACCESS: z.string().default('logs/access.log'),

  // CORS
  CORS_ORIGIN: commaSeparated,
  CORS_CREDENTIALS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  ENCRYPTION_ALGORITHM: z.enum(['aes-256-cbc', 'aes-256-gcm']).default('aes-256-cbc'),

  // Pagination
  DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().default(20),
  MAX_PAGE_SIZE: z.coerce.number().int().positive().default(100),

  // File Upload
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(5242880),
  ALLOWED_FILE_TYPES: commaSeparated,

  // Feature Flags
  ENABLE_SWAGGER: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_RATE_LIMITING: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_CACHING: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
  ENABLE_AUDIT_LOG: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .default(true),
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
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
`;

export const datasourceApp = `import { DataSource } from 'typeorm';
import { env } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: [
    env.NODE_ENV === 'production' ? 'dist/entities/**/*.entity.js' : 'src/entities/**/*.entity.ts',
  ],
  migrations: [
    env.NODE_ENV === 'production'
      ? 'dist/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts',
  ],
});
`;

export const app = `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
export * from './conflic-exception';
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

export const conflicException = `import { BaseException } from './base-exception';

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

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      res.locals.body = validated.body || req.body;
      res.locals.query = validated.query || req.query;
      res.locals.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.length > 0 ? getNestedValue(req, err.path) : undefined,
        }));

        next(new ValidationException('DTO validation error', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};
`;

export const errorHandlerMiddleware = `import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { BaseException } from '../exceptions';

export const errorHandler = (error: Error | BaseException, req: Request, res: Response) => {
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

export const seed = `async function runSeeds() {
  // Run your seeds
}

runSeeds();
`;
