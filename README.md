# Express-Typescript scaffold

CLI tool to generate a complete backend project structure optimized for Node.js, Express, TypeScript, TypeORM, and PostgreSQL applications.

## Installation

```bash
npm install -g express-ts-scaffold
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

## Generated Structure

```
project-name/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   └── index.ts
│   │   ├── seeds/
│   │   │   └── index.ts
│   │   └── index.ts
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
│   ├── validators/
│   │   └── index.ts
│   ├── routes/
│   │   ├── v1/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   ├── jobs/
│   │   └── index.ts
│   ├── queues/
│   │   ├── processors/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   └── index.ts
│   ├── decorators/
│   │   └── index.ts
│   ├── docs/
│   │   ├── schemas/
│   │   │   └── index.ts
│   │   └── index.ts
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
├── scripts/
│   └── index.ts
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
- **validators/** - Request validation schemas
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

- Node.js >= 20.0.0

## License

MIT
