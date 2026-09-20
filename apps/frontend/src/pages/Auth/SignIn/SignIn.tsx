import { Button, Input } from '@bookio/ui';
import { type FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from './SignIn.module.scss';
import { useSignIn } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';

const signInSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number',
        })
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
            message: 'Password must contain at least one special character',
        }),
});

type SignInData = z.infer<typeof signInSchema>;

export const SignIn: FC = () => {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useSignIn();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: SignInData) => {
        await toast.promise(mutateAsync(data), {
            loading: 'Signing in...',
            success: 'Signed in successfully',
            error: (error: Error) => error.message,
        });
        await navigate({ to: '/organizations/list' });
    };

    const onInvalid = (errors: FieldErrors<SignInData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    const isDisabled = isPending || isSubmitting;

    return (
        <form
            className={styles.signInForm}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
        >
            <h1>Sign in</h1>
            <Input
                type="email"
                placeholder="Email"
                autoComplete="email"
                disabled={isDisabled}
                {...register('email')}
            />
            <Input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                disabled={isDisabled}
                {...register('password')}
            />
            <Button
                type="submit"
                variant="primary-filled"
                className={styles.submitButton}
                disabled={isDisabled}
            >
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
            <Button
                type="button"
                variant="simple-outlined"
                onClick={() => void navigate({ to: '/auth/sign-up' })}
            >
                Sign Up
            </Button>
        </form>
    );
};
