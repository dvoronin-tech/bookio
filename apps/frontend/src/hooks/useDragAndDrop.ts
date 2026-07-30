import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type DragAndDropSettings = {
    axis: 'x' | 'y' | 'both';
};

type UseDragAndDropProps<T> = {
    items: T[];
    onReorder: (items: T[]) => void;
    settings?: DragAndDropSettings;
};

const DEFAULT_SETTINGS: DragAndDropSettings = {
    axis: 'both',
};

export const useDragAndDrop = <T>({
    items,
    onReorder,
    settings = DEFAULT_SETTINGS,
}: UseDragAndDropProps<T>) => {
    const draggedItemRef = useRef<HTMLDivElement | null>(null);
    const dragStartMouseRef = useRef({ x: 0, y: 0 });

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);
    const [draggingType, setDraggingType] = useState<string | null>(null);

    const { axis } = settings;

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
            }

            dragStartMouseRef.current = { x: clientX, y: clientY };
        },
        [],
    );

    const onDragEnd = useCallback(() => {
        setIsDragging(false);
        setDraggingId(null);
        setDraggingType(null);
        setHoverTargetId(null);

        if (draggedItemRef.current !== null) {
            draggedItemRef.current.style.cssText = '';
            draggedItemRef.current.style.transition = 'transform 0.2s cubic-bezier(.08,.84,.4,1.2)';
        }

        draggedItemRef.current = null;
    }, []);

    useEffect(() => {
        if (!isDragging || draggedItemRef.current === null) return;

        const handlePointerMove = (e: PointerEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const deltaX = mouseX - dragStartMouseRef.current.x;
            const deltaY = mouseY - dragStartMouseRef.current.y;

            // I have already checked that draggedItemRef.current is not null
            draggedItemRef.current!.style.transform =
                axis === 'x'
                    ? `translate(${deltaX}px, ${deltaY / 10}px)`
                    : axis === 'y'
                      ? `translate(${deltaX / 10}px, ${deltaY}px)`
                      : `translate(${deltaX}px, ${deltaY}px)`;

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
        };

        document.addEventListener('pointermove', handlePointerMove);

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
        };
    }, [
        axis,
        isDragging,
    ]);

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