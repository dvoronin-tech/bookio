import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

export type UiLocale = 'en' | 'ru';

export type UiCopy = {
    validationError: string;
    removeFile: string;
    fileDropPlaceholder: string;
    fileSelectPlaceholder: string;
    fileTypeError: string;
    removeImage: string;
    imageDropPlaceholder: string;
    imageSelectPlaceholder: string;
    imageFileError: string;
    copy: string;
    hide: string;
    show: string;
    progressBar: string;
    selectPlaceholder: string;
    searchPlaceholder: string;
    emptyOptions: string;
    selectedCount: (count: number) => string;
    chooseTime: string;
    closeTimePicker: string;
    openTimePicker: string;
    hours: string;
    minutes: string;
    previousMonth: string;
    nextMonth: string;
    previousYear: string;
    nextYear: string;
    chooseDate: string;
    closeDatePicker: string;
    openDatePicker: string;
    chooseColor: string;
    hexColor: string;
};

export const defaultUiCopy: UiCopy = {
    validationError: 'Validation error',
    removeFile: 'Remove file',
    fileDropPlaceholder: 'Drag & drop a file here, or click to browse',
    fileSelectPlaceholder: 'Select a file',
    fileTypeError: 'This file type is not supported',
    removeImage: 'Remove image',
    imageDropPlaceholder: 'Drag & drop an image here, or click to browse',
    imageSelectPlaceholder: 'Select an image',
    imageFileError: 'Please choose an image file',
    copy: 'Copy',
    hide: 'Hide',
    show: 'Show',
    progressBar: 'Progress bar',
    selectPlaceholder: 'Select...',
    searchPlaceholder: 'Search...',
    emptyOptions: 'No options found',
    selectedCount: (count) => `${count} selected`,
    chooseTime: 'Choose time',
    closeTimePicker: 'Close time picker',
    openTimePicker: 'Open time picker',
    hours: 'Hours',
    minutes: 'Minutes',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    chooseDate: 'Choose date',
    closeDatePicker: 'Close date picker',
    openDatePicker: 'Open date picker',
    chooseColor: 'Choose color',
    hexColor: 'Hex color',
};

const UiI18nContext = createContext<{ locale: UiLocale; copy: UiCopy }>({
    locale: 'en',
    copy: defaultUiCopy,
});

export function UiI18nProvider({
    locale,
    copy,
    children,
}: {
    locale: UiLocale;
    copy: UiCopy;
    children: ReactNode;
}) {
    return <UiI18nContext.Provider value={{ locale, copy }}>{children}</UiI18nContext.Provider>;
}

export function useUiCopy(): UiCopy {
    return useContext(UiI18nContext).copy;
}

export function useUiDateLocale(): Locale {
    return useContext(UiI18nContext).locale === 'ru' ? ru : enUS;
}
