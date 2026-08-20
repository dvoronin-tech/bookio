import type { FC } from 'react';
import { Radio } from '@bookio/ui';
import type { FieldControlProps } from '#/components/Fields/field.types';

export const RadioField: FC<FieldControlProps<'radio'>> = ({ field, register }) => {
    return (
        <Radio {...register(field.key)}>
            <Radio.Label>{field.name}</Radio.Label>
            {field.params.options.map((option) => (
                <Radio.Item key={option.value} value={option.value}>
                    {option.label}
                </Radio.Item>
            ))}
        </Radio>
    );
};
