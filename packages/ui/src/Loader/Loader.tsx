import Spinner from '../Spinner/Spinner.js';
import styles from './Loader.module.scss';

export type LoaderProps = {
    size?: number;
};

function Loader({ size }: LoaderProps) {
    return (
        <div className={styles.loader}>
            <Spinner size={size} />
        </div>
    );
}

export default Loader;
