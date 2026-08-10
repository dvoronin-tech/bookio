import { type RefObject, useCallback, useEffect, useState } from 'react';

interface UseScrollTabsProps {
    containerRef: RefObject<HTMLDivElement | null>;
    trackRef: RefObject<HTMLDivElement | null>;
}

const SCROLL_AMOUNT = 200;

export const useScrollTabs = (props: UseScrollTabsProps) => {
    const { containerRef, trackRef } = props;

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft < track.scrollWidth - container.clientWidth);
    }, [containerRef, trackRef]);

    const onScrollRight = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        container.scrollTo({
            left: container.scrollLeft + SCROLL_AMOUNT,
            behavior: 'smooth',
        });
    }, [containerRef]);

    const onScrollLeft = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        container.scrollTo({
            left: container.scrollLeft - SCROLL_AMOUNT,
            behavior: 'smooth',
        });
    }, [containerRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const abort = new AbortController();
        const { signal } = abort;

        updateScrollState();
        container.addEventListener('scroll', updateScrollState, { signal });

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(container);
        if (trackRef.current) {
            resizeObserver.observe(trackRef.current);
        }

        return () => {
            abort.abort();
            resizeObserver.disconnect();
        };
    }, [containerRef, trackRef, updateScrollState]);

    return {
        onScrollLeft,
        onScrollRight,
        canScrollLeft,
        canScrollRight,
    };
};
