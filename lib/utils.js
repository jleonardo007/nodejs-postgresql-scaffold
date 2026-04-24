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
