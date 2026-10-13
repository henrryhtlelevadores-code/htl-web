import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Logo from './Logo';
import ComplaintsBook from './ComplaintsBook';
import { ADDRESS, COMPLAINTS_EVENT, EMAIL, FLOORS, LEGAL_NAME, PHONE_DISPLAY, RUC, TEL_HREF } from '../../data/site';

const linkClass = 'inline-flex min-h-11 items-center text-muted transition-colors hover:text-ink';

const Footer = () => {
    const [isComplaintsOpen, setIsComplaintsOpen] = useState(false);

    // The legal pages link to the complaints book, which lives here.
    useEffect(() => {
        const open = () => setIsComplaintsOpen(true);
        window.addEventListener(COMPLAINTS_EVENT, open);
        return () => window.removeEventListener(COMPLAINTS_EVENT, open);
    }, []);

    return (
        <footer className="border-t border-line bg-ground">
            <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 lg:px-10">
                <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
                    <div>
                        <Logo className="h-12 w-auto" />
                        <p className="lettering mt-5 text-xl text-muted">Honradez · Tecnología · Lealtad</p>
                    </div>

                    <nav aria-label="Pisos del sitio">
                        <h2 className="label text-muted">Directorio</h2>
                        <ul className="mt-3">
                            {FLOORS.slice(1).map((f) => (
                                <li key={f.id}>
                                    <Link to={{ pathname: '/', hash: `#${f.id}` }} className={linkClass}>
                                        <span className="tabular w-5 font-bold text-accent">{f.code}</span> {f.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/productos" className={linkClass}>
                                    <span className="w-5 font-bold text-accent">A</span> Catálogo de productos
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div>
                        <h2 className="label text-muted">Contacto</h2>
                        <ul className="mt-3">
                            <li><a href={TEL_HREF} className={linkClass}>{PHONE_DISPLAY}</a></li>
                            <li><a href={`mailto:${EMAIL}`} className={`${linkClass} break-all`}>{EMAIL}</a></li>
                            <li className="flex min-h-11 items-center text-muted">{ADDRESS}</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="label text-muted">Legales</h2>
                        <ul className="mt-3">
                            <li><Link to="/aviso-legal" className={linkClass}>Aviso legal</Link></li>
                            <li><Link to="/terminos-y-condiciones" className={linkClass}>Términos y condiciones</Link></li>
                            <li><Link to="/politicas-de-privacidad" className={linkClass}>Política de privacidad</Link></li>
                            <li><Link to="/politica-de-cookies" className={linkClass}>Política de cookies</Link></li>
                            <li>
                                <button type="button" onClick={() => setIsComplaintsOpen(true)} className={`${linkClass} gap-2`}>
                                    <BookOpen size={16} aria-hidden="true" /> Libro de reclamaciones
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
                    © {new Date().getFullYear()} {LEGAL_NAME} · RUC {RUC}. Todos los derechos reservados.
                </p>
                <p className="mt-2 text-sm text-muted">
                    Creada por Fortex Business Solutions
                </p>
            </div>
            <ComplaintsBook isOpen={isComplaintsOpen} onClose={() => setIsComplaintsOpen(false)} />
        </footer>
    );
};

export default Footer;
