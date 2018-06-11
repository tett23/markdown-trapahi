module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  extends: ['prettier'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
    'no-underscore-dangle': 'error',
    'no-unused-vars': ['error', { varsIgnorePattern: '_+', argsIgnorePattern: '_+' }],
    'no-await-in-loop': 'error',
    'no-cond-assign': 'off',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],
    'no-continue': 'off',
    'generator-star-spacing': 'error',
    'no-console': 'error',
    'no-use-before-define': 'off',
    'no-multi-assign': 'off',
    'flowtype-errors/show-errors': 'error',
    'flowtype/define-flow-type': 'error',
    'flowtype/use-flow-type': 'error',
    'flowtype/no-weak-types': [
      'error',
      {
        any: true,
        Object: false,
        Function: true,
      },
    ],
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': 'error',
    'promise/param-names': 'error',
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'compat/compat': 'error',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
  },
  plugins: ['flowtype', 'flowtype-errors', 'import', 'promise', 'compat', 'prettier'],
};
