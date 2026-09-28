export const filterByIsActive = <T extends { isActive: boolean }>(
    items: T[],
): T[] => items.filter((item) => item.isActive);
