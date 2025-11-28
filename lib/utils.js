import path from 'path';
import readline from 'readline';
import fs from 'fs';
import { fileURLToPath } from 'url';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = (query) => new Promise((resolve) => rl.question(query, resolve));
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const DEFAULTS = {
  version: '1.0.0',
  license: 'MIT',
};

export function checkNodeVersion() {
  const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);

  if (nodeVersion < 20) {
    console.error(`❌ Error: This script requires Node.js version 20 or higher.`);
    console.error(`   Current version: ${process.version}`);
    console.error(`   Please upgrade Node.js and try again.`);
    process.exit(1);
  }
}

export async function checkExistingProject(projectPath) {
  const projectExists = fs.existsSync(projectPath);

  if (projectExists) {
    console.log(`Directory "${metadata.name}" already exists!`);
    rl.close();
    return;
  }
}
