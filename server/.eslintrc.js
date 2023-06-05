module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['../.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {},
};
