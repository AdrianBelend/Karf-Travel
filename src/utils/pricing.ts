export interface PricingBreakdown {
  ratePerKm: number;
  baseDistanceCost: number;
  isHourly: boolean; // if kilometers <= 60
  duration: number; // hours or days
  extraDurationAmount: number; // hours past 4, or days past 1
  extraDurationCost: number; // $300 per extra hour of wait or $1500 per extra night
  totalCost: number;
}

export function calculateTripPricing(kilometers: number, duration: number, capacity: number): PricingBreakdown {
  let ratePerKm = 0;
  let isHourly = false;
  let extraDurationAmount = 0;
  let extraDurationCost = 0;

  // Hourly if <= 59 km; changes to daily at 60 km
  if (kilometers <= 59) {
    isHourly = true;
    ratePerKm = 51;
    // duration represents hours (range 4 to 24)
    extraDurationAmount = Math.max(0, duration - 4);
    extraDurationCost = extraDurationAmount * 300;
  } else {
    isHourly = false;
    if (kilometers <= 149) {
      ratePerKm = 40;
    } else if (kilometers <= 299) {
      ratePerKm = 32;
    } else {
      ratePerKm = 30;
    }
    // duration represents days (range 1 to 15)
    extraDurationAmount = Math.max(0, duration - 1);
    extraDurationCost = extraDurationAmount * 1500;
  }

  // Calculate base costs for 15 passengers
  let baseDistanceCost = kilometers * ratePerKm;
  let totalCost = baseDistanceCost + extraDurationCost;

  // The base rates are for 15 passengers. 8 passengers takes 80% (0.80) of 15 passenger rates.
  const multiplier = capacity <= 8 ? 0.80 : 1.0;

  ratePerKm = ratePerKm * multiplier;
  baseDistanceCost = baseDistanceCost * multiplier;
  extraDurationCost = extraDurationCost * multiplier;
  totalCost = totalCost * multiplier;

  return {
    ratePerKm,
    baseDistanceCost,
    isHourly,
    duration,
    extraDurationAmount,
    extraDurationCost,
    totalCost
  };
}
