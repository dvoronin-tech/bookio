import {
    columnResizingFeature,
    columnSizingFeature,
    createPaginatedRowModel,
    rowPaginationFeature,
    tableFeatures,
} from '@tanstack/react-table';

const bookingsTableFeatures = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
    columnSizingFeature,
    columnResizingFeature,
});

export type BookingsTableFeatures = typeof bookingsTableFeatures;

export default bookingsTableFeatures;
