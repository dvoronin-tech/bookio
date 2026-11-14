import type { FC } from 'react';
import { Outlet } from '@tanstack/react-router';
import Logo from '#assets/logo.svg?react';
import { m } from '../../paraglide/messages.js';
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
            <div className={styles.brandGlow} aria-hidden />
        </div>
    );
};

const BrandPanel: FC = () => {
    return (
        <aside className={styles.brandPanel}>

            <div className={styles.brandContent}>
                <Logo className={styles.logo} />
                <div className={styles.brandCopy}>
                    <h1 className={styles.brandHeadline}>
                        {m.auth_headline()}
                    </h1>
                    <p className={styles.brandSubtitle}>
                        {m.auth_subtitle()}
                    </p>
                    <ul className={styles.featureList}>
                        <li>{m.auth_feature_branded()}</li>
                        <li>{m.auth_feature_live()}</li>
                        <li>{m.auth_feature_org()}</li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};
