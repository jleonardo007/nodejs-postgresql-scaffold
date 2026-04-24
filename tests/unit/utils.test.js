import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DEFAULTS, checkNodeVersion, checkExistingProject, checkProjectPath } from '#lib';

describe('DEFAULTS', () => {
  it('should have correct default version', () => {
    expect(DEFAULTS.version).toBe('1.0.0');
  });

  it('should have correct default license', () => {
    expect(DEFAULTS.license).toBe('MIT');
  });
});

describe('checkNodeVersion', () => {
  it('should throw if Node version is below 22', () => {
    vi.stubGlobal('process', { version: 'v20.0.0' });
    expect(() => checkNodeVersion()).toThrow('Node.js 22 or higher is required');
  });

  it('should not throw if Node version is 22 or higher', () => {
    vi.stubGlobal('process', { version: 'v22.0.0' });
    expect(() => checkNodeVersion()).not.toThrow();
  });
});

describe('checkExistingProject', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw if directory already exists', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    expect(() => checkExistingProject('/some/path')).toThrow('already exists');
  });

  it('should not throw if directory does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(() => checkExistingProject('/some/path')).not.toThrow();
  });
});

describe('checkProjectPath', () => {
  const homePath = os.homedir();

  it('should throw if path is a system directory', () => {
    expect(() => checkProjectPath('/')).toThrow('Cannot create project in system directory');
    expect(() => checkProjectPath('/usr')).toThrow('Cannot create project in system directory');
    expect(() => checkProjectPath('/etc')).toThrow('Cannot create project in system directory');
  });

  it('should throw if path is outside home directory', () => {
    expect(() => checkProjectPath('/some/path/outside/home')).toThrow(
      'Cannot create project outside of home directory'
    );
  });

  it('should throw if path exceeds max depth of 5 levels', () => {
    const deepPath = path.join(homePath, 'a', 'b', 'c', 'd', 'e', 'f');
    expect(() => checkProjectPath(deepPath)).toThrow('Project path is too deep');
  });

  it('should not throw for a valid path within home directory', () => {
    const validPath = path.join(homePath, 'projects', 'my-api');
    expect(() => checkProjectPath(validPath)).not.toThrow();
  });

  it('should not throw for a path at exactly max depth', () => {
    const validPath = path.join(homePath, 'a', 'b', 'c', 'd', 'e');
    expect(() => checkProjectPath(validPath)).not.toThrow();
  });
});
