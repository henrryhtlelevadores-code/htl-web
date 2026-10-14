// The one public address of the site. The bare domain and http redirect here (set in the host).
export const SITE_URL = 'https://www.htl-elevadores.com';

// One entry per indexable page. Titles run 50–60 characters and descriptions 150–160, each unique;
// `scripts/check-seo.mjs` fails when one falls outside that or when the sitemap misses a path.
// The home entry is also written by hand in index.html. The build writes each of the others to
// its own HTML file (`<path>.html`, see vite.config.js), so a crawler that does not run
// JavaScript, such as the ones behind link previews, still reads the right page.
export const PAGES = {
    home: {
        path: '/',
        title: 'Mantenimiento de Ascensores en Lima | HTL Elevadores',
        description: 'Mantenimiento, reparación y modernización multimarca de ascensores en Lima, con emergencias 24/7. Agende una visita diagnóstica sin cargo para su edificio.',
    },
    productos: {
        path: '/productos',
        title: 'Productos de Limpieza ProClean en Lima | HTL Elevadores',
        description: 'Catálogo ProClean de limpieza profesional para ascensores y edificios: limpiadores, desinfectantes y desengrasantes. Consulte el stock por WhatsApp hoy.',
    },
    royal: {
        path: '/productos-royal',
        title: 'Productos Royal Prestige para su Hogar | HTL Elevadores',
        description: 'Conozca la línea Royal Prestige que HTL lleva a los edificios de Lima: sets de ollas, sartenes y utensilios de cocina. Solicite una asesoría personalizada.',
    },
    avisoLegal: {
        path: '/aviso-legal',
        title: 'Aviso Legal y Datos de la Empresa | HTL Elevadores',
        description: 'Datos identificativos de HTL ELEVADORES S.A.C.: razón social, RUC, domicilio legal en Surquillo y representante. Consulte quién es el titular de este sitio.',
    },
    terminos: {
        path: '/terminos-y-condiciones',
        title: 'Términos y Condiciones de Uso del Sitio | HTL Elevadores',
        description: 'Condiciones que regulan el uso del sitio de HTL Elevadores: servicios, propiedad intelectual, responsabilidad y ley aplicable. Léalas antes de contratar.',
    },
    privacidad: {
        path: '/politicas-de-privacidad',
        title: 'Política de Privacidad y Datos Personales | HTL Elevadores',
        description: 'Cómo trata HTL Elevadores sus datos personales según la Ley N° 29733: finalidades, plazos, seguridad y cómo ejercer sus derechos ARCO. Conozca los detalles.',
    },
    cookies: {
        path: '/politica-de-cookies',
        title: 'Política de Cookies del Sitio Web | HTL Elevadores',
        description: 'Este sitio no instala cookies ni guarda datos en su dispositivo. Revise qué tecnologías usamos, cuáles no, y cómo gestionar las cookies desde su navegador.',
    },
};

// The page the host serves, with a 404 status, for any other address.
export const NOT_FOUND = {
    title: 'Página no encontrada | HTL Elevadores',
    description: 'La página que busca no existe o cambió de dirección. Vuelva al inicio de HTL Elevadores o agende su visita diagnóstica sin cargo.',
};
