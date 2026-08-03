/** Central route path definitions used by navigation helpers. */
export const routes = {
    auth: {
        signIn: '/auth/sign-in',
    },
    organizations: {
        index: '/organizations',
        list: '/organizations/list',
        create: '/organizations/create',
        connect: '/organizations/connect',
    },
    organization: (organizationId: string) => `/${organizationId}`,
    organizationBookingForms: (organizationId: string) => `/${organizationId}/booking-forms`,
    bookingFormConfigurator: (organizationId: string, bookingFormId: string) =>
        `/${organizationId}/booking-forms/${bookingFormId}/configurator`,
} as const;
