import FloorHeader from '../ui/FloorHeader';
import { METRICS } from '../../data/content';
import { LEGAL_NAME, RUC } from '../../data/site';

/** Floor 1. The hero ends on a full field of brand red; this floor continues it. */
export default function Backing() {
    return (
        <section id="respaldo" aria-labelledby="respaldo-title" className="bg-brand text-on-brand">
            {/* A ramp from the page ground into the brand red, so the floor arrives without a hard edge. */}
            <div aria-hidden="true" className="h-40 md:h-56" style={{ background: 'linear-gradient(to bottom, var(--ground), var(--brand))' }} />
            <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16 lg:px-10">
                <FloorHeader code="1" id="respaldo-title" title="Más de 25 años en transporte vertical" onBrand>
                    HTL significa Honradez, Tecnología y Lealtad. Somos un especialista multimarca en ascensores que también se ocupa de la limpieza y el ambiente de su edificio, con presencia en edificios residenciales, comerciales y complejos logísticos.
                </FloorHeader>

                {/* The numbers, on the kind of data plate every cabin carries. */}
                <div className="plate relative p-6 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] sm:p-8">
                    <p className="label text-muted">Placa de servicio</p>
                    <dl className="mt-3">
                        {METRICS.map((m) => (
                            <div key={m.label} className="flex items-baseline justify-between gap-6 border-t border-line/70 py-3.5">
                                <dt className="text-[0.95rem] font-medium leading-snug">
                                    {m.label}
                                    {m.note && (
                                        <span className="mt-1 block font-montserrat text-[0.72rem] font-normal leading-snug text-muted">
                                            {m.note}
                                        </span>
                                    )}
                                </dt>
                                <dd className="font-montserrat tabular text-right text-5xl font-extrabold leading-none tracking-tight text-accent sm:text-6xl">
                                    {m.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="label border-t border-line/70 pt-4 text-muted">
                        {LEGAL_NAME} · RUC {RUC}
                    </p>
                </div>
            </div>
        </section>
    );
}
