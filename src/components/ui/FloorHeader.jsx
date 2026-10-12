/** Section heading with its floor plate, the same address the nav and the readout show. */
export default function FloorHeader({ code, title, children, onBrand = false, id }) {
    return (
        <header className="grid gap-x-6 gap-y-5 md:grid-cols-[auto_1fr]">
            <span
                aria-hidden="true"
                className={`lettering grid h-14 w-14 place-items-center border text-3xl md:h-[4.5rem] md:w-[4.5rem] md:text-4xl ${onBrand ? 'border-white/50 text-on-brand' : 'border-line bg-raised text-accent'}`}
            >
                {code}
            </span>
            <div>
                <h2 id={id} className="lettering max-w-[20ch] text-[clamp(2.25rem,6.2vw,4.5rem)]">
                    {title}
                </h2>
                {children && (
                    <p className={`mt-5 max-w-[62ch] text-lg leading-relaxed text-pretty ${onBrand ? 'text-on-brand-muted' : 'text-muted'}`}>
                        {children}
                    </p>
                )}
            </div>
        </header>
    );
}
