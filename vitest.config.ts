import tsconfigPaths from 'vite-tsconfig-paths';
import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 60_000,
    teardownTimeout: 60_000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: 'html',
      exclude: [
        ...configDefaults.exclude,
        './apps/api/src/lib/testing/**',
        './packages/tailwind/**',
        // Change this
        './packages/domain/**',
        './packages/db/**',
        './packages/ui/**',
        './tools/local/**',
        '**/index.ts/**',
        './apps/web/**',
        '**/coverage/**',
        '**/.vercel/**',
        '**/emails/**',
        '**/env.ts'
      ]
    }
  }
});
