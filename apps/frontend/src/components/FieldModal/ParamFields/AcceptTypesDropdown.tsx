import { useMemo, type FC, useCallback } from 'react';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import type { AcceptOptions } from '#utils/paramsFieldConfig';
import { imageAcceptOptions } from '#utils/paramsFieldConfig/imageAcceptOptions';

export const ALL_IMAGES_MIME_TYPE = imageAcceptOptions['All images'];

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

export const getDisplayedAcceptTypes = (stored: string[] | undefined): string[] => {
    const accept = stored ?? [];

    return accept.length === 0 ? [ALL_IMAGES_MIME_TYPE] : accept;
};

export const toggleAcceptType = (
    stored: string[] | undefined,
    acceptType: string,
): string[] | undefined => {
    const accept = stored ?? [];
    const isAllImagesSelected =
        accept.length === 0 || accept.includes(ALL_IMAGES_MIME_TYPE);

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

interface AcceptTypesDropdownProps {
    label: string;
    options: AcceptOptions;
    selected: string[];
    onToggleOption: (mimeType: string) => void;
}

export const AcceptTypesDropdown: FC<AcceptTypesDropdownProps> = ({
    label,
    options,
    selected,
    onToggleOption,
}) => {
    const dropdownOptions = useMemo<SelectDropdownOption[]>(
        () =>
            Object.entries(options).map(([extension, mimeType]) => ({
                label: extension,
                value: mimeType,
            })),
        [options],
    );

    const formatSelectedCount = useCallback((count: number) => `${count} types selected`, []);

    return (
        <SelectDropdown
            label={label}
            options={dropdownOptions}
            selected={selected}
            onOptionClick={onToggleOption}
            placeholder="Select allowed types"
            searchPlaceholder="Search types..."
            emptyOptionsText="No types found"
            formatSelectedCount={formatSelectedCount}
            placement="top"
            withSearch
            multiple
        />
    );
};
