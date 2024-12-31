import {type Options, defineConfig} from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/**/*.tsx', 'src/**/*.ts'],
  format: ['cjs', 'esm'],
  esbuildOptions() {
    options.banner = {
      js: '"use client"'
    };
  },
  clean: true,
  minify: true,
  external: ['react'],
  ...options
}));
