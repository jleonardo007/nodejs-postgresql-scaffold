import path from 'path';
import fs from 'fs';

import {
  setPackageJson,
  tsconfig,
  nodemonConfig,
  prettierConfig,
  jestConfig,
  eslintConfig,
  env,
  gitignore,
  tsconfigdev,
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

export function createConfigFiles({ projectPath, metadata, addDocker, addGitHooks }) {
  const packageJson = setPackageJson({ ...metadata, addGitHooks });

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  fs.writeFileSync(
    path.join(projectPath, 'tsconfig.dev.json'),
    JSON.stringify(tsconfigdev, null, 2)
  );
  fs.writeFileSync(path.join(projectPath, 'nodemon.json'), JSON.stringify(nodemonConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, '.prettierrc'), JSON.stringify(prettierConfig, null, 2));
  fs.writeFileSync(path.join(projectPath, 'jest.config.js'), jestConfig);
  fs.writeFileSync(path.join(projectPath, 'eslint.config.js'), eslintConfig);
  fs.writeFileSync(path.join(projectPath, '.env.example'), env);
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  if (addDocker) {
    fs.writeFileSync(path.join(projectPath, 'Dockerfile'), dockerfile);
    fs.writeFileSync(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
    fs.writeFileSync(path.join(projectPath, '.dockerignore'), dockerIgnore);
  }

  if (addGitHooks) {
    fs.writeFileSync(path.join(projectPath, 'commitlint.config.js'), commitlint);
    fs.writeFileSync(path.join(projectPath, 'lint-staged.config.js'), lintstaged);

    const huskyDir = path.join(projectPath, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    fs.writeFileSync(path.join(huskyDir, 'commit-msg'), huskyConfigCommitMsg, { mode: 0o755 });
    fs.writeFileSync(path.join(huskyDir, 'pre-commit'), huskyConfigPreCommit, { mode: 0o755 });
  }
}
