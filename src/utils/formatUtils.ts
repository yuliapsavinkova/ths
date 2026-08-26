import { BookingRequest } from '../types';
import { formatStayDuration } from './calendarUtils';

/**
 * Shared helper to format human-readable pet descriptions.
 */
export function formatPetTypeLabel(booking: BookingRequest): string {
  if (booking.dogCount !== undefined || booking.catCount !== undefined || booking.otherCount !== undefined) {
    const parts: string[] = [];
    if (booking.dogCount && booking.dogCount > 0) {
      parts.push(`${booking.dogCount} ${booking.dogCount === 1 ? 'Dog' : 'Dogs'}`);
    }
    if (booking.catCount && booking.catCount > 0) {
      parts.push(`${booking.catCount} ${booking.catCount === 1 ? 'Cat' : 'Cats'}`);
    }
    if (booking.otherCount && booking.otherCount > 0) {
      parts.push(`${booking.otherCount} Other`);
    }
    if (parts.length > 0) {
      return `${booking.petCount} (${parts.join(', ')})`;
    }
    return `${booking.petCount} Pets`;
  }
  
  if (booking.petType === 'none') return 'No Pets';
  if (booking.petType === 'mixed') return `${booking.petCount} Mixed Pets`;
  if (booking.petType === 'other') return `${booking.petCount} Other (fish, parrots, reptiles...)`;
  if (booking.petType === 'dog') return `${booking.petCount} ${booking.petCount === 1 ? 'Dog' : 'Dogs'}`;
  if (booking.petType === 'cat') return `${booking.petCount} ${booking.petCount === 1 ? 'Cat' : 'Cats'}`;
  
  return `${booking.petCount} ${booking.petType || 'Pets'}`;
}

/**
 * Shared helper to format booking duration.
 */
export function formatBookingDuration(booking: BookingRequest): string {
  if (!booking.duration || booking.duration <= 0) {
    return 'Not specified';
  }
  const nights = booking.duration;
  if (nights < 7) {
    return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  }
  const humanDuration = formatStayDuration(nights, booking.startDate, booking.endDate);
  return `${nights} nights (${humanDuration})`;
}
