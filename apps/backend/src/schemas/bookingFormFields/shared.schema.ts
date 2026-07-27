import type {
    CheckboxFieldParams,
    ChoiceFieldParams,
    FieldOption,
    FileFieldParams,
    GroupFieldParams,
    InputFieldParams,
} from '@bookio/db';
import { z } from 'zod';

export const fieldOptionSchema = z.object({
    id: z.string().min(1),
    value: z.string().min(1),
    label: z.string().min(1),
}) satisfies z.ZodType<FieldOption>;

export const inputParamsSchema = z.object({
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
}) satisfies z.ZodType<InputFieldParams>;

export const choiceParamsSchema = z.object({
    options: z.array(fieldOptionSchema).min(1, 'At least one option is required'),
    placeholder: z.string().optional(),
}) satisfies z.ZodType<ChoiceFieldParams>;

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

export const fieldKeySchema = z
    .string()
    .min(1)
    .max(255)
    .regex(/^\S+$/, 'Key must not contain spaces');

export const fieldNameSchema = z.string().min(1).max(255);

type BuildFieldVariantsOptions<
    TBase extends z.ZodRawShape,
    TRequired extends z.ZodType,
    TGroupRequired extends z.ZodType,
    TGroupParentId extends z.ZodType,
    TInputParams extends z.ZodType,
    TChoiceParams extends z.ZodType,
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
    choiceParams: TChoiceParams;
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
    TChoiceParams extends z.ZodType,
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
    choiceParams,
    checkboxParams,
    fileParams,
    groupParams,
}: BuildFieldVariantsOptions<
    TBase,
    TRequired,
    TGroupRequired,
    TGroupParentId,
    TInputParams,
    TChoiceParams,
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
        leafField('date', inputParams),
        leafField('time', inputParams),
        leafField('textarea', inputParams),
        leafField('select', choiceParams),
        leafField('radio', choiceParams),
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
