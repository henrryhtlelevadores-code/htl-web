import preventivo from '../assets/services/preventivo.jpg';
import suministro from '../assets/services/correctivo-suministro.jpg';
import reparacion from '../assets/services/correctivo-reparacion.jpg';
import pulido from '../assets/services/correctivo-pulido.jpg';
import modernizacion from '../assets/services/modernizacion.jpg';
import remozamiento from '../assets/services/remozamiento.jpg';

import arospray from '../assets/brochure/arospray.png';
import arofuserMax from '../assets/brochure/arofuser-max.png';
import arostyler from '../assets/brochure/arostyler.png';
import arostream from '../assets/brochure/arostream.png';

export const METRICS = [
    { value: '25+', label: 'Años en transporte vertical' },
    { value: '30+', label: 'Equipos bajo gestión', note: 'Ascensores, montacargas y plataformas' },
    { value: '18+', label: 'Clientes institucionales y residenciales' },
    { value: '14+', label: 'Contratos vigentes' },
];

// Each brand carries its own identity colour (or gradient), lit on hover. Neutral names rest in Muted.
export const BRANDS = [
    { name: 'OTIS', color: '#005CA9' },
    // TKE's mark is a left-to-right gradient across its own letters.
    { name: 'TKE', gradient: 'linear-gradient(90deg, #3D1DE0 0%, #A62672 50%, #E83916 100%)' },
    { name: 'Schindler', color: '#E3000F' },
    { name: 'KONE', color: '#005BFF' },
    { name: 'BLT', color: '#3B6B9E' },
    { name: 'PowerTech', color: '#2D3D63' },
    { name: 'MP', color: '#5B6A73' },
    { name: 'KOYO', color: '#E60012' },
    { name: 'Orona', color: '#00A532' },
];

// Contractual response times, shown on the emergency block next to the call button.
export const EMERGENCY_SLAS = [
    { label: 'Rescate de personas atrapadas', value: '45 min' },
    { label: 'Fallo técnico en el ascensor', value: '3 h' },
];

// `option` is the entry of SERVICE_OPTIONS the visit form preselects for that service.
export const SERVICES = [
    {
        id: 'preventivo',
        option: 'Mantenimiento preventivo',
        name: 'Mantenimiento preventivo',
        short: 'Menos paradas, más disponibilidad.',
        image: preventivo,
        alt: 'Técnico de HTL midiendo el tablero de control en la sala de máquinas',
        points: [
            'Maximiza la disponibilidad del ascensor y reduce las paradas no planificadas.',
            'Identifica y corrige problemas pequeños antes de que se conviertan en reparaciones costosas.',
            'Cumple de forma integral con las normativas de seguridad vigentes.',
        ],
    },
    {
        id: 'suministro',
        option: 'Mantenimiento correctivo o reparación',
        name: 'Correctivo: suministro',
        short: 'El repuesto correcto, instalado sin demoras.',
        image: suministro,
        alt: 'Técnico de HTL instalando una tarjeta de control nueva junto a la pieza retirada',
        points: [
            'Reemplazo rápido y preciso con repuestos originales y de alta calidad.',
            'Menos tiempo de inactividad gracias a un stock de repuestos estratégico.',
        ],
    },
    {
        id: 'reparacion',
        option: 'Mantenimiento correctivo o reparación',
        name: 'Correctivo: reparación',
        short: 'La avería puntual, resuelta sin cambiar de más.',
        image: reparacion,
        alt: 'Técnico de HTL reparando una tarjeta de control con un cautín',
        points: [
            'Solución eficiente para averías específicas y puntuales.',
            'Restaura la funcionalidad sin reemplazar el componente completo cuando es posible.',
            'Alarga la vida útil de los componentes existentes con intervenciones expertas.',
        ],
    },
    {
        id: 'pulido',
        option: 'Mantenimiento correctivo o reparación',
        name: 'Correctivo: pulido de acero',
        short: 'Cabinas y puertas que vuelven a brillar.',
        image: pulido,
        alt: 'Técnico de HTL puliendo el acero inoxidable de la entrada de una cabina',
        points: [
            'Pulido de acero inoxidable para restaurar la estética de la cabina.',
            'Reduce rayones y marcas de uso en paneles, puertas y marcos.',
            'Recupera el acabado sin reemplazar los paneles.',
        ],
    },
    {
        id: 'modernizacion',
        option: 'Modernización',
        name: 'Modernización, por componentes o total',
        short: 'De 3 o 4 ítems puntuales a la sala de máquinas completa.',
        image: modernizacion,
        alt: 'Técnico de HTL cambiando la botonera de una cabina durante una modernización',
        points: [
            'Por componentes: botoneras, cámaras de seguridad, tarjetas de control o displays.',
            'Total: reemplazo integral de sala de máquinas, tracción y tableros.',
            'Mayor eficiencia energética y un viaje más suave, rápido y confiable.',
        ],
    },
    {
        id: 'remozamiento',
        option: 'Remozamiento de cabina',
        name: 'Remozamiento de cabina',
        short: 'La cabina que sus residentes ven todos los días.',
        image: remozamiento,
        alt: 'Técnico de HTL instalando paneles nuevos en una cabina remozada',
        points: [
            'Falso techo en acero inoxidable 304 con dicroicos LED del color que usted elija.',
            'Paredes laterales y posteriores nuevas en acero inoxidable 304.',
            'Pasamanos, zócalos y vidrio o espejo en la pared posterior.',
        ],
    },
];

// What HTL Móvil, the technicians' app, does in the field.
export const APP_FEATURES = [
    { id: 'offline', title: 'Funciona sin conexión', text: 'Opera completa en sótanos y fosos, y sincroniza sola al recuperar la señal.' },
    { id: 'seguridad', title: 'Seguridad antes que tareas', text: 'Las tareas y las fotos quedan bloqueadas hasta aprobar el checklist de seguridad: EPP, señalización y herramientas.' },
    { id: 'fotos', title: 'Evidencia clasificada', text: 'Cada foto se registra como Antes, Después o Punto de atención.' },
    { id: 'voz', title: 'Hallazgos por nota de voz', text: 'Con las manos ocupadas, el técnico dicta el hallazgo y la app lo transcribe.' },
    { id: 'firma', title: 'Firma en el sitio', text: 'Quien recibe el servicio firma su conformidad en el teléfono del técnico.' },
];

// What each cost centre finds in HTL Panel, its client portal.
export const PANEL_VIEWS = [
    { id: 'equipos', name: 'Equipos', text: 'El inventario de sus equipos con su estado, la última visita y la próxima.' },
    { id: 'ordenes', name: 'Órdenes de trabajo', text: 'Cada orden con su prioridad, el técnico asignado y los tiempos de ejecución.' },
    { id: 'informes', name: 'Informes', text: 'El informe aprobado de cada orden, con el checklist ejecutado por módulo.' },
    { id: 'cotizaciones', name: 'Cotizaciones', text: 'Las cotizaciones pendientes y su historial, con aprobación desde el mismo portal.' },
];

// One work order followed from schedule to approval. Sample data, labelled as such in the UI.
export const ORDER_STEPS = [
    {
        id: 'programa',
        where: 'Web',
        status: 'Pendiente',
        tone: 'amber',
        title: 'Se programa',
        text: 'La ruta preventiva genera la orden y la asigna a un técnico con su prioridad.',
        log: 'Orden generada desde la ruta preventiva',
    },
    {
        id: 'seguridad',
        where: 'App',
        status: 'En curso',
        tone: 'blue',
        title: 'Seguridad primero',
        text: 'Antes de tocar el equipo, el técnico completa el checklist de seguridad.',
        log: 'Checklist de seguridad aprobado',
    },
    {
        id: 'evidencia',
        where: 'App',
        status: 'En curso',
        tone: 'blue',
        title: 'Se ejecuta con evidencia',
        text: 'Cada tarea queda marcada y fotografiada: antes, después y puntos de atención.',
        log: 'Tareas completadas con fotos',
    },
    {
        id: 'firma',
        where: 'App',
        status: 'En revisión',
        tone: 'violet',
        title: 'Usted firma',
        text: 'Quien recibe el servicio firma en el teléfono del técnico al cerrar la orden.',
        log: 'Firma de conformidad registrada',
    },
    {
        id: 'informe',
        where: 'Web',
        status: 'Completada',
        tone: 'green',
        title: 'Se aprueba el informe',
        text: 'Supervisión aprueba el informe y queda disponible en HTL Panel, su portal de cliente.',
        log: 'Informe aprobado y publicado en HTL Panel',
    },
];

export const ACCESSORIES = [
    'Atomizadores con botella graduada',
    'Microfibras',
    'Fibra circular Green Scrub',
    'Fibra circular White Polish',
    'Damp Mop Head Micromop',
    'Funda electrostática Astrolan Dust Mop',
];

export const AROMA_DEVICES = [
    { name: 'Arospray', tech: 'Aerosol programable', volume: 50, image: arospray, alt: 'Equipo de aromatización Arospray' },
    { name: 'Arofuser Max', tech: 'Microdifusión', volume: 1200, image: arofuserMax, alt: 'Equipo de aromatización Arofuser Max' },
    { name: 'Arostyler', tech: 'Microdifusión', volume: 2000, image: arostyler, alt: 'Equipo de aromatización Arostyler' },
    { name: 'Arostream', tech: 'Microdifusión', volume: 3000, image: arostream, alt: 'Equipo de aromatización Arostream' },
];

export const SERVICE_OPTIONS = [
    'Mantenimiento preventivo',
    'Mantenimiento correctivo o reparación',
    'Modernización',
    'Remozamiento de cabina',
    'Nueva instalación',
    'Limpieza y productos ProClean',
    'Aromatización de ambientes',
];

// The real equipment classes HTL services, with the short name used when the request is composed.
export const EQUIPMENT_TYPES = [
    { id: 'pasajeros', label: 'Ascensores de pasajeros', short: 'ascensores' },
    { id: 'montacargas', label: 'Montacargas', short: 'montacargas' },
    { id: 'camilleros', label: 'Camilleros', short: 'camilleros' },
    { id: 'plataformas', label: 'Plataformas', short: 'plataformas' },
    { id: 'montacoches', label: 'Montacoches', short: 'montacoches' },
    { id: 'escaleras', label: 'Escaleras eléctricas', short: 'escaleras eléctricas' },
];
