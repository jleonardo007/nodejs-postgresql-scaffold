import { useCliContext } from '#lib/context.js';
import {
  datasourceApp,
  datasourceCLI,
  environment,
  logger,
  routes,
  v1Routes,
  swaggerConfig,
  app,
  server,
  baseException,
  validationException,
  _exception,
  validationMiddleware,
  _middlewares,
  unauthorizedException,
  forbiddenException,
  notfoundException,
  conflictException,
  badRequestException,
  expressTypes,
  utils,
  databaseUtils,
  testSetup,
  seedScript,
  runSeeds,
  cli,
  exec,
  dockerizedExcec,
  databaseCliCmd,
  migrationCliCmd,
  seedCliCmd,
  cronJobs,
  logging,
  typeormLogger,
  asyncContext,
  getRequestId,
  errorHandler,
  loggerWrapper,
  contextMiddleware,
  loggingMiddleware,
} from './templates.js';

export function buildStructure() {
  const { flags } = useCliContext();

  return {
    scripts: {
      cli: {
        _files: [{ file: 'index.ts', template: cli }],
        utils: [{ file: 'excec.ts', template: flags.addDocker ? dockerizedExcec : exec }],
        commands: [
          { file: 'db.ts', template: databaseCliCmd },
          { file: 'migration.ts', template: migrationCliCmd },
          { file: 'seed.ts', template: seedCliCmd },
        ],
      },
    },
    src: {
      config: [
        { file: 'database.ts', template: datasourceApp },
        { file: 'environment.ts', template: environment },
        { file: 'logger.ts', template: logger },
      ],
      database: {
        migrations: [{ file: 'index.ts', template: '' }],
        seeds: [{ file: 'index.ts', template: runSeeds }],
        _files: [{ file: 'data-source.ts', template: datasourceCLI }],
      },
      entities: [{ file: 'index.ts', template: '' }],
      repositories: [{ file: 'index.ts', template: '' }],
      services: [{ file: 'index.ts', template: '' }],
      controllers: [{ file: 'index.ts', template: '' }],
      logging: {
        adapters: [{ file: 'typeorm.logger.ts', template: typeormLogger }],
        context: [
          { file: 'async-context.ts', template: asyncContext },
          { file: 'get-request-id.ts', template: getRequestId },
        ],
        errors: [{ file: 'error-handler.ts', template: errorHandler }],
        logger: [{ file: 'logger-wrapper.ts', template: loggerWrapper }],
        middleware: [
          { file: 'context.middleware.ts', template: contextMiddleware },
          { file: 'logging.middleware.ts', template: loggingMiddleware },
        ],
        _files: [{ file: 'index.ts', template: logging }],
      },
      middlewares: {
        _files: [
          { file: 'index.ts', template: _middlewares },
          { file: 'dto-validation.ts', template: validationMiddleware },
        ],
      },
      dtos: [{ file: 'index.ts', template: '' }],
      routes: {
        v1: [{ file: 'index.ts', template: v1Routes }],
        _files: [{ file: 'index.ts', template: routes }],
      },
      types: [
        { file: 'index.ts', template: '' },
        { file: 'express.d.ts', template: expressTypes },
      ],
      utils: [
        { file: 'index.ts', template: utils },
        { file: 'database.ts', template: databaseUtils },
      ],
      constants: [{ file: 'index.ts', template: '' }],
      jobs: [{ file: 'index.ts', template: cronJobs }],
      queues: [{ file: 'index.ts', template: '' }],
      exceptions: {
        _files: [
          { file: 'index.ts', template: _exception },
          { file: 'base-exception.ts', template: baseException },
          { file: 'validation-exception.ts', template: validationException },
          { file: 'unauthorized-exception.ts', template: unauthorizedException },
          { file: 'forbidden-exception.ts', template: forbiddenException },
          { file: 'notfound-exception.ts', template: notfoundException },
          { file: 'conflict-exception.ts', template: conflictException },
          { file: 'bad-request-exception.ts', template: badRequestException },
        ],
      },
      decorators: [{ file: 'index.ts', template: '' }],
      docs: {
        _files: [{ file: 'swagger.config.ts', template: swaggerConfig }],
      },
      scripts: {
        _files: [{ file: 'seeds.ts', template: seedScript }],
      },
      _files: [
        { file: 'app.ts', template: app },
        { file: 'server.ts', template: server },
      ],
    },
    tests: {
      unit: [{ file: 'index.ts', template: '' }],
      integration: [{ file: 'index.ts', template: '' }],
      e2e: [{ file: 'index.ts', template: '' }],
      fixtures: [{ file: 'index.ts', template: '' }],
      helpers: [{ file: 'index.ts', template: '' }],
      _files: [{ file: 'setup.ts', template: testSetup }],
    },
  };
}
