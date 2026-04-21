# Express-Typescript scaffold

CLI tool to generate a complete backend project structure optimized for Node.js, Express, TypeScript, TypeORM, and PostgreSQL applications.

## Installation

```bash
npm install -g nodejs-postgresql-scaffold
```

or in your local machine

```bash
npm install -g ~/nodejs-postgresql-scaffold
```

## Usage

```bash
create-backend
```

The CLI will prompt you for:

- Project name
- Version (default: 1.0.0)
- Description
- Author
- License (default: MIT)
- Add Docker (default: false)
- Add Githooks (default: false)

## Generated Structure

```
project-name/
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
│   │   └── datasource.ts
│   ├── entities/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   ├── services/
│   │   └── index.ts
│   ├── controllers/
│   │   └── index.ts
│   ├── middlewares/
│   │   └── index.ts
│   │   └── dto-validation.ts
│   │   └── error-handler.ts
│   ├── dtos/
│   │   └── index.ts
│   ├── routes/
│   │   └── v1/
│   │       └── index.ts
│   ├── types/
│   │   └── index.ts
│   │   └── express.d.ts
│   ├── utils/
│   │   └── index.ts
│   │   └── database.ts
│   ├── constants/
│   │   └── index.ts
│   ├── jobs/
│   │   └── index.ts
│   ├── queues/
│   │   └── index.ts
│   ├── exceptions/
│   │   └── index.ts
│   │   └── base-exception.ts
│   │   └── conflict-exception.ts
│   │   └── forbidden-exception.ts
│   │   └── notfound-exception.ts
│   │   └── unauthorized-exception.ts
│   │   └── validation-exception.ts
│   ├── decorators/
│   │   └── index.ts
│   ├── docs/
│   │   └── swagger.config.ts
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
├── .prettierrc
├── jest.config.js
└── eslintrc.config.js
```

## Technology Stack

This structure is optimized for:

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database

## Folder Structure Explained

- **config/** - Database, environment, logger configuration
- **database/** - Migrations, seeds, and data source setup
- **entities/** - TypeORM entity definitions
- **repositories/** - Custom database repositories
- **services/** - Business logic layer
- **controllers/** - Route handlers
- **middlewares/** - Express middlewares (auth, validation, error handling)
- **dtos/** - Request validation schemas
- **routes/** - API route definitions (versioned)
- **types/** - TypeScript type definitions
- **utils/** - Helper functions
- **constants/** - Application constants
- **jobs/** - Scheduled tasks (cron jobs)
- **queues/** - Background job processors
- **exceptions/** - Custom error classes
- **decorators/** - Custom TypeScript decorators
- **docs/** - API documentation (Swagger)

## Next Steps

After generation:

```bash
cd your-project-name
npm install
cp .env.example .env
npm run dev
```

## Requirements

- Node.js >= 22.0.0

## License

MIT
