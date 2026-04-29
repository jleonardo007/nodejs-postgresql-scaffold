import { describe, it, expect } from 'vitest';
import { buildStructure } from '#lib';
import { withCliContext } from '../helpers/cli-context';
import { createCliContext } from '../fixtures/cli-context';

describe('Structure', async () => {
  let structure;

  const ctx = createCliContext();
  await withCliContext(ctx, async () => {
    structure = await buildStructure();
  });

  describe('Directories', () => {
    it('should have src directory', () => {
      expect(structure.src).toBeDefined();
    });

    it('should have tests directory', () => {
      expect(structure.tests).toBeDefined();
    });

    it('should have scripts directory', () => {
      expect(structure.scripts).toBeDefined();
    });
  });

  describe('Src', () => {
    it('should have config directory with correct files', () => {
      const files = structure.src.config.map((f) => f.file);
      expect(files).toContain('database.ts');
      expect(files).toContain('environment.ts');
      expect(files).toContain('logger.ts');
    });

    it('should have middlewares directory with correct files', () => {
      const files = structure.src.middlewares._files.map((f) => f.file);
      expect(files).toContain('index.ts');
      expect(files).toContain('dto-validation.ts');
    });

    it('should have exceptions directory with correct files', () => {
      const files = structure.src.exceptions._files.map((f) => f.file);
      expect(files).toContain('index.ts');
      expect(files).toContain('base-exception.ts');
      expect(files).toContain('validation-exception.ts');
      expect(files).toContain('unauthorized-exception.ts');
      expect(files).toContain('forbidden-exception.ts');
      expect(files).toContain('notfound-exception.ts');
      expect(files).toContain('conflict-exception.ts');
      expect(files).toContain('bad-request-exception.ts');
    });

    it('should have routes directory with correct files', () => {
      const files = structure.src.routes._files.map((f) => f.file);
      expect(files).toContain('index.ts');
    });

    it('should have app.ts and server.ts in src root', () => {
      const files = structure.src._files.map((f) => f.file);
      expect(files).toContain('app.ts');
      expect(files).toContain('server.ts');
    });
  });

  describe('Tests', () => {
    it('should have unit, integration and e2e directories', () => {
      expect(structure.tests.unit).toBeDefined();
      expect(structure.tests.integration).toBeDefined();
      expect(structure.tests.e2e).toBeDefined();
    });

    it('should have fixtures and helpers directories', () => {
      expect(structure.tests.fixtures).toBeDefined();
      expect(structure.tests.helpers).toBeDefined();
    });

    it('should have setup.ts in tests root', () => {
      const files = structure.tests._files.map((f) => f.file);
      expect(files).toContain('setup.ts');
    });
  });

  describe('Structure shape', () => {
    it('should only have src and tests as top level directories', () => {
      const keys = Object.keys(structure);
      expect(keys).toEqual(['scripts', 'src', 'tests']);
    });

    it('should only have expected directories in src', () => {
      const keys = Object.keys(structure.src);
      expect(keys).toEqual([
        'config',
        'database',
        'entities',
        'repositories',
        'services',
        'controllers',
        'logging',
        'middlewares',
        'dtos',
        'routes',
        'types',
        'utils',
        'constants',
        'jobs',
        'queues',
        'exceptions',
        'decorators',
        'docs',
        'scripts',
        '_files',
      ]);
    });

    it('should only have expected directories in tests', () => {
      const keys = Object.keys(structure.tests);
      expect(keys).toEqual(['unit', 'integration', 'e2e', 'fixtures', 'helpers', '_files']);
    });
  });
});
