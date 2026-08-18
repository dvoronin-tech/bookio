import type { ComponentType, FC } from 'react';
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import {
    isLeafField,
    type BookingFormField,
    type FieldControlProps,
    type LeafFieldType,
} from '#/components/Fields/field.types';
import { FieldPlaceholder } from '#/components/Fields/FieldPlaceholder/FieldPlaceholder';
import { PhoneInputField } from '#/components/Fields/PhoneInputField/PhoneInputField';
import { TextInputField } from '#/components/Fields/TextInputField/TextInputField';

type FieldsMap = {
    [K in LeafFieldType]: ComponentType<FieldControlProps<K>>;
};

export const fieldsMap: FieldsMap = {
    text: TextInputField,
    number: FieldPlaceholder,
    file: FieldPlaceholder,
    image: FieldPlaceholder,
    url: FieldPlaceholder,
    phone: PhoneInputField,
    date: FieldPlaceholder,
    time: FieldPlaceholder,
    email: FieldPlaceholder,
    checkbox: FieldPlaceholder,
    select: FieldPlaceholder,
    radio: FieldPlaceholder,
    textarea: FieldPlaceholder,
};

function getFieldComponent<T extends LeafFieldType>(type: T): ComponentType<FieldControlProps<T>> {
    return fieldsMap[type];
}

type RenderFieldProps = {
    field: BookingFormField;
    register: UseFormRegister<FieldValues>;
};

export const RenderField: FC<RenderFieldProps> = ({ field, register }) => {
    if (!isLeafField(field)) {
        return null;
    }

    const Field = getFieldComponent(field.type);
    return <Field field={field} register={register} />;
};
