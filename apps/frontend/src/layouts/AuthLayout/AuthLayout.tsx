import type { FC } from 'react';
import { Outlet } from '@tanstack/react-router';
import Logo from '#assets/logo.svg?react';
import styles from './AuthLayout.module.scss';

export const AuthLayout: FC = () => {
    return (
        <div className={styles.page}>
            <BrandPanel />
            <main className={styles.formPanel}>
                <div className={styles.formInner}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const BrandPanel: FC = () => {
    return (
        <aside className={styles.brandPanel}>
            <div className={styles.brandGlow} aria-hidden />
            <div className={styles.brandContent}>
                <Logo className={styles.logo} />
                <div className={styles.brandCopy}>
                    <h1 className={styles.brandHeadline}>
                        Booking forms, ready for your guests.
                    </h1>
                    <p className={styles.brandSubtitle}>
                        Design branded booking experiences your organization can
                        share in minutes.
                    </p>
                    <ul className={styles.featureList}>
                        <li>Branded forms that match your identity</li>
                        <li>Live bookings as they happen</li>
                        <li>Built around your organization</li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};
