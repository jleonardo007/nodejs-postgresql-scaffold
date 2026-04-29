import os from 'os';
import path from 'path';
import fs from 'fs';

const SYSTEM_DIRS = ['/', '/usr', '/etc', '/bin', '/var', '/tmp', '/sys', '/dev', '/boot'];
const MAX_DEPTH = 5;

export const DEFAULTS = {
  version: '1.0.0',
  license: 'MIT',
};

export function checkNodeVersion() {
  const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);

  if (nodeVersion < 22) {
    throw new Error(`Node.js 22 or higher is required. Current version: ${process.version}`);
  }
}

export function checkExistingProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${projectPath}" already exists.`);
  }
}

export function checkProjectPath(projectPath) {
  const resolvedPath = path.resolve(projectPath);

  // Check path traversal and system directories
  if (SYSTEM_DIRS.includes(resolvedPath)) {
    throw new Error(`Cannot create project in system directory "${resolvedPath}"`);
  }

  // Check depth from home
  const homePath = os.homedir();
  const relativePath = path.relative(homePath, resolvedPath);

  if (relativePath.startsWith('..')) {
    throw new Error(`Cannot create project outside of home directory`);
  }

  const depth = relativePath.split(path.sep).length;

  if (depth > MAX_DEPTH) {
    throw new Error(
      `Project path is too deep (${depth} levels). Maximum allowed is ${MAX_DEPTH} levels from home directory`
    );
  }
}

const PROJECT_NAME_REGEX = /^[a-z0-9-_]+$/;

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-z]+(\.[\da-z]+)*)?(?:\+[\da-z]+(\.[\da-z]+)*)?$/i;

const VALID_LICENSES = ['MIT', 'ISC', 'Apache-2.0', 'GPL-3.0', 'UNLICENSED'];

const RESERVED_NAMES = ['con', 'prn', 'aux', 'nul', 'com1', 'lpt1'];

export function validateProjectName(value) {
  const name = value.trim().toLowerCase();

  if (!name) {
    return 'Project name is required';
  }

  if (!PROJECT_NAME_REGEX.test(name)) {
    return 'Only lowercase letters, numbers, "-" and "_" are allowed';
  }

  if (name.startsWith('.')) {
    return 'Project name cannot start with "."';
  }

  if (RESERVED_NAMES.includes(name)) {
    return 'Invalid project name (reserved system name)';
  }

  return true;
}

export function sanitizeProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
}

export function validateVersion(value) {
  const v = value.trim();

  if (!SEMVER_REGEX.test(v)) {
    return 'Version must follow semantic versioning (e.g. 1.0.0)';
  }

  return true;
}

export function sanitizeText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateDescription(value) {
  const v = sanitizeText(value);

  if (v.length > 200) {
    return 'Description must be under 200 characters';
  }

  return true;
}

export function validateAuthor(value) {
  const v = sanitizeText(value);

  if (v.length > 100) {
    return 'Author is too long';
  }

  return true;
}

export function validateLicense(value) {
  const v = value.trim();

  if (!VALID_LICENSES.includes(v)) {
    return 'Invalid license (e.g. MIT, ISC, Apache-2.0)';
  }

  return true;
}
