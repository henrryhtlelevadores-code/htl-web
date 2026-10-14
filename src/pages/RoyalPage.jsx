import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChefHat, CookingPot, Utensils } from 'lucide-react';
import { EXPERIENCE_OPTION, ROYAL_LINES } from '../data/content';
import { useStaticFloor } from '../lib/floor';
import { usePageMeta } from '../lib/seo';

const ICONS = { ollas: CookingPot, sartenes: ChefHat, utensilios: Utensils };

const RoyalPage = () => {
    useStaticFloor('P', 'Productos Royal');
    usePageMeta('royal');

    return (
        <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-32 sm:px-6 lg:px-10">
            <header className="max-w-3xl">
                <Link to={{ pathname: '/', hash: '#experiencias' }} className="label inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-ink">
                    <ArrowLeft size={14} aria-hidden="true" /> Experiencias
                </Link>
                <h1 className="lettering mt-4 text-[clamp(2.5rem,8vw,5rem)]">Herramientas para una cocina más consciente</h1>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                    Descubra la línea de productos Royal Prestige que estamos llevando a los edificios. Utensilios diseñados para cuidar la salud de su familia y mejorar su experiencia en la cocina.
                </p>
            </header>

            <ul className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
                {ROYAL_LINES.map((line) => {
                    const Icon = ICONS[line.id];
                    return (
                        <li key={line.id} className="bg-surface">
                            <div className="grid aspect-[4/3] place-items-center bg-[#08090a]">
                                {line.image ? (
                                    <img src={line.image} alt={line.alt} width={line.size[0]} height={line.size[1]} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                                ) : (
                                    <Icon size={56} strokeWidth={1} className="text-steel" aria-hidden="true" />
                                )}
                            </div>
                            <h2 className="lettering border-t border-line p-6 text-3xl">{line.name}</h2>
                        </li>
                    );
                })}
            </ul>

            <section aria-labelledby="financiamiento-title" className="mt-16 grid gap-8 bg-brand p-6 text-on-brand sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                    <h2 id="financiamiento-title" className="lettering text-3xl md:text-4xl">Financiamiento</h2>
                    <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-on-brand-muted">
                        Pregunte por nuestros planes de financiamiento y facturación directa a su nombre.
                    </p>
                </div>
                <Link
                    to={{ pathname: '/', hash: '#visita' }}
                    state={{ servicio: EXPERIENCE_OPTION }}
                    className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-[3px] bg-white px-5 text-center text-[0.95rem] font-bold uppercase tracking-wide text-brand transition-transform duration-200 active:scale-[0.97]"
                >
                    Solicitar asesoría personalizada <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
};

export default RoyalPage;
