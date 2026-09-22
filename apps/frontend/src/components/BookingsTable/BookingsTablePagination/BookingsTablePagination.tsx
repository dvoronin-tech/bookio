import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingItem } from '#api/bookings/getOrganizationBookings.ts';
import { type FC, useCallback } from 'react';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import styles from './BookingsTablePagination.module.scss';

const PAGE_SIZE_OPTIONS: SelectDropdownOption[] = [20, 50, 100];

interface BookingsTablePaginationProps {
    table: ReactTable<BookingsTableFeatures, BookingItem>;
}

export const BookingsTablePagination: FC<BookingsTablePaginationProps> = ({
    table,
}) => {
    const { pageIndex, pageSize } = table.state.pagination;
    const pageCount = table.getPageCount();
    const totalRows = table.options.data.length;

    const handlePageSizeChange = useCallback(
        (option: SelectDropdownOption) => {
            table.setPageSize(Number(option));
        },
        [table],
    );

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
                <div className={styles.pageSizeSelect}>
                    <SelectDropdown
                        options={PAGE_SIZE_OPTIONS}
                        selected={pageSize}
                        onOptionClick={handlePageSizeChange}
                        placeholder="Page size"
                        highlightSelected
                        triggerClassName={styles.pageSizeTrigger}
                    />
                </div>
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
