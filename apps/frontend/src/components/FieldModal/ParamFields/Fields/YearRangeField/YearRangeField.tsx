import { useMemo, type FC, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    DATE_YEAR_DEFAULT_MIN,
    DATE_YEAR_SLIDER_MAX,
    DATE_YEAR_SLIDER_MIN,
    getDateYearDefaultMax,
    type FieldModalFormValues,
} from '@bookio/backend/schemas';
import { Input, ProgressBar } from '@bookio/ui';

interface YearRangeFieldProps {
    label: string;
}

const isYear = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value);

const clampYear = (value: number): number =>
    Math.min(DATE_YEAR_SLIDER_MAX, Math.max(DATE_YEAR_SLIDER_MIN, value));

const toSliderYear = (value: unknown, fallback: number): number =>
    isYear(value) ? clampYear(value) : fallback;

export const YearRangeField: FC<YearRangeFieldProps> = ({ label }) => {
    const { control, setValue } = useFormContext<FieldModalFormValues>();
    const minYear = useWatch({ control, name: 'params.minYear' });
    const maxYear = useWatch({ control, name: 'params.maxYear' });

    const defaultMaxYear = getDateYearDefaultMax();
    const currentMin = toSliderYear(minYear, DATE_YEAR_DEFAULT_MIN);
    const currentMax = toSliderYear(maxYear, defaultMaxYear);
    const currentValues = useMemo<[number, number]>(
        () => [Math.min(currentMin, currentMax), Math.max(currentMin, currentMax)],
        [currentMin, currentMax],
    );

    const handleChange = useCallback(
        ([nextMin, nextMax]: number[]) => {
            setValue('params.minYear', nextMin ?? DATE_YEAR_DEFAULT_MIN);
            setValue('params.maxYear', nextMax ?? defaultMaxYear);
        },
        [setValue, defaultMaxYear],
    );

    return (
        <Input.Field label={label}>
            <ProgressBar
                minValue={DATE_YEAR_SLIDER_MIN}
                maxValue={DATE_YEAR_SLIDER_MAX}
                currentValues={currentValues}
                onChange={handleChange}
                aria-label={label}
            />
        </Input.Field>
    );
};
