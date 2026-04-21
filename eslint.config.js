import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  prettier,
  {
    files: ['bin/**/*.js', 'lib/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Code quality
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // Style
      eqeqeq: 'error',
      curly: 'error',
      'arrow-body-style': ['error', 'as-needed'],

      // Node.js / async
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'require-await': 'warn',

      // Console
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
