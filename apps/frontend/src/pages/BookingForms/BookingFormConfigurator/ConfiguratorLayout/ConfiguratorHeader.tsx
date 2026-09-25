import { type FC, memo } from 'react';

import PanelLeftCloseIcon from '#assets/icons/panel-left-close.svg?react';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { configuratorTabs } from '../configuratorTabs.tsx';
import styles from './ConfiguratorLayout.module.scss';
import { useShallow } from 'zustand/shallow';

export const ConfiguratorHeader: FC = memo(() => {
    const { activeTab, setIsCollapsed } = useBookingFormConfiguratorStore(
        useShallow(({ activeTab, setIsCollapsed }) => ({
            activeTab,
            setIsCollapsed,
        })),
    );
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>
                {
                    configuratorTabs.find((tab) => tab.value === activeTab)
                        ?.content
                }
            </h2>
            <button
                type="button"
                className={styles.collapseButton}
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse panel"
            >
                <PanelLeftCloseIcon />
            </button>
        </div>
    );
});
