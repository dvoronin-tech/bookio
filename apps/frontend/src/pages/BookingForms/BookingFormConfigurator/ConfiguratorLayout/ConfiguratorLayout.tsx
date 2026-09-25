import { memo, type ReactNode, useEffect } from 'react';
import { clsx } from 'clsx';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabsSection } from './ConfiguratorTabsSection.tsx';
import { ConfiguratorHeader } from './ConfiguratorHeader.tsx';
import { ConfiguratorFooter } from './ConfiguratorFooter.tsx';
import { useShallow } from 'zustand/shallow';

export const ConfiguratorLayout = memo(function ConfiguratorLayout({
    children,
}: {
    children?: ReactNode;
}) {
    const { reset, isCollapsed } = useBookingFormConfiguratorStore(
        useShallow(({ reset, isCollapsed }) => ({ reset, isCollapsed })),
    );

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return (
        <div
            className={clsx(styles.collapseSlot, {
                [styles.collapsed]: isCollapsed,
            })}
        >
            <div className={styles.configuratorContainer}>
                <ConfiguratorTabsSection />
                <ConfiguratorHeader />
                <div className={styles.content}>{children}</div>
                <ConfiguratorFooter />
            </div>
        </div>
    );
});
