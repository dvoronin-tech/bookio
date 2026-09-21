import type { ReactTable } from '@tanstack/react-table';
import { type AnalyticTableFeatures } from '#components/AnalyticTable/utils/analyticTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import ArrowIcon from '#assets/icons/short-arrow.svg?react';
import type { FC } from 'react';
import clsx from 'clsx';
import styles from './THead.module.scss';

interface THeadProps {
    table: ReactTable<AnalyticTableFeatures, BookingItem>;
}

export const THead: FC<THeadProps> = ({ table }) => {
    return (
        <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort();
                        const isSorted = header.column.getIsSorted();

                        return (
                            <th key={header.id} className={styles.headerCell}>
                                {header.isPlaceholder ? null : canSort ? (
                                    <div
                                        className={styles.sortableHeader}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <table.FlexRender header={header} />
                                        <ArrowIcon
                                            className={clsx(
                                                styles.sortIcon,
                                                isSorted === 'asc' &&
                                                    styles.asc,
                                                isSorted === 'desc' &&
                                                    styles.desc,
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <table.FlexRender header={header} />
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};
