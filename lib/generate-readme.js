import { useCliContext } from '#lib/context.js';

export function generateReadme() {
  const { metadata, flags } = useCliContext();
  const { linter, testRunner, packageManager, addDocker, addGitHooks } = flags;

  const pmRun = packageManager === 'npm' ? 'npm run' : packageManager;
  const pmInstall =
    packageManager === 'npm' ? 'npm install' : packageManager === 'yarn' ? 'yarn' : 'pnpm install';

  const extras = [
    addDocker && '- Docker',
    addGitHooks && '- Git Hooks — Husky · commitlint · lint-staged',
  ]
    .filter(Boolean)
    .join('\n');

  return `# ${metadata.name}

${metadata.description}

## Tech Stack
- Node.js · TypeScript · Express
- PostgreSQL · TypeORM
- ${linter === 'eslint' ? 'ESLint + Prettier' : 'Biome'}
- ${testRunner === 'jest' ? 'Jest · ts-jest' : 'Vitest · @vitest/coverage-v8'}
${extras ? extras : ''}

## Requirements
- Node.js >= 22.0.0
- ${packageManager}
- PostgreSQL

## Getting Started

### Installation
\`\`\`bash
${pmInstall}
\`\`\`

### Environment Variables
\`\`\`bash
cp .env.example .env
\`\`\`

### Database
\`\`\`bash
# Run migrations
${pmRun} cli migration run

# Run seeds
${pmRun} cli seed
\`\`\`

### Running the app
\`\`\`bash
${
  addDocker
    ? `# Start with Docker
docker-compose up -d

# Stop
docker-compose down`
    : `# Development
${pmRun} dev

# Production
${pmRun} start:prod`
}
\`\`\`

## Scripts
| Script | Description |
|--------|-------------|
${
  addDocker
    ? `| \`docker-compose up -d\` | Start with Docker |
| \`docker-compose down\` | Stop Docker containers |`
    : `| \`${pmRun} dev\` | Start development server |
| \`${pmRun} start:prod\` | Start production server |`
}
| \`${pmRun} build\` | Build for production |
| \`${pmRun} test\` | Run tests |
| \`${pmRun} test:coverage\` | Run tests with coverage |
| \`${pmRun} lint\` | Lint code |
| \`${pmRun} format\` | Format code |
| \`${pmRun} validate\` | Lint + format check + type check |

## CLI
\`\`\`bash
# Database
${pmRun} cli db drop          # Drop schema
${pmRun} cli db sync          # Sync schema
${pmRun} cli db reset         # Drop + sync + seed

# Migrations
${pmRun} cli migration run              # Run pending migrations
${pmRun} cli migration revert           # Revert last migration
${pmRun} cli migration show             # Show migrations status
${pmRun} cli migration generate <name>  # Generate migration from entities
${pmRun} cli migration create <name>    # Create empty migration

# Seeds
${pmRun} cli seed             # Run seeders
\`\`\`

## Testing
\`\`\`bash
# Run all tests
${pmRun} test

# Run with coverage
${pmRun} test:coverage

# Unit tests
${pmRun} test:unit

# Integration tests
${pmRun} test:integration

# E2E tests
${pmRun} test:e2e
\`\`\`

## Project Structure
\`\`\`
${metadata.name}/
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
${linter === 'eslint' ? '├── .prettierrc\n├── eslint.config.mjs' : '├── biome.json'}
${testRunner === 'jest' ? '└── jest.config.cjs' : '└── vitest.config.ts'}
\`\`\`
`;
}
