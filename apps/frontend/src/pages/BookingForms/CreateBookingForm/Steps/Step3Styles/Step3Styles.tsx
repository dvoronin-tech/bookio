import { type ChangeEvent, type FC, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, ColorPicker, Input } from '@bookio/ui';
import { useCreateBookingFormStore } from '#store/useCreateBookingFormStore.ts';
import { FormWizardLayout } from '#components/FormWizardLayout/FormWizardLayout.tsx';
import { DEFAULT_DARK_BOOKING_FORM_STYLES } from '#utils/defaultBookingFormStyles.ts';
import { step3Schema } from '../../schemas/createBookingFormDraft.schema.ts';
import toast from 'react-hot-toast';
import styles from './Step3Styles.module.scss';
import { trimObj } from '#utils/trimObj.ts';

const COLOR_FIELDS = [
    {
        key: 'primary',
        label: 'Primary',
        placeholder: `Primary* (${DEFAULT_DARK_BOOKING_FORM_STYLES.primary})`,
    },
    {
        key: 'bgMain',
        label: 'Background main',
        placeholder: `Background main* (${DEFAULT_DARK_BOOKING_FORM_STYLES.bgMain})`,
    },
    {
        key: 'bgSecondary',
        label: 'Background secondary',
        placeholder: `Background secondary* (${DEFAULT_DARK_BOOKING_FORM_STYLES.bgSecondary})`,
    },
    {
        key: 'borderColor',
        label: 'Border',
        placeholder: `Border* (${DEFAULT_DARK_BOOKING_FORM_STYLES.borderColor})`,
    },
    {
        key: 'textMain',
        label: 'Text main',
        placeholder: `Text main* (${DEFAULT_DARK_BOOKING_FORM_STYLES.textMain})`,
    },
    {
        key: 'textSecondary',
        label: 'Text secondary',
        placeholder: `Text secondary* (${DEFAULT_DARK_BOOKING_FORM_STYLES.textSecondary})`,
    },
] as const;

export const Step3Styles: FC = () => {
    const {
        primary,
        bgMain,
        bgSecondary,
        borderColor,
        textMain,
        textSecondary,
        setField,
        goToNextStep,
        goToPreviousStep,
    } = useCreateBookingFormStore(
        useShallow((s) => ({
            primary: s.data.primary,
            bgMain: s.data.bgMain,
            bgSecondary: s.data.bgSecondary,
            borderColor: s.data.borderColor,
            textMain: s.data.textMain,
            textSecondary: s.data.textSecondary,
            setField: s.setField,
            goToNextStep: s.goToNextStep,
            goToPreviousStep: s.goToPreviousStep,
        })),
    );

    const values = {
        primary,
        bgMain,
        bgSecondary,
        borderColor,
        textMain,
        textSecondary,
    };

    const handleChange =
        (key: (typeof COLOR_FIELDS)[number]['key']) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            setField(key, event.target.value);
        };

    const handleUseDefaults = useCallback(() => {
        setField('primary', DEFAULT_DARK_BOOKING_FORM_STYLES.primary);
        setField('bgMain', DEFAULT_DARK_BOOKING_FORM_STYLES.bgMain);
        setField('bgSecondary', DEFAULT_DARK_BOOKING_FORM_STYLES.bgSecondary);
        setField('borderColor', DEFAULT_DARK_BOOKING_FORM_STYLES.borderColor);
        setField('textMain', DEFAULT_DARK_BOOKING_FORM_STYLES.textMain);
        setField(
            'textSecondary',
            DEFAULT_DARK_BOOKING_FORM_STYLES.textSecondary,
        );
    }, [setField]);

    const handleClickNext = useCallback(() => {
        const trimmed = trimObj({
            primary,
            bgMain,
            bgSecondary,
            borderColor,
            textMain,
            textSecondary,
        });

        const parsed = step3Schema.safeParse(trimmed);
        if (!parsed.success) {
            return toast.error(
                parsed.error.issues[0]?.message ??
                    'Color must be a hex value (#RGB or #RRGGBB)',
            );
        }

        setField('primary', trimmed.primary);
        setField('bgMain', trimmed.bgMain);
        setField('bgSecondary', trimmed.bgSecondary);
        setField('borderColor', trimmed.borderColor);
        setField('textMain', trimmed.textMain);
        setField('textSecondary', trimmed.textSecondary);
        goToNextStep();
    }, [
        primary,
        bgMain,
        bgSecondary,
        borderColor,
        textMain,
        textSecondary,
        setField,
        goToNextStep,
    ]);

    return (
        <FormWizardLayout
            stepNumber={3}
            title="Choose booking form colors"
            description="Set the color palette for the public booking form. Use hex values like #RGB or #RRGGBB for primary, backgrounds, border, and text."
            onEnterComplete={handleClickNext}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleClickNext}
                    >
                        Go to next
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={handleUseDefaults}
                    >
                        Use defaults
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                    >
                        Back
                    </Button>
                </div>
            }
        >
            {COLOR_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className={styles.colorField}>
                    <Input
                        label={label}
                        id={`step3-styles-${key}`}
                        className={styles.colorFieldInput}
                        value={values[key]}
                        onChange={handleChange(key)}
                        placeholder={placeholder}
                        autoFocus={key === 'primary'}
                    />
                    <ColorPicker
                        className={styles.colorPicker}
                        currentColor={values[key]}
                        setCurrentColor={(color) => setField(key, color)}
                        showValue={false}
                        aria-label={label}
                    />
                </div>
            ))}
        </FormWizardLayout>
    );
};
