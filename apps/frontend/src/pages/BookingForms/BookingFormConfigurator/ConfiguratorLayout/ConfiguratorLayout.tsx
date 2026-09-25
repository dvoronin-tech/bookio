import { memo, type ReactNode, useEffect } from 'react';

import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabsSection } from './ConfiguratorTabsSection.tsx';
import { ConfiguratorHeader } from './ConfiguratorHeader.tsx';
import { ConfiguratorFooter } from './ConfiguratorFooter.tsx';

export const ConfiguratorLayout = memo(function ConfiguratorLayout({
    children,
}: {
    children?: ReactNode;
}) {
    const reset = useBookingFormConfiguratorStore((state) => state.reset);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    return (
        <div className={styles.configuratorContainer}>
            <ConfiguratorTabsSection />
            <ConfiguratorHeader />
            <div className={styles.content}>{children}</div>
            <ConfiguratorFooter />
        </div>
    );
});
