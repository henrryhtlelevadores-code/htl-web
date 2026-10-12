import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCatalog from '../components/ui/ProductCatalog';
import { ACCESSORIES, AROMA_DEVICES } from '../data/content';
import { whatsappHref } from '../data/site';
import { useStaticFloor } from '../lib/floor';

const fmt = new Intl.NumberFormat('es-PE');

const ProductsPage = () => {
    useStaticFloor('A', 'Almacén');

    return (
        <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-32 sm:px-6 lg:px-10">
            <header className="max-w-3xl">
                <h1 className="lettering text-[clamp(2.5rem,8vw,5rem)]">Catálogo de limpieza y ambientes</h1>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                    Línea profesional ProClean, insumos y equipos de aromatización que HTL Facility Management usa y suministra. Elija un producto para ver sus beneficios y presentaciones.
                </p>
            </header>

            <div className="mt-14">
                <ProductCatalog />
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <section>
                    <h2 className="lettering text-3xl">Accesorios e insumos</h2>
                    <ul className="mt-4 border-t border-line">
                        {ACCESSORIES.map((item) => <li key={item} className="border-b border-line py-3 leading-snug">{item}</li>)}
                    </ul>
                </section>
                <section>
                    <h2 className="lettering text-3xl">Aromatización</h2>
                    <ul className="mt-4 border-t border-line">
                        {AROMA_DEVICES.map((d) => (
                            <li key={d.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3 leading-snug">
                                <span>
                                    <span className="font-semibold">{d.name}</span>
                                    <span className="block text-sm text-muted">{d.tech}</span>
                                </span>
                                <span className="tabular shrink-0 text-muted">hasta {fmt.format(d.volume)} m³</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="mt-16 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappHref('Hola, quisiera cotizar productos de limpieza ProClean.')} target="_blank" rel="noopener noreferrer" className="btn-call">
                    Cotizar por WhatsApp
                </a>
                <Link to={{ pathname: '/', hash: '#visita' }} className="btn-ghost">
                    Agendar visita diagnóstica <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
};

export default ProductsPage;
