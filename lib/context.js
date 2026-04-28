import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

/**
 * Run CLI inside a context
 */
export function runCliContext(ctx, fn) {
  return storage.run(ctx, fn);
}

/**
 * Access current CLI context
 */
export function useCliContext() {
  const store = storage.getStore();

  if (!store) {
    throw new Error('CLI context not initialized');
  }

  return store;
}
