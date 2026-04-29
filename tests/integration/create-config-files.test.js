import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createConfigFiles } from '#lib';
import { withCliContext } from '../helpers/cli-context';
import { createCliContext } from '../fixtures/cli-context';

const projectPath = path.join(os.tmpdir(), 'srvkit-test');

describe('CreateConfigFiles', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(projectPath);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('base files', () => {
    beforeEach(async () => {
      const ctx = createCliContext({ projectPath: tmpDir });
      await withCliContext(ctx, () => {
        createConfigFiles();
      });
    });

    it('should create package.json', () => {
      expect(fs.existsSync(path.join(tmpDir, 'package.json'))).toBe(true);
    });

    it('should create tsconfig.json', () => {
      expect(fs.existsSync(path.join(tmpDir, 'tsconfig.json'))).toBe(true);
    });

    it('should create nodemon.json', () => {
      expect(fs.existsSync(path.join(tmpDir, 'nodemon.json'))).toBe(true);
    });

    it('should create .prettierrc', () => {
      expect(fs.existsSync(path.join(tmpDir, '.prettierrc'))).toBe(true);
    });

    it('should create jest.config.js', () => {
      expect(fs.existsSync(path.join(tmpDir, 'jest.config.js'))).toBe(true);
    });

    it('should create eslint.config.mjs', () => {
      expect(fs.existsSync(path.join(tmpDir, 'eslint.config.mjs'))).toBe(true);
    });

    it('should create .env.example', () => {
      expect(fs.existsSync(path.join(tmpDir, '.env.example'))).toBe(true);
    });

    it('should create .gitignore', () => {
      expect(fs.existsSync(path.join(tmpDir, '.gitignore'))).toBe(true);
    });

    it('should create package.json with correct metadata', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
      expect(pkg.name).toBe('test-app');
      expect(pkg.version).toBe('1.0.0');
      expect(pkg.author).toBe('Test Author');
    });
  });

  describe('docker files', () => {
    describe('when addDocker is true', () => {
      beforeEach(async () => {
        const ctx = createCliContext({ projectPath: tmpDir, flags: { addDocker: true } });
        await withCliContext(ctx, () => {
          createConfigFiles();
        });
      });

      it('should create docker files', () => {
        expect(fs.existsSync(path.join(tmpDir, 'Dockerfile'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'docker-compose.yml'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, '.dockerignore'))).toBe(true);
      });
    });

    describe('when addDocker is false', () => {
      beforeEach(async () => {
        const ctx = createCliContext({ projectPath: tmpDir, flags: { addDocker: false } });
        await withCliContext(ctx, () => {
          createConfigFiles();
        });
      });

      it('should not create docker files', () => {
        expect(fs.existsSync(path.join(tmpDir, 'Dockerfile'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, 'docker-compose.yml'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, '.dockerignore'))).toBe(false);
      });
    });
  });

  describe('git hooks files', () => {
    describe('when addGitHooks is true', () => {
      beforeEach(async () => {
        const ctx = createCliContext({ projectPath: tmpDir, flags: { addGitHooks: true } });
        await withCliContext(ctx, () => {
          createConfigFiles();
        });
      });

      it('should create git hooks files', () => {
        expect(fs.existsSync(path.join(tmpDir, 'commitlint.config.mjs'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, 'lint-staged.config.mjs'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, '.husky', 'commit-msg'))).toBe(true);
        expect(fs.existsSync(path.join(tmpDir, '.husky', 'pre-commit'))).toBe(true);
      });
    });

    describe('when addGitHooks is false', () => {
      beforeEach(async () => {
        const ctx = createCliContext({ projectPath: tmpDir, flags: { addGithooks: false } });
        await withCliContext(ctx, () => {
          createConfigFiles();
        });
      });

      it('should not create git hooks files', () => {
        expect(fs.existsSync(path.join(tmpDir, 'commitlint.config.mjs'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, 'lint-staged.config.mjs'))).toBe(false);
        expect(fs.existsSync(path.join(tmpDir, '.husky'))).toBe(false);
      });
    });
  });
});
