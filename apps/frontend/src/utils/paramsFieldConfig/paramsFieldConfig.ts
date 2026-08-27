import { checkboxFieldsConfig } from './fields/checkbox';
import { choiceFieldsConfig, selectFieldsConfig } from './fields/choice';
import { dateFieldsConfig } from './fields/date';
import { groupFieldsConfig } from './fields/group';
import { imageFieldsConfig } from './fields/image';
import { inputFieldsConfig } from './fields/input';
import { textAreaFieldsConfig } from './fields/textarea';
import type { ParamsFieldConfig } from './paramsFieldConfig.types';

export const paramsFieldConfig: ParamsFieldConfig = {
    text: Object.values(inputFieldsConfig),
    email: Object.values(inputFieldsConfig),
    phone: Object.values(inputFieldsConfig),
    url: Object.values(inputFieldsConfig),
    number: Object.values(inputFieldsConfig),
    date: Object.values(dateFieldsConfig),
    time: Object.values(inputFieldsConfig),
    textarea: Object.values(textAreaFieldsConfig),
    select: Object.values(selectFieldsConfig),
    radio: Object.values(choiceFieldsConfig),
    checkbox: Object.values(checkboxFieldsConfig),
    // file: Object.values(fileFieldsConfig),
    image: Object.values(imageFieldsConfig),
    group: Object.values(groupFieldsConfig),
};

export type UIFields = (typeof paramsFieldConfig)[keyof typeof paramsFieldConfig];
