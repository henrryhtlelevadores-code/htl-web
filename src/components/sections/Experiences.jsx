import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Gift, IceCreamCone, Wrench } from 'lucide-react';
import FloorHeader from '../ui/FloorHeader';
import { EXPERIENCE_BENEFITS } from '../../data/content';
import { whatsappHref } from '../../data/site';

const ICONS = { familias: IceCreamCone, administracion: Gift, edificio: Wrench };

/** Floor 4. The darkest floor of the building: Display Glass under plates, red only as ink and light. */
export default function Experiences() {
    return (
        <section id="experiencias" aria-labelledby="experiencias-title" className="border-b border-line bg-[#08090a]">
            <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
                <FloorHeader code="4" id="experiencias-title" title="Más que mantenimiento, una experiencia para su edificio">
                    Llevamos salud, diversión y bienestar a las familias, mientras cuidamos la infraestructura del edificio. Un programa gratuito, sin costos para la administración.
                </FloorHeader>

                <ul className="mt-14 grid gap-px border border-line bg-line lg:grid-cols-3">
                    {EXPERIENCE_BENEFITS.map((b, i) => {
                        const Icon = ICONS[b.id];
                        return (
                            <Motion.li
                                key={b.id}
                                className="bg-surface p-6 sm:p-8"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Icon size={32} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                                <h3 className="lettering mt-6 text-3xl md:text-4xl">{b.title}</h3>
                                <ul className="mt-6 border-t border-line">
                                    {b.items.map((item) => (
                                        <li key={item.label} className="flex gap-3 border-b border-line py-4 last:border-b-0 last:pb-0">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-led" aria-hidden="true" />
                                            <p className="leading-snug text-muted">
                                                <span className="block font-semibold text-ink">{item.label}</span>
                                                <span className="mt-1 block">{item.text}</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </Motion.li>
                        );
                    })}
                </ul>

                <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                        href={whatsappHref('Hola, quisiera agendar la experiencia HTL en mi edificio.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-call"
                    >
                        Agendar experiencia en mi edificio
                    </a>
                    <Link to="/productos-royal" className="btn-ghost border-ink hover:bg-white/10">
                        Ver más detalles <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
