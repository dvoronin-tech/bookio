import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { ChoiceChip } from '#components/ChoiceChip/ChoiceChip';
import { fieldTypeIcons } from '#components/ConfiguratorField/fieldTypeIcons';
import type { SyncBookingFormFieldItem } from '#utils/dataPreparers/bookingFormPreparers';
import styles from './FieldTypeSelector.module.scss';
import { fieldTypeLabel } from '#i18n/fieldTypeLabel';
import { m } from '../../paraglide/messages.js';

export const FieldTypeSelector: FC = () => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const type = useWatch({ control, name: 'type' });

    return (
        <div className={styles.fieldTypesWrapper}>
            <span className={styles.fieldTypesLabel}>{m.field_type()}</span>
            <div className={styles.fieldTypes}>
                {(Object.keys(fieldTypeIcons) as Array<SyncBookingFormFieldItem['type']>)
                    .filter((typeOption): typeOption is SyncBookingFormFieldItem['type'] => {
                        return Boolean(fieldTypeIcons[typeOption]);
                    })
                    .map((typeOption) => {
                        const { icon: Icon, color } = fieldTypeIcons[typeOption]!;

                        const handleSelectFieldType = () => {
                            setValue('type', typeOption);
                            setValue('params', {});
                        };

                        return (
                            <ChoiceChip
                                key={typeOption}
                                icon={<Icon color={color} />}
                                onClick={handleSelectFieldType}
                                active={typeOption === type}
                            >
                                {fieldTypeLabel(typeOption)}
                            </ChoiceChip>
                        );
                    },
                )}
            </div>
        </div>
    );
};
