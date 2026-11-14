import { colorSections } from '#components/BookingFormStyles/bookingFormStyles.constants';
import { m } from '../../../paraglide/messages.js';
import { useBookingFormStyles } from '#components/BookingFormStyles/hooks/useBookingFormStyles';
import { StyleColorField } from '#components/BookingFormStyles/StyleColorField/StyleColorField';
import { StyleColorGroup } from '#components/BookingFormStyles/StyleColorGroup/StyleColorGroup';
import { ThemeCard } from '#components/BookingFormStyles/ThemeCard/ThemeCard';
import type { FC } from 'react';
import { configuratorRouteApi } from '#lib/routeApis';

import styles from './StylesTabForm.module.scss';

export const StylesTabForm: FC = () => {
    const { bookingFormId } = configuratorRouteApi.useParams();
    const { theme, colors, handleThemeChange, handleColorChange } = useBookingFormStyles({
        bookingFormId,
    });

    return (
        <div className={styles.stylesTabForm}>
            <div className={styles.themesSection}>
                <span className={styles.themesLabel}>{m.styles_theme()}</span>
                <div className={styles.themesRow}>
                    <ThemeCard
                        name={m.theme_custom()}
                        variant="custom"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                    <ThemeCard
                        name={m.theme_dark()}
                        variant="dark"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                    <ThemeCard
                        name={m.theme_light()}
                        variant="light"
                        selected={theme}
                        onClick={handleThemeChange}
                    />
                </div>
            </div>

            <div className={styles.colorsSection}>
                <span className={styles.colorsLabel}>{m.styles_colors()}</span>
                {colorSections().map(({ heading, fields }) => (
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
