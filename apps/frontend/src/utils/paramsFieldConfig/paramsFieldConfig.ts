import { checkboxFieldsConfig } from './fields/checkbox';
import { choiceFieldsConfig, selectFieldsConfig } from './fields/choice';
import { groupFieldsConfig } from './fields/group';
import { imageFieldsConfig } from './fields/image';
import { inputFieldsConfig } from './fields/input';
import { textAreaFieldsConfig } from './fields/textarea';
import { namedParamFields } from './namedParamFields';
import type { ParamsFieldConfig } from './paramsFieldConfig.types';

export const paramsFieldConfig: ParamsFieldConfig = {
    text: namedParamFields(inputFieldsConfig),
    email: namedParamFields(inputFieldsConfig),
    phone: namedParamFields(inputFieldsConfig),
    url: namedParamFields(inputFieldsConfig),
    number: namedParamFields(inputFieldsConfig),
    date: namedParamFields(inputFieldsConfig),
    time: namedParamFields(inputFieldsConfig),
    textarea: namedParamFields(textAreaFieldsConfig),
    select: namedParamFields(selectFieldsConfig, 'options'),
    radio: namedParamFields(choiceFieldsConfig, 'options'),
    checkbox: namedParamFields(checkboxFieldsConfig),
    // file: namedParamFields(fileFieldsConfig, 'select'),
    image: namedParamFields(imageFieldsConfig, 'select'),
    group: namedParamFields(groupFieldsConfig),
};

export type UIFields = (typeof paramsFieldConfig)[keyof typeof paramsFieldConfig];
