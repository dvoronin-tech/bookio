import { useEffect, type FC } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from 'motion/react';
import styles from './Background.module.scss';

const POINTER_RANGE = 80;

const ORBS = [
    {
        className: styles.orbTopRight,
        multiplier: 1,
        spring: { stiffness: 235, damping: 11, mass: 0.5 },
    },
    {
        className: styles.orbCenterLeft,
        multiplier: 4,
        spring: { stiffness: 260, damping: 16, mass: 0.7 },
    },
    {
        className: styles.orbBottom,
        multiplier: 0.8,
        spring: { stiffness: 300, damping: 12, mass: 1.2 },
    },
] as const;

type OrbProps = (typeof ORBS)[number] & {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
};

const Orb: FC<OrbProps> = ({ className, multiplier, spring, mouseX, mouseY }) => {
    const targetX = useTransform(mouseX, (value) => value * POINTER_RANGE * multiplier);
    const targetY = useTransform(mouseY, (value) => value * POINTER_RANGE * multiplier);
    const x = useSpring(targetX, spring);
    const y = useSpring(targetY, spring);

    return <motion.span className={`${styles.orb} ${className}`} style={{ x, y }} />;
};

export const Background: FC = () => {
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
        <div className={styles.background} aria-hidden>
            {ORBS.map((orb) => (
                <Orb key={orb.className} mouseX={mouseX} mouseY={mouseY} {...orb} />
            ))}
        </div>
    );
};
