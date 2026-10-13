import { useRef } from 'react';
import { motion as Motion, useInView, useReducedMotion } from 'framer-motion';
import FloorHeader from '../ui/FloorHeader';
import { AROMA_DEVICES } from '../../data/content';

const MAX = Math.max(...AROMA_DEVICES.map((d) => d.volume));
const fmt = new Intl.NumberFormat('es-PE');

export default function Aroma() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.35 });
    const reduce = useReducedMotion();

    return (
        <section id="ambientes" aria-labelledby="ambientes-title" className="border-y border-line bg-surface">
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
                <FloorHeader code="5" id="ambientes-title" title="El ambiente también se mantiene">
                    Sistemas de dosificación programables para halls, cabinas y pasillos. Cuatro equipos, del aerosol para espacios pequeños a la microdifusión para grandes volúmenes.
                </FloorHeader>

                {/* Bars share one linear scale, so the gap between 50 and 3,000 m³ reads true. */}
                <ol ref={ref} className="mt-14 border-t border-line">
                    {AROMA_DEVICES.map((d, i) => (
                        <li key={d.name} className="grid gap-x-8 gap-y-4 border-b border-line py-6 md:grid-cols-[7rem_13rem_1fr] md:items-center">
                            <div className="w-32 md:w-full">
                                <img src={d.image} alt={d.alt} width={d.size[0]} height={d.size[1]} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-contain" />
                            </div>
                            <div>
                                <h3 className="lettering text-3xl md:text-4xl">{d.name}</h3>
                                <p className="mt-1 text-muted">{d.tech}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 flex-1">
                                    <Motion.div
                                        className="h-full origin-left bg-brand"
                                        style={{ width: `max(6px, ${(d.volume / MAX) * 100}%)` }}
                                        initial={reduce ? false : { scaleX: 0 }}
                                        animate={inView || reduce ? { scaleX: 1 } : { scaleX: 0 }}
                                        transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                                <p className="w-36 shrink-0 text-right leading-tight">
                                    <span className="lettering tabular block text-3xl">{fmt.format(d.volume)}</span>
                                    <span className="text-sm text-muted">m³, cobertura máxima</span>
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
                <p className="mt-4 text-sm text-muted">Cobertura máxima de cada equipo, en una misma escala.</p>
            </div>
        </section>
    );
}
