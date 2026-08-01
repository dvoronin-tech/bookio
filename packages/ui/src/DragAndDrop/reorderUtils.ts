import type { ItemId } from './InternalReorderContext.js';

export const computeReorderedIds = (
    orderedIds: ItemId[],
    draggedId: ItemId,
    movedIds: ItemId[],
): ItemId[] => {
    if (movedIds.length === 0) return orderedIds;

    const anchorId = movedIds[movedIds.length - 1];
    const remaining = orderedIds.filter((id) => id !== draggedId);
    const anchorIndex = remaining.indexOf(anchorId);
    if (anchorIndex === -1) return orderedIds;

    const movedForward = orderedIds.indexOf(draggedId) < orderedIds.indexOf(anchorId);
    remaining.splice(movedForward ? anchorIndex + 1 : anchorIndex, 0, draggedId);
    return remaining;
};
