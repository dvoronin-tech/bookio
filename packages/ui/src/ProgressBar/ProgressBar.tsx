import { clsx } from 'clsx';
import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import Point, { type ProgressBarPoint } from './Point.js';
import Segments, { type ProgressBarSegment } from './Segments.js';
import styles from './ProgressBar.module.scss';

export type ProgressBarProps = {
    minValue: number;
    maxValue: number;
    currentValues: [number, ...number[]] | number[];
    onChange: (values: number[]) => void;
    step?: number;
    disabled?: boolean;
    className?: string;
    autoUpdate?: boolean;
    'aria-label'?: string;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function calculatePercent(value: number, minValue: number, maxValue: number): number {
    if (maxValue <= minValue) {
        return 0;
    }
    const clamped = clamp(value, minValue, maxValue);
    return ((clamped - minValue) / (maxValue - minValue)) * 100;
}

function ProgressBar({
    minValue,
    maxValue,
    currentValues: controlledValues,
    onChange,
    step = 1,
    disabled = false,
    className,
    autoUpdate = true,
    'aria-label': ariaLabel = 'Progress bar',
}: ProgressBarProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
    const [values, setValues] = useState<number[]>(controlledValues);

    const points = useMemo<ProgressBarPoint[]>(() => {
        return values.map((value) => ({
            value,
            percent: calculatePercent(value, minValue, maxValue),
        }));
    }, [minValue, maxValue, values]);

    const activeIndex = activeDragIndex ?? hoveredIndex;

    const segments = useMemo<ProgressBarSegment[]>(() => {
        if (points.length === 0) {
            return [];
        }

        if (points.length <= 1) {
            return points.length === 1
                ? [{ left: 0, width: points[0].percent, isActive: activeIndex === 0 }]
                : [];
        }

        const result: ProgressBarSegment[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            const left = points[i].percent;
            const width = Math.max(0, points[i + 1].percent - left);
            const isActive = activeIndex === i || activeIndex === i + 1;

            result.push({ left, width, isActive });
        }

        return result;
    }, [points, activeIndex]);

    const getValueFromClientX = useCallback(
        (clientX: number, index: number, currentVals: number[]): number => {
            const track = trackRef.current;
            if (!track || maxValue <= minValue) return currentVals[index] ?? minValue;

            const rect = track.getBoundingClientRect();
            if (rect.width === 0) return currentVals[index] ?? minValue;

            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            const raw = minValue + ratio * (maxValue - minValue);

            let stepped = raw;
            if (step > 0) {
                stepped = minValue + Math.round((raw - minValue) / step) * step;
                const decimals = step.toString().split('.')[1]?.length ?? 0;
                stepped = Number(stepped.toFixed(decimals));
            }

            const rawMin = index === 0 ? minValue : (currentVals[index - 1] ?? minValue);
            const rawMax =
                index === currentVals.length - 1 ? maxValue : (currentVals[index + 1] ?? maxValue);

            const minBound = Math.min(rawMin, rawMax);
            const maxBound = Math.max(rawMin, rawMax);

            return Math.min(maxBound, Math.max(minBound, stepped));
        },
        [minValue, maxValue, step],
    );

    const updatePointValue = useCallback(
        (index: number, nextVal: number, commit = autoUpdate) => {
            if (values[index] === nextVal) return;

            const nextValues = [...values];
            nextValues[index] = clamp(nextVal, minValue, maxValue);
            setValues(nextValues);
            if (commit) {
                onChange(nextValues);
            }
        },
        [onChange, values],
    );

    // Global pointer move and pointer up listeners during active dragging
    useEffect(() => {
        if (activeDragIndex === null) return;

        const handlePointerMove = (event: globalThis.PointerEvent) => {
            const nextVal = getValueFromClientX(event.clientX, activeDragIndex, values);
            updatePointValue(activeDragIndex, nextVal);
        };

        const handlePointerUp = () => {
            onChange(values);
            setActiveDragIndex(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [activeDragIndex, getValueFromClientX, onChange, updatePointValue, values]);

    const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled || values.length === 0 || maxValue <= minValue) return;
        const track = trackRef.current;
        if (!track) return;

        const rect = track.getBoundingClientRect();
        if (rect.width === 0) return;

        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const clickValue = minValue + ratio * (maxValue - minValue);

        // Find closest point index
        let closestIndex = 0;
        let minDiff = Infinity;

        for (let i = 0; i < values.length; i++) {
            const val = values[i] ?? minValue;
            const diff = Math.abs(val - clickValue);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }

        const nextVal = getValueFromClientX(event.clientX, closestIndex, values);
        updatePointValue(closestIndex, nextVal);
        setActiveDragIndex(closestIndex);
        setHoveredIndex(closestIndex);
    };

    return (
        <div
            className={clsx(styles.root, disabled && styles.disabled, className)}
            role="group"
            aria-label={ariaLabel}
        >
            <div ref={trackRef} className={styles.track} onPointerDown={handleTrackPointerDown}>
                <div className={styles.trackInner}>
                    <Segments segments={segments} />
                </div>
                <div className={styles.pointsOverlay}>
                    {points.map((point, index) => (
                        <Point
                            key={index}
                            index={index}
                            point={point}
                            values={values}
                            activeDragIndex={activeDragIndex}
                            setActiveDragIndex={setActiveDragIndex}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                            minValue={minValue}
                            maxValue={maxValue}
                            commitValue={updatePointValue}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(ProgressBar);
