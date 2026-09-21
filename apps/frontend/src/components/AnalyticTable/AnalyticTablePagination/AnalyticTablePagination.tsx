import type { ReactTable } from '@tanstack/react-table';
import type { AnalyticTableFeatures } from '#components/AnalyticTable/utils/analyticTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import type { FC } from 'react';
import styles from './AnalyticTablePagination.module.scss';

interface AnalyticTablePaginationProps {
    table: ReactTable<AnalyticTableFeatures, BookingItem>;
}

export const AnalyticTablePagination: FC<AnalyticTablePaginationProps> = ({
    table,
}) => {
    const { pageIndex, pageSize } = table.state.pagination;
    const pageCount = table.getPageCount();
    const totalRows = table.options.data.length;

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
                <span>
                    Page <strong>{pageIndex + 1}</strong> of{' '}
                    <strong>{Math.max(pageCount, 1)}</strong>
                </span>
                <span>
                    ({totalRows} total{' '}
                    {totalRows === 1 ? 'booking' : 'bookings'})
                </span>
                <select
                    className={styles.pageSizeSelect}
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.paginationControls}>
                <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    «
                </button>
                <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    ‹ Prev
                </button>
                <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next ›
                </button>
                <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    »
                </button>
            </div>
        </div>
    );
};
