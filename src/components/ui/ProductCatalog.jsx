import { useEffect, useId, useRef, useState } from 'react';
import { Building2, LayoutGrid, MessageCircle, Search, Sparkles, X } from 'lucide-react';
import ChevronsUp from './ChevronsUp';
import CircleCheck from './CircleCheck';
import ProductBottle from './ProductBottle';
import { IMPACT_GROUPS, PRODUCTS } from '../../data/products';
import { whatsappHref } from '../../data/site';

const ALL = 'Todos';
const GROUP_ICONS = { [ALL]: LayoutGrid, 'Transporte Vertical': ChevronsUp, Edificio: Building2, Especializado: Sparkles };

// Search ignores case and accents: "bioenzimatico" finds "Bioenzimáticos".
const fold = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const HAYSTACK = new Map(PRODUCTS.map((p) => [p.id, fold([p.name, p.label, p.category, p.impactGroup, p.shortDescription, ...p.benefits].join(' '))]));

// ProClean's own green, so the stock button reads as theirs. Dark lettering keeps it legible.
const stockClass = 'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-proclean px-2 text-[0.72rem] font-bold uppercase tracking-wide text-[#05211d] transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] sm:px-3 sm:text-[0.8rem]';

const StockLink = ({ product, className = '' }) => (
    <a
        href={whatsappHref(`Hola, quisiera consultar el stock de ${product.name} (ProClean).`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${stockClass} ${className}`}
    >
        <MessageCircle size={16} className="hidden xs:block" aria-hidden="true" /> Consultar stock
    </a>
);

// The studio light behind a bottle, in its label's colour. Lifted towards white so dark labels still glow.
const Spotlight = ({ color, className = '' }) => (
    <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[52%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300 ${className}`}
        style={{ background: `color-mix(in srgb, ${color} 72%, white)` }}
    />
);

function ProductDialog({ product, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!product) return undefined;
        if (!dialog.open) dialog.showModal();
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = prev;
            if (dialog.open) dialog.close();
        };
    }, [product]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()}
            aria-labelledby="producto-titulo"
            className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,46rem)] overflow-y-auto border border-line bg-surface p-0 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] backdrop:bg-black/70"
        >
            {product && (
                <div className="grid sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
                    <div className="relative grid place-items-center overflow-hidden bg-[#0b0c0e] px-8 py-6 sm:py-10">
                        <Spotlight color={product.labelColor} className="w-56 opacity-30" />
                        <ProductBottle {...product} name={product.label} className="relative h-48 w-auto sm:h-72" />
                    </div>
                    <div className="p-5 sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <p className="label pt-1 text-muted">{product.category} · {product.impactGroup}</p>
                            <button type="button" onClick={onClose} aria-label="Cerrar" className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center text-muted transition-colors hover:text-ink">
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>
                        <h3 id="producto-titulo" className="mt-1 text-2xl font-bold leading-tight">{product.name}</h3>
                        <p className="mt-3 leading-snug text-muted">{product.shortDescription}</p>

                        <p className="label mt-6 text-muted">Beneficios</p>
                        <ul className="mt-3 grid gap-2.5">
                            {product.benefits.map((b) => (
                                <li key={b} className="flex gap-3 leading-snug">
                                    <CircleCheck className="mt-0.5 h-5 w-5 text-accent" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="label mt-6 text-muted">Presentaciones</p>
                        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                            {product.presentations.map((size) => (
                                <li key={size} className="border border-line px-2.5 py-1 font-semibold">{size}</li>
                            ))}
                        </ul>

                        <StockLink product={product} className="mt-7 w-full sm:w-auto sm:px-5" />
                    </div>
                </div>
            )}
        </dialog>
    );
}

// Filters wrap instead of scrolling sideways, so none of them is hidden off the edge of a phone.
const strip = 'flex flex-wrap gap-2';

/** The ProClean shelf: narrowed by where the product works, by category and by name, each one opening its sheet. */
export default function ProductCatalog({ limit, children }) {
    const searchId = useId();
    const [group, setGroup] = useState(ALL);
    const [category, setCategory] = useState(null);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);

    const inGroup = group === ALL ? PRODUCTS : PRODUCTS.filter((p) => p.impactGroup === group);
    const categories = [...new Set(inGroup.map((p) => p.category))];
    const needle = fold(query.trim());
    const matching = inGroup.filter((p) => (!category || p.category === category) && (!needle || HAYSTACK.get(p.id).includes(needle)));
    const shown = limit ? matching.slice(0, limit) : matching;

    const pickGroup = (g) => {
        setGroup(g);
        setCategory(null);
    };

    const reset = () => {
        pickGroup(ALL);
        setQuery('');
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Filtrar por uso">
                {[ALL, ...IMPACT_GROUPS].map((g) => {
                    const Icon = GROUP_ICONS[g];
                    const isActive = g === group;
                    const count = g === ALL ? PRODUCTS.length : PRODUCTS.filter((p) => p.impactGroup === g).length;
                    return (
                        <button
                            key={g}
                            type="button"
                            onClick={() => pickGroup(g)}
                            aria-pressed={isActive}
                            className={`flex min-h-11 items-center gap-2 rounded-[3px] border px-2.5 py-2 text-left text-sm font-semibold leading-tight sm:whitespace-nowrap sm:px-3.5 sm:text-base transition-colors ${isActive ? 'border-ink bg-ink text-ground' : 'border-line text-muted hover:border-ink hover:text-ink'}`}
                        >
                            <Icon size={17} className="hidden h-[17px] w-[17px] shrink-0 xs:block" aria-hidden="true" />
                            <span className="min-w-0 flex-1 sm:flex-none">{g}</span> <span className={`tabular text-sm font-normal ${isActive ? 'opacity-70' : ''}`}>({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Categories only make sense once a use is chosen, and only the ones that use has. */}
            {group !== ALL && (
                <div className={`${strip} mt-3`} role="group" aria-label={`Categorías de ${group}`}>
                    {categories.map((c) => {
                        const isActive = c === category;
                        return (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(isActive ? null : c)}
                                aria-pressed={isActive}
                                className={`min-h-10 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${isActive ? 'border-proclean bg-proclean text-[#05211d]' : 'border-line text-muted hover:border-ink hover:text-ink'}`}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="relative mt-3 max-w-md">
                <label htmlFor={searchId} className="sr-only">Buscar producto</label>
                <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                    id={searchId}
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar producto…"
                    autoComplete="off"
                    className="min-h-11 w-full rounded-[3px] border border-line bg-raised pl-10 pr-11 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')} aria-label="Borrar búsqueda" className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted transition-colors hover:text-ink">
                        <X size={17} aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* The shelf: one dark stage in both themes, each gallon under its own light. */}
            <div className="relative mt-6 overflow-hidden bg-[#0b0c0e] px-4 py-8 text-white ring-1 ring-white/[0.07] sm:px-8 sm:py-10">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(255_255_255/0.06),transparent)]" />

                {shown.length > 0 ? (
                    <ul className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
                        {shown.map((p) => (
                            <li key={p.id} className="group flex min-w-0 flex-col">
                                <button type="button" onClick={() => setSelected(p)} aria-haspopup="dialog" className="flex flex-1 flex-col text-left">
                                    <span className="relative grid w-full place-items-center pt-3">
                                        <Spotlight color={p.labelColor} className="w-[85%] opacity-[0.16] group-hover:opacity-[0.34]" />
                                        <ProductBottle {...p} name={p.label} className="relative h-44 w-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 sm:h-56" />
                                    </span>
                                    {/* The shelf edge: the same line under every gallon of a row. */}
                                    <span aria-hidden="true" className="-mt-2 block h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    <span className="flex flex-1 flex-col pt-4">
                                        <span className="label !text-[0.68rem] text-white/55">{p.category}</span>
                                        <span className="lettering mt-1.5 text-xl sm:text-2xl">{p.label}</span>
                                        <span className="mt-2 line-clamp-3 text-sm leading-snug text-white/65">{p.shortDescription}</span>
                                        <span className="mt-auto pt-3 text-sm font-semibold underline underline-offset-4">Ver detalles</span>
                                    </span>
                                </button>
                                <StockLink product={p} className="mt-3" />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="relative py-10 text-center">
                        <p className="text-lg font-semibold">Ningún producto coincide con su búsqueda.</p>
                        <button type="button" onClick={reset} className="mt-4 min-h-11 font-semibold underline underline-offset-4">
                            Ver todos los productos
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-muted" aria-live="polite">
                    {shown.length < matching.length
                        ? `Mostrando ${shown.length} de ${matching.length} productos.`
                        : `${matching.length} ${matching.length === 1 ? 'producto' : 'productos'}.`}
                </p>
                {children}
            </div>

            <ProductDialog product={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
