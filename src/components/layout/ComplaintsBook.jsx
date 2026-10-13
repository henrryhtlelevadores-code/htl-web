import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Send, Book } from 'lucide-react';
import { EMAIL } from '../../data/site';
import { track } from '../../lib/analytics';

// The sheet as it is sent, field by field.
const compose = (d) => [
    'HOJA DE RECLAMACIÓN',
    `Fecha: ${new Date().toLocaleDateString('es-PE')}`,
    '',
    '1. Consumidor reclamante',
    `Nombre o razón social: ${d.nombreRazonSocial.trim()}`,
    `Documento: ${d.tipoDocumento} ${d.numeroDocumento.trim()}`,
    `Dirección: ${d.direccion.trim()}`,
    `Celular: ${d.celular.trim()}`,
    `Correo: ${d.correo.trim()}`,
    '',
    '2. Bien contratado y detalle',
    `Tipo de registro: ${d.tipoRegistro}`,
    `Tipo de bien: ${d.tipoBien}`,
    `Comprobante: ${d.tipoComprobante}${d.nombreComprobante.trim() ? ` ${d.nombreComprobante.trim()}` : ''}`,
    d.detalleBien.trim() ? `Descripción del bien o servicio: ${d.detalleBien.trim()}` : null,
    `Detalle: ${d.detalleReclamo.trim()}`,
    d.pedidoCliente.trim() ? `Pedido del consumidor: ${d.pedidoCliente.trim()}` : null,
    '',
    'Declaro ser el titular del contenido de este formulario, manifestando bajo declaración jurada los hechos descritos en él.',
].filter((line) => line !== null).join('\n');

const ComplaintsBook = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        nombreRazonSocial: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        direccion: '',
        celular: '',
        correo: '',
        tipoRegistro: 'Reclamo',
        tipoBien: 'Servicio',
        tipoComprobante: 'Sin Comprobante',
        nombreComprobante: '',
        detalleBien: '',
        detalleReclamo: '',
        pedidoCliente: '',
        conformidad: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nombreRazonSocial.trim()) newErrors.nombreRazonSocial = 'El nombre o razón social es obligatorio';
        if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = 'El número de documento es obligatorio';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
        if (!formData.celular.trim()) newErrors.celular = 'El celular es obligatorio';
        if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'El correo no es válido';
        if (!formData.detalleReclamo.trim()) newErrors.detalleReclamo = 'El detalle es obligatorio';
        if (!formData.conformidad) newErrors.conformidad = 'Debe aceptar la declaración jurada';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // There is no server behind this form: the sheet is handed to the visitor's mail client,
            // addressed to the company, and it is sent (and kept as a copy) from their own account.
            const subject = `Libro de Reclamaciones: ${formData.tipoRegistro} de ${formData.nombreRazonSocial.trim()}`;
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(formData))}`;
            track('form_submit', { form: 'libro-de-reclamaciones', channel: 'correo' });
            alert(`Abrimos su correo con la hoja de reclamación ya redactada. Envíela para que quede registrada: conservará una copia en sus enviados. Si su correo no se abrió, escríbanos a ${EMAIL}.`);
            onClose();
            setFormData({
                nombreRazonSocial: '',
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                direccion: '',
                celular: '',
                correo: '',
                tipoRegistro: 'Reclamo',
                tipoBien: 'Servicio',
                tipoComprobante: 'Sin Comprobante',
                nombreComprobante: '',
                detalleBien: '',
                detalleReclamo: '',
                pedidoCliente: '',
                conformidad: false
            });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-[#1F1F1F] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                    <Book size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-800 text-white uppercase tracking-tight">Libro de Reclamaciones</h2>
                                    <p className="text-slate-500 text-xs">HTL Elevadores S.A.C.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Section 1: Personal Info */}
                                <div>
                                    <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">1. Identificación del Consumidor</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Nombre / Razón Social *</label>
                                            <input
                                                type="text" name="nombreRazonSocial" value={formData.nombreRazonSocial} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.nombreRazonSocial ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                placeholder="Ej: Juan Perez o Empresa S.A.C."
                                            />
                                            {errors.nombreRazonSocial && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.nombreRazonSocial}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Tipo de Documento</label>
                                            <select
                                                name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}
                                                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                            >
                                                <option value="DNI">DNI</option>
                                                <option value="Carne de Extrangeria">Carné de Extranjería</option>
                                                <option value="Pasaporte">Pasaporte</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Número de Documento *</label>
                                            <input
                                                type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.numeroDocumento ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                placeholder="Número de DNI/CE/Pasaporte"
                                            />
                                            {errors.numeroDocumento && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.numeroDocumento}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Dirección Completa *</label>
                                            <input
                                                type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.direccion ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                placeholder="Calle, Número, Distrito, Ciudad"
                                            />
                                            {errors.direccion && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.direccion}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Celular / Teléfono *</label>
                                            <input
                                                type="tel" name="celular" value={formData.celular} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.celular ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                placeholder="+51 999 999 999"
                                            />
                                            {errors.celular && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.celular}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Correo Electrónico *</label>
                                            <input
                                                type="email" name="correo" value={formData.correo} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.correo ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                placeholder="ejemplo@correo.com"
                                            />
                                            {errors.correo && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.correo}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Details */}
                                <div>
                                    <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">2. Detalle de la Reclamación</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Tipo de Registro</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 text-white cursor-pointer group">
                                                    <input type="radio" name="tipoRegistro" value="Queja" checked={formData.tipoRegistro === 'Queja'} onChange={handleChange} className="accent-primary" />
                                                    <span className="text-sm">Queja</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-white cursor-pointer group">
                                                    <input type="radio" name="tipoRegistro" value="Reclamo" checked={formData.tipoRegistro === 'Reclamo'} onChange={handleChange} className="accent-primary" />
                                                    <span className="text-sm">Reclamo</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Tipo de Bien</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                                    <input type="radio" name="tipoBien" value="Producto" checked={formData.tipoBien === 'Producto'} onChange={handleChange} className="accent-primary" />
                                                    <span className="text-sm">Producto</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                                    <input type="radio" name="tipoBien" value="Servicio" checked={formData.tipoBien === 'Servicio'} onChange={handleChange} className="accent-primary" />
                                                    <span className="text-sm">Servicio</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Comprobante</label>
                                            <select
                                                name="tipoComprobante" value={formData.tipoComprobante} onChange={handleChange}
                                                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                            >
                                                <option value="Factura">Factura</option>
                                                <option value="Boleta">Boleta</option>
                                                <option value="Recibo">Recibo</option>
                                                <option value="Sin Comprobante">Sin Comprobante</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">N° o Nombre de Comprobante</label>
                                            <input
                                                type="text" name="nombreComprobante" value={formData.nombreComprobante} onChange={handleChange}
                                                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                                placeholder="Ej: F001-000123"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Detalle de producto o servicio</label>
                                            <textarea
                                                name="detalleBien" value={formData.detalleBien} onChange={handleChange}
                                                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                                rows="2" placeholder="Especifique el producto o servicio adquirido..."
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Detalle de queja o reclamo *</label>
                                            <textarea
                                                name="detalleReclamo" value={formData.detalleReclamo} onChange={handleChange}
                                                className={`w-full bg-[#2A2A2A] border ${errors.detalleReclamo ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none`}
                                                rows="4" placeholder="Describa ampliamente los hechos ocurridos..."
                                            ></textarea>
                                            {errors.detalleReclamo && <p className="text-accent text-[10px] mt-1 uppercase font-bold">{errors.detalleReclamo}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-bold uppercase mb-2">Pedido del cliente</label>
                                            <textarea
                                                name="pedidoCliente" value={formData.pedidoCliente} onChange={handleChange}
                                                className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                                rows="2" placeholder="¿Qué solución espera recibir?"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Consent */}
                                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                                    <label className="flex gap-4 cursor-pointer">
                                        <input
                                            type="checkbox" name="conformidad" checked={formData.conformidad} onChange={handleChange}
                                            className="w-5 h-5 accent-primary mt-1"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-white text-sm font-bold">Conformidad de envío</p>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                Declaro ser el titular del contenido del presente formulario, manifestando bajo declaración jurada los hechos descritos en él.
                                            </p>
                                            {errors.conformidad && <p className="text-accent text-[10px] uppercase font-bold mt-1">{errors.conformidad}</p>}
                                        </div>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-brand-deep text-white font-800 py-4 rounded-xl shadow-xl shadow-primary/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors"
                                    >
                                        <Send size={18} />
                                        Enviar Reclamación
                                    </Motion.button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="sm:w-32 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComplaintsBook;
