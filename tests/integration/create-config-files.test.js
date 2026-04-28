import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createConfigFiles } from '#lib';

describe('CreateConfigFiles', () => {
  let tmpDir;

  const metadata = {
    name: 'test-project',
    version: '1.0.0',
    description: 'Test project',
    author: 'Test Author',
    license: 'MIT',
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'srvkit-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('base files', () => {
    it('should create package.json', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'package.json'))).toBe(true);
    });

    it('should create tsconfig.json', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'tsconfig.json'))).toBe(true);
    });

    it('should create nodemon.json', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'nodemon.json'))).toBe(true);
    });

    it('should create .prettierrc', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, '.prettierrc'))).toBe(true);
    });

    it('should create jest.config.js', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'jest.config.js'))).toBe(true);
    });

    it('should create eslint.config.js', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'eslint.config.js'))).toBe(true);
    });

    it('should create .env.example', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, '.env.example'))).toBe(true);
    });

    it('should create .gitignore', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, '.gitignore'))).toBe(true);
    });

    it('should create package.json with correct metadata', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
      expect(pkg.name).toBe('test-project');
      expect(pkg.version).toBe('1.0.0');
      expect(pkg.author).toBe('Test Author');
    });
  });

  describe('docker files', () => {
    it('should create docker files when addDocker is true', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: true, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'Dockerfile'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'docker-compose.yml'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.dockerignore'))).toBe(true);
    });

    it('should not create docker files when addDocker is false', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'Dockerfile'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'docker-compose.yml'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, '.dockerignore'))).toBe(false);
    });
  });

  describe('git hooks files', () => {
    it('should create git hooks files when addGitHooks is true', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: true });
      expect(fs.existsSync(path.join(tmpDir, 'commitlint.config.js'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'lint-staged.config.js'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.husky', 'commit-msg'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.husky', 'pre-commit'))).toBe(true);
    });

    it('should not create git hooks files when addGitHooks is false', () => {
      createConfigFiles({ projectPath: tmpDir, metadata, addDocker: false, addGitHooks: false });
      expect(fs.existsSync(path.join(tmpDir, 'commitlint.config.js'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'lint-staged.config.js'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, '.husky'))).toBe(false);
    });
  });
});
