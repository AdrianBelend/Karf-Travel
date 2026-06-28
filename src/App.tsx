import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle, Booking } from './types';
import { FLEET, getInitialBookings } from './utils/data';
import TripCalculator from './components/TripCalculator';
import AvailabilityChecker from './components/AvailabilityChecker';
import ContactSection from './components/ContactSection';
import BookingModal from './components/BookingModal';
import BrandLogo from './components/BrandLogo';
import { 
  Bus, 
  MapPin, 
  Users, 
  Milestone, 
  CalendarDays, 
  CheckCircle, 
  ShieldCheck, 
  Briefcase, 
  ChevronRight, 
  Info, 
  Trash2, 
  PhoneCall, 
  Sparkle,
  BadgeAlert,
  ClipboardList
} from 'lucide-react';

export default function App() {
  // Cargar reservas guardadas de localStorage o semillas base
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('karftravels_reservas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local bookings', e);
      }
    }
    return getInitialBookings();
  });

  // Persistir reservas al cambiar el estado
  useEffect(() => {
    localStorage.setItem('karftravels_reservas', JSON.stringify(bookings));
  }, [bookings]);

  // Estados de control de Fechas y Reservas
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Estados para abrir el Modal de Reserva desde el Calculador
  const [targetVehicle, setTargetVehicle] = useState<Vehicle | null>(null);
  const [calcKms, setCalcKms] = useState<number>(100);
  const [calcDays, setCalcDays] = useState<number>(1);
  const [calcPassengers, setCalcPassengers] = useState<number>(8);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notificación local tipo Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Mostrar mensaje temporal
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Manejar creación de reserva exitosa
  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setIsModalOpen(false);
    triggerToast(`¡Reserva ${newBooking.id} creada con éxito! El vehículo ya se encuentra bloqueado.`, 'success');
    
    // Auto Scroll hacia el calendario o mis reservas
    setTimeout(() => {
      const el = document.getElementById('my-bookings-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  // Cancelar una reserva (libera la fecha en el calendario)
  const handleCancelBooking = (bookingId: string) => {
    if (confirm('¿Está seguro de que desea cancelar esta reserva? Esta acción liberará el espacio en el calendario de forma inmediata.')) {
      setBookings((prev) => prev.filter(b => b.id !== bookingId));
      triggerToast('Reserva cancelada correctamente. La unidad ha sido liberada.', 'info');
    }
  };

  // Manejar el clic en "Reservar" desde cualquier sección
  const handleSelectVehicleForBooking = (vehicle: Vehicle, kms: number, days: number, passengers: number) => {
    setTargetVehicle(vehicle);
    setCalcKms(kms);
    setCalcDays(days);
    setCalcPassengers(passengers);
    setIsModalOpen(true);
  };

  // Desplazamiento suave para los links internos de navegación
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-800 font-sans selection:bg-amber-500/20 selection:text-amber-800">
      
      {/* Barra de Notificación Temporal */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-gray-900 text-white rounded-2xl p-4 shadow-xl border border-gray-800/50 flex gap-3 items-center"
          >
            {toast.type === 'success' && <CheckCircle className="h-6 w-6 text-amber-500 shrink-0" />}
            {toast.type === 'info' && <Info className="h-6 w-6 text-blue-400 shrink-0" />}
            {toast.type === 'error' && <BadgeAlert className="h-6 w-6 text-red-400 shrink-0" />}
            <span className="text-xs font-bold font-sans flex-1">{toast.text}</span>
            <button type="button" onClick={() => setToast(null)} className="text-gray-400 hover:text-white text-xs px-2 py-1">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER DE NAVEGACION PREMIUM */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Marca */}
          <div className="cursor-pointer" onClick={() => scrollTo('hero-section')}>
            <BrandLogo size="sm" />
          </div>

          {/* Menú de Navegación Simple */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <button 
              type="button" 
              onClick={() => scrollTo('intro-niche')} 
              className="hover:text-amber-600 transition cursor-pointer"
            >
              Quiénes Somos
            </button>
            <button 
              type="button" 
              onClick={() => scrollTo('fleet-explorer')} 
              className="hover:text-amber-600 transition cursor-pointer"
            >
              Nuestra Flota
            </button>
            <button 
              type="button" 
              onClick={() => scrollTo('calculator-section')} 
              className="hover:text-amber-600 transition cursor-pointer"
            >
              Cotizador
            </button>
            <button 
              type="button" 
              onClick={() => scrollTo('booking-section')} 
              className="hover:text-amber-600 transition cursor-pointer font-bold text-gray-900"
            >
              Contacto para Reservar
            </button>
          </nav>

          {/* Botón de Llamada a Acción / Contacto Directo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo('calculator-section')}
              className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all shadow-sm cursor-pointer"
            >
              Cotizar Viaje
            </button>
          </div>

        </div>
      </header>

      {/* DETALLE PRINCIPAL - LANDING PAGE CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-20 pb-20">

        {/* HERO SECTION DE INTRODUCCIÓN GENERAL */}
        <section id="hero-section" className="relative rounded-3.5xl overflow-hidden bg-slate-950 text-white p-8 md:p-16 lg:p-20 shadow-xl border border-gray-900">
          {/* Fondo Decorativo Sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-gray-950 to-slate-950 opacity-90 z-0" />
          
          <div className="relative z-10 max-w-3xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/35 tracking-wider font-sans">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Servicio de Traslado Especializado
            </div>

            <h1 className="text-3.5xl md:text-5.5xl font-black tracking-tight leading-none md:leading-tight font-display text-white">
              Tu Grupo, Tu Destino.<br />Nosotros Ponemos <span className="text-amber-400">el Vehículo y el Chofer</span>.
            </h1>

            <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed max-w-xl">
              Ofrecemos servicios integrales de transporte privado, especializándonos en viajes de media y larga distancia, viajes internacionales hacia países limítrofes, y traslados internos para excursiones, bodas, eventos religiosos, corporativos o paseos recreativos. Alquilas vehículos modernos con choferes profesionales calificados.
            </p>

            {/* Banner Crítico de Nicho Especializado */}
            <div className="border border-amber-500/20 bg-amber-950/40 p-4.5 rounded-2xl flex gap-3.5 text-xs text-amber-100 max-w-2xl font-sans">
              <Info className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-extrabold text-sm text-amber-400 mb-0.5 font-display">Declaración de Servicios Exclusivos:</h2>
                Nos dedicamos <strong>exclusivamente a proveer la unidad y conducción</strong>. No planificamos excursiones ni organizamos viajes comerciales. Tú escoges el destino, los horarios y las personas; nosotros garantizamos el traslado seguro de ida y de vuelta.
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('calculator-section')}
                className="px-6 py-3 rounded-2xl font-extrabold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-950/40 text-shadow cursor-pointer transition-all text-xs uppercase tracking-wider font-sans"
              >
                Calcular Costo en Segundos
              </button>
              <button
                type="button"
                onClick={() => scrollTo('booking-section')}
                className="px-6 py-3 rounded-2xl font-bold bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Contacto Directo y Reservas
              </button>
            </div>
          </div>
        </section>

        {/* INTRODUCCION DE LA EMPRESA & DECLARACION DE NICHO EN DOS COLUMNAS */}
        <section id="intro-niche" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-extrabold bg-amber-50/50 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-100 font-sans w-fit block">
              Esencia de Negocio
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 font-display">
              ¿Por qué Alquilar con Karf Travels?
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              Nacimos para cubrir la brecha del transporte de pasajeros de alta calidad. A diferencia de las agencias de turismo masivo que te obligan a seguir recorridos prefijados y pagar reservas de atracciones, nosotros te damos la <strong>libertad total</strong>. 
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              Nuestras comitivas alquilan la unidad a demanda para comulgar un traslado directo desde el hotel al salón de bodas, desde el colegio al polideportivo, o un viaje recreativo familiar de fin de semana.
            </p>
            
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f29815]/5 border border-[#f29815]/10">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-900 block font-sans">Asistencia Telefónica Especializada:</span>
                <span className="text-gray-500 font-sans">¿Tienes consultas grupales? Chatea directamente con nuestro despachador de flotas.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2.5xl border border-gray-100 bg-white space-y-3.5">
              <div className="h-10 w-10 bg-amber-100/70 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-gray-950 font-sans">1. Capacidad Adaptable</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Desde Vans de 8 plazas ejecutivas hasta buses panorámicos de 46 asientos para traslados masivos. Encontramos la escala ideal para que nadie pague asientos de más.
              </p>
            </div>

            <div className="p-6 rounded-2.5xl border border-gray-100 bg-white space-y-3.5">
              <div className="h-10 w-10 bg-amber-100/70 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-gray-950 font-sans">2. Choferes Habilitados</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nuestros conductores cuentan con registro profesional regulatorio, cursos de manejo defensivo periódicos, seguro al día y total puntualidad garantizada para tu evento.
              </p>
            </div>

            <div className="p-6 rounded-2.5xl border border-gray-100 bg-white space-y-3.5">
              <div className="h-10 w-10 bg-amber-100/70 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-gray-950 font-sans">3. Equipamiento Superior</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Aire acondicionado potente bidireccional, bodegas estancas de equipaje de gran volumen, asientos reclinables, micrófonos de cabina y puertos USB de carga activa.
              </p>
            </div>

            <div className="p-6 rounded-2.5xl border border-gray-100 bg-white space-y-3.5">
              <div className="h-10 w-10 bg-amber-100/70 text-amber-700 rounded-xl flex items-center justify-center font-bold">
                <Milestone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-gray-950 font-sans">4. Cotización Simplificada</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sin sorpresas ni "extras ocultos": calculamos el costo exacto en base a kilómetros, capacidad de pasajeros y días. Ideal para presupuestar transparente dentro de comisiones.
              </p>
            </div>
          </div>
        </section>

        {/* EXPLORADOR DE FLOTA GALERIA */}
        <section id="fleet-explorer" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Paseo de Unidades</span>
              <h2 className="text-2.5xl md:text-3.5xl font-black tracking-tight text-gray-950 font-display">
                Explora Nuestra Flota Exclusiva
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-sm font-sans">
              Unidades modernas equipadas con la última tecnología de confort y seguridad vial, listas para su despacho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FLEET.map((vehicle) => {
              return (
                <div 
                  key={vehicle.id}
                  className="bg-white rounded-2.5xl border border-gray-150 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2.5 py-1 rounded-full backdrop-blur-xs font-mono">
                        {vehicle.capacity} Pasajeros Máx
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[10px] font-mono text-amber-700 uppercase tracking-widest block">{vehicle.type}</span>
                        <h3 className="font-extrabold text-base text-gray-950 font-sans line-clamp-1 mt-0.5">{vehicle.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {vehicle.description}
                      </p>

                      {/* Amenities en forma de tags pequeños */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {vehicle.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-[9.5px] bg-slate-55 text-gray-500 px-2 py-0.5 rounded border border-gray-100 truncate max-w-[130px]" title={amenity}>
                            {amenity}
                          </span>
                        ))}
                        {vehicle.amenities.length > 3 && (
                          <span className="text-[9.5px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-100 shrink-0">
                            +{vehicle.amenities.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-sans">Tarifa Referencial</span>
                        <span className="text-sm font-bold text-gray-900 font-mono">
                          {vehicle.capacity > 8 ? '$63.7' : '$51.0'} <span className="text-[10px] font-normal text-gray-400">UYU/km</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          scrollTo('calculator-section');
                          setCalcPassengers(vehicle.capacity); // Secciona capacidad directamente
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-750 hover:text-amber-800 cursor-pointer"
                      >
                        Cotizar coche <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECCION COTIZADOR INTEGRADO */}
        <TripCalculator onSelectVehicleForBooking={handleSelectVehicleForBooking} />

        {/* SECCION COMPROBADOR DE DISPONIBILIDAD */}
        <AvailabilityChecker 
          bookings={bookings}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          triggerToast={triggerToast}
        />

        {/* SECCION DE CONTACTO DIRECTO PARA RESERVAS */}
        <ContactSection />

        {/* PANEL DE GESTION DE RESERVAS (MIS RESERVAS PARA TESTING) */}
      </main>

      {/* FOOTER GENERAL */}
      <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 font-sans">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" />
              </div>
              
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Empresa especializada en logística de pasajeros para viajes nacionales e internacionales, traslados internos (bodas, eventos religiosos, escolares) y servicios corporativos privados.
              </p>
              
              <p className="text-[11px] text-amber-400/80 leading-relaxed max-w-md font-sans border-l-2 border-amber-600 pl-3">
                <strong>Aclaración Importante:</strong> No somos agencia de turismo oficial encargada de coordinar itinerarios turísticos ni de alojamiento. Brindamos pura y exclusivamente el servicio logístico habilitado de vehículo + chofer de punto a punto.
              </p>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white text-xs uppercase tracking-widest font-black font-sans">Navegar Rápido</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li><button type="button" onClick={() => scrollTo('intro-niche')} className="hover:text-white transition cursor-pointer">Quiénes Somos</button></li>
                <li><button type="button" onClick={() => scrollTo('fleet-explorer')} className="hover:text-white transition cursor-pointer">Flota de Unidades</button></li>
                <li><button type="button" onClick={() => scrollTo('calculator-section')} className="hover:text-white transition cursor-pointer">Cotizador en Tiempo Real</button></li>
                <li><button type="button" onClick={() => scrollTo('booking-section')} className="hover:text-white transition cursor-pointer">Calendario de Disponibilidad</button></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white text-xs uppercase tracking-widest font-black font-sans">Garantías de Ruta</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2"><Sparkle className="h-3 w-3 text-amber-500 shrink-0" /> Habilitación de Pasajeros CNRT</li>
                <li className="flex items-center gap-2"><Sparkle className="h-3 w-3 text-amber-500 shrink-0" /> Seguros Civiles Obligatorios</li>
                <li className="flex items-center gap-2"><Sparkle className="h-3 w-3 text-amber-500 shrink-0" /> Choferes Uniformados de Reemplazo</li>
                <li className="flex items-center gap-2"><Sparkle className="h-3 w-3 text-amber-500 shrink-0" /> Asistencia Médica y Mecánica 24h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 font-sans gap-4">
            <p>© {new Date().getFullYear()} Karf Travels Inc. Todos los derechos reservados. Diseñado para alta legibilidad comercial con estética Sunset.</p>
            <div className="flex gap-4">
              <span className="hover:text-gray-300">Términos y Condiciones</span>
              <span className="hover:text-gray-300">Normativas de Seguridad Vial</span>
              <span className="hover:text-gray-300">Tarifario Regulado</span>
            </div>
          </div>
        </div>
      </footer>

      {/* RENDER RESERVATION DIALOG MODAL */}
      {targetVehicle && (
        <BookingModal
          vehicle={targetVehicle}
          selectedDate={selectedDate}
          initialKms={calcKms}
          initialDays={calcDays}
          initialPassengers={calcPassengers}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

    </div>
  );
}
