import { z } from 'zod';
import { m } from '#i18n/messages';

export const step1Schema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(255),
    organizationId: z.uuid(),
});

const hexColorSchema = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: m.color_invalid(),
});

export const step3Schema = z.object({
    primary: hexColorSchema,
    bgMain: hexColorSchema,
    bgSecondary: hexColorSchema,
    borderColor: hexColorSchema,
    textMain: hexColorSchema,
    textSecondary: hexColorSchema,
});

export const step4Schema = z.object({
    metaTitle: z.string().min(1, m.step4_title_required()).max(255),
    metaDescription: z.string().min(1, m.step4_description_required()).max(255),
});
