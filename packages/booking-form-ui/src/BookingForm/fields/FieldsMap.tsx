import type { ComponentType, FC } from 'react';
import type { Control, FieldValues, UseFormRegister } from 'react-hook-form';
import {
    isLeafField,
    type BookingFormFieldInput,
    type FieldControlProps,
    type LeafFieldType,
} from './field.types.js';
import { CheckboxField } from './CheckboxField.js';
import { DateInputField } from './DateInputField.js';
import { EmailInputField } from './EmailInputField.js';
import { FieldPlaceholder } from './FieldPlaceholder.js';
import { NumberInputField } from './NumberInputField.js';
import { PhoneInputField } from './PhoneInputField.js';
import { RadioField } from './RadioField.js';
import { SelectField } from './SelectField.js';
import { TextAreaField } from './TextAreaField.js';
import { TextInputField } from './TextInputField.js';
import { TimeInputField } from './TimeInputField.js';
import { UrlInputField } from './UrlInputField.js';

type FieldsMap = {
    [K in LeafFieldType]: ComponentType<FieldControlProps<K>>;
};

const fieldsMap: FieldsMap = {
    text: TextInputField,
    number: NumberInputField,
    file: FieldPlaceholder,
    image: FieldPlaceholder,
    url: UrlInputField,
    phone: PhoneInputField,
    date: DateInputField,
    time: TimeInputField,
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
    field: BookingFormFieldInput;
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
