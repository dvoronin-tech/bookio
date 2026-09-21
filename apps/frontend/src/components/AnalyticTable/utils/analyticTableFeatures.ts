import {
    columnSizingFeature,
    createPaginatedRowModel,
    rowPaginationFeature,
    tableFeatures,
} from '@tanstack/react-table';

const analyticTableFeatures = tableFeatures({
    rowPaginationFeature,
    columnSizingFeature,
    paginatedRowModel: createPaginatedRowModel(),
});

export type AnalyticTableFeatures = typeof analyticTableFeatures;

export default analyticTableFeatures;
