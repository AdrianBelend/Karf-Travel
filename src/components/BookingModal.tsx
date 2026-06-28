import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle, Booking } from '../types';
import { calculateTripPricing } from '../utils/pricing';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Milestone, 
  CheckCircle2, 
  ClipboardCheck, 
  Printer, 
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';

interface BookingModalProps {
  vehicle: Vehicle;
  selectedDate: string;
  initialKms: number;
  initialDays: number; // acts as initialDuration
  initialPassengers: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export default function BookingModal({
  vehicle,
  selectedDate,
  initialKms,
  initialDays,
  initialPassengers,
  isOpen,
  onClose,
  onConfirmBooking
}: BookingModalProps) {
  // Estados del Formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [passengers, setPassengers] = useState(initialPassengers);
  const [kilometers, setKilometers] = useState(initialKms);
  const [duration, setDuration] = useState(initialDays); // Represents hours if kms <= 59, days if kms >= 60
  
  // Consentimiento sobre servicios
  const [consentTransportOnly, setConsentTransportOnly] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedBooking, setGeneratedBooking] = useState<Booking | null>(null);

  const isHourly = kilometers <= 59;

  // Fecha final calculated
  const endDateStr = useMemo(() => {
    if (!selectedDate) return '';
    if (isHourly) return selectedDate; // Same day event if hourly
    try {
      const start = new Date(selectedDate + 'T00:00:00');
      start.setDate(start.getDate() + (duration - 1));
      return start.toISOString().split('T')[0];
    } catch {
      return selectedDate;
    }
  }, [selectedDate, duration, isHourly]);

  // Calculo de costo final dinamico en ventana modal
  const finalCost = useMemo(() => {
    const pricing = calculateTripPricing(kilometers, duration, vehicle.capacity);
    return pricing.totalCost;
  }, [vehicle, kilometers, duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentTransportOnly) {
      alert('Por favor, confirme que comprende que solo proveemos el transporte (vehículo y chofer).');
      return;
    }

    const bookingId = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: bookingId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      startDate: selectedDate,
      endDate: endDateStr,
      kilometers,
      passengers,
      totalDays: duration, // saving as duration
      totalCost: finalCost,
      status: 'confirmada',
      destination,
      notes
    };

    onConfirmBooking(newBooking);
    setGeneratedBooking(newBooking);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo Opaco */}
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Caja del Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 border border-gray-100 max-h-[90vh] flex flex-col">
        
        {/* Encabezado */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
              {isSubmitted ? 'Reserva Exitosa' : 'Formulario de Reserva'}
            </span>
            <h4 id="modal-title" className="font-extrabold text-xl text-gray-950 font-sans leading-none">
              {isSubmitted ? 'Confirmación de Alquiler' : 'Confirma tu Solicitud'}
            </h4>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido (con scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 font-sans">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
               <motion.form 
                key="booking-form"
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Resumen Superior del Vehiculo */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="h-16 w-full sm:w-24 rounded-lg overflow-hidden shrink-0 bg-gray-150 border">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      {vehicle.type}
                    </span>
                    <h5 className="font-bold text-gray-900 text-sm mt-1">{vehicle.name}</h5>
                    <p className="text-xs text-gray-500 line-clamp-1">{vehicle.description}</p>
                  </div>
                </div>

                {/* Ajuste Fino de Parámetros en Check-out */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-gray-150 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-400 font-sans block font-medium">Fecha Inicio</span>
                    <span className="font-extrabold text-gray-900 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-amber-600" /> {selectedDate}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-gray-400 font-sans block font-medium">Pasajeros</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      <Users className="h-3 w-3 text-amber-600" />
                      <select 
                        value={passengers} 
                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                        className="font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 focus:outline-hidden"
                      >
                        <option value={8}>8 Pax</option>
                        <option value={15}>15 Pax</option>
                      </select>
                      <span className="text-gray-400 font-normal">/{vehicle.capacity} max</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 font-sans block font-medium">Kilómetros</span>
                    <div className="flex items-center gap-1">
                      <Milestone className="h-3 w-3 text-amber-600" />
                      <input 
                        type="number" 
                        min="5" 
                        max="600" 
                        value={kilometers} 
                        onChange={(m) => setKilometers(Math.max(5, parseInt(m.target.value) || 5))}
                        className="w-12 font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 focus:outline-hidden"
                      />
                      <span className="text-gray-400">km</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 font-sans block font-medium">
                      {isHourly ? 'Horas Espera' : 'Días Viaje'}
                    </span>
                    <div className="flex items-center gap-1">
                      {isHourly ? (
                        <Clock className="h-3 w-3 text-amber-600" />
                      ) : (
                        <Calendar className="h-3 w-3 text-amber-600" />
                      )}
                      <input 
                        type="number" 
                        min={isHourly ? 4 : 1} 
                        max={isHourly ? 24 : 15} 
                        value={duration} 
                        onChange={(e) => setDuration(Math.max(isHourly ? 4 : 1, parseInt(e.target.value) || 1))}
                        className="w-8 font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-amber-500 focus:outline-hidden"
                      />
                      <span className="text-gray-400">
                        {isHourly ? (duration === 1 ? 'hora' : 'horas') : (duration === 1 ? 'día' : 'días')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Campos Formulario de Contacto */}
                <div className="space-y-4">
                  <h6 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider font-sans">Datos de Contacto y Itinerario:</h6>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="modal-name" className="text-xs font-semibold text-gray-700">Nombre Completo *</label>
                      <input 
                        id="modal-name"
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Marcelo Fernández"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="modal-email" className="text-xs font-semibold text-gray-700">Email de Contacto *</label>
                      <input 
                        id="modal-email"
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="modal-phone" className="text-xs font-semibold text-gray-700">Teléfono (con WhatsApp) *</label>
                      <input 
                        id="modal-phone"
                        type="tel" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: +598 99 123 456"
                        className="w-full text-sm font-sans px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="modal-dest" className="text-xs font-semibold text-gray-700">Dirección de Destino Escrita *</label>
                      <input 
                        id="modal-dest"
                        type="text" 
                        required 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ej: Montevideo a Punta del Este"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="modal-notes" className="text-xs font-semibold text-gray-700">Indicaciones de Itinerario / Notas Adicionales (Opcional)</label>
                    <textarea 
                      id="modal-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej: Queremos salir de tres cruces, hacer parada previa para recoger a un grupo y retornar un domingo por la tarde."
                      className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* LIMITACIONES DE ALCANCE - MUY IMPORTANTE */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex gap-2 text-amber-900">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <h6 className="font-extrabold text-[13px] uppercase tracking-wide">Cláusula de Alcance Regulatorio</h6>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-sans font-medium">
                    <strong>Nuestra empresa provee únicamente el vehículo habilitado y chofer profesional para tu traslado privado.</strong> NO planificamos paseos guiados, NO intermediamos reservas de hoteles, NO contratamos entradas de parques, ni diseñamos el itinerario turístico interno. Tú nos das los puntos de paradas de ida y regreso, y nosotros transportamos a tu grupo con total seguridad.
                  </p>
                  <div className="flex items-center gap-2.5 pt-1.5 border-t border-amber-200/60">
                    <input 
                      id="consent-check"
                      type="checkbox" 
                      required
                      checked={consentTransportOnly}
                      onChange={(e) => setConsentTransportOnly(e.target.checked)}
                      className="h-4.5 w-4.5 text-amber-600 border-gray-300 rounded-md focus:ring-amber-500/40 cursor-pointer"
                    />
                    <label htmlFor="consent-check" className="text-[11.5px] font-bold text-amber-955 font-sans cursor-pointer select-none">
                      Entiendo y acepto que alquilo únicamente el servicio de chofer y transporte escolar/turístico *
                    </label>
                  </div>
                </div>

                {/* Pie del formulario */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6">
                  <div className="text-left font-sans">
                    <span className="text-xs text-gray-400 block">Estimación de Alquiler</span>
                    <span className="text-2xl font-black text-gray-950 font-mono">
                      ${finalCost.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      <span className="text-xs font-normal text-gray-400 ml-1.5">UYU</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-200 text-shadow cursor-pointer transition-all"
                  >
                    Confirmar Reserva de Viaje
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                  <CheckCircle2 className="h-10 w-10 text-amber-600" />
                </div>

                <div className="space-y-2">
                  <h5 className="text-2xl font-black text-gray-950 font-sans">¡Excelente! Tu Reserva fue Procesada</h5>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Hemos agendado tu traslado. Como operamos de forma transparente, tu coche {vehicle.name} ya está bloqueado en el calendario virtual para la fecha indicada.
                  </p>
                </div>

                {/* RECIBO DE ALQUILER */}
                {generatedBooking && (
                  <div id="booking-receipt" className="border border-gray-200 rounded-2xl p-6 text-left max-w-md mx-auto bg-slate-50 relative space-y-4 font-sans">
                    <div className="absolute right-4 top-4 font-mono text-amber-800 font-bold border border-amber-200 bg-amber-100/40 px-2 py-0.5 rounded-md text-[10px]">
                      {generatedBooking.id}
                    </div>

                    <div className="flex gap-2 items-center border-b border-gray-200 pb-3">
                      <ClipboardCheck className="h-5 w-5 text-gray-600" />
                      <h6 className="font-bold text-[13px] text-gray-400 uppercase tracking-widest font-mono">Recibo del Servicio</h6>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                      <div>
                        <span className="text-gray-400 block font-normal">Pasajero Comitente</span>
                        <strong className="text-gray-900 text-sm block truncate">{generatedBooking.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Contacto</span>
                        <span className="text-gray-900 block truncate">{generatedBooking.customerPhone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block font-normal">Fecha y Duración</span>
                        <strong className="text-gray-900 block font-mono bg-amber-100/25 border border-amber-200 px-2 py-0.5 rounded-md w-fit text-[11px] mt-1">
                          {generatedBooking.startDate} {!isHourly && `a ${generatedBooking.endDate}`} ({generatedBooking.totalDays} {isHourly ? (generatedBooking.totalDays === 1 ? 'Hora de espera' : 'Horas de espera') : (generatedBooking.totalDays === 1 ? 'Día' : 'Días')})
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Unidad de Viaje</span>
                        <span className="text-gray-900 block font-medium truncate">{generatedBooking.vehicleName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-normal">Pasajeros / Kms</span>
                        <span className="text-gray-900 block font-medium font-mono">{generatedBooking.passengers} pax / {generatedBooking.kilometers} km</span>
                      </div>
                      <div className="col-span-2 border-t border-gray-200/60 pt-3">
                        <span className="text-gray-400 block font-normal">Destino Declarado</span>
                        <span className="text-gray-900 text-sm font-semibold flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-amber-600 shrink-0" /> {generatedBooking.destination}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-3.5 flex justify-between items-center bg-gray-100/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase tracking-widest leading-none font-bold">Total Consolidado</span>
                        <span className="text-[10px] text-gray-400 block italic leading-none mt-1">Sujeto a verificación</span>
                      </div>
                      <span className="text-2xl font-black text-gray-950 font-mono">
                        ${generatedBooking.totalCost.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} UYU
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-150 text-gray-700 transition"
                  >
                    <Printer className="h-3.5 w-3.5" /> Imprimir Comprobante
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gray-900 hover:bg-gray-950 text-white transition-all inline-block cursor-pointer"
                  >
                    Terminar y Volver
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
