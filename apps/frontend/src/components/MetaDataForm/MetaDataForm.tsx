import type { EntireBookingFormType } from '#api/bookingForms/getEntireBookingFormById';
import { useBookingFormConfiguratorStore } from '#store/useBookingFormConfiguratorStore';
import { Button, Input } from '@bookio/ui';
import { memo, type FC, useEffect, type ChangeEvent, useCallback, useState, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { AdditionalMetaField } from './AdditionalMetaField/AdditionalMetaField';
import { META_PROPERTIES } from './metaProperties';

import styles from './MetaDataForm.module.scss';

interface MetaDataFormProps {
    bookingFormId: string;
    metaData: EntireBookingFormType['metaData'];
}

interface AdditionalMetaRow {
    id: string;
    property: string;
    value: string;
}

const createAdditionalMetaRow = (property = '', value = ''): AdditionalMetaRow => ({
    id: crypto.randomUUID(),
    property,
    value,
});

const rowsToAdditionalMetaData = (rows: AdditionalMetaRow[]): Record<string, string> =>
    Object.fromEntries(rows.filter((row) => row.property).map((row) => [row.property, row.value]));

export const MetaDataForm: FC<MetaDataFormProps> = memo(({ bookingFormId, metaData }) => {
    const { bookingFormMeta, setBookingFormMeta } = useBookingFormConfiguratorStore(
        useShallow(({ bookingFormMeta, setBookingFormMeta }) => ({
            bookingFormMeta,
            setBookingFormMeta,
        })),
    );

    const [additionalMetaRows, setAdditionalMetaRows] = useState<AdditionalMetaRow[]>([]);

    useEffect(() => {
        if (bookingFormMeta?.bookingFormId === bookingFormId) return;
        if (!metaData) return;

        const rows = Object.entries(metaData.additionalMetaData ?? {}).map(([property, value]) =>
            createAdditionalMetaRow(property, value),
        );

        setAdditionalMetaRows(rows);
        setBookingFormMeta({
            bookingFormId,
            title: metaData.title,
            description: metaData.description,
            additionalMetaData: metaData.additionalMetaData ?? {},
        });
    }, [bookingFormId, metaData, bookingFormMeta, setBookingFormMeta]);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!bookingFormMeta) return;

            setBookingFormMeta({
                ...bookingFormMeta,
                [name as keyof typeof bookingFormMeta]: value,
            });
        },
        [bookingFormMeta, setBookingFormMeta],
    );

    const syncAdditionalMetaData = useCallback(
        (rows: AdditionalMetaRow[]) => {
            if (!bookingFormMeta) return;

            setBookingFormMeta({
                ...bookingFormMeta,
                additionalMetaData: rowsToAdditionalMetaData(rows),
            });
        },
        [bookingFormMeta, setBookingFormMeta],
    );

    const handleAddAdditionalMetaField = useCallback(() => {
        setAdditionalMetaRows((prev) => [...prev, createAdditionalMetaRow()]);
    }, []);

    const handleRemoveAdditionalMetaField = useCallback(
        (rowId: string) => {
            setAdditionalMetaRows((prev) => {
                const next = prev.filter((row) => row.id !== rowId);
                syncAdditionalMetaData(next);
                return next;
            });
        },
        [syncAdditionalMetaData],
    );

    const handlePropertyChange = useCallback(
        (rowId: string, property: string) => {
            setAdditionalMetaRows((prev) => {
                const next = prev.map((row) => (row.id === rowId ? { ...row, property } : row));
                syncAdditionalMetaData(next);
                return next;
            });
        },
        [syncAdditionalMetaData],
    );

    const handleValueChange = useCallback(
        (rowId: string, value: string) => {
            setAdditionalMetaRows((prev) => {
                const next = prev.map((row) => (row.id === rowId ? { ...row, value } : row));
                syncAdditionalMetaData(next);
                return next;
            });
        },
        [syncAdditionalMetaData],
    );

    const optionsToRender = useMemo(() => {
        return META_PROPERTIES.filter(
            (option) => !additionalMetaRows.some((row) => row.property === option.value),
        );
    }, [additionalMetaRows]);

    if (!bookingFormId || !bookingFormMeta) {
        return null;
    }

    return (
        <section className={styles.metaDataForm}>
            <Input
                label="Title"
                className={styles.input}
                value={bookingFormMeta.title}
                onChange={handleChange}
                name="title"
            />
            <Input
                label="Description"
                type="textarea"
                className={styles.textarea}
                value={bookingFormMeta.description}
                onChange={handleChange}
                name="description"
            />
            <span className={styles.additionalMetaFieldsLabel}>Additional meta fields</span>
            <div className={styles.additionalMetaFields}>
                {additionalMetaRows.map((row) => (
                    <AdditionalMetaField
                        key={row.id}
                        id={row.id}
                        property={row.property}
                        value={row.value}
                        options={optionsToRender}
                        onPropertyChange={handlePropertyChange}
                        onValueChange={handleValueChange}
                        onRemove={handleRemoveAdditionalMetaField}
                    />
                ))}
            </div>
            <Button
                variant="primary-outlined"
                className={styles.addButton}
                onClick={handleAddAdditionalMetaField}
            >
                Add meta field
            </Button>
        </section>
    );
});
