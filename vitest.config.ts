import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text-summary'],
      exclude: ['node_modules', 'dist', '*.config.*'],
      provider: 'v8',
    },
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.spec.{ts,tsx}'],
  },
});
