import path from 'node:path';

export function createCliContext(overrides = {}) {
  const base = {
    metadata: {
      name: 'test-app',
      version: '1.0.0',
      description: 'Test project',
      author: 'Test Author',
      license: 'MIT',
    },
    projectPath: path.join(process.cwd(), 'test-app'),
    flags: {
      addDocker: false,
      addGitHooks: false,
      linter: 'eslint',
    },
  };

  return {
    ...base,
    ...overrides,
    metadata: {
      ...base.metadata,
      ...(overrides.metadata || {}),
    },
    flags: {
      ...base.flags,
      ...(overrides.flags || {}),
    },
  };
}
