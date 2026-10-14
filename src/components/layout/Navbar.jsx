import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';
import SevenSegment from '../ui/SevenSegment';
import ChevronsUp from '../ui/ChevronsUp';
import { FLOORS, PHONE_DISPLAY, TEL_HREF } from '../../data/site';
import { useFloor } from '../../lib/floor';

const floorTo = (id) => ({ pathname: '/', hash: `#${id}` });

function Readout() {
    const { floor, direction } = useFloor();
    return (
        <div
            className="ml-1 hidden h-10 items-center gap-2 rounded-[3px] bg-[#08090a] px-2.5 ring-1 ring-white/10 lg:flex sm:ml-3"
            role="status"
            aria-label={`Piso actual: ${floor.name}`}
        >
            <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform duration-300" style={{ transform: direction === 'down' ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
                <path d="M6 1.5 11 9.5H1z" fill="var(--led)" />
            </svg>
            <SevenSegment char={floor.code} className="h-6 w-auto" />
            <span className="label max-w-36 truncate pl-1 text-white/75">{floor.name}</span>
        </div>
    );
}

export default function Navbar() {
    const { floor } = useFloor();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const reduce = useReducedMotion();
    const firstLink = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        firstLink.current?.focus();
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const solid = scrolled || open || floor.id !== 'lobby';

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${solid ? 'border-line bg-ground' : 'border-transparent'}`}
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-10">
                    <Link to={floorTo('lobby')} className="flex min-h-11 shrink-0 items-center" aria-label="HTL Elevadores, inicio">
                        <Logo className="h-8 w-auto sm:h-9" />
                    </Link>

                    <Readout />

                    <nav aria-label="Pisos" className="ml-auto hidden items-center gap-0.5 md:flex lg:gap-1">
                        {FLOORS.slice(1).map((f) => (
                            <Link
                                key={f.id}
                                to={floorTo(f.id)}
                                aria-current={floor.id === f.id ? 'true' : undefined}
                                className="relative flex h-11 items-center px-2 text-[13px] font-medium whitespace-nowrap text-muted transition-colors hover:text-ink lg:px-2.5 lg:text-sm aria-[current=true]:text-ink"
                            >
                                {f.name}
                                {floor.id === f.id && (
                                    <span className="absolute inset-x-2 bottom-0.5 h-0.5 rounded-full bg-accent lg:inset-x-2.5" aria-hidden="true" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-2 md:ml-3">
                        <Link to={floorTo('visita')} className="btn-call btn-call--icon shrink-0 rounded-full !min-h-11 !px-3.5 !py-2 !text-sm md:!px-5 md:!py-2.5 md:!text-[0.95rem]">
                            <ChevronsUp />
                            <span className="md:hidden">Agendar</span>
                            <span className="hidden md:inline">Agendar visita</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className="grid h-11 w-11 place-items-center rounded-[3px] border border-line text-ink md:hidden"
                            aria-expanded={open}
                            aria-controls="directorio"
                            aria-label={open ? 'Cerrar directorio' : 'Abrir directorio de pisos'}
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <Motion.div
                        id="directorio"
                        className="fixed inset-0 z-40 overflow-y-auto bg-ground pt-20 md:hidden"
                        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
                        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
                        exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <nav aria-label="Directorio de pisos" className="mx-auto max-w-xl px-4 pb-10 sm:px-6">
                            <p className="label py-4 text-muted">Directorio del edificio</p>
                            <ul className="border-t border-line">
                                {[...FLOORS].reverse().map((f, i) => (
                                    <li key={f.id} className="border-b border-line">
                                        <Link
                                            ref={i === 0 ? firstLink : undefined}
                                            to={floorTo(f.id)}
                                            onClick={() => setOpen(false)}
                                            aria-current={floor.id === f.id ? 'true' : undefined}
                                            className="flex min-h-16 items-center gap-4 py-3"
                                        >
                                            <span className="w-8 shrink-0 text-right text-sm font-semibold tabular text-muted">{f.code}</span>
                                            <span className="lettering text-2xl">{f.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 grid gap-3">
                                <Link to={floorTo('visita')} onClick={() => setOpen(false)} className="btn-call">
                                    Agendar visita sin cargo
                                </Link>
                                <a href={TEL_HREF} className="btn-ghost">
                                    <Phone size={18} aria-hidden="true" /> {PHONE_DISPLAY}
                                </a>
                                <Link to="/productos" onClick={() => setOpen(false)} className="py-3 text-center text-sm font-medium text-muted underline">
                                    Catálogo de productos
                                </Link>
                            </div>
                        </nav>
                    </Motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
