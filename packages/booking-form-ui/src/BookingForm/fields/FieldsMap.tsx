import type { ComponentType, FC } from 'react';
import type { Control, FieldValues, UseFormRegister } from 'react-hook-form';
import {
    type BookingFormFieldInput,
    type FieldControlProps,
    isLeafField,
    type LeafFieldType,
} from './field.types.js';
import { CheckboxField } from './components/CheckboxField.js';
import { DateInputField } from './components/DateInputField.js';
import { EmailInputField } from './components/EmailInputField.js';
import { FileField } from './components/FileField.js';
import { ImageField } from './components/ImageField.js';
import { NumberInputField } from './components/NumberInputField.js';
import { PhoneInputField } from './components/PhoneInputField.js';
import { RadioField } from './components/RadioField.js';
import { SelectField } from './components/SelectField.js';
import { TextAreaField } from './components/TextAreaField.js';
import { TextInputField } from './components/TextInputField.js';
import { TimeInputField } from './components/TimeInputField.js';
import { UrlInputField } from './components/UrlInputField.js';

type FieldsMap = {
    [K in LeafFieldType]: ComponentType<FieldControlProps<K>>;
};

const fieldsMap: FieldsMap = {
    text: TextInputField,
    number: NumberInputField,
    file: FileField,
    image: ImageField,
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

function getFieldComponent<T extends LeafFieldType>(
    type: T,
): ComponentType<FieldControlProps<T>> {
    return fieldsMap[type];
}

type RenderFieldProps = {
    field: BookingFormFieldInput;
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    markRequiredFields: boolean;
};

export const RenderField: FC<RenderFieldProps> = ({
    field,
    register,
    control,
    markRequiredFields,
}) => {
    if (!isLeafField(field)) {
        return null;
    }

    const Field = getFieldComponent(field.type);
    return (
        <Field
            field={field}
            register={register}
            control={control}
            markRequiredFields={markRequiredFields}
        />
    );
};
