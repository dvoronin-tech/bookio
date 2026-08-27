import { useCallback, useMemo, type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldModalFormValues } from '@bookio/backend/schemas';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import { imageAcceptOptions } from '#utils/paramsFieldConfig/imageAcceptOptions';

const ALL_IMAGES_MIME_TYPE = imageAcceptOptions['All images'];

const ALL_SPECIFIC_IMAGE_MIME_TYPES = Object.values(imageAcceptOptions).filter(
    (mimeType) => mimeType !== ALL_IMAGES_MIME_TYPE,
);

const normalizeAcceptTypes = (accept: string[]): string[] | undefined => {
    const specificTypes = accept.filter((item) => item !== ALL_IMAGES_MIME_TYPE);

    if (
        specificTypes.length > 0 &&
        ALL_SPECIFIC_IMAGE_MIME_TYPES.every((mimeType) => specificTypes.includes(mimeType))
    ) {
        return undefined;
    }

    return specificTypes.length > 0 ? specificTypes : undefined;
};

const getDisplayedAcceptTypes = (stored: string[] | undefined): string[] => {
    const accept = stored ?? [];

    return accept.length === 0 ? [ALL_IMAGES_MIME_TYPE] : accept;
};

const toggleAcceptType = (
    stored: string[] | undefined,
    acceptType: string,
): string[] | undefined => {
    const accept = stored ?? [];
    const isAllImagesSelected = accept.length === 0 || accept.includes(ALL_IMAGES_MIME_TYPE);

    if (acceptType === ALL_IMAGES_MIME_TYPE) {
        return undefined;
    }

    if (isAllImagesSelected) {
        return [acceptType];
    }

    const specificTypes = accept.filter((item) => item !== ALL_IMAGES_MIME_TYPE);
    const nextAccept = specificTypes.includes(acceptType)
        ? specificTypes.filter((item) => item !== acceptType)
        : [...specificTypes, acceptType];

    return normalizeAcceptTypes(nextAccept);
};

interface AcceptTypesFieldProps {
    label: string;
    options: SelectDropdownOption[];
    searchPlaceholder?: string;
    emptyOptionsText?: string;
    withSearch?: boolean;
}

export const AcceptTypesField: FC<AcceptTypesFieldProps> = ({
    label,
    options,
    searchPlaceholder,
    emptyOptionsText,
    withSearch,
}) => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const watchedAccept = useWatch({ control, name: 'params.accept' });
    const displayedSelected = useMemo(
        () => getDisplayedAcceptTypes(watchedAccept),
        [watchedAccept],
    );

    const handleToggleAcceptType = useCallback(
        (option: SelectDropdownOption) => {
            setValue('params.accept', toggleAcceptType(watchedAccept, String(option)));
        },
        [watchedAccept, setValue],
    );

    const formatSelectedCount = useCallback((count: number) => `${count} types selected`, []);

    return (
        <SelectDropdown
            label={label}
            options={options}
            selected={displayedSelected}
            onOptionClick={handleToggleAcceptType}
            placeholder="Select allowed types"
            searchPlaceholder={searchPlaceholder}
            emptyOptionsText={emptyOptionsText}
            formatSelectedCount={formatSelectedCount}
            placement="top"
            withSearch={withSearch}
            multiple
        />
    );
};
