import type { FC } from 'react';
import styles from './Loader.module.scss';
import { Loader } from '../index.js';

const PageLoader: FC = () => {
    return (
        <div className={styles.pageLoader}>
            <Loader />
        </div>
    );
};
export default PageLoader;
