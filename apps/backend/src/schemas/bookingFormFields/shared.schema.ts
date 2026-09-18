import type {
    CheckboxFieldParams,
    ChoiceFieldParams,
    DateFieldParams,
    FieldOption,
    FileFieldParams,
    GroupFieldParams,
    InputFieldParams,
    SelectFieldParams,
    TextAreaFieldParams,
    TimeFieldParams,
} from '@bookio/db';
import { z } from 'zod';

export type { BookingFormFieldRowUnion } from '@bookio/db';

export const fieldKeySchema = z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9][a-z0-9-_]*$/, {
        message:
            'Key must use only lowercase English letters, numbers, hyphens, and underscores (no spaces)',
    });

export const fieldNameSchema = z.string().min(1).max(255);

export const fieldOptionSchema = z.object({
    label: z.string().trim().min(1, 'Option label is required'),
}) satisfies z.ZodType<FieldOption>;

export const inputParamsSchema = z.object({
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
}) satisfies z.ZodType<InputFieldParams>;

const emptyToUndefined = (value: unknown) => {
    if (value === '' || value === null) {
        return undefined;
    }

    if (typeof value === 'number' && Number.isNaN(value)) {
        return undefined;
    }

    return value;
};

export const DATE_YEAR_SLIDER_MIN = 1800;
export const DATE_YEAR_SLIDER_MAX = 2100;
export const DATE_YEAR_DEFAULT_MIN = 1900;

export const getDateYearDefaultMax = () => new Date().getFullYear();

export const getDefaultDateParams = () => ({
    minYear: DATE_YEAR_DEFAULT_MIN,
    maxYear: getDateYearDefaultMax(),
});

export const dateParamsSchema = z.object({
    placeholder: z.string().optional(),
    minYear: z.preprocess(
        emptyToUndefined,
        z.number().int().min(DATE_YEAR_SLIDER_MIN).max(DATE_YEAR_SLIDER_MAX).default(DATE_YEAR_DEFAULT_MIN),
    ),
    maxYear: z.preprocess(
        emptyToUndefined,
        z.number().int().min(DATE_YEAR_SLIDER_MIN).max(DATE_YEAR_SLIDER_MAX).default(getDateYearDefaultMax()),
    ),
}) satisfies z.ZodType<DateFieldParams>;

export const timeStringSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Time must be in HH:mm format' });

export const timeParamsSchema = z.object({
    ...inputParamsSchema.shape,
    min: z.preprocess(emptyToUndefined, timeStringSchema.optional()),
    max: z.preprocess(emptyToUndefined, timeStringSchema.optional()),
    step: z.preprocess(emptyToUndefined, z.number().int().positive().optional()),
}) satisfies z.ZodType<TimeFieldParams>;

export const textAreaParamsSchema = z.object({
    ...inputParamsSchema.shape,
    rows: z.number().positive().optional(),
}) satisfies z.ZodType<TextAreaFieldParams>;

export const choiceParamsSchema = z.object({
    options: z
        .array(fieldOptionSchema)
        .min(1, 'At least one option is required')
        .refine(
            (options) => {
                const labels = options.map((opt) => opt.label.trim());
                return new Set(labels).size === labels.length;
            },
            { message: 'Option labels must be unique' },
        ),
}) satisfies z.ZodType<ChoiceFieldParams>;

export const selectParamsSchema = choiceParamsSchema.extend({
    defaultValue: z.string().min(1, 'Default value is required'),
}) satisfies z.ZodType<SelectFieldParams>;

export const groupParamsSchema = z.object({
    description: z.string().optional(),
}) satisfies z.ZodType<GroupFieldParams>;

export const checkboxParamsSchema = z.object({
    helpText: z.string().optional(),
}) satisfies z.ZodType<CheckboxFieldParams>;

export const fileParamsSchema = z.object({
    placeholder: z.string().optional(),
    accept: z.array(z.string()).optional(),
    maxSizeMb: z.number().positive().optional(),
}) satisfies z.ZodType<FileFieldParams>;

type BuildFieldVariantsOptions<
    TBase extends z.ZodRawShape,
    TRequired extends z.ZodType,
    TGroupRequired extends z.ZodType,
    TGroupParentId extends z.ZodType,
    TInputParams extends z.ZodType,
    TDateParams extends z.ZodType,
    TTimeParams extends z.ZodType,
    TTextAreaParams extends z.ZodType,
    TSelectParams extends z.ZodType,
    TRadioParams extends z.ZodType,
    TCheckboxParams extends z.ZodType,
    TFileParams extends z.ZodType,
    TGroupParams extends z.ZodType,
> = {
    base: TBase;
    required: TRequired;
    groupRequired: TGroupRequired;
    groupParentId: TGroupParentId;
    leafParentId: z.ZodNullable<z.ZodUUID>;
    inputParams: TInputParams;
    dateParams: TDateParams;
    timeParams: TTimeParams;
    textAreaParams: TTextAreaParams;
    selectParams: TSelectParams;
    radioParams: TRadioParams;
    checkboxParams: TCheckboxParams;
    fileParams: TFileParams;
    groupParams: TGroupParams;
};

/**
 * Shared field-type branches for discriminatedUnion('type', …).
 * Branch literals must stay aligned with `fieldTypeValues` in `@bookio/db`.
 */
export const buildBookingFormFieldVariants = <
    TBase extends z.ZodRawShape,
    TRequired extends z.ZodType,
    TGroupRequired extends z.ZodType,
    TGroupParentId extends z.ZodType,
    TInputParams extends z.ZodType,
    TDateParams extends z.ZodType,
    TTimeParams extends z.ZodType,
    TTextAreaParams extends z.ZodType,
    TSelectParams extends z.ZodType,
    TRadioParams extends z.ZodType,
    TCheckboxParams extends z.ZodType,
    TFileParams extends z.ZodType,
    TGroupParams extends z.ZodType,
>({
    base,
    required,
    groupRequired,
    groupParentId,
    leafParentId,
    inputParams,
    dateParams,
    timeParams,
    textAreaParams,
    selectParams,
    radioParams,
    checkboxParams,
    fileParams,
    groupParams,
}: BuildFieldVariantsOptions<
    TBase,
    TRequired,
    TGroupRequired,
    TGroupParentId,
    TInputParams,
    TDateParams,
    TTimeParams,
    TTextAreaParams,
    TSelectParams,
    TRadioParams,
    TCheckboxParams,
    TFileParams,
    TGroupParams
>) => {
    const leafField = <T extends string, TParams extends z.ZodType>(type: T, params: TParams) =>
        z.object({
            ...base,
            type: z.literal(type),
            required,
            parentId: leafParentId,
            params,
        });

    return [
        leafField('text', inputParams),
        leafField('email', inputParams),
        leafField('phone', inputParams),
        leafField('url', inputParams),
        leafField('number', inputParams),
        leafField('date', dateParams),
        leafField('time', timeParams),
        leafField('textarea', textAreaParams),
        leafField('select', selectParams),
        leafField('radio', radioParams),
        leafField('checkbox', checkboxParams),
        leafField('file', fileParams),
        leafField('image', fileParams),
        z.object({
            ...base,
            type: z.literal('group'),
            required: groupRequired,
            parentId: groupParentId,
            params: groupParams,
        }),
    ] as const;
};

const createInputFieldVariants = buildBookingFormFieldVariants({
    base: {
        id: z.uuid(),
        name: fieldNameSchema,
        key: fieldKeySchema,
        order: z.number().int().min(0),
    },
    required: z.boolean().default(false),
    groupRequired: z.literal(false).default(false),
    groupParentId: z.null(),
    leafParentId: z.uuid().nullable(),
    inputParams: inputParamsSchema.default({}),
    dateParams: dateParamsSchema.default(getDefaultDateParams),
    timeParams: timeParamsSchema.default({}),
    textAreaParams: textAreaParamsSchema.default({}),
    selectParams: selectParamsSchema,
    radioParams: choiceParamsSchema,
    checkboxParams: checkboxParamsSchema.default({}),
    fileParams: fileParamsSchema.default({}),
    groupParams: groupParamsSchema.default({}),
});

export const createInputFieldSchema = z.discriminatedUnion('type', [
    createInputFieldVariants[0],
    createInputFieldVariants[1],
    createInputFieldVariants[2],
    createInputFieldVariants[3],
    createInputFieldVariants[4],
    createInputFieldVariants[5],
    createInputFieldVariants[6],
    createInputFieldVariants[7],
]);

export type CreateInputFieldInput = z.input<typeof createInputFieldSchema>;
export type CreateInputFieldOutput = z.infer<typeof createInputFieldSchema>;
