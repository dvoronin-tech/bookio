import type { EntireBookingFormType } from '#api/bookingForms/getEntireBookingFormById';
import { COLOR_SECTIONS } from '#components/BookingFormStyles/bookingFormStyles.constants';
import { useBookingFormStyles } from '#components/BookingFormStyles/hooks/useBookingFormStyles';
import { StyleColorField } from '#components/BookingFormStyles/StyleColorField/StyleColorField';
import { StyleColorGroup } from '#components/BookingFormStyles/StyleColorGroup/StyleColorGroup';
import { ThemeCard } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import type { FC } from 'react';

import styles from './StylesTabForm.module.scss';

interface StylesTabFormProps {
    bookingFormId: string;
    formStyles: EntireBookingFormType['styles'];
}

export const StylesTabForm: FC<StylesTabFormProps> = ({ bookingFormId, formStyles }) => {
    const { theme, colors, handleThemeChange, handleColorChange } = useBookingFormStyles({
        bookingFormId,
        formStyles,
    });

    if (!bookingFormId) {
        return null;
    }

    return (
        <div className={styles.stylesTabForm}>
            <div className={styles.themesSection}>
                <span className={styles.themesLabel}>Theme</span>
                <div className={styles.themesRow}>
                    <ThemeCard
                        name="Custom"
                        variant="custom"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                    <ThemeCard
                        name="Dark"
                        variant="dark"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                    <ThemeCard
                        name="Light"
                        variant="light"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                </div>
            </div>

            <div className={styles.colorsSection}>
                <span className={styles.colorsLabel}>Colors</span>
                {COLOR_SECTIONS.map(({ heading, fields }) => (
                    <StyleColorGroup key={heading} heading={heading}>
                        {fields.map(({ key, label }) => (
                            <StyleColorField
                                key={key}
                                id={`styles-tab-${key}`}
                                label={label}
                                value={colors[key]}
                                onChange={handleColorChange(key)}
                            />
                        ))}
                    </StyleColorGroup>
                ))}
            </div>
        </div>
    );
};
