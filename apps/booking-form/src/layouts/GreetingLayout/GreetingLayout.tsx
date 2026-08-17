import { memo, type FC } from 'react';
import { Background } from '#/components/Background/Background';
import ArrowIcon from '#/assets/icons/short-arrow.svg?react';
import styles from './GreetingLayout.module.scss';

interface GreetingLayoutProps extends GreetingHeroProps {}

export const GreetingLayout: FC<GreetingLayoutProps> = ({ name, description }) => {
    return (
        <div className={styles.layout}>
            <div className={styles.content}>
                <GreetingHero name={name} description={description} />
                <button type="button" className={styles.cta}>
                    Book now
                    <ArrowIcon className={styles.ctaIcon} aria-hidden />
                </button>
                <GreetingFooter />
            </div>
            <Background />
        </div>
    );
};

interface GreetingHeroProps {
    name: string;
    description: string | null;
}

const GreetingHero: FC<GreetingHeroProps> = memo(({ name, description }) => {
    return (
        <div className={styles.hero}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.description}>{description}</p>
        </div>
    );
});

const GreetingFooter: FC = memo(() => {
    return (
        <div className={styles.credit}>
            <span className={styles.creditMark} aria-hidden>
                B
            </span>
            <span className={styles.creditText}>Powered by Bookio</span>
        </div>
    );
});
