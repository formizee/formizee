import {defineConfig, type Options} from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/**/*.tsx', 'src/**/*.ts'],
  format: ['cjs', 'esm'],
  esbuildOptions() {
    options.banner = {
      js: '"use client"'
    };
  },
  dts: true,
  clean: true,
  minify: true,
  external: ['react'],
  ...options
}));
