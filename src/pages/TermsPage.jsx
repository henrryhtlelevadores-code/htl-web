import { Link } from 'react-router-dom';
import LegalPage, { Facts, List, Mail, P } from './LegalPage';
import { COMPLAINTS_EVENT, EMAIL, LEGAL_NAME, LEGAL_REPRESENTATIVE, RUC } from '../data/site';

const inline = 'font-semibold text-ink underline';

const sections = [
    {
        title: 'Identificación del titular',
        body: (
            <P>
                El presente documento regula el uso del sitio web titularidad de {LEGAL_NAME}, con RUC {RUC}, con domicilio legal en Cal. Laurel Rosa Mz. G1 Lote 14, Surquillo, Lima, Perú, debidamente representada por su Gerente General, {LEGAL_REPRESENTATIVE}.
            </P>
        ),
    },
    {
        title: 'Aceptación de los Términos',
        body: (
            <P>
                El acceso y uso del sitio web atribuye la condición de Usuario y supone la aceptación plena, expresa y sin reservas de los presentes Términos y Condiciones, así como de la <Link to="/politicas-de-privacidad" className={inline}>Política de Privacidad</Link> y la <Link to="/politica-de-cookies" className={inline}>Política de Cookies</Link>. Si el Usuario no está de acuerdo con alguna de estas condiciones, deberá abstenerse de utilizar el sitio.
            </P>
        ),
    },
    {
        title: 'Capacidad legal',
        body: (
            <P>
                El Usuario declara ser mayor de edad y contar con la capacidad legal necesaria para contratar los servicios ofrecidos por {LEGAL_NAME}, conforme al artículo 42 del Código Civil peruano. En caso de actuar en representación de una persona jurídica, declara contar con facultades suficientes.
            </P>
        ),
    },
    {
        title: 'Prestación de servicios',
        body: (
            <>
                <P>{LEGAL_NAME} ofrece servicios de:</P>
                <List
                    items={[
                        'Mantenimiento preventivo y correctivo de ascensores, montacargas y plataformas.',
                        'Modernización de sistemas de transporte vertical.',
                        'Instalación de nuevos equipos.',
                        'Asesoría técnica especializada.',
                    ]}
                />
                <P>
                    La solicitud de presupuesto a través del sitio web no constituye contrato vinculante. La relación contractual se perfeccionará únicamente mediante la suscripción de un contrato de servicios por escrito, conforme al artículo 1351 del Código Civil y a la Ley N° 27291 sobre manifestación de voluntad por medios electrónicos.
                </P>
            </>
        ),
    },
    {
        title: 'Uso adecuado del sitio web',
        body: (
            <>
                <P>El Usuario se compromete a utilizar el sitio web de forma diligente y lícita, absteniéndose de:</P>
                <List
                    items={[
                        'Realizar actividades contrarias a la ley, la moral o el orden público.',
                        'Difundir contenidos ilícitos, difamatorios, discriminatorios o violentos.',
                        'Introducir virus, malware o cualquier código dañino.',
                        'Intentar acceder a áreas restringidas del sistema.',
                        'Recopilar datos de otros usuarios sin consentimiento.',
                        `Suplantar la identidad de ${LEGAL_NAME} o de terceros.`,
                    ]}
                />
                <P>El incumplimiento faculta a {LEGAL_NAME} a bloquear el acceso y a ejercer las acciones legales que correspondan.</P>
            </>
        ),
    },
    {
        title: 'Propiedad intelectual e industrial',
        body: (
            <>
                <P>
                    Todos los contenidos del sitio web (textos, gráficos, logotipos, imágenes, videos, software, bases de datos, diseño y código fuente) son propiedad exclusiva de {LEGAL_NAME} o de sus licenciantes, y están protegidos por:
                </P>
                <List
                    items={[
                        'Decreto Legislativo N° 822 – Ley sobre el Derecho de Autor.',
                        'Decisión 486 de la Comunidad Andina – Régimen Común sobre Propiedad Industrial.',
                        'Decisión 351 de la Comunidad Andina – Régimen Común sobre Derecho de Autor.',
                    ]}
                />
                <P>
                    Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación sin autorización previa y por escrito.
                </P>
            </>
        ),
    },
    {
        title: 'Protección de datos personales',
        body: (
            <P>
                {LEGAL_NAME} trata los datos personales de los usuarios conforme a la Ley N° 29733, Ley de Protección de Datos Personales, su Reglamento aprobado por D.S. N° 003-2013-JUS, y demás normativa aplicable. Para mayor detalle, el Usuario debe consultar la <Link to="/politicas-de-privacidad" className={inline}>Política de Privacidad</Link> disponible en este sitio.
            </P>
        ),
    },
    {
        title: 'Cookies',
        body: (
            <P>
                El sitio web puede utilizar cookies propias y de terceros. El Usuario puede configurar su navegador para rechazarlas, aunque ello podría afectar la funcionalidad del sitio. Para más información, consulte la <Link to="/politica-de-cookies" className={inline}>Política de Cookies</Link>.
            </P>
        ),
    },
    {
        title: 'Enlaces a sitios de terceros',
        body: (
            <P>
                El sitio web puede contener enlaces a páginas externas. {LEGAL_NAME} no controla ni se responsabiliza por el contenido, políticas o prácticas de dichos sitios. La inclusión de un enlace no implica respaldo o asociación alguna.
            </P>
        ),
    },
    {
        title: 'Limitación de responsabilidad',
        body: (
            <>
                <P>En la máxima medida permitida por la legislación peruana, {LEGAL_NAME} no será responsable por:</P>
                <List
                    items={[
                        'Daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso del sitio web.',
                        'Interrupciones, errores o fallos técnicos ajenos a su control.',
                        'Contenidos publicados por terceros o por usuarios.',
                        'Uso indebido de la información contenida en el sitio.',
                    ]}
                />
                <P>
                    Esta limitación no afecta los derechos que la Ley N° 29571, Código de Protección y Defensa del Consumidor, reconoce a los consumidores.
                </P>
            </>
        ),
    },
    {
        title: 'Indemnidad',
        body: (
            <P>
                El Usuario se obliga a indemnizar y mantener indemne a {LEGAL_NAME}, sus socios, directivos, empleados y colaboradores, frente a cualquier reclamación, demanda, sanción o gasto (incluidos honorarios profesionales) derivado del uso indebido del sitio o del incumplimiento de estos Términos.
            </P>
        ),
    },
    {
        title: 'Modificaciones',
        body: (
            <P>
                {LEGAL_NAME} se reserva el derecho de modificar unilateralmente, en cualquier momento y sin previo aviso, la presentación, configuración y contenido del sitio web, así como los presentes Términos y Condiciones. Las modificaciones entrarán en vigor desde su publicación. El uso continuado del sitio implica su aceptación.
            </P>
        ),
    },
    {
        title: 'Nulidad parcial',
        body: (
            <P>
                Si alguna cláusula de estos Términos fuese declarada nula o ineficaz por autoridad competente, dicha nulidad no afectará la validez del resto, que continuará vigente. La cláusula nula se entenderá sustituida por otra que, respetando la legalidad, se aproxime a la voluntad de las partes.
            </P>
        ),
    },
    {
        title: 'Ley aplicable y jurisdicción',
        body: (
            <>
                <P>
                    Los presentes Términos y Condiciones se rigen por la legislación de la República del Perú. Para cualquier controversia derivada de su interpretación o cumplimiento, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Lima, salvo que el Usuario ostente la condición de consumidor, en cuyo caso podrá acudir al fuero de su domicilio conforme al Código de Protección y Defensa del Consumidor.
                </P>
                <P>
                    El Usuario puede presentar reclamos ante el INDECOPI o utilizar la plataforma de{' '}
                    <button type="button" onClick={() => window.dispatchEvent(new Event(COMPLAINTS_EVENT))} className={inline}>
                        Libro de Reclamaciones Virtual
                    </button>
                    , accesible desde este sitio.
                </P>
            </>
        ),
    },
    {
        title: 'Contacto',
        body: (
            <>
                <P>Para cualquier consulta sobre estos Términos y Condiciones:</P>
                <Facts
                    rows={[
                        ['Razón social', LEGAL_NAME],
                        ['RUC', RUC],
                        ['Domicilio', 'Cal. Laurel Rosa Mz. G1 Lote 14, Surquillo, Lima – Perú'],
                        ['Correo', <Mail key="mail" address={EMAIL} />],
                        ['Representante legal', `${LEGAL_REPRESENTATIVE} – Gerente General`],
                    ]}
                />
            </>
        ),
    },
];

const TermsPage = () => (
    <LegalPage seo="terminos" title="Términos y condiciones de uso" note="Última actualización: octubre de 2025" sections={sections} />
);

export default TermsPage;
