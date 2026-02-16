import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const DEFAULTS = {
  version: '1.0.0',
  license: 'MIT',
};

export function checkNodeVersion() {
  const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);

  if (nodeVersion < 20) {
    throw new Error(`Node.js 20 or higher is required. Current version: ${process.version}`);
  }
}

export function checkExistingProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${projectPath}" already exists.`);
  }
}
