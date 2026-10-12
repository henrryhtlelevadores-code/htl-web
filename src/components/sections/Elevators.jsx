import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import FloorHeader from '../ui/FloorHeader';
import DoorImage from '../ui/DoorImage';
import ChevronsUp from '../ui/ChevronsUp';
import CircleCheck from '../ui/CircleCheck';
import emergencia from '../../assets/brochure/emergencia.jpg';
import { BRANDS, EMERGENCY_SLAS, SERVICES } from '../../data/content';

const Points = ({ points }) => (
    <ul className="grid gap-3">
        {points.map((p) => (
            <li key={p} className="flex gap-3 leading-snug">
                <CircleCheck className="mt-0.5 h-5 w-5 text-accent" />
                <span>{p}</span>
            </li>
        ))}
    </ul>
);

// Rides to the visit form, which reads the service from the navigation state and preselects it.
const RequestLink = ({ service, className = '' }) => (
    <Link to={{ pathname: '/', hash: '#visita' }} state={{ servicio: service.option }} className={`btn-call btn-call--icon whitespace-nowrap ${className}`}>
        <ChevronsUp /> Solicitar este servicio
    </Link>
);

// Fetched and decoded while the call intro plays, so a service never opens on an empty frame.
// Kept at module level so the decoded images are not collected before they are shown.
const preloaded = [];
const preloadServiceImages = () => {
    if (preloaded.length) return;
    SERVICES.forEach((s) => {
        const img = new Image();
        img.fetchPriority = 'low'; // behind the lobby scene, which the visitor sees first
        img.src = s.image;
        img.decode?.().catch(() => {});
        preloaded.push(img);
    });
};

export default function Elevators() {
    const [active, setActive] = useState(SERVICES[0].id);
    const reduce = useReducedMotion();
    const current = SERVICES.find((s) => s.id === active);

    useEffect(preloadServiceImages, []);

    return (
        <section id="ascensores" aria-labelledby="ascensores-title" className="bg-ground">
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
                <FloorHeader code="2" id="ascensores-title" title="Atendemos el ascensor que usted ya tiene">
                    Aplicamos el mantenimiento que el fabricante diseñó para la marca y el modelo de su equipo, desde la revisión mensual hasta la modernización completa.
                </FloorHeader>

                <ul aria-label="Marcas que atendemos" className="mt-12 flex flex-wrap gap-x-7 gap-y-2 border-y border-line py-6 md:gap-x-10">
                    {BRANDS.map((b) => {
                        const hoverStyle = b.gradient
                            ? { backgroundImage: b.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
                            : { color: b.color };
                        return (
                            <li key={b.name} className="group relative">
                                <span className="lettering text-3xl text-muted md:text-5xl">{b.name}</span>
                                <span
                                    aria-hidden="true"
                                    style={hoverStyle}
                                    className="lettering brand-lit pointer-events-none absolute inset-0 text-3xl transition-opacity duration-300 md:text-5xl"
                                >
                                    {b.name}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <p className="mt-3 text-sm text-muted">Las marcas mencionadas pertenecen a sus respectivos titulares.</p>

                {/* Emergency comes first: it is the call nobody plans to make. */}
                <div className="mt-14 grid overflow-hidden bg-brand text-on-brand md:grid-cols-[minmax(0,0.8fr)_1fr]">
                    <img
                        src={emergencia}
                        alt="Técnico de emergencias de HTL ayudando a una pasajera a salir de la cabina"
                        loading="lazy"
                        decoding="async"
                        className="h-64 w-full scale-[1.03] object-cover object-[50%_30%] md:h-full md:max-h-[30rem]"
                    />
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                        <h3 className="lettering text-4xl md:text-5xl">Personas atrapadas o falla técnica</h3>
                        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-on-brand-muted">
                            Respuesta de emergencia las 24 horas, los 365 días del año, con rescate profesional y el objetivo de devolver el equipo a la operación cuanto antes.
                        </p>

                        <div className="mt-6">
                            <p className="label text-on-brand-muted">SLA garantizado para clientes con contrato vigente</p>
                            <dl className="mt-3 border-t border-white/25">
                                {EMERGENCY_SLAS.map((s) => (
                                    <div key={s.label} className="flex items-baseline justify-between gap-6 border-b border-white/25 py-3.5">
                                        <dt className="text-[0.95rem] font-medium leading-snug">{s.label}</dt>
                                        <dd className="lettering tabular whitespace-nowrap text-2xl text-on-brand md:text-4xl">{s.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
                    <div>
                        <h3 className="lettering text-3xl md:text-4xl">Servicios para su equipo</h3>
                        <ul className="mt-6 border-t border-line">
                            {SERVICES.map((s) => {
                                const isActive = s.id === active;
                                return (
                                    <li key={s.id} className="border-b border-line">
                                        <button
                                            type="button"
                                            onClick={() => setActive(s.id)}
                                            onMouseEnter={() => window.matchMedia('(hover: hover) and (min-width: 1024px)').matches && setActive(s.id)}
                                            aria-expanded={isActive}
                                            aria-controls={`servicio-${s.id}`}
                                            className={`group relative flex w-full items-center gap-4 py-4 pl-4 pr-3 text-left transition-colors duration-300 ${isActive ? 'bg-[color-mix(in_srgb,var(--led)_7%,transparent)]' : ''}`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`absolute inset-y-0 left-0 w-[3px] origin-center bg-led shadow-[0_0_12px_color-mix(in_srgb,var(--led)_55%,transparent)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                                            />
                                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-200 ${isActive ? 'bg-led shadow-[0_0_0_4px_color-mix(in_srgb,var(--led)_22%,transparent)]' : 'bg-line'}`} aria-hidden="true" />
                                            <span className="min-w-0 flex-1">
                                                <span className={`block text-lg font-semibold leading-tight transition-colors ${isActive ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>{s.name}</span>
                                                <span className="mt-1 block text-sm text-muted">{s.short}</span>
                                            </span>
                                            <Plus size={18} className={`shrink-0 text-muted transition-transform duration-300 lg:hidden ${isActive ? 'rotate-45' : ''}`} aria-hidden="true" />
                                        </button>

                                        {/* Phones and tablets open the detail in place. */}
                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <Motion.div
                                                    id={`servicio-${s.id}`}
                                                    className="overflow-hidden lg:hidden"
                                                    initial={reduce ? false : { height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <div className="grid gap-5 pb-6 pt-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:items-center sm:gap-7">
                                                        <img src={s.image} alt={s.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full bg-raised object-cover object-[50%_38%] sm:aspect-[4/5]" />
                                                        <div>
                                                            <Points points={s.points} />
                                                            <RequestLink service={s} className="mt-6 w-full sm:w-auto" />
                                                        </div>
                                                    </div>
                                                </Motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="mt-6 leading-relaxed text-muted">
                            ¿Un proyecto nuevo? También instalamos equipos desde cero conforme a la normativa.{' '}
                            <Link to={{ pathname: '/', hash: '#visita' }} className="inline-flex items-center gap-1 font-semibold text-ink underline">
                                Cuéntenos su proyecto <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </p>
                    </div>

                    {/* Desktop keeps one panel in view while the list changes it. */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] xl:gap-8">
                            <DoorImage src={current.image} alt={current.alt} imageKey={current.id} className="aspect-[16/10] xl:aspect-[4/5]" imgClassName="object-[50%_38%]" />
                            <div className="self-center">
                                <AnimatePresence mode="wait" initial={false}>
                                    <Motion.div
                                        key={current.id}
                                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                                        transition={{ duration: 0.16, ease: 'easeIn' }}
                                    >
                                        <h4 className="lettering text-3xl">{current.name}</h4>
                                        <div className="mt-5">
                                            <Points points={current.points} />
                                        </div>
                                        <RequestLink service={current} className="mt-7" />
                                    </Motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
