import type { FC } from 'react';
import { StatusPage } from '#/pages/Errors/StatusPage/StatusPage';
import { m } from '#/i18n/messages';

export const ErrorPage: FC = () => {
    return (
        <StatusPage
            tone="error"
            code="500"
            title={m.error_title()}
            description={m.error_description()}
        />
    );
};
