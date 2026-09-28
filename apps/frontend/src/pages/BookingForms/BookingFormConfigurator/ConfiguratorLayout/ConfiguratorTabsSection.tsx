import { type FC, memo, useRef } from 'react';

import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import { useScrollTabs } from '#pages/BookingForms/BookingFormConfigurator/hooks/useScrollTabs.ts';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore.ts';
import { useShallow } from 'zustand/shallow';
import clsx from 'clsx';
import { configuratorTabs } from '../configuratorTabs.tsx';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabs } from './ConfiguratorTabs.tsx';

export const ConfiguratorTabsSection: FC = memo(() => {
    const { activeTab, setActiveTab } = useBookingFormConfiguratorStore(
        useShallow(({ activeTab, setActiveTab }) => ({
            activeTab,
            setActiveTab,
        })),
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const { onScrollLeft, onScrollRight, canScrollLeft, canScrollRight } =
        useScrollTabs({
            containerRef,
            trackRef,
        });

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                <button
                    type="button"
                    className={clsx(styles.scrollButtonLeft, {
                        [styles.disabled]: !canScrollLeft,
                    })}
                    onClick={onScrollLeft}
                    disabled={!canScrollLeft}
                    aria-label="Scroll tabs left"
                >
                    <ArrowIcon className={styles.scrollArrowLeft} />
                </button>
                <div className={styles.tabsScroll} ref={containerRef}>
                    <ConfiguratorTabs
                        tabs={configuratorTabs}
                        activeTab={activeTab}
                        onActiveTabChange={setActiveTab}
                        ref={trackRef}
                    />
                </div>
                <button
                    type="button"
                    className={clsx(styles.scrollButtonRight, {
                        [styles.disabled]: !canScrollRight,
                    })}
                    onClick={onScrollRight}
                    disabled={!canScrollRight}
                    aria-label="Scroll tabs right"
                >
                    <ArrowIcon className={styles.scrollArrowRight} />
                </button>
            </div>
        </div>
    );
});

