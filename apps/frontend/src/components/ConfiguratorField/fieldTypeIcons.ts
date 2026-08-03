import type { FC, SVGProps } from 'react';
import type { EntireBookingFormField } from '#api/bookingForms/getEntireBookingFormById';

import TextIcon from '#assets/icons/field-types/text.svg?react';
import EmailIcon from '#assets/icons/field-types/email.svg?react';
import PhoneIcon from '#assets/icons/field-types/phone.svg?react';
import NumberIcon from '#assets/icons/field-types/number.svg?react';
import TextareaIcon from '#assets/icons/field-types/textarea.svg?react';
import SelectIcon from '#assets/icons/field-types/select.svg?react';
import CheckboxIcon from '#assets/icons/field-types/checkbox.svg?react';
import RadioIcon from '#assets/icons/field-types/radio.svg?react';
import DateIcon from '#assets/icons/field-types/date.svg?react';
import TimeIcon from '#assets/icons/field-types/time.svg?react';
import UrlIcon from '#assets/icons/field-types/url.svg?react';
// import FileIcon from '#assets/icons/field-types/file.svg?react';
import ImageIcon from '#assets/icons/field-types/image.svg?react';
import GroupIcon from '#assets/icons/field-types/group.svg?react';

type FieldType = EntireBookingFormField['type'];
type IconComponent = FC<SVGProps<SVGSVGElement>>;

export interface FieldTypeIconData {
    icon: IconComponent;
    color: string;
}

export const fieldTypeIcons: Partial<Record<FieldType, FieldTypeIconData>> = {
    text: { icon: TextIcon, color: 'var(--color-primary)' },
    textarea: { icon: TextareaIcon, color: 'var(--color-primary)' },
    email: { icon: EmailIcon, color: 'var(--color-system-blue)' },
    phone: {
        icon: PhoneIcon,
        color: 'color-mix(in srgb, var(--color-system-blue) 70%, var(--color-primary))',
    },
    url: { icon: UrlIcon, color: 'var(--color-system-blue)' },
    number: { icon: NumberIcon, color: 'var(--color-system-green)' },
    select: {
        icon: SelectIcon,
        color: 'color-mix(in srgb, var(--color-primary) 60%, var(--color-system-blue))',
    },
    checkbox: { icon: CheckboxIcon, color: 'var(--color-system-green)' },
    radio: {
        icon: RadioIcon,
        color: 'color-mix(in srgb, var(--color-system-green) 50%, var(--color-system-blue))',
    },
    date: {
        icon: DateIcon,
        color: 'color-mix(in srgb, var(--color-system-blue) 45%, var(--color-system-red))',
    },
    time: {
        icon: TimeIcon,
        color: 'color-mix(in srgb, var(--color-system-blue) 55%, var(--color-system-green))',
    },
    // file: { icon: FileIcon, color: 'var(--color-system-red)' },
    image: {
        icon: ImageIcon,
        color: 'color-mix(in srgb, var(--color-primary) 55%, var(--color-system-red))',
    },
    group: { icon: GroupIcon, color: 'color-mix(in srgb, var(--color-primary) 60%, var(--color-system-blue))' },
} as const;