import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Plus, 
  Trash, 
  AlertCircle,
  Clock,
  Briefcase,
  HelpCircle,
  EyeOff
} from 'lucide-react';
import { Booking, Vehicle } from '../types';
import { FLEET } from '../utils/data';

interface AvailabilityCheckerProps {
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  triggerToast: (text: string, type: 'success' | 'info' | 'error') => void;
}

interface BlockedDate {
  id: string;
  date: string;
  vehicleId: string;
  reason: string;
  timeRange?: string; // Optional custom time range (e.g. "08:00 a 14:00")
}

export default function AvailabilityChecker({
  bookings,
  selectedDate,
  setSelectedDate,
  triggerToast
}: AvailabilityCheckerProps) {
  const [checkedDate, setCheckedDate] = useState<string>(selectedDate);
  const [selectedCapacity, setSelectedCapacity] = useState<number>(8);
  const [statusResult, setStatusResult] = useState<{
    isChecked: boolean;
    available: boolean;
    msg: string;
    reason?: string;
  } | null>(null);

  // Admin states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Persisted admin blocked dates
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => {
    const saved = localStorage.getItem('karftravels_blocked_dates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // New block rules inputs
  const [newBlockDate, setNewBlockDate] = useState<string>('');
  const [newBlockVehicleId, setNewBlockVehicleId] = useState<string>(FLEET[0].id);
  const [newBlockReason, setNewBlockReason] = useState<string>('');
  const [newBlockTimeRange, setNewBlockTimeRange] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('karftravels_blocked_dates', JSON.stringify(blockedDates));
  }, [blockedDates]);

  // Handle checking by capacity category
  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching fleet vehicles for this capacity
    const associatedVehicles = FLEET.filter(v => v.capacity === selectedCapacity);
    if (associatedVehicles.length === 0) return;

    let availableVehicle = null;
    let failReason = "";

    // A capacity class is available if AT LEAST ONE of its vehicles is free on that day
    for (const vehicle of associatedVehicles) {
      // 1. Check if booked
      const isBooked = bookings.some(b => {
        if (b.vehicleId !== vehicle.id) return false;
        
        const checkTime = new Date(checkedDate + 'T00:00:00').getTime();
        const startTime = new Date(b.startDate + 'T00:00:00').getTime();
        const endTime = new Date(b.endDate + 'T00:00:00').getTime();
        
        return checkTime >= startTime && checkTime <= endTime;
      });

      // 2. Check if locked by administrator
      const lockBlock = blockedDates.find(b => b.date === checkedDate && b.vehicleId === vehicle.id);

      if (!isBooked && !lockBlock) {
        availableVehicle = vehicle;
        break;
      } else {
        if (isBooked) {
          failReason = "Reservado por un cliente comercial";
        } else if (lockBlock) {
          failReason = lockBlock.reason + (lockBlock.timeRange ? ` (${lockBlock.timeRange})` : '');
        }
      }
    }

    const label = selectedCapacity === 8 ? "Servicio para 8 Pasajeros" : "Servicio para 15 Pasajeros";

    if (availableVehicle) {
      setStatusResult({
        isChecked: true,
        available: true,
        msg: `¡Disponible! El ${label} se encuentra libre para realizar traslados desde Bella Unión, Artigas o alrededores.`
      });
      setSelectedDate(checkedDate); // Sync globally
    } else {
      setStatusResult({
        isChecked: true,
        available: false,
        msg: `Lo sentimos, las unidades de ${label} ya se encuentran ocupadas o cubriendo servicios escolares en la fecha seleccionada.`,
        reason: failReason || "Ocupado o en mantenimiento"
      });
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim().toLowerCase() === 'karf') {
      setIsAuthorized(true);
      triggerToast('Acceso Administrador Autorizado. Agenda interna cargada.', 'success');
    } else {
      triggerToast('Contraseña incorrecta. Intente con: karf', 'error');
    }
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) {
      triggerToast('Por favor seleccione una fecha.', 'error');
      return;
    }

    const newBlock: BlockedDate = {
      id: 'BLK-' + Date.now(),
      date: newBlockDate,
      vehicleId: newBlockVehicleId,
      reason: newBlockReason || 'Compromiso o Mantenimiento',
      timeRange: newBlockTimeRange || undefined
    };

    setBlockedDates(prev => [newBlock, ...prev]);
    setNewBlockDate('');
    setNewBlockReason('');
    setNewBlockTimeRange('');
    triggerToast('Bloqueo de agenda guardado de forma segura y privada.', 'success');
  };

  const handleDeleteBlock = (id: string) => {
    setBlockedDates(prev => prev.filter(b => b.id !== id));
    triggerToast('Fecha liberada correctamente de la agenda.', 'info');
  };

  return (
    <div id="booking-section" className="bg-white rounded-3xl border border-gray-150 p-6 md:p-10 space-y-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-sans flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Agenda de Unidades
          </span>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-gray-950 font-sans">
            Verifica Disponibilidad en Tiempo Real
          </h3>
          <p className="text-xs text-gray-500 max-w-xl">
            Toma nota del calendario de salidas de Karf Travels para coordinar tus traslados en Bella Unión, Artigas o alrededores cómodamente.
          </p>
        </div>

        {/* Hidden toggle option for Admin loading */}
        <button
          type="button"
          onClick={() => {
            setIsAdminOpen(!isAdminOpen);
            setAdminPassword('');
          }}
          className="text-xs font-extrabold text-gray-400 hover:text-amber-750 transition-colors flex items-center gap-1 cursor-pointer font-sans"
        >
          <Lock className="h-3.5 w-3.5" /> Acceso Socios / Cargar Agenda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulario Cliente de Consulta */}
        <form onSubmit={handleCheckAvailability} className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-5">
          <h4 className="font-bold text-gray-950 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#f29815]" /> Consulta tu Fecha de Evento
          </h4>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="check-date" className="text-xs font-bold text-gray-700">Día de Salida Planificado</label>
              <input
                id="check-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={checkedDate}
                onChange={(e) => {
                  setCheckedDate(e.target.value);
                  setStatusResult(null);
                }}
                className="w-full text-sm font-sans bg-white px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="check-capacity" className="text-xs font-bold text-gray-700">Capacidad Requerida</label>
              <select
                id="check-capacity"
                value={selectedCapacity}
                onChange={(e) => {
                  setSelectedCapacity(parseInt(e.target.value));
                  setStatusResult(null);
                }}
                className="w-full text-sm bg-white px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 font-sans font-semibold text-gray-800"
              >
                <option value={8}>De 1 a 8 Pasajeros</option>
                <option value={15}>De 9 a 15 Pasajeros</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer font-sans transition-all"
          >
            Verificar Agenda Oficial
          </button>

          {/* Resultado interactivo */}
          <AnimatePresence mode="wait">
            {statusResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border flex gap-3 text-xs ${
                  statusResult.available 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {statusResult.available ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                )}
                <div>
                  <h5 className="font-extrabold">{statusResult.available ? '¡Unidad Disponible!' : 'Unidad Reservada u Ocupada'}</h5>
                  <p className="mt-1 leading-relaxed">{statusResult.msg}</p>
                  {statusResult.reason && (
                    <span className="inline-block mt-1.5 bg-red-100/60 font-mono scale-[0.95] text-[10px] text-red-800 font-bold px-2 py-0.5 rounded-md">
                      Motivo: {statusResult.reason}
                    </span>
                  )}
                  {statusResult.available && (
                    <button
                      type="button"
                      onClick={() => {
                        const cal = document.getElementById('calculator-section');
                        if (cal) cal.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="mt-2 text-[11px] font-bold text-emerald-700 hover:underline block"
                    >
                      Ir abajo al calcular costo express →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Info lateral ilustrativo */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="border border-gray-150 p-6 rounded-2xl relative overflow-hidden bg-slate-50/40">
            <h4 className="font-bold text-gray-950 text-sm mb-3">¿Cómo Administramos la Disponibilidad?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 leading-relaxed font-sans">
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block flex items-center gap-1 text-emerald-700">
                  <CheckCircle className="h-3 w-3" /> Sistema No Directo
                </span>
                <p>Las reservas cargadas por clientes en esta prueba se guardan automáticamente en tu agenda para que no choquen dos paseos el mismo día.</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block flex items-center gap-1 text-amber-700">
                  <Clock className="h-3 w-3" /> Horarios de Choferes
                </span>
                <p>Nuestra mini-van de 8 pasajeros y microbuses de 15 pasajeros tienen guardias y descansos coordinados. Las horas libres se confirman una a una.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200/60 space-y-1 font-sans">
            <strong className="block text-[13px] font-extrabold flex items-center gap-1 text-amber-950">
              <HelpCircle className="h-4 w-4" /> ¿Tu fecha está ocupada?
            </strong>
            <p className="leading-relaxed">
              No dejes de contactarnos directamente. Brindamos servicios contratados y escolares en Bella Unión, Artigas y norte del país. Si tu fecha no figura libre, disponemos de convenios con transportistas amigos recomendados de confianza.
            </p>
          </div>
        </div>

      </div>

      {/* ADMIN HIDDEN DRAWER */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-150 pt-8 mt-4 overflow-hidden"
          >
            <div className="bg-gray-950 text-white p-6 md:p-8 rounded-3xl space-y-6 shadow-inner relative border border-gray-800">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-800/40 tracking-wider">
                    Panel Exclusivo de Carga Interna (Karf Travels)
                  </span>
                  <h4 className="text-lg font-black mt-1 text-white">Consola de Agenda Privada</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1.5 rounded-xl border border-gray-800 hover:bg-gray-900"
                >
                  Ocultar Panel
                </button>
              </div>

              {!isAuthorized ? (
                /* Password form, secret option mentioned in description */
                <form onSubmit={handleAdminAuth} className="max-w-md space-y-4 py-4">
                  <div className="space-y-2">
                    <span className="text-xs text-gray-400 block font-normal">
                      Esta sección permite al chofer/socio cargar viajes sin que se listen al público.
                    </span>
                    <label htmlFor="admin-code" className="text-xs font-bold text-amber-400 block">Código Acceso Socios:</label>
                    <div className="flex gap-2">
                      <input
                        id="admin-code"
                        type="password"
                        placeholder="Prueba con: karf"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="flex-1 bg-gray-900 text-sm text-white px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-hidden focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                      >
                        Ingresar
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-500 block italic leading-none mt-2">
                      * El código interno de fábrica es <strong className="text-amber-500">karf</strong> para test de demostración.
                    </span>
                  </div>
                </form>
              ) : (
                /* Authorized Area to Load Availability and Blocks */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
                  
                  {/* Formulario de Carga */}
                  <form onSubmit={handleAddBlock} className="md:col-span-5 bg-gray-900 p-5 rounded-2xl border border-gray-800 space-y-4">
                    <h5 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Bloquear Horarios / Fechas
                    </h5>
                    
                    <p className="text-gray-400 leading-relaxed text-[11px]">
                      Agrega horas comprometidas o mantenimiento para que el cotizador y el comprobador de agenda adviertan automáticamente al cliente.
                    </p>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block">Fecha a Bloquear:</label>
                        <input
                          type="date"
                          required
                          value={newBlockDate}
                          onChange={(e) => setNewBlockDate(e.target.value)}
                          className="w-full bg-gray-950 text-white px-3 py-2 rounded-lg border border-gray-800 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block">Vehículo Involucrado:</label>
                        <select
                          value={newBlockVehicleId}
                          onChange={(e) => setNewBlockVehicleId(e.target.value)}
                          className="w-full bg-gray-950 text-white px-3 py-2 rounded-lg border border-gray-800 focus:outline-hidden focus:border-amber-400"
                        >
                          {FLEET.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block">Intervalo Horario (Opcional):</label>
                        <input
                          type="text"
                          placeholder="Ej: Todo el día, 08:00 a 14:00"
                          value={newBlockTimeRange}
                          onChange={(e) => setNewBlockTimeRange(e.target.value)}
                          className="w-full bg-gray-950 text-white px-3 py-2 rounded-lg border border-gray-800 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 block">Descripción del Trabajo / Motivo:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Servicio Escolar Monte VI o Mantenimiento"
                          value={newBlockReason}
                          onChange={(e) => setNewBlockReason(e.target.value)}
                          className="w-full bg-gray-950 text-white px-3 py-2 rounded-lg border border-gray-800 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg font-sans text-xs uppercase"
                    >
                      Bloquear Fecha en Agenda
                    </button>
                  </form>

                  {/* Listado de Bloqueos Actuales */}
                  <div className="md:col-span-7 space-y-4">
                    <h5 className="font-bold text-white text-sm flex items-center justify-between">
                      <span>Listado de Agenda Interna Desactivada</span>
                      <span className="text-[10px] text-gray-500 font-normal">No visible al cliente promedio</span>
                    </h5>

                    {blockedDates.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-gray-800 rounded-2xl text-gray-500 space-y-2">
                        <Unlock className="h-6 w-6 mx-auto text-gray-600" />
                        <p>No hay bloqueos manuales en la agenda.</p>
                        <p className="text-[10px] text-gray-600 leading-normal">Todas las unidades están 100% libres a menos que tengan un viaje agendado por un usuario arriba.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {blockedDates.map((rule) => {
                          const associatedVehicle = FLEET.find(v => v.id === rule.vehicleId);
                          return (
                            <div key={rule.id} className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <strong className="text-amber-400 text-xs font-mono">{rule.date}</strong>
                                  <span className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-[10px] font-medium scale-[0.9]">
                                    {associatedVehicle ? associatedVehicle.name : 'Unidad'}
                                  </span>
                                </div>
                                <p className="text-gray-300 font-sans text-[11px]">
                                  {rule.reason} {rule.timeRange && <span className="text-gray-450 italic">({rule.timeRange})</span>}
                                </p>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteBlock(rule.id)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                                title="Eliminar Bloqueo"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
