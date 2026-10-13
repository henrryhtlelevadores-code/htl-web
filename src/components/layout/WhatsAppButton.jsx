import { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { TEL_HREF, whatsappHref } from '../../data/site';
import { useFloor } from '../../lib/floor';

// WhatsApp's own glyph, so the button is recognised before it is read.
const GLYPH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

const isField = (el) => el instanceof HTMLElement && el.matches('input, textarea, select, [contenteditable="true"]');

// Appears with the first scroll, so the hero ride never leaves a phone without a contact path.
// It steps aside on the visit floor, where the same action is already on screen, and while a
// field is being filled, so it never sits over the form or the keyboard.
const WhatsAppButton = () => {
    const { floor } = useFloor();
    const [scrolled, setScrolled] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onFocusIn = (e) => setTyping(isField(e.target));
        const onFocusOut = () => setTyping(false);
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);
        return () => {
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
        };
    }, []);

    const show = scrolled && !typing && floor.id !== 'visita';

    return (
        <AnimatePresence>
            {show && (
                <Motion.div
                    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-3 md:bottom-5 md:right-5"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* On phones a call is one tap away too, kept neutral beside the main action. */}
                    <a
                        href={TEL_HREF}
                        aria-label="Llamar a HTL Elevadores"
                        className="grid h-12 w-12 place-items-center rounded-full border border-line bg-raised text-ink shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] transition-transform duration-150 active:scale-95 md:hidden"
                    >
                        <Phone size={20} aria-hidden="true" />
                    </a>
                    <a
                        href={whatsappHref()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contactar por WhatsApp con HTL Elevadores"
                        className="group relative grid h-[60px] w-[60px] place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_24px_-8px_rgb(0_0_0/0.55)] transition-transform duration-200 hover:scale-[1.08] active:scale-95 md:h-14 md:w-14"
                    >
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                            <path d={GLYPH} />
                        </svg>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-[3px] border border-line bg-raised px-3 py-2 text-sm font-semibold text-ink opacity-0 shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                        >
                            ¿Hablamos? Respondemos en minutos.
                        </span>
                    </a>
                </Motion.div>
            )}
        </AnimatePresence>
    );
};

export default WhatsAppButton;
