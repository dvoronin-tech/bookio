import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Stack } from '#utils/stack';

export interface OnDragEndProps {
    draggingId: string | null;
    direction: Direction | null;
    movedIds: string[];
    hoverTargetId: string | null;
}

type UseDragAndDropProps = {
    items: string[]
    axis?: 'x' | 'y';
    containerRef: React.RefObject<HTMLDivElement | null>;
    onDrop: (props: OnDragEndProps) => void;
};

type Direction = 'toUp' | 'toDown' | 'toLeft' | 'toRight';

export const useDragAndDrop = ({ axis = 'y', containerRef, onDrop }: UseDragAndDropProps) => {
    const draggedItemRef = useRef<HTMLDivElement | null>(null);
    const dragStartMouseRef = useRef({ x: 0, y: 0 });
    const dragStartRectRef = useRef<DOMRect | null>(null);
    const directionRef = useRef<Direction | null>(null);
    const movedStack = useRef<Stack<string>>(new Stack());

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);
    const [draggingType, setDraggingType] = useState<string | null>(null);

    /** Map of field ids to their corresponding elements. */
    const fieldRefsMap = useMemo(() => {
        const elements = document.querySelectorAll<HTMLDivElement>('[data-field-id]');
        const map = new Map<string, HTMLDivElement>();

        elements.forEach((el) => {
            if (!el.dataset.fieldId) return;
            map.set(el.dataset.fieldId, el);
        });

        return map;
    }, []);

    /** Drag start handler */
    const onDragStart = useCallback(
        (
            id: string,
            ref: RefObject<HTMLDivElement | null>,
            clientX: number,
            clientY: number,
            type: string,
        ) => {
            setIsDragging(true);
            setDraggingId(id);
            setDraggingType(type);

            if (ref.current !== null) {
                draggedItemRef.current = ref.current;
                ref.current.style.cssText = 'transition: none; pointer-events: none; z-index: 2;';
                dragStartRectRef.current = ref.current.getBoundingClientRect();
            }

            dragStartMouseRef.current = { x: clientX, y: clientY };
        },
        [],
    );

    /** Drag end handler */
    const onDragEnd = useCallback(() => {
        setIsDragging(false);
        setDraggingId(null);
        setDraggingType(null);
        setHoverTargetId(null);

        if (draggedItemRef.current !== null) {
            draggedItemRef.current.style.cssText = '';
            draggedItemRef.current.style.transition = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';
        }

        onDrop({
            draggingId,
            direction: directionRef.current,
            movedIds: movedStack.current.getStack(),
            hoverTargetId,
        }); 

        draggedItemRef.current = null;
        movedStack.current.clear();
        fieldRefsMap.forEach((el) => (el.style.transform = ''));
    }, [fieldRefsMap, onDrop, draggingId, directionRef, movedStack, hoverTargetId]);

    /** Set group id which is hovered by the mouse while dragging. */
    const setGroupId = useCallback((mouseX: number, mouseY: number) => {
        let nextHoverId: string | null = null;

        for (const element of document.elementsFromPoint(mouseX, mouseY)) {
            if (!(element instanceof HTMLElement)) continue;

            const fieldElement = element.closest<HTMLElement>('[data-field-id]');
            if (fieldElement?.dataset.fieldId) {
                nextHoverId = fieldElement.dataset.fieldId;
                break;
            }
        }

        setHoverTargetId((prev) => (prev === nextHoverId ? prev : nextHoverId));
    }, []);

    /** Handle element movement while dragging. */
    const handleElementMovementWhileDragging = useCallback(
        (mouseX: number, mouseY: number) => {
            if (draggedItemRef.current === null) return;
            const deltaX = mouseX - dragStartMouseRef.current.x;
            const deltaY = mouseY - dragStartMouseRef.current.y;

            draggedItemRef.current.style.transform =
                axis === 'x'
                    ? `translate(${deltaX}px, ${deltaY / 10}px)`
                    : axis === 'y'
                      ? `translate(${deltaX / 10}px, ${deltaY}px)`
                      : `translate(${deltaX}px, ${deltaY}px)`;
        },
        [axis],
    );

    /** Set the movement direction of a field. */
    const setDirection = useCallback(() => {
        if (!dragStartRectRef.current || !draggedItemRef.current) return;
        const { top: startTop, left: startLeft } = dragStartRectRef.current;
        const { top: draggedTop, left: draggedLeft } =
            draggedItemRef.current.getBoundingClientRect();

        if (startTop > draggedTop) {
            directionRef.current = 'toUp';
        } else if (startTop < draggedTop) {
            directionRef.current = 'toDown';
        } else if (startLeft > draggedLeft) {
            directionRef.current = 'toRight';
        } else if (startLeft < draggedLeft) {
            directionRef.current = 'toLeft';
        }
    }, []);

    /** Add a field id to the stack if it's the next field in the direction of the drag. */
    const setStack = useCallback(
        (
            hoverFieldId: string,
            { draggedCenterX, draggedCenterY, hoverCenterX, hoverCenterY }: Record<string, number>,
        ) => {
            const direction = directionRef.current;
            const stack = movedStack.current;

            if (
                (draggedCenterY < hoverCenterY && direction === 'toUp') ||
                (draggedCenterY > hoverCenterY && direction === 'toDown') ||
                (draggedCenterX > hoverCenterX && direction === 'toRight') ||
                (draggedCenterX < hoverCenterX && direction === 'toLeft')
            ) {
                stack.push(hoverFieldId);
            }
        },
        [],
    );

    /** Remove a field id from the stack if it's not the next field in the direction of the drag. */
    const popStack = useCallback(
        ({
            draggedCenterX,
            draggedCenterY,
            hoverCenterX,
            hoverCenterY,
        }: Record<string, number>) => {
            const stack = movedStack.current;
            const direction = directionRef.current;

            if (
                (draggedCenterY > hoverCenterY && direction === 'toUp') ||
                (draggedCenterY < hoverCenterY && direction === 'toDown') ||
                (draggedCenterX < hoverCenterX && direction === 'toRight') ||
                (draggedCenterX > hoverCenterX && direction === 'toLeft')
            ) {
                const popId = stack.peek();
                const element = fieldRefsMap.get(popId);
                if (!element) return;
                element.style.transform = '';
                stack.pop();
            }
        },
        [fieldRefsMap],
    );

    /** Get the gap between the fields in the container. */
    const getContainerGap = useCallback(() => {
        const container = containerRef.current;
        if (!container) return 0;

        const styles = getComputedStyle(container);
        return parseInt(styles.gap);
    }, [containerRef]);

    /** Update the stack of field ids based on the current drag position. */
    const updateStack = useCallback(() => {
        if (draggingId === null) return;
        const draggedElement = fieldRefsMap.get(draggingId);
        console.log(fieldRefsMap);
        if (!draggedElement) return;
        
        const {
            left: draggedLeft,
            right: draggedRight,
            top: draggedTop,
            bottom: draggedBottom,
        } = draggedElement.getBoundingClientRect();
        const draggedCenterX = (draggedLeft + draggedRight) / 2;
        const draggedCenterY = (draggedTop + draggedBottom) / 2;
        
        const hoverField = document
        .elementFromPoint(draggedCenterX, draggedCenterY)
        ?.closest<HTMLElement>('[data-field-id]');
        const hoverFieldId = hoverField?.dataset.fieldId;

        setDirection();
        const stack = movedStack.current;
        console.log(stack.peek(), hoverFieldId);
        if (hoverField && hoverFieldId) {
            const {
                left: hoverLeft,
                right: hoverRight,
                top: hoverTop,
                bottom: hoverBottom,
            } = hoverField.getBoundingClientRect();

            const hoverCenterX = (hoverLeft + hoverRight) / 2;
            const hoverCenterY = (hoverTop + hoverBottom) / 2;
            if (stack.peek() !== hoverFieldId) {
                setStack(hoverFieldId, {
                    draggedCenterX,
                    draggedCenterY,
                    hoverCenterX,
                    hoverCenterY,
                });
            } else {
                popStack({ draggedCenterX, draggedCenterY, hoverCenterX, hoverCenterY });
            }
        }
    }, [draggingId, fieldRefsMap, setDirection, setStack, popStack]);

    /** Reset the stack of field ids if the dragged element is back in the direction of the drag. */
    const resetStackOnBackDragged = useCallback(() => {
        const stack = movedStack.current;
        const startRect = dragStartRectRef.current;
        const draggedElement = draggedItemRef.current;
        const direction = directionRef.current;
        const OFFSET = 30;
        if (!startRect || !draggedElement) return;

        const {
            top: startTop,
            left: startLeft,
            bottom: startBottom,
            right: startRight,
        } = startRect;
        const {
            top: draggedTop,
            left: draggedLeft,
            bottom: draggedBottom,
            right: draggedRight,
        } = draggedElement.getBoundingClientRect();

        if (
            (draggedBottom > startTop + OFFSET && direction === 'toUp') ||
            (draggedTop < startBottom - OFFSET && direction === 'toDown') ||
            (draggedLeft < startRight - OFFSET && direction === 'toRight') ||
            (draggedRight > startLeft + OFFSET && direction === 'toLeft')
        ) {
            stack.clear();
            fieldRefsMap.forEach((el) => {
                if (el.dataset.fieldId === draggingId) return;
                el.style.transform = '';
            });
        }
    }, [fieldRefsMap, draggingId]);

    /** Move the fields near the dragged element based on the stack. */
    const moveNearElements = useCallback(() => {
        const stackContent = movedStack.current.getStack();
        const draggedElement = draggedItemRef.current;
        if (!draggedElement) return;

        stackContent.forEach((id) => {
            const field = fieldRefsMap.get(id);
            if (!field) return;
            const direction = directionRef.current;
            const { height, width } = draggedElement.getBoundingClientRect();
            const containerGap = getContainerGap();

            if (direction === 'toUp') {
                field.style.transform = `translateY(${height + containerGap}px)`;
            } else if (direction === 'toDown') {
                field.style.transform = `translateY(-${height + containerGap}px)`;
            } else if (direction === 'toLeft') {
                field.style.transform = `translateX(-${width + containerGap}px)`;
            } else if (direction === 'toRight') {
                field.style.transform = `translateX(${width + containerGap}px)`;
            }
        });
    }, [fieldRefsMap, getContainerGap]);

    /** Handle the pointer move event. */
    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            handleElementMovementWhileDragging(mouseX, mouseY);
            setGroupId(mouseX, mouseY);
            updateStack();
            resetStackOnBackDragged();
            moveNearElements();
        },
        [
            handleElementMovementWhileDragging,
            setGroupId,
            updateStack,
            resetStackOnBackDragged,
            moveNearElements,
        ],
    );

    /** Drag move listener. */
    useEffect(() => {
        const abort = new AbortController();
        if (isDragging) {
            document.addEventListener('pointermove', handlePointerMove, { signal: abort.signal });
        } else {
            abort.abort();
        }

        return () => {
            abort.abort();
        };
    }, [handlePointerMove, isDragging]);

    /** Drag end listener. */
    useEffect(() => {
        if (draggingId === null) return;
        const abort = new AbortController();

        const handlePointerUp = () => {
            onDragEnd();
        };

        window.addEventListener('pointerup', handlePointerUp, { signal: abort.signal });
        window.addEventListener('pointercancel', handlePointerUp, { signal: abort.signal });

        return () => {
            abort.abort();
        };
    }, [draggingId, onDragEnd]);

    return {
        onDragStart,
        onDragEnd,
        isDragging,
        draggingId,
        draggingType,
        hoverTargetId,
    };
};

export type UseDragAndDropReturn = ReturnType<typeof useDragAndDrop>;
