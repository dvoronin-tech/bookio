import type { FC } from 'react';
import { Button } from '@bookio/ui';
import { useNavigate } from '@tanstack/react-router';
import { m } from '#i18n/messages';
import styles from './NotFound.module.scss';

export const NotFound: FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.message}>{m.not_found_message()}</p>
            <Button variant="primary-filled" onClick={() => void navigate({ to: '/' })}>
                {m.go_home()}
            </Button>
        </div>
    );
};
