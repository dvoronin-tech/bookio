import styles from './AnalyticTable.module.scss';
import { THead } from '#components/AnalyticTable/THead/THead.tsx';
import { TBody } from '#components/AnalyticTable/TBody/TBody.tsx';
import type { ReactTable } from '@tanstack/react-table';
import type { AnalyticTableFeatures } from '#components/AnalyticTable/utils/analyticTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import type { FC } from 'react';

interface AnalyticTableProps {
    table: ReactTable<AnalyticTableFeatures, BookingItem>;
}

export const AnalyticTable: FC<AnalyticTableProps> = ({ table }) => {
    const tableWidth = table.getTotalSize();

    return (
        <table
            className={styles.table}
            style={{ width: '100%', minWidth: tableWidth }}
        >
            <THead table={table} />
            <TBody table={table} />
        </table>
    );
};
