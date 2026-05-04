import { describe, it, expect } from 'vitest';
import { buildPackageJson, prettierConfig, tsconfig, nodemonConfig, biomeJson } from '#lib';
import { withCliContext } from '../helpers/cli-context';
import { createCliContext } from '../fixtures/cli-context';

describe('PrettierConfig', () => {
  it('should have all correct properties', () => {
    expect(prettierConfig).toEqual({
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
    });
  });
});

describe('NodemonConfig', () => {
  it('should have all correct properties', () => {
    expect(nodemonConfig).toEqual({
      watch: ['src'],
      ext: 'ts,json',
      ignore: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'node_modules'],
      exec: 'ts-node -r tsconfig-paths/register src/server.ts',
      env: {
        NODE_ENV: 'development',
      },
      restartable: 'rs',
      delay: 1000,
    });
  });
});

describe('Tsconfig', () => {
  it('should have correct include and exclude', () => {
    expect(tsconfig.include).toEqual(['src/**/*', 'scripts/**/*', 'tests/**/*']);
    expect(tsconfig.exclude).toEqual(['node_modules', 'dist']);
  });

  it('should have all correct compilerOptions', () => {
    expect(tsconfig.compilerOptions).toMatchObject({
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
    });
  });

  it('should have all correct paths', () => {
    expect(tsconfig.compilerOptions.paths).toMatchObject({
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
      '@logging': ['./src/logging/index'],
      '@logging/*': ['./src/logging/*'],
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
    });
  });
});

describe('PackageJson', async () => {
  let pkg;

  const ctx = createCliContext();
  await withCliContext(ctx, async () => {
    pkg = await buildPackageJson();
  });

  it('should generate correct metadata', () => {
    expect(pkg.name).toBe('test-app');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.description).toBe('Test project');
    expect(pkg.author).toBe('Test Author');
    expect(pkg.license).toBe('MIT');
  });

  it('should have correct main and scripts', () => {
    expect(pkg.main).toBe('dist/server.js');
    expect(pkg.scripts.cli).toBeDefined();
    expect(pkg.scripts.dev).toBeDefined();
    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.scripts.start).toBeDefined();
    expect(pkg.scripts.test).toBeDefined();
    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.format).toBeDefined();
    expect(pkg.scripts.validate).toBeDefined();
  });

  it('should have correct engines', () => {
    expect(pkg.engines).toEqual({
      node: '>=22.0.0',
      npm: '>=9.0.0',
    });
  });

  it('should have all core dependencies', () => {
    const deps = Object.keys(pkg.dependencies);
    expect(deps).toContain('express');
    expect(deps).toContain('typeorm');
    expect(deps).toContain('pg');
    expect(deps).toContain('zod');
    expect(deps).toContain('winston');
    expect(deps).toContain('dotenv');
    expect(deps).toContain('jsonwebtoken');
    expect(deps).toContain('helmet');
    expect(deps).toContain('cors');
  });

  it('should have all core devDependencies', () => {
    const devDeps = Object.keys(pkg.devDependencies);
    expect(devDeps).toContain('typescript');
    expect(devDeps).toContain('jest');
    expect(devDeps).toContain('ts-jest');
    expect(devDeps).toContain('eslint');
    expect(devDeps).toContain('prettier');
    expect(devDeps).toContain('supertest');
  });

  it('should not include git hooks when addGitHooks is false', () => {
    expect(pkg.scripts.prepare).toBeUndefined();
    expect(pkg.devDependencies.husky).toBeUndefined();
    expect(pkg.devDependencies['@commitlint/cli']).toBeUndefined();
    expect(pkg.devDependencies['lint-staged']).toBeUndefined();
  });

  it('should include git hooks when addGitHooks is true', async () => {
    let newPkg;
    const newCtx = createCliContext({ flags: { addGitHooks: true } });
    await withCliContext(newCtx, async () => {
      newPkg = await buildPackageJson();
    });

    expect(newPkg.scripts.prepare).toBe('husky');
    expect(newPkg.devDependencies.husky).toBeDefined();
    expect(newPkg.devDependencies['@commitlint/cli']).toBeDefined();
    expect(newPkg.devDependencies['lint-staged']).toBeDefined();
    expect(newPkg.devDependencies.commitlint).toBeDefined();
  });

  it('should include eslint dependencies ', async () => {
    let newPkg;
    const newCtx = createCliContext({ flags: { linter: 'eslint' } });
    await withCliContext(newCtx, async () => {
      newPkg = await buildPackageJson();
    });

    expect(newPkg.devDependencies.eslint).toBeDefined();
    expect(newPkg.devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined();
    expect(newPkg.devDependencies['@typescript-eslint/parser']).toBeDefined();
    expect(newPkg.devDependencies['eslint-config-prettier']).toBeDefined();
    expect(newPkg.devDependencies['typescript-eslint']).toBeDefined();
    expect(newPkg.devDependencies['@biomejs/biome']).toBeUndefined();
  });

  it('should include biome dependencies ', async () => {
    let newPkg;
    const newCtx = createCliContext({ flags: { linter: 'biome' } });
    await withCliContext(newCtx, async () => {
      newPkg = await buildPackageJson();
    });

    expect(newPkg.devDependencies['@biomejs/biome']).toBeDefined();
    expect(newPkg.devDependencies['@typescript-eslint/eslint-plugin']).toBeUndefined();
    expect(newPkg.devDependencies['@typescript-eslint/parser']).toBeUndefined();
    expect(newPkg.devDependencies['eslint-config-prettier']).toBeUndefined();
    expect(newPkg.devDependencies['typescript-eslint']).toBeUndefined();
  });
});

describe('BiomeConfig', () => {
  it('should have all correct properties', () => {
    expect(biomeJson).toEqual({
      $schema: 'https://biomejs.dev/schemas/2.4.13/schema.json',
      vcs: {
        enabled: false,
      },
      files: {
        includes: [
          'src/**',
          'scripts/**',
          'tests/**',
          '**/*.{js,cjs,mjs,json,md,yml,yaml}',
          '!node_modules',
          '!dist',
          '!coverage',
        ],
      },
      formatter: {
        enabled: true,
        indentStyle: 'space',
        indentWidth: 2,
        lineWidth: 100,
        lineEnding: 'lf',
      },
      javascript: {
        formatter: {
          semicolons: 'always',
          trailingCommas: 'es5',
          quoteStyle: 'single',
          arrowParentheses: 'always',
          bracketSpacing: true,
          quoteProperties: 'asNeeded',
        },
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
          suspicious: {
            noExplicitAny: 'warn',
            noDoubleEquals: 'error',
            noConsole: {
              level: 'warn',
              options: { allow: ['warn', 'error'] },
            },
            noDebugger: 'error',
            noImportAssign: 'error',
          },
          style: {
            useConst: 'error',
            noSubstr: 'error',
            useAtIndex: 'error',
            useNodejsImportProtocol: 'error',
          },
          correctness: {
            noUnusedVariables: 'error',
            noUnusedImports: 'error',
          },
          complexity: {
            noUselessSwitchCase: 'error',
            noForEach: 'error',
            noUselessUndefined: 'error',
          },
        },
      },
      overrides: [
        {
          includes: ['src/database/migrations/**/*.ts', 'src/database/seeds/**/*.ts'],
          linter: {
            rules: {
              suspicious: {
                noExplicitAny: 'off',
                noConsole: 'off',
              },
            },
          },
        },
      ],
      assist: {
        actions: {
          source: {
            organizeImports: 'off',
          },
        },
      },
    });
  });
});
