import { Button, Loader } from '@bookio/ui';
import { useBookingFormContext } from '../../BookingFormContext.js';
import styles from './SubmitButton.module.scss';

export function SubmitButton({ message }: { message?: string }) {
    const { formState, copy } = useBookingFormContext();
    const isLoading = formState === 'loading' || formState === 'success';

    return (
        <div className={styles.submit}>
            <Button
                type="submit"
                variant="primary-filled"
                className={styles.cta}
                disabled={isLoading}
                aria-busy={isLoading}
            >
                {isLoading ? (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                ) : (
                    <span className={styles.statusText}>{copy.submit}</span>
                )}
            </Button>
            {formState === 'error' && (
                <p className={styles.errorNotification}>
                    {message ?? copy.submitFailed}
                </p>
            )}
        </div>
    );
}
