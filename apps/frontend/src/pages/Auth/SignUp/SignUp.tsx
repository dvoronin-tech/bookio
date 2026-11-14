import { type FC, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from '#layouts/AuthLayout/AuthLayout.module.scss';
import { useSignUp } from '#api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '#utils/formErrors';
import { goToCurrentUserEntry } from '#lib/organizationEntry';
import { getLocale, m } from '#i18n/messages';

function createSignUpSchema() {
    const passwordSchema = z
        .string()
        .min(6, { message: m.auth_password_min() })
        .regex(/[A-Z]/, { message: m.auth_password_upper() })
        .regex(/[a-z]/, { message: m.auth_password_lower() })
        .regex(/[0-9]/, { message: m.auth_password_number() })
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
            message: m.auth_password_special(),
        });

    return z
        .object({
            email: z.email(),
            password: passwordSchema,
            confirmPassword: passwordSchema,
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: m.auth_passwords_mismatch(),
            path: ['confirmPassword'],
        });
}

type SignUpData = z.infer<ReturnType<typeof createSignUpSchema>>;

export const SignUp: FC = () => {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useSignUp();
    const locale = getLocale();
    const signUpSchema = useMemo(() => createSignUpSchema(), [locale]);

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
            loading: m.auth_signing_up(),
            success: m.auth_signed_up(),
            error: (error: Error) => error.message,
        });
        await goToCurrentUserEntry(navigate);
    };

    const onInvalid = (errors: FieldErrors<SignUpData>) => {
        toast.error(getFirstFieldError(errors) ?? m.invalid_form_data());
    };

    const isDisabled = isPending || isSubmitting;

    return (
        <div className={styles.formBlock}>
            <p className={styles.eyebrow}>{m.auth_get_started()}</p>
            <h1 className={styles.title}>{m.auth_create_account()}</h1>
            <p className={styles.support}>{m.auth_create_account_support()}</p>
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
                <label className={styles.field}>
                    <span className={styles.label}>{m.auth_confirm_password()}</span>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder={m.auth_repeat_password()}
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('confirmPassword')}
                    />
                </label>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isDisabled}
                >
                    {isPending ? m.auth_signing_up_button() : m.auth_create_account()}
                </button>
            </form>
            <div className={styles.switchRow}>
                {m.auth_already_have_account()}{' '}
                <button
                    type="button"
                    className={styles.textControl}
                    onClick={() => void navigate({ to: '/auth/sign-in' })}
                >
                    {m.auth_sign_in()}
                </button>
            </div>
        </div>
    );
};
