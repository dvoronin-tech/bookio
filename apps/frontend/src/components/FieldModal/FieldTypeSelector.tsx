import type { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { ChoiceChip } from '#components/ChoiceChip/ChoiceChip';
import { fieldTypeIcons } from '#components/ConfiguratorField/fieldTypeIcons';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';
import styles from './FieldTypeSelector.module.scss';

export const FieldTypeSelector: FC = () => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const type = useWatch({ control, name: 'type' });

    return (
        <div className={styles.fieldTypesWrapper}>
            <span className={styles.fieldTypesLabel}>Field type*</span>
            <div className={styles.fieldTypes}>
                {(Object.keys(fieldTypeIcons) as Array<EntireBookingFormField['type']>)
                    .filter((typeOption): typeOption is EntireBookingFormField['type'] => {
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
                                {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                            </ChoiceChip>
                        );
                    },
                )}
            </div>
        </div>
    );
};
