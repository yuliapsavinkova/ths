export interface PricingBreakdown {
  baseRate: number;
  petSurcharge: number;
  petSurchargePerNight: number;
  seniorSurcharge: number;
  medsSurcharge: number;
  gardenSurcharge: number;
  durationDiscount: number;
  homeOnlyDiscount: number;
  repeatClientDiscount: number;
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
  isRepeatClient?: boolean;
}

/**
 * Cumulative base price lookup table for 1 to 30 nights.
 * - Days 1–7: Hardcoded introductory & weekly tiers ($99, $160, $200, $240, $260, $280, $299)
 * - Days 8–21: Standard weekly scaling (~$42.71/night -> $897 at 3 weeks)
 * - Days 22–30: Smooth glide to 1-month milestone ($11.33/night -> $999 at 30 nights)
 */
export const BASE_PRICE_BY_NIGHT: Record<number, number> = {
  1: 99,
  2: 160,
  3: 200,
  4: 240,
  5: 260,
  6: 280,
  7: 299,
  8: 342,
  9: 384,
  10: 427,
  11: 470,
  12: 513,
  13: 555,
  14: 598,
  15: 641,
  16: 683,
  17: 726,
  18: 769,
  19: 812,
  20: 854,
  21: 897,
  22: 908,
  23: 920,
  24: 931,
  25: 942,
  26: 954,
  27: 965,
  28: 976,
  29: 988,
  30: 999,
};

/** Beyond 30 nights, rate continues based on the $999/month daily rate (~$33.30/night) */
export const RATE_PER_NIGHT_AFTER_30 = 33;

/**
 * Pure mathematical calculation engine for booking pricing.
 * Look up base rate from table (1-30 nights) or pro-rates beyond 30 nights.
 * Handles pet surcharges (1st pet free), optional add-ons, and client discounts.
 */
export function calculateBookingPricing({
  duration,
  dogCount = 0,
  catCount = 0,
  otherCount = 0,
  hasSeniorPets = false,
  hasMedications = false,
  largeGarden = false,
  isRepeatClient = false,
}: PricingCalculationParams): PricingBreakdown {
  const safeDuration = Math.max(1, duration);

  // 1. Base Rate from cumulative table or pro-rated monthly rate after 30 nights
  const baseRate =
    safeDuration <= 30
      ? (BASE_PRICE_BY_NIGHT[safeDuration] ?? 99)
      : (BASE_PRICE_BY_NIGHT[30] + Math.round((safeDuration - 30) * (BASE_PRICE_BY_NIGHT[30] / 30)));

  // 2. Base rate includes 1 pet of any kind free (deducted from highest priority type)
  let chargeableDogs = Math.max(0, dogCount);
  let chargeableCats = Math.max(0, catCount);
  let chargeableOthers = Math.max(0, otherCount);

  if (chargeableDogs > 0) {
    chargeableDogs -= 1;
  } else if (chargeableCats > 0) {
    chargeableCats -= 1;
  } else if (chargeableOthers > 0) {
    chargeableOthers -= 1;
  }

  const petDailyRate = chargeableDogs * 10 + chargeableCats * 5 + chargeableOthers * 5;
  const petSurcharge = Math.round(petDailyRate * safeDuration);
  const totalPets = Math.max(0, dogCount + catCount + otherCount);

  // 3. Add-on surcharges
  const seniorSurcharge = hasSeniorPets ? Math.round(2.5 * safeDuration) : 0;
  const medsSurcharge = hasMedications ? Math.round(2.5 * safeDuration) : 0;
  const gardenSurcharge = largeGarden ? Math.round(2.5 * safeDuration) : 0;

  const subtotalItems = baseRate + petSurcharge + seniorSurcharge + medsSurcharge + gardenSurcharge;

  // 4. Client discounts (e.g. repeat clients)
  const durationDiscount = 0;
  const homeOnlyDiscount = 0;
  const repeatClientDiscount = isRepeatClient ? Math.round(subtotalItems * 0.1) : 0;
  const total = Math.max(0, subtotalItems - durationDiscount - homeOnlyDiscount - repeatClientDiscount);
  const perDay = Number((total / safeDuration).toFixed(2));

  return {
    baseRate,
    petSurcharge,
    petSurchargePerNight: petDailyRate,
    seniorSurcharge,
    medsSurcharge,
    gardenSurcharge,
    durationDiscount,
    homeOnlyDiscount,
    repeatClientDiscount,
    total,
    perDay,
  };
}
