import type { FC } from 'react';
import { BOOKING_FORM_URL } from '#utils/constants';
import styles from './BookingFormUrlPreview.module.scss';
import { m } from '../../paraglide/messages.js';

type BookingFormUrlPreviewProps = {
    organizationSlug?: string;
    formSlug?: string;
};

export const BookingFormUrlPreview: FC<BookingFormUrlPreviewProps> = ({
    organizationSlug = m.url_org_fallback(),
    formSlug = m.url_form_fallback(),
}) => {
    return (
        <div className={styles.urlPreview}>
            <span className={styles.urlPreviewLabel}>{m.url_public()}</span>
            <span className={styles.urlPreviewValue}>
                {BOOKING_FORM_URL}/{organizationSlug}/
                <span className={styles.urlPreviewSlug}>{formSlug}</span>
            </span>
        </div>
    );
};
