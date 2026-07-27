import { type FC } from 'react';
import { Button, Input } from '@bookio/ui';
import styles from './SignUp.module.scss';
import { useSignUp } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';

const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: 'Password must contain at least one special character',
    });

const signUpSchema = z
    .object({
        email: z.email(),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type SignUpData = z.infer<typeof signUpSchema>;

export const SignUp: FC = () => {
    const { mutateAsync, isPending } = useSignUp();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: SignUpData) => {
        await toast.promise(mutateAsync(data), {
            loading: 'Signing up...',
            success: 'Signed up successfully',
            error: (error: Error) => error.message,
        });
    };

    const onInvalid = (errors: FieldErrors<SignUpData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    const isDisabled = isPending || isSubmitting;

    return (
        <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <h1>Sign up</h1>
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
            <Input
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                disabled={isDisabled}
                {...register('confirmPassword')}
            />
            <Button
                type="submit"
                variant="primary-filled"
                className={styles.submitButton}
                disabled={isDisabled}
            >
                {isPending ? 'Signing up…' : 'Sign Up'}
            </Button>
            <Button type="link" to="/auth/sign-in" variant="simple-outlined">
                Sign in
            </Button>
        </form>
    );
};
