import { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { EMERGENCY_SLAS } from '../../data/content';

const SLIDES = [
    { id: 'estado', label: 'Estado de elevadores', value: 'Operativo', tone: '#3ddc97', note: 'Todos los equipos en servicio' },
    { id: 'preventivo', label: 'Mantenimiento preventivo', value: 'Registrado', tone: '#8ab8ff', note: 'Informe disponible en HTL Panel' },
    { id: 'emergencia', label: 'Emergencias 24/7', value: EMERGENCY_SLAS[0].value, tone: '#ff7a6e', note: EMERGENCY_SLAS[0].label },
];
const HOLD = 4800; // ms each message stays on screen

const clock = () => new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

/**
 * The lobby's information screen: a dark steel totem with a lit LCD that rotates building notices.
 * Type is sized in container units, so the screen keeps its proportions at any size of the wall.
 */
export default function HallDisplay({ className = '' }) {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [time, setTime] = useState(clock);
    const slide = SLIDES[index];

    useEffect(() => {
        if (reduce) return undefined;
        const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), HOLD);
        return () => clearInterval(id);
    }, [reduce]);

    useEffect(() => {
        const id = setInterval(() => setTime(clock()), 20000);
        return () => clearInterval(id);
    }, []);

    return (
        <figure aria-label="Pantalla informativa del hall" className={`@container relative aspect-[5/8] ${className}`}>
            {/* The light the screen throws on the wall around it. */}
            <div aria-hidden="true" className="absolute -inset-[10%] rounded-[20%] bg-[#7fb0ff]/[0.13] blur-3xl" />

            {/* Steel frame */}
            <div
                className="relative flex h-full flex-col rounded-[3.5cqw] p-[3.2cqw] pb-0 shadow-[0_30px_50px_-24px_rgb(0_0_0/0.75),inset_0_1px_0_rgb(255_255_255/0.22),inset_0_0_0_1px_rgb(255_255_255/0.06)]"
                style={{
                    backgroundColor: '#1a1c20',
                    backgroundImage:
                        'repeating-linear-gradient(90deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 3px), linear-gradient(160deg, #3a3e45 0%, #1c1e22 38%, #0e0f11 100%)',
                }}
            >
                {/* LCD */}
                <div className="relative flex-1 overflow-hidden rounded-[1.4cqw] bg-[#05070b] text-white shadow-[0_0_0_1px_rgb(0_0_0/0.9),0_0_3.5cqw_rgb(127_176_255/0.38),inset_0_0_9cqw_rgb(60_110_200/0.18)]">
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgb(70_120_210/0.28),transparent_70%)]" />

                    <div aria-hidden="true" className="relative flex h-full flex-col p-[6cqw]">
                        <div className="flex items-baseline justify-between border-b border-white/15 pb-[3.5cqw] font-montserrat">
                            <p className="text-[4.4cqw] font-light tracking-[0.02em]">
                                <span className="font-extrabold">HTL</span> Smart Building
                            </p>
                            <p className="tabular text-[4.4cqw] font-medium text-white/70">{time}</p>
                        </div>

                        <div className="relative flex-1">
                            <AnimatePresence mode="wait" initial={false}>
                                <Motion.div
                                    key={slide.id}
                                    className="absolute inset-0 flex flex-col justify-center font-montserrat"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                                    exit={{ opacity: 0, y: -6, transition: { duration: 0.35, ease: 'easeIn' } }}
                                >
                                    <p className="text-[3.9cqw] font-semibold uppercase tracking-[0.14em] text-white/60">{slide.label}</p>
                                    <p className="mt-[3cqw] flex items-center gap-[3cqw] text-[12.5cqw] font-extrabold leading-none tracking-tight">
                                        <span
                                            className="h-[3.4cqw] w-[3.4cqw] shrink-0 rounded-full"
                                            style={{ background: slide.tone, boxShadow: `0 0 4cqw ${slide.tone}` }}
                                        />
                                        {slide.value}
                                    </p>
                                    <p className="mt-[4cqw] text-[4.6cqw] font-normal leading-snug text-white/75">{slide.note}</p>
                                </Motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-[2cqw]">
                            {SLIDES.map((s, i) => (
                                <span key={s.id} className={`h-[0.9cqw] flex-1 rounded-full transition-colors duration-500 ${i === index ? 'bg-white/85' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Glass: a soft diagonal reflection and the faint line structure of the panel. */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.09)_0%,transparent_32%)]" />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]" />
                </div>

                {/* Chin: the maker's mark and the power lamp. */}
                <div aria-hidden="true" className="flex h-[9cqw] shrink-0 items-center justify-between px-[1.5cqw]">
                    <span className="font-montserrat text-[2.9cqw] font-semibold uppercase tracking-[0.3em] text-white/45">HTL Elevadores</span>
                    <span className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-[#3ddc97] shadow-[0_0_2cqw_#3ddc97]" />
                </div>
            </div>
        </figure>
    );
}
