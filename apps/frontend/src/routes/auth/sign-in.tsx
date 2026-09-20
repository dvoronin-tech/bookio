import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '#pages/Auth/SignIn/SignIn';

export const Route = createFileRoute('/auth/sign-in')({
    component: SignIn,
});
