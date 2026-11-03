import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'off'
    }
  }
];
