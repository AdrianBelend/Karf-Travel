export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
  pricePerKm: number;
  pricePerDay: number;
  image: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  kilometers: number;
  passengers: number;
  totalDays: number;
  totalCost: number;
  status: 'confirmada' | 'pendiente';
  destination: string;
  notes?: string;
}

export interface CalculationResult {
  vehicle: Vehicle;
  baseCost: number;
  distanceCost: number;
  daysCost: number;
  totalCost: number;
  isAvailable: boolean;
}
