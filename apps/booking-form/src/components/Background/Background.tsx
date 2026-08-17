import { useEffect, type FC } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from 'motion/react';
import { clsx } from 'clsx';
import styles from './Background.module.scss';

const POINTER_RANGE = 80;

const APPEAR_EASE = [0.16, 1, 0.3, 1] as const;

const ORBS = [
    {
        className: styles.orbTopRight,
        multiplier: 1,
        spring: { stiffness: 235, damping: 11, mass: 0.5 },
        appearDelay: 0.28,
    },
    {
        className: styles.orbCenterLeft,
        multiplier: 4,
        spring: { stiffness: 260, damping: 16, mass: 0.7 },
        appearDelay: 0.12,
    },
    {
        className: styles.orbBottom,
        multiplier: 0.8,
        spring: { stiffness: 300, damping: 12, mass: 1.2 },
        appearDelay: 0,
    },
] as const;

type OrbProps = (typeof ORBS)[number] & {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    shouldReduceMotion: boolean | null;
};

const Orb: FC<OrbProps> = ({
    className,
    multiplier,
    spring,
    appearDelay,
    mouseX,
    mouseY,
    shouldReduceMotion,
}) => {
    const targetX = useTransform(mouseX, (value) => value * POINTER_RANGE * multiplier);
    const targetY = useTransform(mouseY, (value) => value * POINTER_RANGE * multiplier);
    const x = useSpring(targetX, spring);
    const y = useSpring(targetY, spring);

    return (
        <motion.span
            className={`${styles.orb} ${className}`}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.45, y: '40vh' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
                shouldReduceMotion
                    ? { duration: 0 }
                    : {
                          delay: appearDelay,
                          ease: APPEAR_EASE,
                          opacity: { duration: 1.4, delay: appearDelay, ease: 'easeOut' },
                          scale: { duration: 1.9, delay: appearDelay },
                          y: { duration: 2.1, delay: appearDelay },
                      }
            }
        >
            <motion.span className={styles.orbBlob} style={{ x, y }} />
        </motion.span>
    );
};

interface BackgroundProps {
    className?: string;
}

export const Background: FC<BackgroundProps> = ({ className }) => {
    const shouldReduceMotion = useReducedMotion();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        if (shouldReduceMotion) {
            return;
        }

        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

        if (!finePointer.matches) {
            return;
        }

        const onPointerMove = (event: PointerEvent) => {
            mouseX.set((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2 || 1));
            mouseY.set((event.clientY - window.innerHeight / 2) / (window.innerHeight / 2 || 1));
        };

        const onPointerLeave = () => {
            mouseX.set(0);
            mouseY.set(0);
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        };
    }, [mouseX, mouseY, shouldReduceMotion]);

    return (
        <div className={clsx(styles.background, className)} aria-hidden>
            {ORBS.map((orb) => (
                <Orb
                    key={orb.className}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    shouldReduceMotion={shouldReduceMotion}
                    {...orb}
                />
            ))}
        </div>
    );
};
