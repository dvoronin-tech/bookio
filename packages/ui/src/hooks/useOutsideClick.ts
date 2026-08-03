import { useEffect, type RefObject } from 'react';

type ElementRef = RefObject<Element | null>;

const OUTSIDE_CLICK_IGNORE_SELECTOR = '[data-outside-click-ignore]';

const normalizeRefs = (ref: ElementRef | ElementRef[]): ElementRef[] =>
    Array.isArray(ref) ? ref : [ref];

const shouldIgnoreOutsideClick = (target: Node) =>
    target instanceof Element && Boolean(target.closest(OUTSIDE_CLICK_IGNORE_SELECTOR));

export const useOutsideClick = (ref: ElementRef | ElementRef[], callback: () => void) => {
    useEffect(() => {
        const refs = normalizeRefs(ref);

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (shouldIgnoreOutsideClick(target)) {
                return;
            }

            const isInside = refs.some((elementRef) => elementRef.current?.contains(target));

            if (!isInside) {
                callback();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [ref, callback]);
};
