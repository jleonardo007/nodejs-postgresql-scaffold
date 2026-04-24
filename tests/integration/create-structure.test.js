import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createStructure, structure } from '#lib';

describe('CreateStructure', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'srvkit-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should create src directory', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'src'))).toBe(true);
  });

  it('should create tests directory', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'tests'))).toBe(true);
  });

  it('should create src/config directory with correct files', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'config', 'database.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'config', 'environment.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'config', 'logger.ts'))).toBe(true);
  });

  it('should create src/middlewares with correct files', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'middlewares', 'index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'middlewares', 'error-handler.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'middlewares', 'dto-validation.ts'))).toBe(true);
  });

  it('should create src/exceptions with correct files', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'exceptions', 'base-exception.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'exceptions', 'validation-exception.ts'))).toBe(
      true
    );
  });

  it('should create app.ts and server.ts in src root', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'app.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src', 'server.ts'))).toBe(true);
  });

  it('should create tests subdirectories', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'unit'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'integration'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'e2e'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'fixtures'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'helpers'))).toBe(true);
  });

  it('should create setup.ts in tests root', () => {
    createStructure(tmpDir, structure);
    expect(fs.existsSync(path.join(tmpDir, 'tests', 'setup.ts'))).toBe(true);
  });
});
