import LegalPage, { Facts, Mail, P } from './LegalPage';
import { EMAIL, LEGAL_ADDRESS, LEGAL_NAME, LEGAL_REPRESENTATIVE, RUC } from '../data/site';

const sections = [
    {
        title: 'Datos del titular',
        body: (
            <Facts
                rows={[
                    ['Razón social', LEGAL_NAME],
                    ['RUC', RUC],
                    ['Tipo de sociedad', 'Sociedad Anónima Cerrada'],
                    ['Fecha de inscripción', '14 de agosto de 2025'],
                    ['Fecha de inicio de actividades', '22 de agosto de 2025'],
                    ['Estado', 'Activo – Habido'],
                    ['Domicilio legal', LEGAL_ADDRESS],
                    ['Actividad económica principal (CIIU 3312)', 'Reparación de maquinaria'],
                    ['Actividad secundaria (CIIU 36996)', 'Otras industrias manufactureras NCP'],
                    ['Representante legal / Gerente General', LEGAL_REPRESENTATIVE],
                    ['Correo electrónico de contacto', <Mail key="mail" address={EMAIL} />],
                    ['Sistema de emisión de comprobantes', 'Computarizado'],
                    ['Comprobantes electrónicos autorizados', 'Factura electrónica (desde 20/09/2025) y Boleta electrónica (desde 30/10/2025)'],
                ]}
            />
        ),
    },
    {
        title: 'Objeto del sitio web',
        body: (
            <P>
                Este sitio web tiene como finalidad brindar información sobre los servicios de mantenimiento, modernización e instalación de transporte vertical (ascensores, montacargas, plataformas y similares) ofrecidos por {LEGAL_NAME}, así como permitir a los usuarios solicitar presupuestos y ponerse en contacto con la empresa.
            </P>
        ),
    },
    {
        title: 'Condiciones de uso',
        body: (
            <P>
                El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de las presentes condiciones. El usuario se compromete a hacer un uso lícito del sitio, absteniéndose de cualquier conducta que pueda dañar la imagen, los intereses o los derechos de {LEGAL_NAME} o de terceros.
            </P>
        ),
    },
    {
        title: 'Propiedad intelectual',
        body: (
            <P>
                Todos los contenidos del sitio (textos, marcas, logotipos, imágenes, diseño, código fuente) son de titularidad de {LEGAL_NAME} o de terceros que han autorizado su uso, y se encuentran protegidos por la Decisión 486 de la Comunidad Andina (Régimen Común sobre Propiedad Industrial) y por el Decreto Legislativo N° 822 (Ley sobre el Derecho de Autor). Queda prohibida su reproducción total o parcial sin autorización previa y escrita.
            </P>
        ),
    },
    {
        title: 'Responsabilidad',
        body: (
            <P>
                {LEGAL_NAME} no se responsabiliza por interrupciones del servicio, errores en los contenidos, ni por el uso indebido que los usuarios hagan del sitio. La información publicada tiene carácter informativo y no constituye oferta vinculante hasta la firma del contrato correspondiente.
            </P>
        ),
    },
];

const LegalNoticePage = () => (
    <LegalPage
        seo="avisoLegal"
        title="Aviso legal"
        note="Última actualización: octubre de 2025"
        intro="En cumplimiento de lo dispuesto por la Ley N° 27291 (Ley que modifica el Código Civil permitiendo la utilización de los medios electrónicos para la manifestación de voluntad) y la Ley N° 29571, Código de Protección y Defensa del Consumidor, se informa al usuario de los datos identificativos del titular de este sitio web."
        sections={sections}
    />
);

export default LegalNoticePage;
