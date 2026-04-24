import { describe, it, expect } from 'vitest';
import { setPackageJson, prettierConfig, tsconfig, tsconfigdev, nodemonConfig } from '#lib';

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
    expect(tsconfig.include).toEqual(['src/**/*']);
    expect(tsconfig.exclude).toEqual([
      'node_modules',
      'dist',
      'tests',
      '**/*.spec.ts',
      '**/*.test.ts',
    ]);
  });

  it('should have all correct compilerOptions', () => {
    expect(tsconfig.compilerOptions).toMatchObject({
      target: 'ES2022',
      module: 'commonjs',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      removeComments: true,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node',
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
      baseUrl: '.',
    });
  });

  it('should have all correct paths', () => {
    expect(tsconfig.compilerOptions.paths).toMatchObject({
      '@config': ['src/config/index'],
      '@config/*': ['src/config/*'],
      '@controllers': ['src/controllers/index'],
      '@controllers/*': ['src/controllers/*'],
      '@entities': ['src/entities/index'],
      '@entities/*': ['src/entities/*'],
      '@exceptions': ['src/exceptions/index'],
      '@exceptions/*': ['src/exceptions/*'],
      '@middlewares': ['src/middlewares/index'],
      '@middlewares/*': ['src/middlewares/*'],
      '@routes': ['src/routes/index'],
      '@routes/*': ['src/routes/*'],
      '@services': ['src/services/index'],
      '@services/*': ['src/services/*'],
      '@utils': ['src/utils/index'],
      '@utils/*': ['src/utils/*'],
    });
  });
});

describe('TsconfigDev', () => {
  it('should extend tsconfig.json', () => {
    expect(tsconfigdev.extends).toBe('./tsconfig.json');
  });

  it('should include tests and scripts', () => {
    expect(tsconfigdev.include).toContain('tests/**/*');
    expect(tsconfigdev.include).toContain('scripts/**/*');
  });

  it('should have correct compilerOptions', () => {
    expect(tsconfigdev.compilerOptions).toEqual({
      rootDir: '.',
      noEmit: true,
      incremental: false,
    });
  });
});

describe('PackageJson', () => {
  const metadata = {
    name: 'test-project',
    version: '1.0.0',
    description: 'Test project',
    author: 'Test Author',
    license: 'MIT',
  };

  it('should generate correct metadata', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
    expect(pkg.name).toBe('test-project');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.description).toBe('Test project');
    expect(pkg.author).toBe('Test Author');
    expect(pkg.license).toBe('MIT');
  });

  it('should have correct main and scripts', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
    expect(pkg.main).toBe('dist/server.js');
    expect(pkg.scripts.dev).toBeDefined();
    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.scripts.start).toBeDefined();
    expect(pkg.scripts.test).toBeDefined();
    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.format).toBeDefined();
    expect(pkg.scripts.validate).toBeDefined();
  });

  it('should have correct engines', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
    expect(pkg.engines).toEqual({
      node: '>=20.0.0',
      npm: '>=9.0.0',
    });
  });

  it('should have all core dependencies', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
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
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
    const devDeps = Object.keys(pkg.devDependencies);
    expect(devDeps).toContain('typescript');
    expect(devDeps).toContain('jest');
    expect(devDeps).toContain('ts-jest');
    expect(devDeps).toContain('eslint');
    expect(devDeps).toContain('prettier');
    expect(devDeps).toContain('supertest');
  });

  it('should not include git hooks when addGitHooks is false', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: false });
    expect(pkg.scripts.prepare).toBeUndefined();
    expect(pkg.devDependencies.husky).toBeUndefined();
    expect(pkg.devDependencies['@commitlint/cli']).toBeUndefined();
    expect(pkg.devDependencies['lint-staged']).toBeUndefined();
  });

  it('should include git hooks when addGitHooks is true', () => {
    const pkg = setPackageJson({ ...metadata, addGitHooks: true });
    expect(pkg.scripts.prepare).toBe('husky');
    expect(pkg.devDependencies.husky).toBeDefined();
    expect(pkg.devDependencies['@commitlint/cli']).toBeDefined();
    expect(pkg.devDependencies['lint-staged']).toBeDefined();
    expect(pkg.devDependencies.commitlint).toBeDefined();
  });
});
