import { createFactory } from 'hono/factory';
import { validate } from '@/utils/validate.js';
import { db } from '@/db.js';
import { and, eq } from 'drizzle-orm';
import { members, organizations } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { logoutOrganizationSchema } from '@/schemas/organization/logout.schema.js';

const factory = createFactory().createHandlers;

export const logoutOrganizationHandler = factory(
    validate('json', logoutOrganizationSchema),
    async (c) => {
        const { userId, organizationId, organizationPassword } = c.req.valid('json');

        const [member] = await db
            .select()
            .from(members)
            .where(and(eq(members.userId, userId), eq(members.organizationId, organizationId)));

        if (!member) {
            return c.json(prepareError('Member not found', 'not_found'), 404);
        }

        if (member.role === 'owner') {
            const [organization] = await db
                .select()
                .from(organizations)
                .where(eq(organizations.id, organizationId));
            if (!organization) {
                return c.json(prepareError('Organization not found', 'not_found'), 404);
            }

            if (organization.password !== organizationPassword) {
                return c.json(prepareError('Invalid organization password', 'invalid_password'), 401);
            }

            const [deletedOrganization] = await db
                .delete(organizations)
                .where(eq(organizations.id, organizationId))
                .returning();

            if (deletedOrganization) {
                return c.json(prepareSuccess('Organization deleted successfully'));
            } else {
                return c.json(prepareError('Failed to delete organization', 'internal'), 500);
            }
        }

        await db
            .delete(members)
            .where(and(eq(members.userId, userId), eq(members.organizationId, organizationId)));

        return c.json(prepareSuccess('Member deleted successfully'));
    },
);
