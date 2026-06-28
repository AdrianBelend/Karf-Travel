import { 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Award,
  Clock
} from 'lucide-react';

export default function ContactSection() {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hola Karf Travels! Me gustaría consultar para contratar un traslado privado.`
    );
    window.open(`https://wa.me/5491112345678?text=${text}`, '_blank');
  };

  return (
    <div id="booking-section" className="bg-slate-50 rounded-3xl border border-gray-150 p-6 md:p-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
          <MessageSquare className="h-3 w-3 text-amber-600" /> Contacto Directo
        </span>
        <h3 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-gray-950 font-sans">
          Reserva Tu Viaje de Forma Inmediata
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-sans">
          ¿Tienes definido tu itinerario o necesitas asesoramiento? Ponte en contacto directo con nuestros asesores para coordinar tu viaje de forma ágil y segura.
        </p>
      </div>

      {/* Grid de Canales Directos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WhatsApp Card */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="bg-white p-6 rounded-2.5xl border border-emerald-100 hover:border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20 text-emerald-950 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between h-48 cursor-pointer group"
        >
          <div className="space-y-3">
            <span className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-xs text-gray-400 font-sans">WhatsApp Express</span>
              <span className="block text-base font-extrabold text-emerald-900 mt-1 font-sans">Chatear con un Asesor</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full pt-2 text-xs font-bold text-emerald-700 font-sans">
            <span>Conversar ahora</span>
            <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Phone Card */}
        <a
          href="tel:+5491112345678"
          className="bg-white p-6 rounded-2.5xl border border-amber-100 hover:border-amber-200 bg-amber-50/5 hover:bg-amber-50/15 text-amber-950 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between h-48 group"
        >
          <div className="space-y-3">
            <span className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-xs text-gray-400 font-sans">Atención Telefónica</span>
              <span className="block text-base font-extrabold text-amber-950 mt-1 font-sans">+54 9 11 1234 5678</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full pt-2 text-xs font-bold text-amber-800 font-sans">
            <span>Llamar ahora</span>
            <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        </a>

        {/* Email Card */}
        <a
          href="mailto:reservas@karftravels.com"
          className="bg-white p-6 rounded-2.5xl border border-gray-150 hover:border-gray-250 bg-gray-50/20 hover:bg-gray-50/45 text-gray-900 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between h-48 group"
        >
          <div className="space-y-3">
            <span className="h-10 w-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-xs text-gray-400 font-sans">Correo Electrónico</span>
              <span className="block text-base font-extrabold text-gray-800 mt-1 font-sans font-sans">reservas@karftravels.com</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full pt-2 text-xs font-bold text-gray-600 font-sans">
            <span>Escribir correo</span>
            <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        </a>

      </div>

      {/* Banner de Garantías en Ruta */}
      <div className="bg-gradient-to-br from-slate-950 via-amber-950/10 to-slate-900 border border-gray-800 text-white rounded-2.5xl p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Garantía de Ruta y Confiabilidad
            </span>
            <h4 className="font-extrabold text-lg md:text-xl font-display">Choferes Profesionales y Flota Verificada</h4>
            <p className="text-[12px] text-gray-300 leading-relaxed font-sans">
              Nuestra premisa es la total tranquilidad de vuestro grupo. Aseguramos que todas las unidades son sometidas a mantenimiento preventivo quincenal y poseen sus pólizas de transportación vigentes del tipo comercial con habilitaciones vigentes.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
              <Award className="h-5 w-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="block text-[11px] font-bold text-gray-100 font-sans">Habilitación Oficial</span>
                <span className="block text-[9.5px] text-gray-400 font-sans">Transporte de Pasajeros</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="block text-[11px] font-bold text-gray-100 font-sans">Puntualidad de Ruta</span>
                <span className="block text-[9.5px] text-gray-400 font-sans">Coordinación Satelital Directa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
