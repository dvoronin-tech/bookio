import { useCallback, type KeyboardEvent, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
    'input:not([disabled]):not([type="hidden"]):not([readonly]), textarea:not([disabled]):not([readonly])';

export function useEnterFieldNavigation(
    containerRef: RefObject<HTMLElement | null>,
    onComplete: (() => void) | undefined,
) {
    return useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (!onComplete) return;
            if (event.key !== 'Enter') return;
            if (event.nativeEvent.isComposing) return;
            if (event.target instanceof HTMLTextAreaElement) return;

            const container = containerRef.current;
            if (!container) return;

            const target = event.target;
            if (!(target instanceof HTMLElement) || !container.contains(target)) return;

            const fields = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
            );
            const currentIndex = fields.indexOf(target);
            if (currentIndex === -1) return;

            event.preventDefault();

            const next = fields[currentIndex + 1];
            if (next) {
                next.focus();
                return;
            }

            onComplete();
        },
        [containerRef, onComplete],
    );
}
