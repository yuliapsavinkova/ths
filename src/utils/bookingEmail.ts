import { SPECIALIZED_CARE_OPTIONS } from '../data';

/**
 * Generates an elegant, beautifully styled HTML email notification for new bookings.
 * 
 * Note: While we share visual styling choices with our main UI (such as the premium #b08c40 
 * brand accent, high-contrast dark elements, and clean card spacing), we must use inline 
 * fallback colors and absolute values here. 
 * Email clients (Gmail, Apple Mail, Outlook) do not support CSS variables, external stylesheets, 
 * or complex flexbox structures. Using strict inline-styled table grids guarantees a flawless, 
 * robust, and responsive layout across all inboxes.
 */

interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  location: string;
  referredBy?: string;
  startDate?: string;
  endDate?: string;
  petType: string;
  petCount: number;
  hasMedications?: boolean;
  hasSeniorPets?: boolean;
  largeGarden?: boolean;
  notes?: string;
}

export function generateBookingEmailHtml(booking: BookingRequest): string {
  // Format pet label gracefully based on count and type
  let petTypeLabel = booking.petType;
  if (booking.petType === 'none') {
    petTypeLabel = 'No Pets';
  } else if (booking.petType === 'mixed') {
    petTypeLabel = 'Mixed Pets';
  } else if (booking.petType === 'other') {
    petTypeLabel = 'Other (fish, parrots, reptiles...)';
  } else if (booking.petType === 'dog') {
    petTypeLabel = booking.petCount === 1 ? 'Dog' : 'Dogs';
  } else if (booking.petType === 'cat') {
    petTypeLabel = booking.petCount === 1 ? 'Cat' : 'Cats';
  }

  // Aggregate special care needs flags
  const specialNeedsList: string[] = [];
  if (booking.hasSeniorPets) specialNeedsList.push(SPECIALIZED_CARE_OPTIONS.highEnergy.label);
  if (booking.hasMedications) specialNeedsList.push(SPECIALIZED_CARE_OPTIONS.medications.label);
  if (booking.largeGarden) specialNeedsList.push(SPECIALIZED_CARE_OPTIONS.garden.label);
  const specialNeedsHtml = specialNeedsList.length > 0 
    ? specialNeedsList.map(item => `<div style="margin-bottom: 2px;">• ${item}</div>`).join('') 
    : 'None';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h2 style="color: #b08c40; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Booking Request</h2>
        <p style="color: #666666; font-size: 14px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Services</p>
      </div>
      
      <!-- Client Details Card -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Client Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Client Name:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Email Address:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">
              <a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Phone Number:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Location:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.location || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Referred By:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.referredBy || 'Not specified'}</td>
          </tr>
        </table>
      </div>

      <!-- Stay & Pet Profile Card -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-top: 16px;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Stay & Pet Profile</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Start Date:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.startDate || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">End Date:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.endDate || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Pets:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.petCount} ${petTypeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500; vertical-align: top;">Specialized Care:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${specialNeedsHtml}</td>
          </tr>
        </table>
      </div>

      <!-- Specific Instructions Card -->
      ${booking.notes ? `
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-top: 16px;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Specific Instructions & Routines</h3>
        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap;">${booking.notes}</p>
      </div>
      ` : ''}

      <!-- Footer Branding & Action -->
      <div style="text-align: center; margin-top: 28px; font-size: 12px; color: #999999; line-height: 1.4;">
        This request was securely routed using Resend via your website portal.<br>
        To reply directly to this client, email <a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email}</a>.
      </div>
    </div>
  `;
}
