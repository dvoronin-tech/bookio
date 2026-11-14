import { type FC, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from '#layouts/AuthLayout/AuthLayout.module.scss';
import { useSignIn } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { goToCurrentUserEntry } from '#lib/organizationEntry';
import { m } from '../../../paraglide/messages.js';
import { getLocale } from '../../../paraglide/runtime.js';

function createSignInSchema() {
    return z.object({
        email: z.email(),
        password: z
            .string()
            .min(6, { message: m.auth_password_min() })
            .regex(/[A-Z]/, { message: m.auth_password_upper() })
            .regex(/[a-z]/, { message: m.auth_password_lower() })
            .regex(/[0-9]/, { message: m.auth_password_number() })
            .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
                message: m.auth_password_special(),
            }),
    });
}

type SignInData = z.infer<ReturnType<typeof createSignInSchema>>;

export const SignIn: FC = () => {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useSignIn();
    const locale = getLocale();
    const signInSchema = useMemo(() => createSignInSchema(), [locale]);

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
            loading: m.auth_signing_in(),
            success: m.auth_signed_in(),
            error: (error: Error) => error.message,
        });
        await goToCurrentUserEntry(navigate);
    };

    const onInvalid = (errors: FieldErrors<SignInData>) => {
        toast.error(getFirstFieldError(errors) ?? m.invalid_form_data());
    };

    const isDisabled = isPending || isSubmitting;

    return (
        <div className={styles.formBlock}>
            <p className={styles.eyebrow}>{m.auth_welcome()}</p>
            <h1 className={styles.title}>{m.auth_sign_in()}</h1>
            <p className={styles.support}>{m.auth_sign_in_support()}</p>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit, onInvalid)}
            >
                <label className={styles.field}>
                    <span className={styles.label}>{m.email()}</span>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder={m.auth_email_placeholder()}
                        autoComplete="email"
                        disabled={isDisabled}
                        {...register('email')}
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>{m.password()}</span>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder={m.auth_password_placeholder()}
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('password')}
                    />
                </label>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isDisabled}
                >
                    {isPending ? m.auth_signing_in_button() : m.auth_sign_in()}
                </button>
            </form>
            <div className={styles.switchRow}>
                <button
                    type="button"
                    className={styles.textControl}
                    onClick={() => void navigate({ to: '/auth/sign-up' })}
                >
                    {m.auth_create_account_link()}
                </button>
            </div>
        </div>
    );
};
