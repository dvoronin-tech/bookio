import type { FC, ReactNode, RefObject } from 'react';
import { memo } from 'react';
import Tabs from '#components/Tabs/Tabs';

import type { ConfiguratorTabValue } from '../configuratorTabs';

export type ConfiguratorTab = {
    value: ConfiguratorTabValue;
    content: string;
    icon: ReactNode;
};

export const ConfiguratorTabs: FC<{
    tabs: ConfiguratorTab[];
    activeTab: string;
    onActiveTabChange: (tab: ConfiguratorTabValue) => void;
    ref?: RefObject<HTMLDivElement | null>;
}> = memo(({ tabs, activeTab, onActiveTabChange, ref }) => {
    return (
        <Tabs value={activeTab} onValueChange={onActiveTabChange as (value: string) => void} ref={ref}>
            {tabs.map((tab) => (
                <Tabs.Item key={tab.value} value={tab.value}>
                    <Tabs.Icon>{tab.icon}</Tabs.Icon>
                    <Tabs.Content>{tab.content}</Tabs.Content>
                </Tabs.Item>
            ))}
        </Tabs>
    );
});
