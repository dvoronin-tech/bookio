import type { KeyboardEvent, MouseEvent } from 'react';

export function createOpenOnKeyDownHandler(open: () => void) {
    return (event: KeyboardEvent<HTMLElement>) => {
        // Ignore keys coming from nested interactive elements (e.g. the clear button).
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open();
    };
}

export function createClearClickHandler(clear: () => void) {
    return (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        clear();
    };
}
