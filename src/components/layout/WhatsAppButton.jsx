import { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { whatsappHref } from '../../data/site';
import { useFloor } from '../../lib/floor';

// Appears with the first scroll, so the hero ride never leaves a phone without a contact path.
// It steps aside on the visit floor, where the same action is already on screen.
const WhatsAppButton = () => {
    const { floor } = useFloor();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const show = scrolled && floor.id !== 'visita';

    return (
        <AnimatePresence>
            {show && (
                <Motion.a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Escribir por WhatsApp"
                    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-13 w-13 place-items-center rounded-[3px] bg-ink text-ground shadow-[0_12px_28px_-10px_rgb(0_0_0/0.6)] md:right-8"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <MessageCircle size={24} aria-hidden="true" />
                </Motion.a>
            )}
        </AnimatePresence>
    );
};

export default WhatsAppButton;
