export const getDataKeys = <T extends Record<string, unknown>[]>(data: T) => {
    const keys = new Set<string>();

    for (const booking of data) {
        const bookingData = booking.data;

        if (bookingData && !Array.isArray(bookingData)) {
            for (const [key] of Object.entries(bookingData)) {
                keys.add(key);
            }
        }
    }

    return [...keys].sort();
};
