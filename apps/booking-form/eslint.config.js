//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
    ...tanstackConfig,
    {
        rules: {
            'import/consistent-type-specifier-style': 'off',
            'import/no-cycle': 'off',
            'import/order': 'off',
            'sort-imports': 'off',
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/require-await': 'off',
            'no-shadow': 'off',
            'pnpm/json-enforce-catalog': 'off',
        },
    },
    {
        ignores: ['eslint.config.js', 'prettier.config.js'],
    },
];
