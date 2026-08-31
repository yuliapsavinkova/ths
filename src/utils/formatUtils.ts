import { BookingRequest } from '../types';

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
      parts.push(`${booking.otherCount} ${booking.otherCount === 1 ? 'Other' : 'Others'}`);
    }
    if (parts.length > 0) {
      return parts.join(', ');
    }
    return 'No Pets';
  }
  
  if (booking.petType === 'none' || !booking.petCount || booking.petCount <= 0) return 'No Pets';
  if (booking.petType === 'dog') return `${booking.petCount} ${booking.petCount === 1 ? 'Dog' : 'Dogs'}`;
  if (booking.petType === 'cat') return `${booking.petCount} ${booking.petCount === 1 ? 'Cat' : 'Cats'}`;
  if (booking.petType === 'other') return `${booking.petCount} ${booking.petCount === 1 ? 'Other' : 'Others'}`;
  if (booking.petType === 'mixed') return `${booking.petCount} Mixed Pets`;
  
  return `${booking.petCount} Pets`;
}

/**
 * Shared helper to format booking duration in nights.
 */
export function formatBookingDuration(booking: BookingRequest): string {
  if (!booking.duration || booking.duration <= 0) {
    return 'Not specified';
  }
  const nights = booking.duration;
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
}
