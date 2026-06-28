import { Vehicle, Booking } from '../types';
import peugeotTravellerImg from '../assets/images/peugeot_traveller_1782601674152.jpg';
import renaultMasterWhiteImg from '../assets/images/renault_master_white_1782602095438.jpg';
import renaultMasterGrayImg from '../assets/images/renault_master_gray_1782602111317.jpg';

export const FLEET: Vehicle[] = [
  {
    id: 'traveller-9pax',
    name: 'Peugeot Traveller',
    type: 'Van Ejecutiva de Pasajeros',
    capacity: 8,
    basePrice: 80,
    pricePerKm: 0.90,
    pricePerDay: 110,
    image: peugeotTravellerImg,
    description: 'Excelente para grupos pequeños de hasta 8 pasajeros (9 incluyendo el chofer). Ideal para traslados ejecutivos rápidos o salidas familiares confortables.',
    amenities: ['Aire Acondicionado Independiente', 'Puertos USB para Carga', 'Asientos Ergonómicos Climatizados', 'Cristales con Filtro UV', 'Baúl Amplio para Equipaje']
  },
  {
    id: 'master-16pax-1',
    name: 'Renault Master Minibús (Unidad A - Blanca)',
    type: 'Minibús Ejecutivo',
    capacity: 15,
    basePrice: 150,
    pricePerKm: 1.40,
    pricePerDay: 210,
    image: renaultMasterWhiteImg,
    description: 'Equipada para transportar hasta 15 pasajeros (16 incluyendo el chofer). Totalmente equipada para viajes de media y larga distancia en eventos o excursiones.',
    amenities: ['Climatizador Tri-zona de Alto Rendimiento', 'Música Bluetooth Funcional', 'Asientos Altos Reclinables con Apoyacabezas', 'Cinturones de Seguridad Homologados', 'Bodega de Equipaje Trasera', 'Wifi de Alta Velocidad']
  },
  {
    id: 'master-16pax-2',
    name: 'Renault Master Minibús (Unidad B - Gris Oscuro)',
    type: 'Minibús Ejecutivo',
    capacity: 15,
    basePrice: 150,
    pricePerKm: 1.40,
    pricePerDay: 210,
    image: renaultMasterGrayImg,
    description: 'Equipada para transportar hasta 15 pasajeros (16 incluyendo el chofer). Nuestra segunda unidad de alta gama en un elegante tono gris oscuro, garantizando máxima puntualidad y disponibilidad permanente.',
    amenities: ['Climatizador Tri-zona de Alto Rendimiento', 'Música Bluetooth Funcional', 'Asientos Altos Reclinables con Apoyacabezas', 'Cinturones de Seguridad Homologados', 'Bodega de Equipaje Trasera', 'Wifi de Alta Velocidad']
  }
];

// Generar reservas semilla sutiles
export const getInitialBookings = (): Booking[] => {
  const today = new Date();
  
  const getDateOffset = (days: number) => {
    const target = new Date(today);
    target.setDate(today.getDate() + days);
    return target.toISOString().split('T')[0];
  };

  return [
    {
      id: 'res-001',
      customerName: 'Santiago Rodríguez',
      customerEmail: 'santiago.r@gmail.com',
      customerPhone: '+598 99 456 789',
      vehicleId: 'master-16pax-1',
      vehicleName: 'Renault Master Minibús (Unidad A - Blanca)',
      startDate: getDateOffset(3),
      endDate: getDateOffset(3),
      kilometers: 120,
      passengers: 15,
      totalDays: 1,
      totalCost: 6000,
      status: 'confirmada',
      destination: 'Montevideo Prado a Bodega Estableciemento Juanicó',
      notes: 'Traslado de ida y vuelta para grupo de bodas, salida 11:30hs.'
    }
  ];
};
