import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FLEET } from '../utils/data';
import { Vehicle } from '../types';
import { calculateTripPricing } from '../utils/pricing';
import { 
  Users, 
  Milestone, 
  CalendarDays, 
  Info, 
  Check, 
  ChevronsRight, 
  Calendar,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface TripCalculatorProps {
  onSelectVehicleForBooking: (vehicle: Vehicle, kms: number, duration: number, passengers: number) => void;
}

export default function TripCalculator({ onSelectVehicleForBooking }: TripCalculatorProps) {
  const [passengers, setPassengers] = useState<number>(8);
  const [kilometers, setKilometers] = useState<number>(100);
  const [duration, setDuration] = useState<number>(1); // Represents hours if kms <= 59, days if kms >= 60

  const isHourly = kilometers <= 59;

  // Adjust duration if threshold cross occurs (changes from hours to days at 61 km)
  useEffect(() => {
    if (isHourly) {
      if (duration < 4 || duration > 24) {
        setDuration(4); // Default wait hours
      }
    } else {
      if (duration > 15) {
        setDuration(1); // Default days
      }
    }
  }, [isHourly]);

  // Pricing calculation
  const calculatedVehicles = useMemo(() => {
    return FLEET.map((vehicle) => {
      const isEligible = passengers <= vehicle.capacity;
      
      const pricing = calculateTripPricing(kilometers, duration, vehicle.capacity);
      
      return {
        vehicle,
        isEligible,
        ratePerKm: pricing.ratePerKm,
        baseDistanceCost: pricing.baseDistanceCost,
        extraDurationCost: pricing.extraDurationCost,
        totalCost: pricing.totalCost,
        isHourly: pricing.isHourly,
        duration: pricing.duration,
        extraDurationAmount: pricing.extraDurationAmount
      };
    }).sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return a.vehicle.capacity - b.vehicle.capacity;
    });
  }, [passengers, kilometers, duration]);

  // Recommended vehicle
  const recommendedVehicleId = useMemo(() => {
    const eligible = calculatedVehicles.filter(v => v.isEligible);
    return eligible.length > 0 ? eligible[0].vehicle.id : null;
  }, [calculatedVehicles]);

  return (
    <div id="calculator-section" className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Parámetros */}
          <div className="w-full lg:w-5/12 space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 mb-3 border border-amber-200">
                <Sparkles className="h-3 w-3 text-amber-600" /> Cotizador Express Inmediato
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950 font-sans">
                Cotizador de Viajes en Pesos Uruguayos
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Cotizaciones inmediatas con salidas desde <strong>Bella Unión, Artigas y alrededores de ambas ciudades</strong> hacia cualquier punto del país.
              </p>
            </div>

            <div className="space-y-6">
              {/* Pasajeros */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#f29815]" />
                    Cantidad de Pasajeros
                  </label>
                  <span className="text-sm font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-mono">
                    {passengers} Pasajeros
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengers(8)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      passengers === 8
                        ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-md shadow-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm">Hasta 8 Pasajeros</span>
                    <span className={`text-[11px] block font-normal mt-0.5 ${passengers === 8 ? 'text-slate-800' : 'text-gray-400'}`}>
                      Máximo de 8 personas
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassengers(15)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      passengers === 15
                        ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-md shadow-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm">Hasta 15 Pasajeros</span>
                    <span className={`text-[11px] block font-normal mt-0.5 ${passengers === 15 ? 'text-slate-800' : 'text-gray-400'}`}>
                      Máximo de 15 personas
                    </span>
                  </button>
                </div>
              </div>

              {/* Kilómetros */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="km-input" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Milestone className="h-4 w-4 text-[#f29815]" />
                    Distancia Estimada (Km totales)
                  </label>
                  <span className="text-lg font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 font-mono">
                    {kilometers} Km
                  </span>
                </div>
                <input
                  id="km-input"
                  type="range"
                  min="5"
                  max="600"
                  step="5"
                  value={kilometers}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val <= 59 && kilometers >= 60) {
                      setDuration(4);
                    } else if (val >= 60 && kilometers <= 59) {
                      setDuration(1);
                    }
                    setKilometers(val);
                  }}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 Km (Urbano)</span>
                  <span>600 Km (Larga Distancia)</span>
                </div>
              </div>

              {/* Duración Condicional: Horas o Días */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="duration-input" className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {isHourly ? (
                      <>
                        <Clock className="h-4 w-4 text-[#f29815]" />
                        Horas de Espera Incluidas
                      </>
                    ) : (
                      <>
                        <CalendarDays className="h-4 w-4 text-[#f29815]" />
                        Duración del Viaje (Días/Noches)
                      </>
                    )}
                  </label>
                  <span className="text-lg font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 font-mono">
                    {duration} {isHourly ? (duration === 1 ? 'Hora' : 'Horas') : (duration === 1 ? 'Día / Noche' : 'Días / Noches')}
                  </span>
                </div>
                
                {isHourly ? (
                  <input
                    id="duration-input"
                    type="range"
                    min="4"
                    max="24"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                ) : (
                  <input
                    id="duration-input"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                )}

                <div className="flex justify-between text-xs text-gray-400">
                  {isHourly ? (
                    <>
                      <span>4 Horas (Base)</span>
                      <span>12 Hs</span>
                      <span>24 Horas máx</span>
                    </>
                  ) : (
                    <>
                      <span>1 Día / Noche</span>
                      <span>7 Días</span>
                      <span>15 Días Máximo</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cuadro informativo de alcance */}
            <div className="p-4 bg-[#f29815]/5 rounded-2xl border border-[#f29815]/15 space-y-1.5 text-xs text-amber-900">
              <div className="flex gap-2 items-center font-bold text-gray-900 uppercase tracking-wide text-[11px]">
                <Info className="h-4 w-4 text-amber-600 shrink-0" /> Salidas Locales de Confianza
              </div>
              <p className="text-gray-600 leading-relaxed text-[11px] font-sans">
                Todos los traslados inician con partida desde Bella Unión, Artigas o áreas suburbanas, garantizando puntualidad y choferes con conocimiento experto de las rutas de la región.
              </p>
            </div>
          </div>

          {/* Opciones de Vehículos Calculados */}
          <div className="w-full lg:w-7/12 space-y-6">
            <h4 className="text-lg font-bold text-gray-950 font-sans flex items-center justify-between">
              <span>Unidades Sugeridas para tu Grupo</span>
              <span className="text-xs font-normal text-gray-400">Pesos Uruguayos ($ UY)</span>
            </h4>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {calculatedVehicles.map(({ vehicle, isEligible, ratePerKm, baseDistanceCost, extraDurationCost, totalCost, isHourly, duration, extraDurationAmount }) => {
                  const isRecommended = vehicle.id === recommendedVehicleId;
                  const displayName = vehicle.capacity <= 8 ? "Servicio Especial de 8 Pasajeros" : "Servicio Especial de 15 Pasajeros";
                  
                  return (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className={`p-5 rounded-2xl border transition-all relative ${
                        !isEligible 
                          ? 'bg-gray-50/50 border-gray-100 opacity-50' 
                          : isRecommended
                          ? 'bg-amber-500/10 border-[#f29815] shadow-md ring-1 ring-[#f29815]'
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow'
                      }`}
                    >
                      {/* Insignia Recomendado */}
                      {isEligible && isRecommended && (
                        <span className="absolute -top-3 right-6 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-sm font-sans">
                          <Sparkles className="h-3 w-3 fill-amber-100 text-slate-950" /> Recomendado
                        </span>
                      )}

                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        {/* Miniatura Imagen */}
                        <div className="h-24 w-full sm:w-32 rounded-xl overflow-hidden relative shrink-0 bg-gray-100 border border-gray-200">
                          <img 
                            src={vehicle.image} 
                            alt={displayName} 
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          {!isEligible && (
                            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded bg-red-600">
                                Capacidad Baja
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info del Vehículo */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-gray-950 text-base leading-tight font-sans">
                              {displayName}
                            </h5>
                            <span className="text-xs font-semibold bg-amber-150 text-amber-900 px-2 py-0.5 rounded-md font-sans">
                              {vehicle.capacity} Pax Máx
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {vehicle.capacity <= 8 
                              ? "Climatizado, amplio espacio para equipaje de mano. Ideal para traslados ejecutivos rápidos y paseos de grupos reducidos." 
                              : "Unidad ejecutiva con aire acondicionado, asientos reclinables individuales, maletero. Pensada para delegaciones medianas y traslados turísticos confortables."
                            }
                          </p>
                          
                          {/* Inclusiones del Servicio */}
                          {isEligible && (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-gray-500 font-sans font-medium">
                              <span className="text-emerald-700">✓ Chofer privado profesional habilitado</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-emerald-700">✓ Combustible y peajes de ruta incluidos</span>
                            </div>
                          )}
                        </div>

                        {/* Precio Total y Acción */}
                        <div className="w-full sm:w-auto text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 flex sm:flex-col justify-between items-center sm:items-end gap-3 font-sans">
                          <div>
                            <span className="block text-xs text-gray-400">Total Estimado</span>
                            {isEligible ? (
                              <span className="text-2xl font-black text-gray-950 font-mono">
                                ${totalCost.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                <span className="text-xs font-normal text-gray-400 ml-1">UYU</span>
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-red-500 font-sans">
                                Capacidad insuficiente
                              </span>
                            )}
                          </div>

                          {isEligible && (
                            <button
                              type="button"
                              onClick={() => onSelectVehicleForBooking(vehicle, kilometers, duration, passengers)}
                              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isRecommended
                                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-200'
                                  : 'bg-gray-900 hover:bg-gray-950 text-white'
                              } cursor-pointer`}
                            >
                              Reservar Unidad <ChevronsRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
