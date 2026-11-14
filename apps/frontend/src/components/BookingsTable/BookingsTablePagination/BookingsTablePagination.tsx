import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import { type FC, useCallback } from 'react';
import { SelectDropdown, type SelectDropdownOption } from '@bookio/ui';
import styles from './BookingsTablePagination.module.scss';
import { plural } from '#i18n/locale';
import { m } from '../../../paraglide/messages.js';

const PAGE_SIZE_OPTIONS: SelectDropdownOption[] = [20, 50, 100];

interface BookingsTablePaginationProps {
    table: ReactTable<BookingsTableFeatures, BookingByIdItem>;
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
                    {m.table_page({
                        page: pageIndex + 1,
                        pages: Math.max(pageCount, 1),
                    })}
                </span>
                <span>
                    {plural(totalRows, {
                        one: m.table_total_one({ count: totalRows }),
                        few: m.table_total_few({ count: totalRows }),
                        many: m.table_total_many({ count: totalRows }),
                    })}
                </span>
                <div className={styles.pageSizeSelect}>
                    <SelectDropdown
                        options={PAGE_SIZE_OPTIONS}
                        selected={pageSize}
                        onOptionClick={handlePageSizeChange}
                        placeholder={m.table_page_size()}
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
                    {m.table_prev()}
                </button>
                <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {m.table_next()}
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
