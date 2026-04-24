import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    reporters: ['tree', 'github-actions'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['lib/**/*.js', 'bin/**/*.js'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
  resolve: {
    alias: [
      {
        find: /^#lib\/(.+)$/,
        replacement: path.resolve(__dirname, './lib/$1'),
      },
      {
        find: '#lib',
        replacement: path.resolve(__dirname, './lib/index.js'),
      },
    ],
  },
});
