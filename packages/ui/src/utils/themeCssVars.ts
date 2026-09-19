import type { CSSProperties } from 'react';

const THEME_CSS_VARS = [
    '--font-family',
    '--color-primary',
    '--color-text-accent-button',
    '--color-bg-main',
    '--color-bg-ui',
    '--color-text-main',
    '--color-text-secondary',
    '--color-border',
    '--color-system-red',
    '--color-system-green',
    '--color-system-blue',
] as const;

export function getThemeCssVars(from: Element | null): CSSProperties {
    if (!from || typeof getComputedStyle === 'undefined') {
        return {};
    }

    const computed = getComputedStyle(from);
    const vars: Record<string, string> = {};

    for (const name of THEME_CSS_VARS) {
        const value = computed.getPropertyValue(name).trim();

        if (value) {
            vars[name] = value;
        }
    }

    return vars as CSSProperties;
}
