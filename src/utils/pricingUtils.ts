export interface PricingBreakdown {
  baseRate: number;
  petSurcharge: number;
  petSurchargePerNight: number;
  seniorSurcharge: number;
  medsSurcharge: number;
  gardenSurcharge: number;
  durationDiscount: number;
  total: number;
  perDay: number;
}

export interface PricingCalculationParams {
  duration: number;
  dogCount: number;
  catCount: number;
  otherCount: number;
  hasSeniorPets?: boolean;
  hasMedications?: boolean;
  largeGarden?: boolean;
}

/**
 * Pure mathematical calculation engine for booking pricing.
 * Calculates base rate, multi-tier durations, pet surcharges, add-on surcharges, and long-stay discounts.
 */
export function calculateBookingPricing({
  duration,
  dogCount,
  catCount,
  otherCount,
  hasSeniorPets = false,
  hasMedications = false,
  largeGarden = false,
}: PricingCalculationParams): PricingBreakdown {
  const safeDuration = Math.max(1, duration);

  let baseVal = 0;
  if (safeDuration <= 1) {
    baseVal = 99;
  } else if (safeDuration < 7) {
    // Linear scale between 1 night ($99) and 7 nights ($299)
    baseVal = 99 + (safeDuration - 1) * ((299 - 99) / 6);
  } else if (safeDuration < 30) {
    // Weekly scale: $299 per full week (7 days) + pro-rated daily rate ($299 / 7) for extra days, capped at monthly rate ($999)
    const weeks = Math.floor(safeDuration / 7);
    const extraDays = safeDuration % 7;
    const weeklyTotal = weeks * 299 + extraDays * (299 / 7);
    baseVal = Math.min(weeklyTotal, 999);
  } else {
    // Monthly scale: $999 per 30 days + pro-rated weekly/daily rate for remaining days
    const months = Math.floor(safeDuration / 30);
    const remDays = safeDuration % 30;
    const remWeeks = Math.floor(remDays / 7);
    const remExtraDays = remDays % 7;
    const remCost = Math.min(remWeeks * 299 + remExtraDays * (299 / 7), 999);
    baseVal = months * 999 + remCost;
  }
  const baseRate = Math.round(baseVal);

  // 2 pets of any kind always included, any additional pet +$10/night
  const totalPets = dogCount + catCount + otherCount;
  const additionalPets = Math.max(0, totalPets - 2);
  const petDailyRate = additionalPets * 10;
  const petSurcharge = Math.round(petDailyRate * safeDuration);

  const seniorSurcharge = hasSeniorPets ? Math.round(2.5 * safeDuration) : 0;
  const medsSurcharge = hasMedications ? Math.round(2.5 * safeDuration) : 0;
  const gardenSurcharge = largeGarden ? Math.round(2.5 * safeDuration) : 0;

  const subtotalItems = baseRate + petSurcharge + seniorSurcharge + medsSurcharge + gardenSurcharge;

  let discountPercent = 0;
  if (safeDuration >= 60) {
    discountPercent = 0.1;
  }

  const durationDiscount = Math.round(subtotalItems * discountPercent);
  const total = Math.max(0, subtotalItems - durationDiscount);
  const perDay = Number((total / safeDuration).toFixed(2));

  return {
    baseRate,
    petSurcharge,
    petSurchargePerNight: petDailyRate,
    seniorSurcharge,
    medsSurcharge,
    gardenSurcharge,
    durationDiscount,
    total,
    perDay,
  };
}
