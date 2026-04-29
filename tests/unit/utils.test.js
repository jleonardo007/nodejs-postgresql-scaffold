import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  DEFAULTS,
  checkNodeVersion,
  checkExistingProject,
  checkProjectPath,
  validateProjectName,
  sanitizeProjectName,
  validateVersion,
  sanitizeText,
  validateDescription,
  validateAuthor,
  validateLicense,
} from '#lib';

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

describe('validateProjectName', () => {
  it('should return error if name is empty', () => {
    expect(validateProjectName('')).toBe('Project name is required');
    expect(validateProjectName('   ')).toBe('Project name is required');
  });

  it('should return error if name has invalid characters', () => {
    expect(validateProjectName('My Project')).toBe(
      'Only lowercase letters, numbers, "-" and "_" are allowed'
    );
    expect(validateProjectName('my@project')).toBe(
      'Only lowercase letters, numbers, "-" and "_" are allowed'
    );
  });

  it('should return error if name starts with "."', () => {
    expect(validateProjectName('.myproject')).toBe(
      'Only lowercase letters, numbers, "-" and "_" are allowed'
    );
  });

  it('should return error if name is a reserved system name', () => {
    expect(validateProjectName('con')).toBe('Invalid project name (reserved system name)');
    expect(validateProjectName('nul')).toBe('Invalid project name (reserved system name)');
  });

  it('should return true for a valid name', () => {
    expect(validateProjectName('my-project')).toBe(true);
    expect(validateProjectName('my_project_123')).toBe(true);
  });
});

describe('sanitizeProjectName', () => {
  it('should trim and lowercase the name', () => {
    expect(sanitizeProjectName('  My Project  ')).toBe('my-project');
  });

  it('should replace spaces with hyphens', () => {
    expect(sanitizeProjectName('my project name')).toBe('my-project-name');
  });

  it('should remove invalid characters', () => {
    expect(sanitizeProjectName('my@project!')).toBe('myproject');
  });
});

describe('validateVersion', () => {
  it('should return error if version is not semver', () => {
    expect(validateVersion('1.0')).toBe('Version must follow semantic versioning (e.g. 1.0.0)');
    expect(validateVersion('v1.0.0')).toBe('Version must follow semantic versioning (e.g. 1.0.0)');
    expect(validateVersion('abc')).toBe('Version must follow semantic versioning (e.g. 1.0.0)');
  });

  it('should return true for a valid semver', () => {
    expect(validateVersion('1.0.0')).toBe(true);
    expect(validateVersion('0.0.1')).toBe(true);
    expect(validateVersion('1.0.0-alpha.1')).toBe(true);
  });
});

describe('sanitizeText', () => {
  it('should trim and collapse multiple spaces', () => {
    expect(sanitizeText('  hello   world  ')).toBe('hello world');
  });
});

describe('validateDescription', () => {
  it('should return error if description exceeds 200 characters', () => {
    const longDescription = 'a'.repeat(201);
    expect(validateDescription(longDescription)).toBe('Description must be under 200 characters');
  });

  it('should return true for a valid description', () => {
    expect(validateDescription('A short description')).toBe(true);
  });

  it('should return true for an empty description', () => {
    expect(validateDescription('')).toBe(true);
  });
});

describe('validateAuthor', () => {
  it('should return error if author exceeds 100 characters', () => {
    const longAuthor = 'a'.repeat(101);
    expect(validateAuthor(longAuthor)).toBe('Author is too long');
  });

  it('should return true for a valid author', () => {
    expect(validateAuthor('Leonardo Bravo')).toBe(true);
  });
});

describe('validateLicense', () => {
  it('should return error for an invalid license', () => {
    expect(validateLicense('INVALID')).toBe('Invalid license (e.g. MIT, ISC, Apache-2.0)');
    expect(validateLicense('BSD')).toBe('Invalid license (e.g. MIT, ISC, Apache-2.0)');
  });

  it('should return true for valid licenses', () => {
    expect(validateLicense('MIT')).toBe(true);
    expect(validateLicense('ISC')).toBe(true);
    expect(validateLicense('Apache-2.0')).toBe(true);
    expect(validateLicense('GPL-3.0')).toBe(true);
    expect(validateLicense('UNLICENSED')).toBe(true);
  });
});
