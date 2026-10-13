import { Link, NavLink } from 'react-router-dom';
import { useStaticFloor } from '../lib/floor';
import { usePageMeta } from '../lib/seo';

const DOCUMENTS = [
    { to: '/aviso-legal', name: 'Aviso legal' },
    { to: '/terminos-y-condiciones', name: 'Términos y condiciones' },
    { to: '/politicas-de-privacidad', name: 'Política de privacidad' },
    { to: '/politica-de-cookies', name: 'Política de cookies' },
];

const prose = 'max-w-[68ch] text-lg leading-relaxed text-muted';

export const P = ({ children }) => <p className={prose}>{children}</p>;

/** A sub-heading inside a section, for a group of items. */
export const Lead = ({ children }) => <p className="max-w-[68ch] text-lg font-semibold leading-snug text-ink">{children}</p>;

export const List = ({ items }) => (
    <ul className={`${prose} grid gap-2.5`}>
        {items.map((item, i) => (
            <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

/** Label and value rows, as on a registry sheet. */
export const Facts = ({ rows }) => (
    <dl className="plate">
        {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-6">
                <dt className="label pt-1 text-muted">{label}</dt>
                <dd className="font-semibold leading-snug">{value}</dd>
            </div>
        ))}
    </dl>
);

export const Mail = ({ address }) => (
    <a href={`mailto:${address}`} className="break-all font-semibold text-ink underline">{address}</a>
);

const sectionId = (i) => `seccion-${i + 1}`;

/** Shared layout for the legal notice, the terms, the privacy policy and the cookies policy. */
const LegalPage = ({ seo, title, note, intro, sections }) => {
    useStaticFloor('-', 'Legales');
    usePageMeta(seo);
    return (
        <article className="mx-auto max-w-[90rem] px-4 pb-24 pt-28 sm:px-6 lg:px-10">
            <nav aria-label="Documentos legales" className="flex flex-wrap gap-2">
                {DOCUMENTS.map((d) => (
                    <NavLink
                        key={d.to}
                        to={d.to}
                        className={({ isActive }) => `flex min-h-11 items-center rounded-[3px] border px-3.5 text-sm font-semibold transition-colors ${isActive ? 'border-ink bg-ink text-ground' : 'border-line text-muted hover:border-ink hover:text-ink'}`}
                    >
                        {d.name}
                    </NavLink>
                ))}
            </nav>

            <header className="mt-10 max-w-3xl">
                <h1 className="lettering text-[clamp(2.25rem,7vw,4rem)]">{title}</h1>
                <p className="label mt-4 text-muted">{note}</p>
                {intro && <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>}
            </header>

            <div className="mt-12 grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
                {/* The index stays in view on wide screens while the document scrolls. */}
                <nav aria-label="Contenido del documento" className="hidden lg:block">
                    <div className="sticky top-24">
                        <p className="label text-muted">Contenido</p>
                        <ol className="mt-3 border-t border-line">
                            {sections.map((s, i) => (
                                <li key={s.title} className="border-b border-line">
                                    <Link to={{ hash: `#${sectionId(i)}` }} className="flex gap-3 py-2.5 text-sm leading-snug text-muted transition-colors hover:text-ink">
                                        <span className="tabular w-5 shrink-0 font-bold text-accent">{i + 1}</span>
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </div>
                </nav>

                <div className="min-w-0 border-t border-line">
                    {sections.map((s, i) => (
                        <section key={s.title} id={sectionId(i)} aria-labelledby={`${sectionId(i)}-titulo`} className="border-b border-line py-8">
                            <h2 id={`${sectionId(i)}-titulo`} className="flex gap-3 text-xl font-bold leading-snug">
                                <span className="tabular text-accent">{i + 1}.</span> {s.title}
                            </h2>
                            <div className="mt-4 grid gap-4">{s.body}</div>
                        </section>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default LegalPage;
