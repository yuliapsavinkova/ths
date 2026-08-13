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
 * Calculates the inclusive number of days between two local YYYY-MM-DD date strings.
 */
export const calculateDuration = (startStr: string, endStr: string): number => {
  if (!startStr) return 0;
  if (!endStr) return 1;
  
  const start = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};
