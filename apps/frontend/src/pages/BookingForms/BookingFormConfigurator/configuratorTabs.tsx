import type { ComponentType, ReactNode } from 'react';

import SettingsIcon from '#assets/icons/settings.svg?react';
import FieldsIcon from '#assets/icons/fields.svg?react';
import StylesIcon from '#assets/icons/styles.svg?react';
import MetaIcon from '#assets/icons/meta.svg?react';

import { SettingsTab } from './ConfiguratorTabs/SettingsTab/SettingsTab.tsx';
import { FieldsTab } from './ConfiguratorTabs/FieldsTab/FieldsTab.tsx';
import { StylesTab } from './ConfiguratorTabs/StylesTab/StylesTab.tsx';
import { MetaTab } from './ConfiguratorTabs/MetaTab/MetaTab.tsx';

export const CONFIGURATOR_TAB_VALUES = [
    'settings',
    'fields',
    'styles',
    'meta',
] as const;

export type ConfiguratorTabValue = (typeof CONFIGURATOR_TAB_VALUES)[number];

type ConfiguratorTabConfig = {
    value: ConfiguratorTabValue;
    content: string;
    icon: ReactNode;
    Panel?: ComponentType;
};

export const configuratorTabs: ConfiguratorTabConfig[] = [
    {
        value: 'settings',
        content: 'Basic settings',
        icon: <SettingsIcon />,
        Panel: SettingsTab,
    },
    {
        value: 'fields',
        content: 'Fields',
        icon: <FieldsIcon />,
        Panel: FieldsTab,
    },
    {
        value: 'styles',
        content: 'Styles',
        icon: <StylesIcon />,
        Panel: StylesTab,
    },
    {
        value: 'meta',
        content: 'Meta',
        icon: <MetaIcon />,
        Panel: MetaTab,
    },
];

export const DEFAULT_CONFIGURATOR_TAB: ConfiguratorTabValue = 'settings';

export const getConfiguratorTab = (value: ConfiguratorTabValue) =>
    configuratorTabs.find((tab) => tab.value === value);
