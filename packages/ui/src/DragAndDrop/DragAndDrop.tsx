import type { FC, HTMLAttributes, ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    InternalReorderProvider,
    useInternalReorderContext,
    type Axis,
    type ItemId,
    type ItemsMap,
} from './InternalReorderContext.js';
import { ExternalReorderProvider } from './ExternalReorderContext.js';
import { computeReorderedIds } from './reorderUtils.js';

interface ReorderProps extends HTMLAttributes<HTMLDivElement> {
    axis: Axis;
    onReorder?: (orderedIds: ItemId[]) => void;
    /** Drop outside the container bounds: replaces reorder (e.g. pull a child out of a group). */
    onDropOut?: (draggedId: ItemId) => void;
    /** Which items accept a drop onto themselves for the current dragged item. */
    isDropTarget?: (draggedId: ItemId, targetId: ItemId) => boolean;
    /** Drop onto a hovered drop target: replaces reorder (e.g. put a field into a group). */
    onDropInto?: (draggedId: ItemId, targetId: ItemId) => void;
    children: ReactNode;
}

type Direction = 'toUp' | 'toDown' | 'toLeft' | 'toRight';

const MOVE_TRIGGER_OFFSET = 20;

/** Pointer must come back this deep into the container to cancel the dragged-out state. */
const DRAG_OUT_REENTER_MARGIN = 8;

const SIBLING_SHIFT_TRANSITION = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
    toUp: 'toDown',
    toDown: 'toUp',
    toLeft: 'toRight',
    toRight: 'toLeft',
};

const Container: FC<ReorderProps> = ({
    axis,
    onReorder,
    onDropOut,
    isDropTarget,
    onDropInto,
    children,
    ...props
}) => {
    const directionRef = useRef<Direction | null>(null);
    const draggedItemRef = useRef<HTMLElement | null>(null);
    const draggedItemIdRef = useRef<ItemId | null>(null);
    const itemsMapRef = useRef<ItemsMap>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartMouseRef = useRef({ x: 0, y: 0 });
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const dragStartRectRef = useRef<DOMRect | null>(null);
    const shiftDistanceRef = useRef(0);
    const gapRef = useRef(0);
    const movedIdsRef = useRef<ItemId[]>([]);
    const movedDirectionRef = useRef<Direction | null>(null);
    const settlingRef = useRef(false);
    const isDraggedOutRef = useRef(false);
    const hoveredDropTargetRef = useRef<ItemId | null>(null);

    const [isDragging, setIsDragging] = useState(false);

    const registerItem = useCallback((id: ItemId, ref: React.RefObject<HTMLElement | null>) => {
        itemsMapRef.current.set(id, ref);
    }, []);

    const unregisterItem = useCallback((id: ItemId) => {
        itemsMapRef.current.delete(id);
    }, []);

    const moveDraggedItem = useCallback(
        (deltaX: number, deltaY: number) => {
            if (!draggedItemRef.current) return;
            draggedItemRef.current.style.transform =
                axis === 'x'
                    ? `translate(${deltaX}px, ${deltaY / 10}px)`
                    : axis === 'y'
                      ? `translate(${deltaX / 10}px, ${deltaY}px)`
                      : `translate(${deltaX}px, ${deltaY}px)`;
        },
        [axis],
    );

    const applySiblingShift = useCallback((id: ItemId) => {
        const item = itemsMapRef.current.get(id)?.current;
        const stackDirection = movedDirectionRef.current;
        const distance = shiftDistanceRef.current;
        if (!item || !stackDirection || distance === 0) return;

        let transform: string;
        // Neighbors slide opposite to the stack direction to free the slot.
        if (stackDirection === 'toUp') transform = `translateY(${distance}px)`;
        else if (stackDirection === 'toDown') transform = `translateY(${-distance}px)`;
        else if (stackDirection === 'toLeft') transform = `translateX(${distance}px)`;
        else transform = `translateX(${-distance}px)`;

        item.style.transition = SIBLING_SHIFT_TRANSITION;
        item.style.transform = transform;
    }, []);

    const resetSiblingShift = useCallback((id: ItemId) => {
        const item = itemsMapRef.current.get(id)?.current;
        if (!item) return;
        item.style.transition = SIBLING_SHIFT_TRANSITION;
        item.style.transform = 'translate(0px, 0px)';
    }, []);

    // Direction follows the pointer's last movement, not offset from drag start.
    // Otherwise reverse motion above/left of the start never flips direction and pop never runs.
    const setDirection = useCallback(
        (moveX: number, moveY: number) => {
            let nextDirection: Direction | null = null;

            if (axis === 'x') {
                if (moveX > 0) nextDirection = 'toRight';
                else if (moveX < 0) nextDirection = 'toLeft';
            } else if (axis === 'y') {
                if (moveY > 0) nextDirection = 'toDown';
                else if (moveY < 0) nextDirection = 'toUp';
            }

            if (!nextDirection) return;
            directionRef.current = nextDirection;
        },
        [axis],
    );

    const updateMovedIds = useCallback(() => {
        const draggedItem = draggedItemRef.current;
        const direction = directionRef.current;
        if (!draggedItem || !direction) return;

        const stackDirection = movedDirectionRef.current;
        if (
            movedIdsRef.current.length > 0 &&
            stackDirection &&
            direction === OPPOSITE_DIRECTION[stackDirection]
        ) {
            const lastId = movedIdsRef.current[movedIdsRef.current.length - 1];
            const lastItem = itemsMapRef.current.get(lastId)?.current;
            if (!lastItem) return;

            const draggedRect = draggedItem.getBoundingClientRect();
            const lastRect = lastItem.getBoundingClientRect();

            let released: boolean;
            if (axis === 'y') {
                released =
                    direction === 'toDown'
                        ? draggedRect.bottom >= lastRect.bottom - MOVE_TRIGGER_OFFSET
                        : draggedRect.top <= lastRect.top + MOVE_TRIGGER_OFFSET;
            } else {
                released =
                    direction === 'toRight'
                        ? draggedRect.right >= lastRect.right - MOVE_TRIGGER_OFFSET
                        : draggedRect.left <= lastRect.left + MOVE_TRIGGER_OFFSET;
            }

            if (!released) return;

            movedIdsRef.current = movedIdsRef.current.slice(0, -1);
            resetSiblingShift(lastId);
            if (movedIdsRef.current.length === 0) {
                movedDirectionRef.current = null;
            }
            return;
        }

        const ids = [...itemsMapRef.current.keys()];
        const draggedIndex = ids.findIndex(
            (id) => itemsMapRef.current.get(id)?.current === draggedItem,
        );
        if (draggedIndex === -1) return;

        const step = direction === 'toUp' || direction === 'toLeft' ? -1 : 1;
        let neighborId: ItemId | undefined;
        for (let i = draggedIndex + step; i >= 0 && i < ids.length; i += step) {
            const candidateId = ids[i];
            if (!movedIdsRef.current.includes(candidateId)) {
                neighborId = candidateId;
                break;
            }
        }
        if (neighborId === undefined) return;

        // A hovered drop target stays in place: the drop goes into it, not before/after it.
        if (neighborId === hoveredDropTargetRef.current) return;

        const neighborItem = itemsMapRef.current.get(neighborId)?.current;
        if (!neighborItem) return;

        const draggedRect = draggedItem.getBoundingClientRect();
        const neighborRect = neighborItem.getBoundingClientRect();

        let touched: boolean;
        if (axis === 'y') {
            if (direction === 'toUp') {
                touched = draggedRect.top <= neighborRect.top + MOVE_TRIGGER_OFFSET;
            } else if (direction === 'toDown') {
                touched = draggedRect.bottom >= neighborRect.bottom - MOVE_TRIGGER_OFFSET;
            } else {
                return;
            }
        } else {
            if (direction === 'toLeft') {
                touched = draggedRect.left <= neighborRect.left + MOVE_TRIGGER_OFFSET;
            } else if (direction === 'toRight') {
                touched = draggedRect.right >= neighborRect.right - MOVE_TRIGGER_OFFSET;
            } else {
                return;
            }
        }

        if (!touched) return;

        if (movedIdsRef.current.length === 0) {
            movedDirectionRef.current = direction;
        }
        movedIdsRef.current = [...movedIdsRef.current, neighborId];
        applySiblingShift(neighborId);
    }, [axis, applySiblingShift]);

    const resetMovedIds = useCallback(() => {
        const draggedItem = draggedItemRef.current;
        const startRect = dragStartRectRef.current;
        if (!draggedItem || !startRect || movedIdsRef.current.length === 0) return;

        const hitbox = {
            top: startRect.top + MOVE_TRIGGER_OFFSET,
            bottom: startRect.bottom - MOVE_TRIGGER_OFFSET,
            left: startRect.left + MOVE_TRIGGER_OFFSET,
            right: startRect.right - MOVE_TRIGGER_OFFSET,
        };

        // Hitbox collapsed — start rect is smaller than 2 * OFFSET.
        if (hitbox.top >= hitbox.bottom || hitbox.left >= hitbox.right) return;

        const draggedRect = draggedItem.getBoundingClientRect();
        const touchesHitbox =
            draggedRect.left < hitbox.right &&
            draggedRect.right > hitbox.left &&
            draggedRect.top < hitbox.bottom &&
            draggedRect.bottom > hitbox.top;

        if (!touchesHitbox) return;

        movedIdsRef.current.forEach(resetSiblingShift);
        movedIdsRef.current = [];
        movedDirectionRef.current = null;
    }, [resetSiblingShift]);

    /** Highlights the drop target under the dragged item's center. A target that was
    already shifted snaps back, since dropping now means "into it", not a reorder. */
    const updateDropTargetHover = useCallback(() => {
        if (!isDropTarget) return;
        const draggedItem = draggedItemRef.current;
        const draggedId = draggedItemIdRef.current;
        if (!draggedItem || draggedId === null) return;

        const draggedRect = draggedItem.getBoundingClientRect();
        const centerX = draggedRect.left + draggedRect.width / 2;
        const centerY = draggedRect.top + draggedRect.height / 2;

        let hovered: ItemId | null = null;
        for (const [id, ref] of itemsMapRef.current) {
            if (id === draggedId || !isDropTarget(draggedId, id)) continue;
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) continue;
            if (
                centerX >= rect.left &&
                centerX <= rect.right &&
                centerY >= rect.top &&
                centerY <= rect.bottom
            ) {
                hovered = id;
                break;
            }
        }

        if (hovered === hoveredDropTargetRef.current) return;

        if (hoveredDropTargetRef.current !== null) {
            const prev = itemsMapRef.current.get(hoveredDropTargetRef.current)?.current;
            if (prev) delete prev.dataset.dropTargetHover;
        }
        hoveredDropTargetRef.current = hovered;

        if (hovered !== null) {
            const el = itemsMapRef.current.get(hovered)?.current;
            if (el) el.dataset.dropTargetHover = 'true';
            if (movedIdsRef.current.includes(hovered)) {
                movedIdsRef.current = movedIdsRef.current.filter((id) => id !== hovered);
                resetSiblingShift(hovered);
                if (movedIdsRef.current.length === 0) {
                    movedDirectionRef.current = null;
                }
            }
        }
    }, [isDropTarget, resetSiblingShift]);

    /** Tracks whether the pointer left the container. Re-entry requires a small
    margin to avoid flickering at the boundary. Shifted siblings stay in place
    while outside — they pop back on re-entry or are released on drop-out. */
    const updateDraggedOut = useCallback(
        (x: number, y: number) => {
            if (!onDropOut) return;
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const wasOut = isDraggedOutRef.current;
            const out = wasOut
                ? !(
                      x >= rect.left + DRAG_OUT_REENTER_MARGIN &&
                      x <= rect.right - DRAG_OUT_REENTER_MARGIN &&
                      y >= rect.top + DRAG_OUT_REENTER_MARGIN &&
                      y <= rect.bottom - DRAG_OUT_REENTER_MARGIN
                  )
                : x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;

            if (out === wasOut) return;
            isDraggedOutRef.current = out;
            container.dataset.draggedOut = out ? 'true' : 'false';
        },
        [onDropOut],
    );

    const handlePointerMove = useCallback(
        (e: globalThis.PointerEvent) => {
            const { x: startX, y: startY } = dragStartMouseRef.current;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const moveX = e.clientX - lastPointerRef.current.x;
            const moveY = e.clientY - lastPointerRef.current.y;
            lastPointerRef.current = { x: e.clientX, y: e.clientY };

            moveDraggedItem(deltaX, deltaY);
            setDirection(moveX, moveY);
            updateDropTargetHover();
            updateDraggedOut(e.clientX, e.clientY);
            if (!isDraggedOutRef.current) {
                resetMovedIds();
                updateMovedIds();
            }
        },
        [
            moveDraggedItem,
            setDirection,
            updateDropTargetHover,
            updateDraggedOut,
            resetMovedIds,
            updateMovedIds,
        ],
    );

    const onDragStart = useCallback(
        (fieldId: string, e: ReactPointerEvent<HTMLElement>) => {
            if (draggedItemRef.current) return;
            const itemRef = itemsMapRef.current.get(fieldId)?.current;
            if (!itemRef) return;
            draggedItemRef.current = itemRef;
            draggedItemIdRef.current = fieldId;
            dragStartMouseRef.current = { x: e.clientX, y: e.clientY };
            lastPointerRef.current = { x: e.clientX, y: e.clientY };
            dragStartRectRef.current = itemRef.getBoundingClientRect();
            directionRef.current = null;
            movedIdsRef.current = [];
            movedDirectionRef.current = null;
            isDraggedOutRef.current = false;
            hoveredDropTargetRef.current = null;

            // Shift distance is fixed per drag: dragged item size + container gap.
            const container = containerRef.current;
            const gap = container
                ? parseFloat(getComputedStyle(container)[axis === 'y' ? 'rowGap' : 'columnGap']) ||
                  0
                : 0;
            shiftDistanceRef.current =
                (axis === 'y' ? dragStartRectRef.current.height : dragStartRectRef.current.width) +
                gap;
            gapRef.current = gap;

            if (container && isDropTarget) {
                const canDropInto = [...itemsMapRef.current.keys()].some(
                    (id) => id !== fieldId && isDropTarget(fieldId, id),
                );
                container.dataset.canDropInto = canDropInto ? 'true' : 'false';
            }

            itemRef.onpointermove = handlePointerMove;
            itemRef.style.zIndex = '1000';
            itemRef.dataset.dragging = 'true';
            setIsDragging(true);
        },
        [axis, handlePointerMove, isDropTarget],
    );

    /** Releases sibling shifts when the dragged item leaves the list for good
    (drop-out / drop-into). Siblings the dragged item passed already sit in the
    slots that collapse onto them, so an instant clear keeps them visually in
    place; siblings on the opposite side slide back with a transition. */
    const releaseSiblingShifts = useCallback(() => {
        const stackDirection = movedDirectionRef.current;
        const slideBack = stackDirection === 'toUp' || stackDirection === 'toLeft';
        movedIdsRef.current.forEach((id) => {
            const item = itemsMapRef.current.get(id)?.current;
            if (!item) return;
            item.style.transition = slideBack ? SIBLING_SHIFT_TRANSITION : 'none';
            item.style.transform = 'translate(0px, 0px)';
        });
    }, []);

    const resetDragState = useCallback((draggedItem: HTMLElement) => {
        draggedItem.style.zIndex = 'auto';
        delete draggedItem.dataset.dragging;
        draggedItem.onpointermove = null;

        if (hoveredDropTargetRef.current !== null) {
            const el = itemsMapRef.current.get(hoveredDropTargetRef.current)?.current;
            if (el) delete el.dataset.dropTargetHover;
            hoveredDropTargetRef.current = null;
        }
        const container = containerRef.current;
        if (container) {
            delete container.dataset.draggedOut;
            delete container.dataset.canDropInto;
        }
        isDraggedOutRef.current = false;

        draggedItemRef.current = null;
        draggedItemIdRef.current = null;
        dragStartMouseRef.current = { x: 0, y: 0 };
        lastPointerRef.current = { x: 0, y: 0 };
        directionRef.current = null;
        movedIdsRef.current = [];
        movedDirectionRef.current = null;
        shiftDistanceRef.current = 0;
        gapRef.current = 0;
        setIsDragging(false);
    }, []);

    /** Slides the dragged item into its final slot, then commits the reorder and
    clears all transforms without animation. Sibling shifts already match the
    new layout exactly, so an instant clear keeps every item visually in place. */
    const settleDraggedItem = useCallback(
        (draggedItem: HTMLElement, draggedId: ItemId, movedIds: ItemId[]) => {
            if (!onReorder) return;

            draggedItem.onpointermove = null;
            settlingRef.current = true;

            // Final offset is the total size of passed neighbors (not the dragged
            // item's own size) plus one gap per neighbor.
            const neighborsSize = movedIds.reduce<number>((sum, id) => {
                const rect = itemsMapRef.current.get(id)?.current?.getBoundingClientRect();
                return rect ? sum + (axis === 'y' ? rect.height : rect.width) : sum;
            }, 0);
            const direction = movedDirectionRef.current;
            const sign = direction === 'toUp' || direction === 'toLeft' ? -1 : 1;
            const target = sign * (neighborsSize + gapRef.current * movedIds.length);

            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                draggedItem.removeEventListener('transitionend', handleTransitionEnd);
                window.clearTimeout(fallbackId);

                const nextOrderedIds = computeReorderedIds(
                    [...itemsMapRef.current.keys()],
                    draggedId,
                    movedIds,
                );
                // React reorders DOM nodes without re-registering refs, so resync
                // the map order to the committed order before the next drag.
                const nextItemsMap: ItemsMap = new Map();
                nextOrderedIds.forEach((id) => {
                    const ref = itemsMapRef.current.get(id);
                    if (ref) nextItemsMap.set(id, ref);
                });
                itemsMapRef.current = nextItemsMap;

                onReorder(nextOrderedIds);

                movedIds.forEach((id) => {
                    const item = itemsMapRef.current.get(id)?.current;
                    if (!item) return;
                    item.style.transition = 'none';
                    item.style.transform = 'translate(0px, 0px)';
                });
                draggedItem.style.transition = 'none';
                draggedItem.style.transform = 'translate(0px, 0px)';

                settlingRef.current = false;
                resetDragState(draggedItem);
            };
            const handleTransitionEnd = (e: TransitionEvent) => {
                if (e.target !== draggedItem || e.propertyName !== 'transform') return;
                finish();
            };

            draggedItem.addEventListener('transitionend', handleTransitionEnd);
            const fallbackId = window.setTimeout(finish, 300);

            draggedItem.style.transition = SIBLING_SHIFT_TRANSITION;
            draggedItem.style.transform =
                axis === 'y' ? `translate(0px, ${target}px)` : `translate(${target}px, 0px)`;
        },
        [axis, onReorder, resetDragState],
    );

    const onDragEnd = useCallback(() => {
        const draggedItem = draggedItemRef.current;
        if (!draggedItem || settlingRef.current) return;

        const draggedId = draggedItemIdRef.current;

        // Drop outside the container: consumer reparents the item, no reorder.
        if (draggedId !== null && onDropOut && isDraggedOutRef.current) {
            onDropOut(draggedId);
            releaseSiblingShifts();
            resetDragState(draggedItem);
            return;
        }

        // Drop onto a hovered target: consumer reparents the item, no reorder.
        const dropTargetId = hoveredDropTargetRef.current;
        if (draggedId !== null && onDropInto && dropTargetId !== null) {
            onDropInto(draggedId, dropTargetId);
            releaseSiblingShifts();
            resetDragState(draggedItem);
            return;
        }

        if (onReorder && draggedId !== null && movedIdsRef.current.length > 0) {
            settleDraggedItem(draggedItem, draggedId, [...movedIdsRef.current]);
            return;
        }

        movedIdsRef.current.forEach(resetSiblingShift);

        draggedItem.style.transform = 'translate(0px, 0px)';
        draggedItem.style.transition = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';
        resetDragState(draggedItem);
    }, [
        onReorder,
        onDropOut,
        onDropInto,
        resetSiblingShift,
        releaseSiblingShifts,
        resetDragState,
        settleDraggedItem,
    ]);

    /** Drag end listener. */
    useEffect(() => {
        if (!isDragging) return;
        const abort = new AbortController();

        const handlePointerUp = () => {
            onDragEnd();
        };

        document.addEventListener('pointerup', handlePointerUp, { signal: abort.signal });
        document.addEventListener('pointercancel', handlePointerUp, { signal: abort.signal });

        return () => abort.abort();
    }, [isDragging, onDragEnd]);

    return (
        <ExternalReorderProvider onDragStart={onDragStart}>
            <InternalReorderProvider
                axis={axis}
                containerRef={containerRef}
                registerItem={registerItem}
                unregisterItem={unregisterItem}
            >
                <div ref={containerRef} {...props}>
                    {children}
                </div>
            </InternalReorderProvider>
        </ExternalReorderProvider>
    );
};

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    itemId: ItemId;
    children: React.ReactNode;
}

const Item: FC<ItemProps> = memo(({ children, itemId, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { registerItem, unregisterItem } = useInternalReorderContext();

    useLayoutEffect(() => {
        registerItem(itemId, ref);
        return () => unregisterItem(itemId);
    }, [itemId, registerItem, unregisterItem]);

    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
});

export const Reorder = Object.assign(Container, { Item });
