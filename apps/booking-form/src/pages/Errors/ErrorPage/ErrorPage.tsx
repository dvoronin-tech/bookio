import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';

export const ErrorPage: FC = () => {
    return (
        <StatusPage
            tone="error"
            code="500"
            title="Something went wrong"
            description="We couldn't load this booking form. Please refresh the page or try again later."
        />
    );
};
