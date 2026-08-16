import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';

export const NotFoundPage: FC = () => {
    return (
        <StatusPage
            code="404"
            title="This booking form doesn't exist"
            description="The link may be incorrect or the form may have been removed"
        />
    );
};
