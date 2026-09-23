export const readBookingDataValue = (
    bookingData: unknown,
    key: string,
): unknown => {
    if (
        !bookingData ||
        typeof bookingData !== 'object' ||
        Array.isArray(bookingData)
    ) {
        return null;
    }

    return (bookingData as Record<string, unknown>)[key] ?? null;
};
