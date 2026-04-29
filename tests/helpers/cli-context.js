import { runCliContext } from '#lib';

export function withCliContext(ctx, fn) {
  runCliContext(ctx, fn);
}
