import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';

/** Swaps images the way the hero opens: the new one parts from the centre like a pair of doors. */
export default function DoorImage({ src, alt, size, imageKey, className = '', imgClassName = '' }) {
    const reduce = useReducedMotion();
    return (
        <div className={`relative overflow-hidden bg-raised ${className}`}>
            <AnimatePresence initial={false}>
                <Motion.img
                    key={imageKey ?? src}
                    src={src}
                    alt={alt}
                    width={size?.[0]}
                    height={size?.[1]}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
                    initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 50% 0 50%)' }}
                    animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0%)' }}
                    exit={{ opacity: 0.999, transition: { duration: 0.55 } }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
            </AnimatePresence>
        </div>
    );
}
