import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue';

export default tseslint.config(
  eslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/src/generated/**',
      'packages/**/scripts/**',
    ],
  },
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
