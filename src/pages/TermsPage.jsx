import LegalPage from './LegalPage';

const sections = [
    {
        title: "1. Aceptación de Términos",
        content: "Al acceder y utilizar el sitio web de HTL Elevadores, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web."
    },
    {
        title: "2. Prestación de Servicios",
        content: "HTL Elevadores ofrece servicios de mantenimiento, modernización e instalación de transporte vertical. La solicitud de presupuesto a través de la web no constituye un contrato vinculante hasta que sea ratificado por un contrato de servicios formal."
    },
    {
        title: "3. Propiedad Intelectual",
        content: "Todo el contenido presente en este sitio, incluyendo textos, gráficos, logotipos, imágenes y software, es propiedad de HTL Elevadores y está protegido por las leyes de propiedad intelectual internacionales."
    },
    {
        title: "4. Limitación de Responsabilidad",
        content: "HTL Elevadores no será responsable de ningún daño indirecto, incidental o consecuente que surja del uso o la imposibilidad de uso de nuestro sitio web o servicios en línea."
    }
];

const TermsPage = () => (
    <LegalPage title="Términos y condiciones" note="Última actualización: febrero de 2024" sections={sections} />
);

export default TermsPage;
