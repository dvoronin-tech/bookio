import { type FC } from 'react';
import styles from './Components.module.scss';
import CopyIcon from '#assets/icons/copy.svg?react';
import { copyToClipboard } from '#utils/copyToClipboard.ts';

interface BookingIdProps {
    bookingId: string;
}

export const BookingId: FC<BookingIdProps> = ({ bookingId }) => {
    return (
        <div className={styles.idCell} title={bookingId}>
            <span className={styles.idText}>{bookingId}</span>
            <button
                type="button"
                className={styles.copyBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(bookingId, 'Booking ID');
                }}
                title="Copy full ID"
            >
                <CopyIcon width={14} height={14} />
            </button>
        </div>
    );
};
