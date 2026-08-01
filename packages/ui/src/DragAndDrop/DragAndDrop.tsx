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

interface ReorderProps extends HTMLAttributes<HTMLDivElement> {
    axis: Axis;
    children: ReactNode;
}

type Direction = 'toUp' | 'toDown' | 'toLeft' | 'toRight';

const MOVE_TRIGGER_OFFSET = 20;

const SIBLING_SHIFT_TRANSITION = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
    toUp: 'toDown',
    toDown: 'toUp',
    toLeft: 'toRight',
    toRight: 'toLeft',
};

const Container: FC<ReorderProps> = ({ axis, children, ...props }) => {
    const directionRef = useRef<Direction | null>(null);
    const draggedItemRef = useRef<HTMLElement | null>(null);
    const itemsMapRef = useRef<ItemsMap>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartMouseRef = useRef({ x: 0, y: 0 });
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const dragStartRectRef = useRef<DOMRect | null>(null);
    const shiftDistanceRef = useRef(0);

    const [isDragging, setIsDragging] = useState(false);
    const movedIdsRef = useRef<ItemId[]>([]);
    const movedDirectionRef = useRef<Direction | null>(null);

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
            resetMovedIds();
            updateMovedIds();
        },
        [moveDraggedItem, setDirection, resetMovedIds, updateMovedIds],
    );

    const onDragStart = useCallback(
        (fieldId: string, e: ReactPointerEvent<HTMLElement>) => {
            const itemRef = itemsMapRef.current.get(fieldId)?.current;
            if (!itemRef) return;
            draggedItemRef.current = itemRef;
            dragStartMouseRef.current = { x: e.clientX, y: e.clientY };
            lastPointerRef.current = { x: e.clientX, y: e.clientY };
            dragStartRectRef.current = itemRef.getBoundingClientRect();
            directionRef.current = null;
            movedIdsRef.current = [];
            movedDirectionRef.current = null;

            // Shift distance is fixed per drag: dragged item size + container gap.
            const container = containerRef.current;
            const gap = container
                ? parseFloat(
                      getComputedStyle(container)[axis === 'y' ? 'rowGap' : 'columnGap'],
                  ) || 0
                : 0;
            shiftDistanceRef.current =
                (axis === 'y'
                    ? dragStartRectRef.current.height
                    : dragStartRectRef.current.width) + gap;

            itemRef.onpointermove = handlePointerMove;
            itemRef.style.zIndex = '1000';
            setIsDragging(true);
        },
        [axis, handlePointerMove],
    );

    const onDragEnd = useCallback(() => {
        const draggedItem = draggedItemRef.current;
        if (!draggedItem) return;

        movedIdsRef.current.forEach(resetSiblingShift);

        draggedItem.style.transform = 'translate(0px, 0px)';
        draggedItem.style.transition = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';
        draggedItem.style.zIndex = 'auto';
        draggedItem.onpointermove = null;
        draggedItemRef.current = null;
        dragStartMouseRef.current = { x: 0, y: 0 };
        lastPointerRef.current = { x: 0, y: 0 };
        directionRef.current = null;
        movedIdsRef.current = [];
        movedDirectionRef.current = null;
        shiftDistanceRef.current = 0;
        setIsDragging(false);
    }, [resetSiblingShift]);

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
