import type { FC } from 'react';
import { Spinner } from '#components/Spinner/Spinner';
import styles from './Loader.module.scss';

type LoaderProps = {
    size?: number;
};

export const Loader: FC<LoaderProps> = ({ size }) => {
    return (
        <div className={styles.loader}>
            <Spinner size={size} />
        </div>
    );
};
