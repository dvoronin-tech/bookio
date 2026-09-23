import type { ReactTable } from '@tanstack/react-table';
import type { BookingsTableFeatures } from '#components/BookingsTable/bookingsTableFeatures.ts';
import type { BookingByIdItem } from '#api/bookings/getBookingsById.ts';
import { type FC, useEffect } from 'react';
import clsx from 'clsx';
import styles from './THead.module.scss';

interface THeadProps {
    table: ReactTable<BookingsTableFeatures, BookingByIdItem>;
}

export const THead: FC<THeadProps> = ({ table }) => {
    const isResizingColumn = table.state.columnResizing.isResizingColumn;

    useEffect(() => {
        if (!isResizingColumn) return;

        const { style } = document.body;
        const previousCursor = style.cursor;
        const previousUserSelect = style.userSelect;
        style.cursor = 'col-resize';
        style.userSelect = 'none';

        return () => {
            style.cursor = previousCursor;
            style.userSelect = previousUserSelect;
        };
    }, [isResizingColumn]);

    return (
        <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        const resizeHandler = header.getResizeHandler();

                        return (
                            <th
                                key={header.id}
                                className={clsx(
                                    styles.headerCell,
                                    header.column.getIsResizing() &&
                                        styles.isResizingTh,
                                )}
                                style={{
                                    width: header.getSize(),
                                }}
                            >
                                {header.isPlaceholder ? null : (
                                    <table.FlexRender header={header} />
                                )}
                                {header.column.getCanResize() && (
                                    <div
                                        role="separator"
                                        aria-orientation="vertical"
                                        aria-label="Resize column"
                                        className={clsx(
                                            styles.resizer,
                                            header.column.getIsResizing() &&
                                                styles.isResizing,
                                        )}
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            resizeHandler(event);
                                        }}
                                        onTouchStart={resizeHandler}
                                        onDoubleClick={() => {
                                            header.column.resetSize();
                                        }}
                                    />
                                )}
                            </th>
                        );
                    })}
                </tr>
            ))}
        </thead>
    );
};
