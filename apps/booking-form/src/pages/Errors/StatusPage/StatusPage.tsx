import type { FC } from 'react';
import styles from './StatusPage.module.scss';

type StatusPageProps = {
    code: string;
    title: string;
    description: string;
    tone?: 'default' | 'error';
};

export const StatusPage: FC<StatusPageProps> = ({ code, title, description, tone = 'default' }) => {
    return (
        <div className={styles.statusPage} data-tone={tone}>
            <div className={styles.content}>
                <div className={styles.hero}>
                    <span className={styles.accent} aria-hidden>
                        <span className={styles.accentLine} />
                        <span className={styles.accentOrb} />
                        <span className={styles.accentLine} />
                    </span>
                    <p className={styles.code}>{code}</p>
                    <div className={styles.text}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
