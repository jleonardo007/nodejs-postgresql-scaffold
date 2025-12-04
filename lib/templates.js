export const logger = `
import winston from 'winston';

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
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
`;

export const environment = `
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  swagger: {
    enabled: boolean;
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  apiPrefix: process.env.API_PREFIX || '/api',
  apiVersion: process.env.API_PREFIX || 'V1',
  swagger: {
    enabled: process.env.ENABLE_SWAGGER !== 'false',
  }
};
`;

export const swaggerConfig = `
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/environment';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'express-ts backend scaffold',
      version: '0.0.1',
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
        url: \`http://localhost:\${config.port}/api\`,
        description: 'Development server',
      },
      {
        url: 'https://api.production.com/api',
        description: 'Production server',
      },
    ],
    components: {},
    security: [],
  },
  apis: ['./src/routes/**/*.ts', './src/docs/schemas/**/*.ts'],
};

export default swaggerJsdoc(options);
`;

export const datasourceCLI = `
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
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

export const datasourceApp = `
import { DataSource } from 'typeorm';
import { config } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false,
  logging: config.env === 'development',
  
  entities: [
    config.env === 'production'
      ? 'dist/entities/**/*.entity.js'
      : 'src/entities/**/*.entity.ts'
  ],
  migrations: [
    config.env === 'production'
      ? 'dist/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts'
  ],
});
`;

export const app = `
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middlewares';
import { logger } from './config/logger';

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
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;
`;

export const server = `
import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';
import { config } from './config/environment';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    // Init Database
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    // Init Server
    app.listen(config.port, () => {
      logger.info(\`Server running on port \${config.port}\`);
      logger.info(\`Environment: \${config.env}\`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
`;

export const routes = `
import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

router.use('/v1', v1Routes);
export default router;
`;

export const v1Routes = `
import { Router } from 'express';

const router = Router();
export default router;
`;

export const _exception = `
export * from "./base-exception"
export * from "./validation-exception"
export * from "./unauthorized-exception"
export * from "./forbidden-exception"
export * from "./conflic-exception"
export * from "./notfound-exception"
export * from "./bad-request-exception"
`;

export const baseException = `
export class BaseException extends Error {
  public code: string;
  public httpCode: number;

  constructor(
    message: string,
    httpCode: number = 500,
    code: string = 'INTERNAL_ERROR',
  ) {
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

export const validationException = `
import { BaseException } from './base-exception';

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

export class ValidationException extends BaseException {
  public errors: ValidationError[];

  constructor(
    message: string = 'Validation error',
    errors: ValidationError[] = []
  ) {
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

export const unauthorizedException = `
import { BaseException } from './base-exception';

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Not authorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
`;

export const forbiddenException = `
import { BaseException } from './base-exception';

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}
`;

export const notfoundException = `
import { BaseException } from './base-exception';

export class NotFoundException extends BaseException {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}
`;

export const conflicException = `
import { BaseException } from './base-exception';

export class ConflictException extends BaseException {
  constructor(message: string = 'Resource is in a conflicting state') {
    super(message, 409, 'CONFLICT');
  }
}
`;

export const badRequestException = `
import { BaseException } from './base-exception';

export class BadRequestException extends BaseException {
  constructor(message: string = 'Invalid request') {
    super(message, 400, 'BAD_REQUEST');
  }
}
`;

export const _middlewares = `
export * from "./error-handler"
export * from "./dto-validation"
`;

export const validationMiddleware = `
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationException, ValidationError } from '../exceptions';

function getNestedValue(obj: any, path: (string | number)[]): any {
  return path.reduce((current, key) => {
    return current?.[key];
  }, obj);
}


export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.length > 0 ? getNestedValue(req, err.path) : undefined,
        }));

        next(new ValidationException('Error de validación', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};
`;

export const errorHandlerMiddleware = `
import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { BaseException, ValidationException } from '../exceptions';

export const errorHandler = (
  error: Error | BaseException,
  req: Request,
  res: Response,
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
    if (error instanceof ValidationException) {
      return res.status(error.httpCode).json(error.toJSON());
    }

    return res.status(error.httpCode).json(error.toJSON());
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
    },
  });
};
`;

export const seed = `
async function runSeeds() {
  // Run your seeds
}

runSeeds()
`;
