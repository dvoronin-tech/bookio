import { type FC, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useShallow } from 'zustand/shallow';
import { Button } from '@bookio/ui';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { createBookingFormRouteApi } from '#lib/routeApis';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import styles from './Step6Success.module.scss';

import DoneIcon from '#assets/icons/done.svg?react';
import { m } from '#i18n/messages';

export const Step6Success: FC = () => {
    const navigate = useNavigate();
    const { guided } = createBookingFormRouteApi.useSearch();
    const { organizationId, createdBookingFormId } = useCreateBookingFormStore(
        useShallow((s) => ({
            organizationId: s.data.organizationId,
            createdBookingFormId: s.createdBookingFormId,
        })),
    );

    const handleContinueToConfigurator = useCallback(() => {
        if (!organizationId || !createdBookingFormId) return;

        void navigate({
            to: '/$organizationId/booking-forms/$bookingFormId/configurator',
            params: { organizationId, bookingFormId: createdBookingFormId },
        });
    }, [navigate, organizationId, createdBookingFormId]);

    const handleFinish = useCallback(() => {
        if (!organizationId) return;

        void navigate({
            to: '/$organizationId/booking-forms',
            params: { organizationId },
        });
    }, [navigate, organizationId]);

    return (
        <FormWizardLayout
            stepNumber={6}
            title={m.step6_title()}
            description={
                guided ? m.step6_description_guided() : m.step6_description()
            }
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleContinueToConfigurator}
                        disabled={!createdBookingFormId}
                    >
                        {m.step6_continue()}
                    </Button>
                    {guided ? null : (
                        <Button
                            type="button"
                            variant="simple-clean"
                            onClick={handleFinish}
                        >
                            {m.finish()}
                        </Button>
                    )}
                </div>
            }
        >
            <div className={styles.content}>
                <DoneIcon className={styles.doneIcon} aria-hidden />
            </div>
        </FormWizardLayout>
    );
};
