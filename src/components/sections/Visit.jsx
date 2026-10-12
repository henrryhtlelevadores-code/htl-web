import { useId, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Minus, Phone, Plus } from 'lucide-react';
import FloorHeader from '../ui/FloorHeader';
import Select from '../ui/Select';
import { EQUIPMENT_TYPES, SERVICE_OPTIONS } from '../../data/content';
import { ADDRESS, EMAIL, PHONE_DISPLAY, TEL_HREF, whatsappHref } from '../../data/site';

const EMPTY_EQUIPOS = Object.fromEntries(EQUIPMENT_TYPES.map((t) => [t.id, 0]));

const EMPTY = { nombre: '', telefono: '', edificio: '', servicio: SERVICE_OPTIONS[0], equipos: { ...EMPTY_EQUIPOS }, mensaje: '' };

const validate = (data) => {
    const errors = {};
    if (!data.nombre.trim()) errors.nombre = 'Indique su nombre para saber con quién coordinar.';
    if (data.telefono.replace(/\D/g, '').length < 7) errors.telefono = 'Ingrese un teléfono con al menos 7 dígitos.';
    return errors;
};

const compose = (data) => {
    const detalle = EQUIPMENT_TYPES
        .filter((t) => Number(data.equipos[t.id]) > 0)
        .map((t) => `- ${data.equipos[t.id]} equipo${Number(data.equipos[t.id]) > 1 ? 's' : ''} (${t.short})`)
        .join('\n');

    return [
        'Hola, quisiera agendar una visita diagnóstica sin cargo.',
        `Nombre: ${data.nombre.trim()}`,
        `Teléfono: ${data.telefono.trim()}`,
        data.edificio.trim() && `Edificio o empresa: ${data.edificio.trim()}`,
        `Servicio de interés: ${data.servicio}`,
        detalle && `Equipos a atender:\n${detalle}`,
        data.mensaje.trim() && `Detalle: ${data.mensaje.trim()}`,
    ].filter(Boolean).join('\n');
};

function Field({ label, error, optional, children, id }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-semibold">
                {label}
                {optional && <span className="font-normal text-on-brand-muted">Opcional</span>}
            </label>
            {children}
            {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-[#ffd9d3]">{error}</p>}
        </div>
    );
}

/** Floor 6. The form has no backend: it hands the request to WhatsApp or the mail client. */
export default function Visit() {
    const uid = useId();
    const [data, setData] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);

    // A "Solicitar este servicio" link arrives with its service in the navigation state.
    const { key: navKey, state: navState } = useLocation();
    const [seenNav, setSeenNav] = useState(null);
    if (seenNav !== navKey) {
        setSeenNav(navKey);
        if (SERVICE_OPTIONS.includes(navState?.servicio)) setData((d) => ({ ...d, servicio: navState.servicio }));
    }

    const set = (e) => {
        const { name, value } = e.target;
        setData((d) => ({ ...d, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const setEquipo = (id, raw) => {
        let n = Math.floor(Number(raw));
        if (!Number.isFinite(n) || n < 0) n = 0;
        if (n > 99) n = 99;
        setData((d) => ({ ...d, equipos: { ...d.equipos, [id]: n } }));
    };

    const totalEquipos = EQUIPMENT_TYPES.reduce((sum, t) => sum + Number(data.equipos[t.id] || 0), 0);

    const check = () => {
        const found = validate(data);
        setErrors(found);
        const first = Object.keys(found)[0];
        if (first) document.getElementById(`${uid}-${first}`)?.focus();
        return !first;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!check()) return;
        window.open(whatsappHref(compose(data)), '_blank', 'noopener');
        setSent(true);
    };

    const onMail = () => {
        if (!check()) return;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Solicitud de visita diagnóstica')}&body=${encodeURIComponent(compose(data))}`;
        setSent(true);
    };

    const fieldProps = (name) => ({
        id: `${uid}-${name}`,
        name,
        value: data[name],
        onChange: set,
        className: 'field',
        'aria-invalid': errors[name] ? 'true' : undefined,
        'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
    });

    return (
        <section id="visita" aria-labelledby="visita-title" className="bg-brand text-on-brand">
            <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-16 lg:px-10">
                <div>
                    <FloorHeader code="6" id="visita-title" title="Inicie su plan de excelencia hoy" onBrand>
                        Complete el formulario y un asesor técnico se comunicará con usted para agendar una visita diagnóstica sin cargo.
                    </FloorHeader>

                    <ul className="mt-12 grid gap-px bg-white/25 sm:grid-cols-2 lg:max-w-2xl">
                        {[
                            { icon: Phone, label: 'Llamadas', value: PHONE_DISPLAY, href: TEL_HREF },
                            { icon: MessageCircle, label: 'WhatsApp', value: PHONE_DISPLAY, href: whatsappHref() },
                            { icon: Mail, label: 'Correo', value: EMAIL, href: `mailto:${EMAIL}` },
                            { icon: MapPin, label: 'Domicilio fiscal', value: ADDRESS },
                        ].map(({ icon, label, value, href }) => {
                            const Icon = icon;
                            const body = (
                                <>
                                    <Icon size={20} className="shrink-0" aria-hidden="true" />
                                    <span className="min-w-0">
                                        <span className="label block text-on-brand-muted">{label}</span>
                                        <span className="mt-1 block font-semibold [overflow-wrap:anywhere]">{value}</span>
                                    </span>
                                </>
                            );
                            return (
                                <li key={label} className="bg-brand">
                                    {href ? (
                                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex min-h-20 items-center gap-4 py-4 pr-4 transition-colors hover:bg-brand-deep sm:px-4">
                                            {body}
                                        </a>
                                    ) : (
                                        <div className="flex min-h-20 items-center gap-4 py-4 pr-4 sm:px-4">{body}</div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-brand-deep p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] sm:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field id={`${uid}-nombre`} label="Nombre y apellido" error={errors.nombre}>
                            <input type="text" autoComplete="name" required {...fieldProps('nombre')} />
                        </Field>
                        <Field id={`${uid}-telefono`} label="Teléfono o WhatsApp" error={errors.telefono}>
                            <input type="tel" inputMode="tel" autoComplete="tel" required placeholder="999 999 999" {...fieldProps('telefono')} />
                        </Field>
                        <Field id={`${uid}-edificio`} label="Edificio o empresa" optional>
                            <input type="text" autoComplete="organization" {...fieldProps('edificio')} />
                        </Field>
                        <Field id={`${uid}-servicio`} label="Servicio de interés">
                            <Select
                                id={`${uid}-servicio`}
                                value={data.servicio}
                                options={SERVICE_OPTIONS}
                                onChange={(v) => setData((d) => ({ ...d, servicio: v }))}
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <div className="mb-1.5 flex items-baseline justify-between text-sm font-semibold">
                                <span>Equipos a atender</span>
                                <span className="font-normal text-on-brand-muted">Opcional</span>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                                {EQUIPMENT_TYPES.map((t) => {
                                    const qty = Number(data.equipos[t.id] || 0);
                                    return (
                                        <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-black/20 px-3 py-2">
                                            <span className="text-sm font-medium leading-snug">{t.label}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setEquipo(t.id, qty - 1)}
                                                    disabled={qty === 0}
                                                    aria-label={`Quitar un equipo: ${t.label}`}
                                                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/25 text-on-brand transition-colors hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent"
                                                >
                                                    <Minus size={15} aria-hidden="true" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="99"
                                                    inputMode="numeric"
                                                    value={qty === 0 ? '' : qty}
                                                    placeholder="0"
                                                    onChange={(e) => setEquipo(t.id, e.target.value)}
                                                    aria-label={`Cantidad de ${t.label}`}
                                                    className="no-spin h-8 w-11 rounded-lg border border-white/25 bg-transparent text-center text-sm font-semibold text-on-brand outline-none transition-colors focus:border-led"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEquipo(t.id, qty + 1)}
                                                    aria-label={`Agregar un equipo: ${t.label}`}
                                                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/25 text-on-brand transition-colors hover:bg-white/10 active:scale-95"
                                                >
                                                    <Plus size={15} aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="mt-2 text-sm text-on-brand-muted">
                                {totalEquipos > 0
                                    ? `Total: ${totalEquipos} ${totalEquipos === 1 ? 'equipo' : 'equipos'}. Se detallarán por tipo en su solicitud.`
                                    : 'Indique la cantidad por tipo de equipo.'}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <Field id={`${uid}-mensaje`} label="Cuéntenos qué necesita" optional>
                                <textarea rows={3} {...fieldProps('mensaje')} className="field resize-y" />
                            </Field>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <button type="submit" className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-white px-5 text-[0.95rem] font-bold uppercase tracking-wide text-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgb(255_61_46/0.6)] active:scale-[0.97]">
                            <MessageCircle size={20} aria-hidden="true" /> Enviar por WhatsApp
                        </button>
                        <button type="button" onClick={onMail} className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border border-white/45 px-5 text-[0.95rem] font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 active:scale-[0.97]">
                            <Mail size={20} aria-hidden="true" /> Por correo
                        </button>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-on-brand-muted" role="status">
                        {sent
                            ? `Abrimos su aplicación con la solicitud lista para enviar. Si no se abrió, llámenos al ${PHONE_DISPLAY}.`
                            : 'Al enviar se abrirá WhatsApp o su correo con la solicitud ya redactada. Usted confirma el envío.'}
                    </p>
                </form>
            </div>
        </section>
    );
}
