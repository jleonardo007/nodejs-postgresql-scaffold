import path from 'path';
import fs from 'fs';
import { useCliContext } from '#lib/context.js';
import { buildPackajeJson } from '#lib/package-json.js';

import {
  tsconfig,
  nodemonConfig,
  prettierConfig,
  jestConfig,
  eslintConfig,
  env,
  gitignore,
  lintstaged,
  commitlint,
  dockerfile,
  dockerCompose,
  dockerIgnore,
  huskyConfigCommitMsg,
  huskyConfigPreCommit,
} from '#lib/config-files.js';

export function createStructure(basePath, struct) {
  for (const [key, value] of Object.entries(struct)) {
    if (key === '_files') {
      value.forEach((item) => {
        fs.writeFileSync(path.join(basePath, item.file), item.template, 'utf8');
      });
    } else if (Array.isArray(value)) {
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      value.forEach((item) => {
        fs.writeFileSync(path.join(dirPath, item.file), item.template, 'utf8');
      });
    } else if (typeof value === 'object' && value !== null) {
      const dirPath = path.join(basePath, key);
      fs.mkdirSync(dirPath, { recursive: true });
      createStructure(dirPath, value);
    }
  }
}

export function createConfigFiles() {
  const { projectPath, flags } = useCliContext();
  const packageJson = buildPackajeJson();

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'nodemon.json'), JSON.stringify(nodemonConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, '.prettierrc'), JSON.stringify(prettierConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'jest.config.js'), jestConfig);
  fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), eslintConfig);
  fs.writeFileSync(path.join(projectPath, '.env.example'), env);
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  if (flags.addDocker) {
    fs.writeFileSync(path.join(projectPath, 'Dockerfile'), dockerfile);
    fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
    fs.writeFileSync(path.join(projectPath, '.dockerignore'), dockerIgnore);
  }

  if (flags.addGitHooks) {
    fs.writeFileSync(path.join(projectPath, 'commitlint.config.mjs'), commitlint);
    fs.writeFileSync(path.join(projectPath, 'lint-staged.config.mjs'), lintstaged);

    const huskyDir = path.join(projectPath, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    fs.writeFileSync(path.join(huskyDir, 'commit-msg'), huskyConfigCommitMsg, { mode: 0o755 });
    fs.writeFileSync(path.join(huskyDir, 'pre-commit'), huskyConfigPreCommit, { mode: 0o755 });
  }
}
