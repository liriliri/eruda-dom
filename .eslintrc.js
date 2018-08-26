module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true
  },
  extends: 'standard',
  rules: {
    quotes: ['error', 'single'],
    'space-before-function-paren': 'off'
  },
  parserOptions: {
    sourceType: 'module'
  }
}
