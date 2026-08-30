import { clsx } from 'clsx';
import {
    memo,
    type ChangeEvent,
    type FC,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    useState,
    useRef,
} from 'react';
import Input from '../Input/Input.js';
import styles from './ProgressBar.module.scss';
import { useOutsideClick } from '../hooks/useOutsideClick.js';

export type ProgressBarPoint = {
    value: number;
    percent: number;
};

interface PointProps {
    point: ProgressBarPoint;
    activeDragIndex: number | null;
    hoveredIndex: number | null;
    minValue: number;
    maxValue: number;
    values: number[];
    index: number;
    disabled: boolean;
    setActiveDragIndex: (index: number | null) => void;
    setHoveredIndex: (index: number | null) => void;
    commitValue: (index: number, value: number) => void;
}

const Point: FC<PointProps> = ({
    point,
    activeDragIndex,
    hoveredIndex,
    minValue,
    maxValue,
    values,
    index,
    disabled,
    setActiveDragIndex,
    setHoveredIndex,
    commitValue,
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const isDragging = activeDragIndex === index;
    const isHovered = hoveredIndex === index;
    const showTooltip = isDragging || isHovered || editingIndex === index;
    const rawMin = index === 0 ? minValue : (values[index - 1] ?? minValue);
    const rawMax = index === values.length - 1 ? maxValue : (values[index + 1] ?? maxValue);
    const minBound = Math.min(rawMin, rawMax);
    const maxBound = Math.max(rawMin, rawMax);

    const handlePointPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        event.stopPropagation();
        event.preventDefault();
        setActiveDragIndex(index);
        setHoveredIndex(index);
    };

    const handleMouseEnter = () => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const handleFocus = () => {
        setHoveredIndex(index);
    };

    const handleBlur = () => {
        setHoveredIndex(null);
    };

    const handleDoubleClick = () => {
        setEditingIndex(index);
    };

    return (
        <div
            className={clsx(
                styles.pointWrapper,
                isHovered && styles.hovered,
                isDragging && styles.active,
            )}
            style={{ left: `${point.percent}%` }}
        >
            <div
                className={clsx(styles.point, isDragging && styles.dragging)}
                tabIndex={disabled ? -1 : 0}
                role="slider"
                aria-valuemin={minBound}
                aria-valuemax={maxBound}
                aria-valuenow={point.value}
                aria-label={`Point ${index + 1}`}
                onPointerDown={handlePointPointerDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onDoubleClick={handleDoubleClick}
            >
                <span className={styles.dot} />
                {showTooltip && (
                    <Tooltip
                        value={point.value}
                        index={index}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        commitValue={commitValue}
                    />
                )}
            </div>
        </div>
    );
};

interface TooltipProps {
    value: number;
    index: number;
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    commitValue: (index: number, value: number) => void;
}

const Tooltip: FC<TooltipProps> = memo(
    ({ value, index, editingIndex, setEditingIndex, commitValue }) => {
        const [newValue, setNewValue] = useState(String(value));
        const [wasEditing, setWasEditing] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);
        const isEditing = editingIndex === index;

        if (isEditing && !wasEditing) {
            setWasEditing(true);
            setNewValue(String(value));
        } else if (!isEditing && wasEditing) {
            setWasEditing(false);
        }

        useOutsideClick(inputRef, () => {
            commitValue(index, Number(newValue));
            setEditingIndex(null);
        });

        if (isEditing) {
            const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                setNewValue(event.target.value);
            };

            const handleBlur = () => {
                setEditingIndex(null);
            };

            const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    commitValue(index, Number(newValue));
                    setEditingIndex(null);
                }
            };

            return (
                <Input
                    className={clsx(styles.tooltip)}
                    value={newValue}
                    style={{ width: `${String(newValue).length}ch` }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    type="number"
                    ref={inputRef}
                />
            );
        }

        return (
            <div className={clsx(styles.tooltip)} aria-hidden>
                {value}
            </div>
        );
    },
);

export default memo(Point);
