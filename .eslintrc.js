module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    indent: ['error', 2],
    '@typescript-eslint/indent': ['error', 2]
  }
};
