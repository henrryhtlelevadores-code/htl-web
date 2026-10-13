import { Link } from 'react-router-dom';
import LegalPage, { Facts, Lead, List, Mail, P } from './LegalPage';
import { EMAIL, LEGAL_NAME, LEGAL_REPRESENTATIVE, RUC } from '../data/site';

// A named item of a list: the term in ink, its explanation after it.
const term = (name, text) => (
    <>
        <strong className="font-semibold text-ink">{name}:</strong> {text}
    </>
);

const sections = [
    {
        title: 'Responsable del tratamiento',
        body: (
            <Facts
                rows={[
                    ['Razón social', LEGAL_NAME],
                    ['RUC', RUC],
                    ['Domicilio', 'Cal. Laurel Rosa Mz. G1 Lote 14, Surquillo, Lima – Perú'],
                    ['Correo de privacidad', <Mail key="mail" address={EMAIL} />],
                    ['Representante legal', LEGAL_REPRESENTATIVE],
                ]}
            />
        ),
    },
    {
        title: 'Finalidades del tratamiento',
        body: (
            <>
                <P>
                    Los datos personales recabados a través de los formularios del sitio web, correo electrónico, WhatsApp, teléfono o de manera presencial, serán tratados para las siguientes finalidades:
                </P>
                <Lead>Finalidades necesarias (no requieren consentimiento adicional):</Lead>
                <List
                    items={[
                        'Atender consultas, solicitudes de información y cotizaciones.',
                        'Coordinar visitas técnicas y diagnósticos presenciales.',
                        'Elaborar presupuestos y, en su caso, ejecutar la relación contractual.',
                        'Facturación y cumplimiento de obligaciones tributarias ante SUNAT.',
                        'Gestión posventa y garantías.',
                    ]}
                />
                <Lead>Finalidades adicionales (requieren consentimiento expreso):</Lead>
                <List
                    items={[
                        'Envío de comunicaciones comerciales, boletines y promociones.',
                        'Realización de encuestas de satisfacción.',
                        'Remisión de información sobre nuevos productos o servicios.',
                    ]}
                />
                <P>El usuario podrá oponerse en cualquier momento a las finalidades adicionales sin que ello afecte la prestación del servicio.</P>
            </>
        ),
    },
    {
        title: 'Base legal del tratamiento',
        body: (
            <>
                <P>El tratamiento se sustenta en:</P>
                <List
                    items={[
                        'El consentimiento libre, previo, expreso e informado del titular (art. 5 y 6 de la Ley N° 29733).',
                        'La ejecución de la relación contractual o precontractual.',
                        'El cumplimiento de obligaciones legales (tributarias, contables, registrales).',
                        `El interés legítimo de ${LEGAL_NAME} para fines de seguridad y prevención de fraude.`,
                    ]}
                />
            </>
        ),
    },
    {
        title: 'Datos que recopilamos',
        body: (
            <>
                <List
                    items={[
                        term('Datos identificativos', 'nombre, DNI o RUC.'),
                        term('Datos de contacto', 'correo electrónico, teléfono, WhatsApp, dirección.'),
                        term('Datos de la empresa o edificio', 'razón social, dirección del inmueble, características técnicas del equipo.'),
                        term('Datos de navegación', <>dirección IP, tipo de navegador, cookies (ver <Link to="/politica-de-cookies" className="font-semibold text-ink underline">Política de Cookies</Link>).</>),
                    ]}
                />
                <P>
                    No recopilamos datos sensibles (salud, biometría, origen étnico, creencias, etc.) ni datos de menores de edad sin autorización de sus padres o tutores.
                </P>
            </>
        ),
    },
    {
        title: 'Plazo de conservación',
        body: (
            <>
                <P>Los datos personales serán conservados:</P>
                <List
                    items={[
                        'Mientras subsista la relación contractual o comercial.',
                        'Durante los plazos exigidos por la normativa tributaria peruana (mínimo 5 años, conforme al Código Tributario).',
                        'Hasta que el titular solicite su supresión, salvo obligación legal de conservación.',
                    ]}
                />
                <P>Cumplidos los plazos, los datos serán eliminados o anonimizados de forma segura.</P>
            </>
        ),
    },
    {
        title: 'Destinatarios y transferencias',
        body: (
            <>
                <P>Los datos personales no serán vendidos ni cedidos a terceros ajenos a la actividad de {LEGAL_NAME}, salvo:</P>
                <List
                    items={[
                        term('Encargados de tratamiento', 'proveedores de hosting, correo electrónico, servicios de analítica, contabilidad externa, que actúan bajo contrato y con deberes de confidencialidad.'),
                        term('Obligación legal', 'cuando la ley o una autoridad competente lo exija (SUNAT, INDECOPI, Poder Judicial, ANPD).'),
                    ]}
                />
                <P>
                    <strong className="font-semibold text-ink">Transferencias internacionales:</strong> si se contratan servicios en la nube con servidores fuera del Perú (por ejemplo, Google, Microsoft, Meta, WhatsApp), {LEGAL_NAME} verificará que dichos proveedores ofrezcan niveles adecuados de protección conforme al artículo 15 del Reglamento de la Ley 29733.
                </P>
            </>
        ),
    },
    {
        title: 'Medidas de seguridad',
        body: (
            <>
                <P>{LEGAL_NAME} implementa medidas técnicas, organizativas y legales para garantizar la seguridad de los datos personales, entre ellas:</P>
                <List
                    items={[
                        'Cifrado de la comunicación mediante HTTPS/SSL.',
                        'Control de acceso mediante credenciales individuales.',
                        'Copias de respaldo periódicas.',
                        'Políticas internas de confidencialidad para el personal.',
                        'Registro de actividades de tratamiento.',
                    ]}
                />
            </>
        ),
    },
    {
        title: 'Derechos del titular (Derechos ARCO)',
        body: (
            <>
                <P>El titular de los datos puede ejercer en cualquier momento sus derechos de:</P>
                <List
                    items={[
                        term('Acceso', 'conocer qué datos personales tratamos.'),
                        term('Rectificación', 'corregir datos inexactos o incompletos.'),
                        term('Cancelación/Supresión', 'solicitar la eliminación de sus datos.'),
                        term('Oposición', 'oponerse al tratamiento para finalidades específicas.'),
                        term('Información', 'ser informado sobre el tratamiento (art. 19 del Reglamento).'),
                        <><strong className="font-semibold text-ink">Revocación del consentimiento</strong> en cualquier momento.</>,
                    ]}
                />
                <Lead>¿Cómo ejercerlos?</Lead>
                <P>
                    Enviando solicitud por escrito al correo <Mail address={EMAIL} /> o al domicilio legal, adjuntando copia del DNI del titular o documento que acredite representación. Plazo de respuesta: 10 días hábiles conforme a la Ley N° 29733.
                </P>
            </>
        ),
    },
    {
        title: 'Reclamaciones ante la ANPD',
        body: (
            <>
                <P>
                    Si el titular considera que sus derechos no han sido debidamente atendidos, puede acudir a la Autoridad Nacional de Protección de Datos Personales (ANPD), dependiente del Ministerio de Justicia y Derechos Humanos, a través de:
                </P>
                <List
                    items={[
                        <>Portal: <a href="https://www.gob.pe/minjus" target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-ink underline">https://www.gob.pe/minjus</a></>,
                        'Mesa de partes virtual del MINJUSDH',
                    ]}
                />
            </>
        ),
    },
    {
        title: 'Modificaciones',
        body: (
            <P>
                {LEGAL_NAME} se reserva el derecho de modificar la presente Política de Privacidad para adaptarla a novedades legislativas o jurisprudenciales. Las modificaciones serán publicadas en este sitio con indicación de la fecha de actualización. Se recomienda al usuario revisarla periódicamente.
            </P>
        ),
    },
];

const PrivacyPage = () => (
    <LegalPage
        seo="privacidad"
        title="Política de privacidad"
        note="Última actualización: octubre de 2025"
        intro={`En cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales, su Reglamento aprobado por D.S. N° 003-2013-JUS y las directivas emitidas por la Autoridad Nacional de Protección de Datos Personales (ANPD) del Ministerio de Justicia y Derechos Humanos, ${LEGAL_NAME} pone a disposición del usuario la presente Política de Privacidad.`}
        sections={sections}
    />
);

export default PrivacyPage;
