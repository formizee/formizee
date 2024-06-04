const {resolve} = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/node',
    'eslint-config-turbo'
  ].map(require.resolve),
  parserOptions: {
    project
  },
  settings: {
    'import/resolver': {
      typescript: {
        project
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    '@typescript-eslint/prefer-promise-reject-errors': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'import/no-default-export': 'off'
  }
};
