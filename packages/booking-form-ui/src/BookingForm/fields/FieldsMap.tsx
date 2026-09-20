import type { ComponentType, FC } from 'react';
import {
    type BookingFormFieldInput,
    type FieldRendererProps,
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
    [K in LeafFieldType]: ComponentType<FieldRendererProps<K>>;
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
): ComponentType<FieldRendererProps<T>> {
    return fieldsMap[type];
}

type RenderFieldProps = {
    field: BookingFormFieldInput;
};

export const RenderField: FC<RenderFieldProps> = ({ field }) => {
    if (!isLeafField(field)) {
        return null;
    }

    const Field = getFieldComponent(field.type);
    return <Field field={field} />;
};
