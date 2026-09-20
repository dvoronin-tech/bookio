import { Mark } from './Mark.js';
import styles from './Spinner.module.scss';

export type SpinnerProps = {
    size?: number;
};

function Spinner({ size }: SpinnerProps) {
    return (
        <div className={styles.spinner}>
            <Mark size={size} />
        </div>
    );
}

export default Spinner;
