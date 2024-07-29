import {defineConfig} from 'vitest/config';
import {config} from 'dotenv';
config({path: '.dev.vars'});

export default defineConfig({
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    testTimeout: 60_000,
    teardownTimeout: 60_000
  }
});
