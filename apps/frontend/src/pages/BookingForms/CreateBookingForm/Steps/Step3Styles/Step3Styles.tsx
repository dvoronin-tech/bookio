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
import { m } from '#i18n/messages';

const COLOR_KEYS = [
    'primary',
    'bgMain',
    'bgSecondary',
    'borderColor',
    'textMain',
    'textSecondary',
] as const;

const colorLabel = (key: (typeof COLOR_KEYS)[number]) => {
    switch (key) {
        case 'primary':
            return m.color_primary();
        case 'bgMain':
            return m.color_bg_main();
        case 'bgSecondary':
            return m.color_bg_secondary();
        case 'borderColor':
            return m.color_border();
        case 'textMain':
            return m.color_text_main();
        case 'textSecondary':
            return m.color_text_secondary();
    }
};

const colorFields = () =>
    COLOR_KEYS.map((key) => {
        const label = colorLabel(key);
        return {
            key,
            label,
            placeholder: m.color_placeholder({
                label,
                value: DEFAULT_DARK_BOOKING_FORM_STYLES[key],
            }),
        };
    });

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

    const fields = colorFields();

    const handleChange =
        (key: (typeof COLOR_KEYS)[number]) =>
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
                parsed.error.issues[0]?.message ?? m.color_invalid(),
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
            title={m.step3_title()}
            description={m.step3_description()}
            onEnterComplete={handleClickNext}
            footer={
                <div className={styles.footerActions}>
                    <Button
                        type="button"
                        variant="primary-filled"
                        onClick={handleClickNext}
                    >
                        {m.wizard_next()}
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={handleUseDefaults}
                    >
                        {m.use_defaults()}
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={goToPreviousStep}
                    >
                        {m.back()}
                    </Button>
                </div>
            }
        >
            {fields.map(({ key, label, placeholder }) => (
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
