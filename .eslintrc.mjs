export default {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^[_]*$', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'enum',
        format: ['PascalCase', 'UPPER_CASE'],
      },
    ],
    'import/export': 2,
    'import/named': 'off',
    'import/default': 'off',
    'import/namespace': 'off',
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: ['external', 'builtin'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              Function: false,
            },
            extendDefaults: true,
          },
        ],
      },
    },
  ],
};
