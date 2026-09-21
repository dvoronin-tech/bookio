import {
    createPaginatedRowModel,
    rowPaginationFeature,
    tableFeatures,
} from '@tanstack/react-table';

const analyticTableFeatures = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
});

export type AnalyticTableFeatures = typeof analyticTableFeatures;

export default analyticTableFeatures;
