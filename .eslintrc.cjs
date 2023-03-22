module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'no-multi-spaces': ['error']
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};