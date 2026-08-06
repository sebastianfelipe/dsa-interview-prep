import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['topics/**/problems/**/solution.test.ts'],
    globals: false,
    environment: 'node',
    testTimeout: 10_000,
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
});
