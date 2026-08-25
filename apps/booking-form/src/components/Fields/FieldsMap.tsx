import type { ComponentType, FC } from 'react';
import type { Control, FieldValues, UseFormRegister } from 'react-hook-form';
import {
    isLeafField,
    type ApiField,
    type FieldControlProps,
    type LeafFieldType,
} from '#/components/Fields/field.types';
import { CheckboxField } from '#/components/Fields/CheckboxField/CheckboxField';
import { DateInputField } from '#/components/Fields/DateInputField/DateInputField';
import { EmailInputField } from '#/components/Fields/EmailInputField/EmailInputField';
import { FieldPlaceholder } from '#/components/Fields/FieldPlaceholder/FieldPlaceholder';
import { NumberInputField } from '#/components/Fields/NumberInputField/NumberInputField';
import { PhoneInputField } from '#/components/Fields/PhoneInputField/PhoneInputField';
import { RadioField } from '#/components/Fields/RadioField/RadioField';
import { SelectField } from '#/components/Fields/SelectField/SelectField';
import { TextAreaField } from '#/components/Fields/TextAreaField/TextAreaField';
import { TextInputField } from '#/components/Fields/TextInputField/TextInputField';
import { UrlInputField } from '#/components/Fields/UrlInputField/UrlInputField';

type FieldsMap = {
    [K in LeafFieldType]: ComponentType<FieldControlProps<K>>;
};

export const fieldsMap: FieldsMap = {
    text: TextInputField,
    number: NumberInputField,
    file: FieldPlaceholder,
    image: FieldPlaceholder,
    url: UrlInputField,
    phone: PhoneInputField,
    date: DateInputField,
    time: FieldPlaceholder,
    email: EmailInputField,
    checkbox: CheckboxField,
    select: SelectField,
    radio: RadioField,
    textarea: TextAreaField,
};

function getFieldComponent<T extends LeafFieldType>(type: T): ComponentType<FieldControlProps<T>> {
    return fieldsMap[type];
}

type RenderFieldProps = {
    field: ApiField;
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
};

export const RenderField: FC<RenderFieldProps> = ({ field, register, control }) => {
    if (!isLeafField(field)) {
        return null;
    }

    const Field = getFieldComponent(field.type);
    return <Field field={field} register={register} control={control} />;
};
