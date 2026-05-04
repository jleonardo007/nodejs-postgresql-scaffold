# srvkit

CLI scaffold generator for Node.js backend projects with TypeScript, Express and PostgreSQL.

## Installation

```bash
npm install -g srvkit
```

Or from your local machine:

```bash
npm install -g ~/srvkit
```

## Usage

```bash
srvkit-run
```

The CLI will prompt you for:

- Project name
- Version (default: 1.0.0)
- Description
- Author
- License (default: MIT)
- Linter / Formatter (ESLint + Prettier / Biome)
- Test runner (Jest / Vitest)
- Package manager (npm / yarn / pnpm)
- Extras: Docker, Git Hooks

## Generated Structure

```
project-name/
├── scripts/
│   └── cli/
│       ├── commands/
│       │   ├── db.ts
│       │   ├── migration.ts
│       │   └── seed.ts
│       ├── utils/
│       │   └── excec.ts
│       └── index.ts
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── logger.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   └── index.ts
│   │   ├── seeds/
│   │   │   └── index.ts
│   │   └── data-source.ts
│   ├── entities/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   ├── services/
│   │   └── index.ts
│   ├── controllers/
│   │   └── index.ts
│   ├── logging/
│   │   ├── adapters/
│   │   │   └── typeorm.logger.ts
│   │   ├── context/
│   │   │   ├── async-context.ts
│   │   │   └── get-request-id.ts
│   │   ├── errors/
│   │   │   └── error-handler.ts
│   │   ├── middleware/
│   │   │   ├── context.middleware.ts
│   │   │   └── logging.middleware.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── index.ts
│   │   └── dto-validation.ts
│   ├── dtos/
│   │   └── index.ts
│   ├── routes/
│   │   ├── v1/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── express.d.ts
│   ├── utils/
│   │   ├── index.ts
│   │   └── database.ts
│   ├── constants/
│   │   └── index.ts
│   ├── jobs/
│   │   └── index.ts
│   ├── queues/
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── index.ts
│   │   ├── base-exception.ts
│   │   ├── bad-request-exception.ts
│   │   ├── conflict-exception.ts
│   │   ├── forbidden-exception.ts
│   │   ├── notfound-exception.ts
│   │   ├── unauthorized-exception.ts
│   │   └── validation-exception.ts
│   ├── docs/
│   │   └── swagger.config.ts
│   ├── scripts/
│   │   └── seeds.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   │   └── index.ts
│   ├── integration/
│   │   └── index.ts
│   ├── e2e/
│   │   └── index.ts
│   ├── fixtures/
│   │   └── index.ts
│   ├── helpers/
│   │   └── index.ts
│   └── setup.ts
├── logs/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
├── .prettierrc or biome.json
└── jest.config.cjs or vitest.config.ts
```

## Technology Stack

- **Node.js** — JavaScript runtime
- **Express** — Web framework
- **TypeScript** — Type-safe JavaScript
- **TypeORM** — Database ORM
- **PostgreSQL** — Relational database

## Folder Structure Explained

- **scripts/cli/** — Database, migration and seed CLI commands
- **config/** — Database, environment and logger configuration
- **database/** — Migrations, seeds and data source setup
- **entities/** — TypeORM entity definitions
- **repositories/** — Custom database repositories
- **services/** — Business logic layer
- **controllers/** — Route handlers
- **logging/** — Logger adapters, context, error handler and middleware
- **middlewares/** — Express middlewares (validation, error handling)
- **dtos/** — Request validation schemas
- **routes/** — API route definitions (versioned)
- **types/** — TypeScript type definitions
- **utils/** — Helper functions
- **constants/** — Application constants
- **jobs/** — Scheduled tasks (cron jobs)
- **queues/** — Background job processors
- **exceptions/** — Custom error classes
- **docs/** — API documentation (Swagger)

## Next Steps

After generation:

```bash
cd your-project-name
cp .env.example .env
# install dependencies — handled automatically by the CLI
# run migrations
<pm> cli migration run
# start the server
<pm> dev
```

## Requirements

- Node.js >= 22.0.0
- PostgreSQL

## License

MIT
