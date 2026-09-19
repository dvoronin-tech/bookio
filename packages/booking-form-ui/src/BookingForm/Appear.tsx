import type { ReactNode } from 'react';
import styles from './Appear.module.scss';

const FIELD_APPEAR_START_MS = 300;
const FIELD_APPEAR_STEP_MS = 100;

export const getAppearDelayMs = (index: number) =>
    FIELD_APPEAR_START_MS + index * FIELD_APPEAR_STEP_MS;

export function Appear({
    delayMs,
    children,
}: {
    delayMs: number;
    children: ReactNode;
}) {
    return (
        <div
            className={styles.appear}
            style={{ animationDelay: `${delayMs}ms` }}
        >
            {children}
        </div>
    );
}
