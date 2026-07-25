import { z } from 'zod';

const fieldKeySchema = z
    .string()
    .min(1)
    .regex(/^[a-z0-9][a-z0-9-_]*$/, {
        message:
            'Key must use only lowercase English letters, numbers, hyphens, and underscores (no spaces)',
    });


const fieldNameSchema = z.string().min(1).max(255);

export const fieldOptionSchema = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
});

export const inputParamsSchema = z.object({
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
});

export const textAreaParamsSchema = z.object({
    ...inputParamsSchema.shape,
    rows: z.number().positive().optional(),
});

export const choiceParamsSchema = z.object({
    options: z.array(fieldOptionSchema).min(1, 'At least one option is required'),
    placeholder: z.string().optional(),
});

export const groupParamsSchema = z.object({
    description: z.string().optional(),
});

export const checkboxParamsSchema = z.object({
    helpText: z.string().optional(),
});

export const fileParamsSchema = z.object({
    accept: z.array(z.string()).optional(),
    maxSizeMb: z.number().positive().optional(),
});

const createFieldSchema = z.object({
    id: z.uuidv7(),
    key: fieldKeySchema,
    name: fieldNameSchema,
    order: z.number().positive()
});

const buildCreateModalFieldVariants = <
    TBase extends z.ZodRawShape,
    TInputParams extends z.ZodType,
    TChoiceParams extends z.ZodType,
    TCheckboxParams extends z.ZodType,
    TFileParams extends z.ZodType,
    TGroupParams extends z.ZodType,
>({
    base,
    inputParams,
    choiceParams,
    checkboxParams,
    fileParams,
    groupParams,
}: {
    base: TBase;
    inputParams: TInputParams;
    choiceParams: TChoiceParams;
    checkboxParams: TCheckboxParams;
    fileParams: TFileParams;
    groupParams: TGroupParams;
}) => {
    const leafField = <T extends string, TParams extends z.ZodType>(type: T, params: TParams) =>
        z.object({
            ...base,
            type: z.literal(type),
            required: z.boolean(),
            parentId: z.uuid().nullable(),
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
        leafField('textarea', textAreaParamsSchema),
        leafField('select', choiceParams),
        leafField('radio', choiceParams),
        leafField('checkbox', checkboxParams),
        leafField('file', fileParams),
        leafField('image', fileParams),
        z.object({
            ...base,
            type: z.literal('group'),
            required: z.literal(false),
            parentId: null,
            params: groupParams,
        }),
    ] as const;
};

const createModalFieldVariants = buildCreateModalFieldVariants({
    base: createFieldSchema.shape,
    inputParams: inputParamsSchema.default({}),
    choiceParams: choiceParamsSchema,
    checkboxParams: checkboxParamsSchema.default({}),
    fileParams: fileParamsSchema.default({}),
    groupParams: groupParamsSchema.default({}),
});

export const createInputFieldSchema = z.discriminatedUnion('type', [
    createModalFieldVariants[0],
    createModalFieldVariants[1],
    createModalFieldVariants[2],
    createModalFieldVariants[3],
    createModalFieldVariants[4],
    createModalFieldVariants[5],
    createModalFieldVariants[6],
    createModalFieldVariants[7],
]);

export const createModalFieldSchema = z.discriminatedUnion('type', createModalFieldVariants);


export type CreateModalFieldInput = z.input<typeof createModalFieldSchema>;
export type CreateModalFieldOutput = z.infer<typeof createModalFieldSchema>;
