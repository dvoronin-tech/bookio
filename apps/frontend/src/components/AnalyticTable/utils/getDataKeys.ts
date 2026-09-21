export const getDataKeys = <T extends Record<string, unknown>[]>(
    data: T,
): (keyof T)[] => {
    const keys = new Set<keyof T>();

    for (const booking of data) {
        const bookingData = booking.data;

        if (bookingData && !Array.isArray(bookingData)) {
            for (const [key] of Object.entries(bookingData)) {
                keys.add(key as keyof T);
            }
        }
    }

    return [...keys].sort();
};
