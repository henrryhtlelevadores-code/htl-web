import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useInView, useReducedMotion } from 'framer-motion';
import { Camera, Check, ChevronDown, CloudCheck, FileText, Lock, Mic, Monitor, PenLine, ShieldCheck, Smartphone, WifiOff } from 'lucide-react';
import FloorHeader from '../ui/FloorHeader';
import cabina from '../../assets/brochure/cabina-antes-despues.webp';
import { APP_FEATURES, ORDER_STEPS, PANEL_VIEWS } from '../../data/content';

const TONES = {
    amber: '#d99a1c',
    blue: '#4d8fe8',
    violet: '#9a6fe0',
    green: '#2fa36b',
};

// The sample order the phone and the portal both show.
const ORDER = { code: 'OT-2026-10-00GJVA', place: 'Edificio · Ascensor 2' };

const StatusPill = ({ step }) => (
    <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-line px-2.5 py-1 text-xs font-semibold">
        <span className="h-2 w-2 rounded-full" style={{ background: TONES[step.tone] }} aria-hidden="true" />
        {step.status}
    </span>
);

const Row = ({ children, done }) => (
    <div className="flex items-center gap-2.5 border-b border-line py-2 text-[0.8rem] leading-tight">
        <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border ${done ? 'border-transparent bg-ink text-ground' : 'border-steel'}`}>
            {done && <Check size={11} strokeWidth={3} aria-hidden="true" />}
        </span>
        {children}
    </div>
);

/** The technician's phone at each step. Rebuilt from the app's real screens, with sample data. */
function PhoneScreen({ index }) {
    if (index === 0) {
    return (
            <>
                <p className="text-[0.95rem] font-bold">Mis órdenes</p>
                <div className="mt-3 border border-line bg-raised p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="tabular text-xs font-bold">{ORDER.code}</span>
                        <StatusPill step={ORDER_STEPS[0]} />
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-tight">Mantenimiento preventivo</p>
                    <p className="mt-1 text-xs text-muted">{ORDER.place}</p>
                </div>
                {[['OT-2026-10-00GJVB', 'Revisión por avería', 'Edificio · Ascensor 1'], ['OT-2026-11-00GK2C', 'Mantenimiento preventivo', 'Edificio · Montacargas']].map(([code, kind, place]) => (
                    <div key={code} className="mt-2 border border-line p-3">
                        <span className="tabular text-xs font-bold text-muted">{code}</span>
                        <p className="mt-1 text-sm font-semibold leading-tight">{kind}</p>
                        <p className="mt-1 text-xs text-muted">{place}</p>
                    </div>
                ))}
            </>
        );
    }
    if (index === 1) {
    return (
            <>
                <p className="text-[0.95rem] font-bold">Checklist de seguridad</p>
                <div className="mt-2">
                    {['Equipo señalizado y fuera de servicio', 'Energía bloqueada', 'EPP completo', 'Foso y sala despejados'].map((t) => (
                        <div key={t} className="flex items-center justify-between gap-2 border-b border-line py-2.5 text-[0.8rem] leading-tight">
                            <span>{t}</span>
                            <span className="flex shrink-0 overflow-hidden rounded-[3px] border border-line text-[0.65rem] font-bold">
                                <span className="bg-ink px-1.5 py-1 text-ground">Sí</span>
                                <span className="px-1.5 py-1 text-muted">No</span>
                                <span className="px-1.5 py-1 text-muted">N/A</span>
                            </span>
                        </div>
                    ))}
                </div>
                <p className="mt-3 flex items-center gap-2 border border-dashed border-steel px-2.5 py-2 text-xs leading-tight text-muted">
                    <Lock size={13} className="shrink-0" aria-hidden="true" /> Tareas y fotos bloqueadas hasta aprobar
                </p>
            </>
        );
    }
    if (index === 2) {
    return (
            <>
                <p className="text-[0.95rem] font-bold">Tareas y fotos</p>
                <div className="mt-1">
                    <Row done>Limpieza de sala de máquinas</Row>
                    <Row done>Revisión de puertas de piso</Row>
                    <Row done>Lubricación de guías</Row>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {[['Antes', '0%'], ['Después', '100%']].map(([tag, pos]) => (
                        <div key={tag} className="relative aspect-square overflow-hidden bg-line">
                            <img src={cabina} alt="" width="899" height="706" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: `${pos} 50%`, width: '200%', maxWidth: 'none', marginLeft: tag === 'Antes' ? 0 : '-100%' }} />
                            <span className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                                <Camera size={10} aria-hidden="true" /> {tag}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-2 border border-line px-2.5 py-2 text-xs">
                    <Mic size={14} className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="flex flex-1 items-center gap-[3px]" aria-hidden="true">
                        {[5, 11, 7, 14, 9, 4, 12, 8, 13, 6, 10, 5, 9, 12, 6].map((h, i) => (
                            <span key={i} className="w-[3px] rounded-full bg-steel" style={{ height: h }} />
                        ))}
                    </span>
                    <span className="tabular text-muted">0:24</span>
                </div>
                <p className="mt-1.5 text-[0.7rem] italic leading-snug text-muted">“Zapata de puerta desgastada en el piso 3. Se recomienda el cambio.”</p>
            </>
        );
    }
    if (index === 3) {
    return (
            <>
                <p className="text-[0.95rem] font-bold">Cerrar orden</p>
                <p className="mt-3 text-xs text-muted">Firma de conformidad</p>
                <div className="mt-1.5 grid h-32 place-items-center border border-dashed border-steel bg-raised">
                    <svg viewBox="0 0 200 80" className="h-20 w-full text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <Motion.path
                            d="M14 56c10-22 20-40 27-40 8 0-6 46 2 46 9 0 14-30 23-30 7 0 2 24 9 24 8 0 10-20 18-20 6 0 4 16 11 16 9 0 12-26 22-26 8 0 2 24 12 24 12 0 22-14 48-18"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.25 }}
                        />
                    </svg>
                </div>
                <p className="mt-3 text-xs text-muted">Nombre de quien recibe</p>
                <div className="mt-1.5 border border-line bg-raised px-2.5 py-2 text-sm">Administración del edificio</div>
                <div className="mt-4 rounded-[3px] bg-brand py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white">Cerrar y enviar</div>
            </>
        );
    }
    return (
        <div className="grid h-full place-items-center text-center">
            <div>
                <CloudCheck size={44} className="mx-auto" style={{ color: TONES.green }} aria-hidden="true" />
                <p className="mt-3 text-[0.95rem] font-bold">Orden enviada</p>
                <p className="mx-auto mt-1.5 max-w-[22ch] text-xs leading-relaxed text-muted">
                    Checklist, fotos y firma ya están en HTL Panel.
                </p>
            </div>
        </div>
    );
}

const Tag = ({ tone, children }) => <StatusPill step={{ tone, status: children }} />;

const Fact = ({ label, children }) => (
    <div>
        <dt className="label !text-[0.65rem] text-muted">{label}</dt>
        <dd className="mt-1 text-sm font-semibold leading-tight">{children}</dd>
    </div>
);

/** The client portal at each view. Rebuilt from the real panel, with sample data. */
function PanelScreen({ view }) {
    if (view === 'equipos') {
        return (
            <ul className="grid gap-2.5">
                {[
                    ['Ascensor 1', 'Pasajeros', 'green', 'Operativo', '02 oct 2026', '02 nov 2026'],
                    ['Ascensor 2', 'Pasajeros', 'green', 'Operativo', '02 oct 2026', '02 nov 2026'],
                    ['Montacargas', 'Carga', 'amber', 'En mantenimiento', '18 sep 2026', '18 oct 2026'],
                ].map(([name, kind, tone, status, last, next]) => (
                    <li key={name} className="border border-line bg-raised p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold leading-tight">
                                {name} <span className="font-normal text-muted">· {kind}</span>
                            </p>
                            <Tag tone={tone}>{status}</Tag>
                        </div>
                        <dl className="mt-3 grid grid-cols-2 gap-3">
                            <Fact label="Última visita"><span className="tabular">{last}</span></Fact>
                            <Fact label="Próxima visita"><span className="tabular">{next}</span></Fact>
                        </dl>
                    </li>
                ))}
            </ul>
        );
    }
    if (view === 'ordenes') {
        return (
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <ul className="grid content-start gap-2">
                    {[
                        [ORDER.code, 'Mantenimiento preventivo · Ascensor 2', 'green', 'Completada'],
                        ['OT-2026-10-00GJVB', 'Revisión por avería · Ascensor 1', 'blue', 'En curso'],
                        ['OT-2026-11-00GK2C', 'Mantenimiento preventivo · Montacargas', 'amber', 'Pendiente'],
                    ].map(([code, kind, tone, status], i) => (
                        <li key={code} className={`border p-3 ${i === 0 ? 'border-ink bg-raised' : 'border-line'} ${i === 2 ? 'hidden sm:block' : ''}`}>
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <span className="tabular text-xs font-bold">{code}</span>
                                <Tag tone={tone}>{status}</Tag>
                            </div>
                            <p className="mt-1.5 text-sm leading-tight text-muted">{kind}</p>
                        </li>
                    ))}
                </ul>
                <div className="border border-line bg-raised p-4">
                    <p className="tabular text-sm font-bold">{ORDER.code}</p>
                    <p className="mt-0.5 text-sm text-muted">{ORDER.place}</p>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-line pt-4">
                        <Fact label="Prioridad">SLA Normal</Fact>
                        <Fact label="Técnico asignado">Técnico de ejemplo</Fact>
                        <Fact label="Inicio"><span className="tabular">09:12</span></Fact>
                        <Fact label="Cierre"><span className="tabular">10:47</span></Fact>
                        <div className="hidden sm:block"><Fact label="Duración"><span className="tabular">1 h 35 min</span></Fact></div>
                        <div className="hidden sm:block"><Fact label="Tipo">Preventivo</Fact></div>
                    </dl>
                </div>
            </div>
        );
    }
    if (view === 'informes') {
        return (
            <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-sm font-bold">
                        <FileText size={16} className="shrink-0 text-accent" aria-hidden="true" />
                        <span>Informe técnico · <span className="tabular">{ORDER.code}</span></span>
                    </p>
                    <Tag tone="green">Aprobado</Tag>
                </div>
                <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {[
                        ['Sistema de puertas', ['Comprobación de contactos', 'Limpieza de pisaderas y guías', 'Ajuste de operador de puerta']],
                        ['Sala de máquinas', ['Revisión de freno y polea', 'Nivel de aceite', 'Limpieza del tablero de control']],
                    ].map(([module, tasks]) => (
                        <div key={module}>
                            <p className="label text-muted">{module}</p>
                            <div className="mt-1.5 border-t border-line">
                                {tasks.map((t) => <Row key={t} done>{t}</Row>)}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-muted">Incluye fotos de antes y después, puntos de atención y la firma de conformidad.</p>
            </>
        );
    }
    return (
        <>
            <p className="label text-muted">Pendiente de su aprobación</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border border-ink bg-raised p-3.5">
                <div>
                    <p className="tabular text-xs font-bold">COT-2026-0187</p>
                    <p className="mt-1 text-sm font-semibold leading-tight">Cambio de contactos de puerta · Ascensor 1</p>
                </div>
                <span className="rounded-[3px] bg-brand px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white">Aprobar</span>
            </div>
            <p className="label mt-5 text-muted">Historial</p>
            <ul className="mt-2 border-t border-line">
                {[
                    ['COT-2026-0142', 'Pulido de acero de cabina · Ascensor 2'],
                    ['COT-2026-0098', 'Cambio de botonera · Ascensor 1'],
                ].map(([code, what]) => (
                    <li key={code} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3">
                        <span className="text-sm leading-tight">
                            <span className="tabular font-bold">{code}</span> <span className="text-muted">· {what}</span>
                        </span>
                        <Tag tone="green">Aprobada</Tag>
                    </li>
                ))}
            </ul>
        </>
    );
}

const FEATURE_ICONS = { offline: WifiOff, seguridad: ShieldCheck, fotos: Camera, voz: Mic, firma: PenLine };

const ProductTitle = ({ icon, name, children }) => {
    const Icon = icon;
    return (
        <div>
            <p className="label flex items-center gap-2 text-accent">
                <Icon size={16} aria-hidden="true" /> {name}
            </p>
            <h3 className="lettering mt-3 text-3xl md:text-4xl">{children}</h3>
        </div>
    );
};

const AUTOPLAY_MS = 3500;

/** The story-style bar that fills while the current item is on its turn. */
const Progress = () => (
    <Motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-led"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
    />
);

// On phones the lists are strips: keep the current item in sight without moving the page.
const useKeepInStrip = (ref, current, reduce) => {
    useEffect(() => {
        const strip = ref.current;
        const item = strip?.children[current];
        if (!item || strip.scrollWidth <= strip.clientWidth) return;
        const left = item.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft - 16;
        strip.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
    }, [ref, current, reduce]);
};

export default function Software() {
    const [index, setIndex] = useState(0);
    const [auto, setAuto] = useState(true);
    const [view, setView] = useState(PANEL_VIEWS[0].id);
    const reduce = useReducedMotion();
    const demoRef = useRef(null);
    const inView = useInView(demoRef, { amount: 0.4 });
    const [autoView, setAutoView] = useState(true);
    const stepsRef = useRef(null);
    const panelRef = useRef(null);
    const panelInView = useInView(panelRef, { amount: 0.4 });
    const step = ORDER_STEPS[index];
    const viewIndex = PANEL_VIEWS.findIndex((v) => v.id === view);
    const currentView = PANEL_VIEWS[viewIndex];
    const viewsRef = useRef(null);

    // The order advances on its own until the visitor takes over.
    useEffect(() => {
        if (!auto || !inView || reduce) return undefined;
        const id = setTimeout(() => setIndex((i) => (i + 1) % ORDER_STEPS.length), AUTOPLAY_MS);
        return () => clearTimeout(id);
    }, [auto, inView, reduce, index]);

    const pick = (i) => {
        setAuto(false);
        setIndex(i);
    };

    // The portal views rotate the same way, each on its own clock.
    useEffect(() => {
        if (!autoView || !panelInView || reduce) return undefined;
        const id = setTimeout(() => setView(PANEL_VIEWS[(viewIndex + 1) % PANEL_VIEWS.length].id), AUTOPLAY_MS);
        return () => clearTimeout(id);
    }, [autoView, panelInView, reduce, viewIndex]);

    const pickView = (id) => {
        setAutoView(false);
        setView(id);
    };

    useKeepInStrip(stepsRef, index, reduce);
    useKeepInStrip(viewsRef, viewIndex, reduce);

    const stepsPlaying = auto && inView && !reduce;
    const viewsPlaying = autoView && panelInView && !reduce;

    return (
        <section id="software" aria-labelledby="software-title" className="border-y border-line bg-surface">
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
                <FloorHeader code="3" id="software-title" title="Cada visita queda registrada">
                    Trabajamos con Operate Core, la plataforma desarrollada por{' '}
                    <a href="https://landingpage-fortex.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline">Fortex Business Solutions</a>{' '}
                    y personalizada para nuestra empresa: HTL Móvil, la app con la que cada técnico ejecuta la orden en campo, y HTL Panel, el portal donde usted la revisa. Sabe qué se hizo, quién lo hizo y con qué evidencia.
                </FloorHeader>

                <div className="mt-14">
                    <ProductTitle icon={Smartphone} name="HTL Móvil">La orden, paso a paso, en el teléfono del técnico</ProductTitle>
                </div>

                <div ref={demoRef} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-12">
                    {/* Steps */}
                    <ol ref={stepsRef} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-line lg:px-0">
                        {ORDER_STEPS.map((s, i) => {
                            const isActive = i === index;
                            return (
                                <li key={s.id} className="shrink-0 snap-start lg:border-b lg:border-line">
                                    <button
                                        type="button"
                                        onClick={() => pick(i)}
                                        aria-current={isActive ? 'step' : undefined}
                                        className={`relative flex min-h-11 items-center gap-3 overflow-hidden rounded-[3px] border px-3 py-2 text-left transition-colors lg:w-full lg:items-start lg:rounded-none lg:border-0 lg:px-0 lg:py-4 ${isActive ? 'border-ink text-ink' : 'border-line text-muted hover:text-ink'}`}
                                    >
                                        <span className="call-ring" data-lit={isActive}>{i + 1}</span>
                                        <span>
                                            <span className="block whitespace-nowrap font-semibold leading-tight lg:whitespace-normal lg:text-lg">{s.title}</span>
                                            <span className={`mt-1 hidden text-[0.95rem] leading-snug text-muted ${isActive ? 'lg:block' : ''}`}>{s.text}</span>
                                        </span>
                                        {isActive && stepsPlaying && <Progress />}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                    <p className="-mt-6 leading-snug text-muted lg:hidden" aria-live="polite">{step.text}</p>

                    {/* Phone */}
                    <div className="mx-auto w-[15.5rem] max-w-full rounded-[2rem] border border-line bg-[#08090a] p-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)]">
                        <div className="relative h-[26.5rem] overflow-hidden rounded-[1.55rem] bg-ground">
                            <div className="flex items-center justify-between bg-surface px-4 pb-2 pt-3 text-[0.7rem] font-semibold text-muted">
                                <span>HTL Móvil</span>
                                <StatusPill step={step} />
                            </div>
                            <AnimatePresence mode="wait" initial={false}>
                                <Motion.div
                                    key={index}
                                    className="absolute inset-x-0 bottom-0 top-12 p-4"
                                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <PhoneScreen index={index} />
                                </Motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* What the app does in the field */}
                    <ul className="border-t border-line">
                        {APP_FEATURES.map((f) => {
                            const Icon = FEATURE_ICONS[f.id];
                            return (
                                <li key={f.id} className="flex gap-4 border-b border-line py-4">
                                    <Icon size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                                    <div>
                                        <p className="font-semibold leading-tight">{f.title}</p>
                                        <p className="mt-1 text-[0.95rem] leading-snug text-muted">{f.text}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* The same order, seen from the client's side. */}
                <div className="mt-20 border-t border-line pt-14 md:mt-24">
                    <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-14">
                        <ProductTitle icon={Monitor} name="HTL Panel">Lo registrado en campo aparece en su portal</ProductTitle>
                        <p className="max-w-[60ch] text-lg leading-relaxed text-muted">
                            La información de cada visita y el informe de cada orden de trabajo se publican en el portal del centro de costos registrado: su edificio, su sede o su empresa.
                        </p>
                    </div>

                    <div ref={panelRef} className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12">
                        <div className="min-w-0">
                            <ul ref={viewsRef} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-line lg:px-0">
                                {PANEL_VIEWS.map((v) => {
                                    const isActive = v.id === view;
                                    return (
                                        <li key={v.id} className="shrink-0 snap-start lg:border-b lg:border-line">
                                            <button
                                                type="button"
                                                onClick={() => pickView(v.id)}
                                                aria-pressed={isActive}
                                                className={`relative flex min-h-11 w-full items-center overflow-hidden rounded-[3px] border px-3.5 py-2 text-left transition-colors duration-300 lg:block lg:rounded-none lg:border-0 lg:py-4 lg:pl-4 lg:pr-3 ${isActive ? 'border-ink text-ink lg:bg-[color-mix(in_srgb,var(--led)_7%,transparent)]' : 'border-line text-muted hover:text-ink'}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`absolute inset-y-0 left-0 hidden w-[3px] bg-led shadow-[0_0_12px_color-mix(in_srgb,var(--led)_55%,transparent)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
                                                />
                                                <span className="block whitespace-nowrap font-semibold leading-tight lg:whitespace-normal lg:text-lg">{v.name}</span>
                                                <span className="mt-1 hidden text-[0.95rem] leading-snug text-muted lg:block">{v.text}</span>
                                                {isActive && viewsPlaying && <Progress />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="mt-4 leading-snug text-muted lg:hidden" aria-live="polite">{currentView.text}</p>
                        </div>

                        {/* Browser */}
                        <div className="min-w-0 overflow-hidden rounded-lg border border-line bg-ground shadow-[0_30px_60px_-36px_rgb(0_0_0/0.5)]">
                            <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5 text-xs font-semibold text-muted">
                                <span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" />
                                <span className="ml-2">HTL Panel · Portal del cliente</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
                                <div>
                                    <p className="label !text-[0.65rem] text-muted">Centro de costos</p>
                                    <p className="mt-1 flex items-center gap-1.5 font-bold leading-tight">
                                        Edificio <ChevronDown size={15} className="text-muted" aria-hidden="true" />
                                    </p>
                                </div>
                                <p className="label text-muted">{currentView.name}</p>
                            </div>
                            <div className="min-h-[28.5rem] p-4 sm:min-h-[23.5rem] sm:p-5">
                                <AnimatePresence mode="wait" initial={false}>
                                    <Motion.div
                                        key={view}
                                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15, ease: 'easeIn' }}
                                    >
                                        <PanelScreen view={view} />
                                    </Motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-sm text-muted">Demostración ilustrativa con datos de ejemplo. El recorrido corresponde al flujo real de una orden de trabajo.</p>
            </div>
        </section>
    );
}
