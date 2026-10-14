export const PHONE_DISPLAY = '+51 963 207 058';
export const PHONE_E164 = '51963207058';
export const TEL_HREF = `tel:+${PHONE_E164}`;
export const EMAIL = 'comercial@htl-elevadores.com';
export const ADDRESS = 'Surquillo, Lima, Perú';
export const LEGAL_NAME = 'HTL ELEVADORES S.A.C.';
export const RUC = '20614626241';
export const LEGAL_ADDRESS = 'Cal. Laurel Rosa Mz. G1 Lote 14, Distrito de Surquillo, Provincia y Departamento de Lima, Perú';
export const LEGAL_REPRESENTATIVE = 'Henrry Abner Díaz Cueva';
// Fired by a page that wants the footer to open the complaints book.
export const COMPLAINTS_EVENT = 'htl:libro-de-reclamaciones';

export const whatsappHref = (text = 'Hola, quisiera agendar una visita diagnóstica.') =>
    `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`;

// The building. Each home section is a floor; `code` is what the readout shows.
export const FLOORS = [
    { id: 'lobby', code: 'L', name: 'Lobby' },
    { id: 'respaldo', code: '1', name: 'Nosotros' },
    { id: 'ascensores', code: '2', name: 'Servicios' },
    { id: 'software', code: '3', name: 'Software' },
    { id: 'experiencias', code: '4', name: 'Experiencias' },
    { id: 'facility', code: '5', name: 'Productos' },
    { id: 'ambientes', code: '6', name: 'Aromatizantes' },
    { id: 'visita', code: '7', name: 'Contacto' },
];

export const floorById = (id) => FLOORS.find((f) => f.id === id);
