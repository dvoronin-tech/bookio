import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';
import { m } from '#/i18n/messages';

export const NotFoundPage: FC = () => {
    return (
        <StatusPage
            code="404"
            title={m.not_found_title()}
            description={m.not_found_description()}
        />
    );
};
