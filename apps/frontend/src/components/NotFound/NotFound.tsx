import type { FC } from 'react';
import { Button } from '@bookio/ui';
import { useNavigate } from '@tanstack/react-router';
import styles from './NotFound.module.scss';

export const NotFound: FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.message}>The page you are looking for does not exist.</p>
            <Button variant="primary-filled" onClick={() => void navigate({ to: '/' })}>
                Go home
            </Button>
        </div>
    );
};
