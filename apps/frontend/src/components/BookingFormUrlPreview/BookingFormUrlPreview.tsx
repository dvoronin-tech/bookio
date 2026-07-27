import type { FC } from 'react';
import { BOOKING_FORM_URL } from '#utils/constants';
import styles from './BookingFormUrlPreview.module.scss';

type BookingFormUrlPreviewProps = {
    organizationSlug?: string;
    formSlug?: string;
};

export const BookingFormUrlPreview: FC<BookingFormUrlPreviewProps> = ({
    organizationSlug = 'your-org',
    formSlug = 'your-form',
}) => {
    return (
        <div className={styles.urlPreview}>
            <span className={styles.urlPreviewLabel}>Public form URL</span>
            <span className={styles.urlPreviewValue}>
                {BOOKING_FORM_URL}/{organizationSlug}/
                <span className={styles.urlPreviewSlug}>{formSlug}</span>
            </span>
        </div>
    );
};
