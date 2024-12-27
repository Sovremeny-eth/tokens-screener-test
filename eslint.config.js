import eslint from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/**/*.{ts,tsx}'],
  plugins: {
    import: pluginImport,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  extends: [eslint.configs.recommended, ...tseslint.configs.strict, configPrettier],
  settings: {
    'import/resolver': {
      typescript: {
        project: true,
      },
    },
  },
  rules: {
    // TypeScript with `strict` mode enabled checks this on its own
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    'no-console': 'warn',
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'unknown', // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: 'asc',
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],
  },
});
