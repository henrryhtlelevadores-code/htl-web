import LegalPage from './LegalPage';

const sections = [
    {
        title: "Recopilación de Información",
        content: "Recopilamos información personal que usted nos proporciona voluntariamente a través de nuestro formulario de contacto, como su nombre, teléfono y dirección del edificio, con el único fin de brindar una asesoría técnica especializada."
    },
    {
        title: "Uso de Datos",
        content: "Los datos recopilados se utilizan exclusivamente para: contactar al cliente, realizar diagnósticos técnicos presenciales y enviar presupuestos solicitados."
    },
    {
        title: "Protección de Información",
        content: "Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la alteración o la divulgación."
    },
    {
        title: "Sus Derechos",
        content: "Usted tiene derecho a solicitar el acceso, rectificación o eliminación de sus datos personales de nuestra base de datos en cualquier momento a través de nuestros canales de contacto oficiales."
    }
];

const PrivacyPage = () => (
    <LegalPage title="Política de privacidad" note="Cómo tratamos los datos que usted nos confía." sections={sections} />
);

export default PrivacyPage;
