import type { FieldModalFormValues } from '@bookio/backend/schemas';

export interface OptionItem {
    id: string;
    value: string;
    label: string;
}

export const createEmptyOption = (): OptionItem => ({
    id: crypto.randomUUID(),
    value: '',
    label: '',
});

export const getChoiceOptionsFromParams = (
    type: FieldModalFormValues['type'],
    params: FieldModalFormValues['params'],
): OptionItem[] => {
    if ((type !== 'select' && type !== 'radio') || !params || !('options' in params)) {
        return [];
    }

    return params.options ?? [];
};

export const getAcceptTypesFromParams = (
    type: FieldModalFormValues['type'],
    params: FieldModalFormValues['params'],
): string[] => {
    if ((type !== 'file' && type !== 'image') || !params || !('accept' in params)) {
        return [];
    }

    return params.accept ?? [];
};

export const normalizeFieldParams = (
    type: FieldModalFormValues['type'],
    params: FieldModalFormValues['params'],
) => {
    const choiceParamsOptions = getChoiceOptionsFromParams(type, params);

    if (choiceParamsOptions.length === 0) {
        return params;
    }

    return {
        ...params,
        options: choiceParamsOptions,
    };
};
