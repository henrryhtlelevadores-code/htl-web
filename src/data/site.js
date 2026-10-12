export const PHONE_DISPLAY = '+51 963 207 058';
export const PHONE_E164 = '51963207058';
export const TEL_HREF = `tel:+${PHONE_E164}`;
export const EMAIL = 'comercial@htl-elevadores.com';
export const ADDRESS = 'Surquillo, Lima, Perú';
export const LEGAL_NAME = 'HTL ELEVADORES S.A.C.';
export const RUC = '20614626241';

export const whatsappHref = (text = 'Hola, quisiera agendar una visita diagnóstica.') =>
    `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`;

// The building. Each home section is a floor; `code` is what the readout shows.
export const FLOORS = [
    { id: 'lobby', code: 'L', name: 'Lobby' },
    { id: 'respaldo', code: '1', name: 'Respaldo' },
    { id: 'ascensores', code: '2', name: 'Ascensores' },
    { id: 'software', code: '3', name: 'Software' },
    { id: 'facility', code: '4', name: 'Limpieza' },
    { id: 'ambientes', code: '5', name: 'Aromas' },
    { id: 'visita', code: '6', name: 'Visita' },
];

export const floorById = (id) => FLOORS.find((f) => f.id === id);
