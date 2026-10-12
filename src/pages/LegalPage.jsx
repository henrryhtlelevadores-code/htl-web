import { useStaticFloor } from '../lib/floor';

/** Shared layout for the terms and privacy pages. */
const LegalPage = ({ title, note, sections }) => {
    useStaticFloor('-', 'Legales');
    return (
        <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
            <h1 className="lettering text-[clamp(2.25rem,7vw,4rem)]">{title}</h1>
            <p className="mt-4 text-lg text-muted">{note}</p>
            <div className="mt-12 border-t border-line">
                {sections.map((section) => (
                    <section key={section.title} className="border-b border-line py-8">
                        <h2 className="text-xl font-bold">{section.title}</h2>
                        <p className="mt-3 max-w-[68ch] text-lg leading-relaxed text-muted">{section.content}</p>
                    </section>
                ))}
            </div>
        </article>
    );
};

export default LegalPage;
