import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChevronsUp from '../components/ui/ChevronsUp';
import { NOT_FOUND } from '../data/seo';
import { FLOORS } from '../data/site';
import { useStaticFloor } from '../lib/floor';

/** Any address the site does not have. The host answers it with a real 404 (see vercel.json). */
const NotFoundPage = () => {
    useStaticFloor('-', 'Sin piso');

    // Kept out of search results, and titled for the tab while it is open.
    useEffect(() => {
        const title = document.title;
        document.title = NOT_FOUND.title;
        const robots = document.createElement('meta');
        robots.name = 'robots';
        robots.content = 'noindex';
        document.head.appendChild(robots);
        return () => {
            document.title = title;
            robots.remove();
        };
    }, []);

    return (
        <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-32 sm:px-6 lg:px-10">
            <p className="label text-accent">Error 404</p>
            <h1 className="lettering mt-4 max-w-3xl text-[clamp(2.5rem,8vw,5rem)]">Este piso no existe</h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
                La página que busca no existe o cambió de dirección. Elija un piso del directorio o agende su visita diagnóstica.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Link to={{ pathname: '/', hash: '#visita' }} className="btn-call btn-call--icon">
                    <ChevronsUp /> Agendar visita sin cargo
                </Link>
                <Link to="/" className="btn-ghost">Volver al inicio</Link>
            </div>

            <nav aria-label="Directorio del edificio" className="mt-14 max-w-xl">
                <h2 className="label text-muted">Directorio</h2>
                <ul className="plate mt-3">
                    {FLOORS.slice(1).map((f) => (
                        <li key={f.id} className="border-b border-line">
                            <Link to={{ pathname: '/', hash: `#${f.id}` }} className="flex min-h-12 items-center gap-4 px-4 py-2 font-semibold transition-colors hover:bg-ground">
                                <span className="tabular w-5 font-bold text-accent">{f.code}</span> {f.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link to="/productos" className="flex min-h-12 items-center gap-4 px-4 py-2 font-semibold transition-colors hover:bg-ground">
                            <span className="w-5 font-bold text-accent">A</span> Catálogo de productos
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NotFoundPage;
