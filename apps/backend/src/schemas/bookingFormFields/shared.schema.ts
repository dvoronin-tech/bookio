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

export const fieldOptionValueSchema = z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
            'Value must use only letters, numbers, hyphens, and underscores (no spaces)',
    });

export const fieldOptionSchema = z.object({
    value: fieldOptionValueSchema,
    label: z.string().min(1),
}) satisfies z.ZodType<FieldOption>;

export const inputParamsSchema = z.object({
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
}) satisfies z.ZodType<InputFieldParams>;

export const dateParamsSchema = z.object({
    placeholder: z.string().optional(),
}) satisfies z.ZodType<DateFieldParams>;

export const textAreaParamsSchema = z.object({
    ...inputParamsSchema.shape,
    rows: z.number().positive().optional(),
}) satisfies z.ZodType<TextAreaFieldParams>;

export const choiceParamsSchema = z.object({
    options: z.array(fieldOptionSchema).min(1, 'At least one option is required'),
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
        leafField('time', inputParams),
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
    dateParams: dateParamsSchema.default({}),
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
