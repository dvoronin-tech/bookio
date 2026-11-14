import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { prepareSuccess } from '@/utils/prepareResponse.js';
import { isOrganizationExists } from '@/utils/isOrganizationExists.js';
import { isOrganizationExistsSchema } from '@/schemas/organization/isExists.schema.js';

const factory = createFactory().createHandlers;

export const isOrganizationExistsHandler = factory(
    validate('json', isOrganizationExistsSchema),
    async (c) => {
        const { slug } = c.req.valid('json');

        const isExists = await isOrganizationExists(slug);

        return c.json(prepareSuccess(isExists));
    },
);
