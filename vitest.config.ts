import tsconfigPaths from 'vite-tsconfig-paths';
import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: 'html',
      exclude: [
        ...configDefaults.exclude,
        './packages/tailwind/**',
        './packages/domain/**',
        './packages/db/**',
        './packages/ui/**',
        '**/index.ts/**',
        './apps/api/**',
        './apps/web/**',
        '**/.vercel/**'
      ]
    }
  }
});
