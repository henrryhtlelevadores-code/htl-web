import LegalPage, { Lead, List, P } from './LegalPage';
import { LEGAL_NAME } from '../data/site';

const term = (name, text) => (
    <>
        <strong className="font-semibold text-ink">{name}:</strong> {text}
    </>
);

// Keep this page in step with the site: it describes what the site really stores, which today is
// nothing. Rewrite the second section when a cookie or any stored preference is introduced.
const sections = [
    {
        title: '¿Qué son las cookies?',
        body: (
            <P>
                Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario al visitar un sitio web. Permiten recordar preferencias, analizar el uso del sitio y personalizar la experiencia. Los navegadores ofrecen además un almacenamiento local que cumple la misma función de recordar datos en el dispositivo, y que esta política trata del mismo modo.
            </P>
        ),
    },
    {
        title: 'Qué utiliza este sitio',
        body: (
            <>
                <P>
                    Este sitio no instala cookies ni guarda ningún otro dato en el dispositivo del usuario: no utiliza el almacenamiento local del navegador ni recuerda preferencias entre una visita y otra.
                </P>
                <Lead>Lo que este sitio no utiliza:</Lead>
                <List
                    items={[
                        term('Analíticas', 'no se mide el tráfico ni el comportamiento con Google Analytics, Matomo u otras herramientas.'),
                        term('Publicitarias o de marketing', 'no hay Meta Pixel, Google Ads ni remarketing.'),
                        term('Redes sociales', 'no hay botones de compartir ni contenido embebido de terceros.'),
                    ]}
                />
            </>
        ),
    },
    {
        title: 'Gestión del consentimiento',
        body: (
            <P>
                Como el sitio no guarda nada en el dispositivo, no hay nada que consentir y no se muestra un banner de cookies. Si en el futuro se incorporan cookies analíticas, publicitarias o de redes sociales, no se cargarán antes del consentimiento expreso del usuario: se le presentará un aviso con las opciones de aceptar, rechazar o configurar por categoría, y esta política se actualizará para detallarlas.
            </P>
        ),
    },
    {
        title: 'Cómo deshabilitar o borrar los datos desde el navegador',
        body: (
            <>
                <List
                    items={[
                        term('Chrome', 'Configuración → Privacidad y seguridad → Cookies.'),
                        term('Firefox', 'Preferencias → Privacidad y seguridad.'),
                        term('Safari', 'Preferencias → Privacidad.'),
                        term('Edge', 'Configuración → Cookies y permisos del sitio.'),
                    ]}
                />
                <P>Bloquear las cookies desde el navegador no afecta el funcionamiento de este sitio.</P>
            </>
        ),
    },
    {
        title: 'Cookies de terceros',
        body: (
            <P>
                Este sitio no instala cookies de terceros. Contiene enlaces a servicios externos, como WhatsApp, que al abrirse pueden usar sus propias cookies y tratar los datos del usuario conforme a sus propias políticas. {LEGAL_NAME} no controla dichos tratamientos.
            </P>
        ),
    },
    {
        title: 'Actualizaciones',
        body: <P>Esta política puede modificarse cuando cambien las cookies utilizadas o la normativa aplicable.</P>,
    },
];

const CookiesPage = () => (
    <LegalPage seo="cookies" title="Política de cookies" note="Última actualización: octubre de 2025" sections={sections} />
);

export default CookiesPage;
