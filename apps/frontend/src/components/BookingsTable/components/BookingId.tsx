import { type FC } from 'react';
import styles from './Components.module.scss';
import CopyIcon from '#assets/icons/copy.svg?react';
import { copyToClipboard } from '#utils/copyToClipboard.ts';
import { m } from '../../../paraglide/messages.js';

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
                    copyToClipboard(bookingId, m.table_copy_id_label());
                }}
                title={m.table_copy_id_title()}
            >
                <CopyIcon width={14} height={14} />
            </button>
        </div>
    );
};
