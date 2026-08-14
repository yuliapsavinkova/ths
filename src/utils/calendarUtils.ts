import { DateRange, BOOKED_DATE_RANGES, LIMITED_DATE_RANGES } from '../data';

/**
 * Resolves the status of a specific Date based on the configured booked and limited date ranges.
 */
export const getDateStatus = (date: Date): 'available' | 'booked' | 'limited' => {
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();

  // Format date safely as local 'YYYY-MM-DD'
  const yearStr = y;
  const monthStr = String(m + 1).padStart(2, '0');
  const dayStr = String(d).padStart(2, '0');
  const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

  // If outside active calendar scope
  if (dateStr < '2026-07-01' || dateStr > '2027-06-30') {
    return 'booked';
  }

  // Check booked ranges
  const isBooked = BOOKED_DATE_RANGES.some(range => dateStr >= range.start && dateStr <= range.end);
  if (isBooked) {
    return 'booked';
  }

  // Check limited ranges
  const isLimited = LIMITED_DATE_RANGES.some(range => dateStr >= range.start && dateStr <= range.end);
  if (isLimited) {
    return 'limited';
  }

  return 'available';
};

/**
 * Returns the number of days in a given month of a year.
 */
export const getDaysInMonth = (y: number, m: number): number => {
  return new Date(y, m + 1, 0).getDate();
};

/**
 * Returns the starting weekday offset of a month (0 = Mon, 6 = Sun).
 */
export const getFirstDayOfMonth = (y: number, m: number): number => {
  const day = new Date(y, m, 1).getDay();
  return day === 0 ? 6 : day - 1; // 0 = Mon, 6 = Sun
};

/**
 * Safely format year, month index, and day as a local YYYY-MM-DD string.
 */
export const formatDateStr = (y: number, mIndex: number, d: number): string => {
  const mm = String(mIndex + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
};

/**
 * Checks if a range of YYYY-MM-DD local strings contains any booked days.
 */
export const rangeHasBookedDays = (startStr: string, endStr: string): boolean => {
  const start = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');
  let current = new Date(start.getTime());
  
  while (current <= end) {
    if (getDateStatus(current) === 'booked') {
      return true;
    }
    current.setDate(current.getDate() + 1);
  }
  return false;
};

/**
 * Formats a local date string (YYYY-MM-DD) into a friendly human-readable format.
 */
export const formatHumanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Calculates the exact night difference between two local YYYY-MM-DD date strings,
 * free from Daylight Saving Time (DST) hour shifts.
 */
export const getDatesDiff = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const [sY, sM, sD] = startStr.split('-').map(Number);
  const [eY, eM, eD] = endStr.split('-').map(Number);
  if (isNaN(sY) || isNaN(eY)) return 1;
  const sUtc = Date.UTC(sY, sM - 1, sD);
  const eUtc = Date.UTC(eY, eM - 1, eD);
  const diff = Math.round((eUtc - sUtc) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
};

/**
 * Calculates end date (YYYY-MM-DD) from a start date and number of nights,
 * utilizing calendar arithmetic to avoid DST shifts.
 */
export const calculateEndDateStr = (startStr: string, nights: number): string => {
  if (!startStr) return '';
  const [year, month, day] = startStr.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + nights);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Calculates end date (YYYY-MM-DD) from a start date adding exact calendar months.
 */
export const calculateEndDateWithMonths = (startStr: string, monthsToAdd: number): string => {
  if (!startStr) return '';
  const [year, month, day] = startStr.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
  const date = new Date(year, month - 1 + monthsToAdd, day);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Formats a stay duration into a clean, human-friendly string (e.g., '1 week', '3 months', '2 months 5 days').
 * Accurately accounts for exact calendar month intervals and common stay milestones.
 */
export const formatStayDuration = (nights: number, startStr?: string, endStr?: string): string => {
  if (!nights || nights <= 0) return '1 night';
  if (nights < 7) {
    return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  }
  if (nights === 7) return '1 week';
  if (nights === 14) return '2 weeks';
  if (nights === 21) return '3 weeks';
  if (nights === 28 && !startStr) return '4 weeks';

  // Check for exact calendar month intervals if dates are provided
  if (startStr && endStr) {
    const [sY, sM, sD] = startStr.split('-').map(Number);
    const [eY, eM, eD] = endStr.split('-').map(Number);

    if (!isNaN(sY) && !isNaN(eY)) {
      const totalMonthDiff = (eY - sY) * 12 + (eM - sM);
      if (totalMonthDiff > 0) {
        const lastDayOfEndMonth = new Date(eY, eM, 0).getDate();
        const lastDayOfStartMonth = new Date(sY, sM, 0).getDate();
        const isStartEndOfMonth = sD === lastDayOfStartMonth;
        const isEndEndOfMonth = eD === lastDayOfEndMonth;

        if (
          sD === eD || 
          (isStartEndOfMonth && isEndEndOfMonth) || 
          (sD > lastDayOfEndMonth && eD === lastDayOfEndMonth)
        ) {
          return `${totalMonthDiff} ${totalMonthDiff === 1 ? 'month' : 'months'}`;
        }
      }
    }
  }

  // Handle standard milestone day counts
  if (nights === 30) return '1 month';
  if (nights === 60) return '2 months';
  if (nights === 90) return '3 months';
  if (nights === 120) return '4 months';
  if (nights === 150) return '5 months';
  if (nights === 180) return '6 months';

  if (nights < 30) {
    const weeks = Math.floor(nights / 7);
    const days = nights % 7;
    const weekText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    if (days === 0) return weekText;
    const dayText = `${days} ${days === 1 ? 'day' : 'days'}`;
    return `${weekText} ${dayText}`;
  }

  // If dates are provided, compute actual calendar months + remaining days
  if (startStr && endStr) {
    const [sY, sM, sD] = startStr.split('-').map(Number);
    const [eY, eM, eD] = endStr.split('-').map(Number);
    if (!isNaN(sY) && !isNaN(eY)) {
      let months = (eY - sY) * 12 + (eM - sM);
      let extraDays = eD - sD;

      if (extraDays < 0) {
        months -= 1;
        const prevMonthDays = new Date(eY, eM - 1, 0).getDate();
        extraDays += prevMonthDays;
      }

      if (months > 0) {
        const monthText = `${months} ${months === 1 ? 'month' : 'months'}`;
        if (extraDays === 0) return monthText;
        const dayText = `${extraDays} ${extraDays === 1 ? 'day' : 'days'}`;
        return `${monthText} ${dayText}`;
      }
    }
  }

  // Fallback if no dates provided or calculations default
  const months = Math.floor(nights / 30);
  const days = nights % 30;
  const monthText = `${months} ${months === 1 ? 'month' : 'months'}`;
  if (days === 0) return monthText;
  const dayText = `${days} ${days === 1 ? 'day' : 'days'}`;
  return `${monthText} ${dayText}`;
};

/**
 * Calculates the inclusive number of days between two local YYYY-MM-DD date strings.
 */
export const calculateDuration = (startStr: string, endStr: string): number => {
  if (!startStr) return 0;
  if (!endStr) return 1;
  return getDatesDiff(startStr, endStr) + 1;
};
