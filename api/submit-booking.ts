import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface PricingBreakdownData {
  baseRate?: number;
  petSurcharge?: number;
  petSurchargePerNight?: number;
  seniorSurcharge?: number;
  medsSurcharge?: number;
  gardenSurcharge?: number;
  durationDiscount?: number;
  total?: number;
  perDay?: number;
}

interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  location: string;
  referredBy?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  petType: string;
  petCount: number;
  dogCount?: number;
  catCount?: number;
  otherCount?: number;
  hasMedications?: boolean;
  hasSeniorPets?: boolean;
  largeGarden?: boolean;
  notes?: string;
  pricing?: PricingBreakdownData;
}

function generateBookingEmailHtml(booking: BookingRequest): string {
  let petTypeLabel = booking.petType;
  if (
    booking.dogCount !== undefined ||
    booking.catCount !== undefined ||
    booking.otherCount !== undefined
  ) {
    const parts: string[] = [];
    if (booking.dogCount && booking.dogCount > 0)
      parts.push(`${booking.dogCount} ${booking.dogCount === 1 ? 'Dog' : 'Dogs'}`);
    if (booking.catCount && booking.catCount > 0)
      parts.push(`${booking.catCount} ${booking.catCount === 1 ? 'Cat' : 'Cats'}`);
    if (booking.otherCount && booking.otherCount > 0) parts.push(`${booking.otherCount} Other`);
    if (parts.length > 0) {
      petTypeLabel = `${booking.petCount} (${parts.join(', ')})`;
    } else {
      petTypeLabel = `${booking.petCount} Pets`;
    }
  } else if (booking.petType === 'none') {
    petTypeLabel = 'No Pets';
  } else if (booking.petType === 'mixed') {
    petTypeLabel = `${booking.petCount} Mixed Pets`;
  } else if (booking.petType === 'other') {
    petTypeLabel = `${booking.petCount} Other (fish, parrots, reptiles...)`;
  } else if (booking.petType === 'dog') {
    petTypeLabel = `${booking.petCount} ${booking.petCount === 1 ? 'Dog' : 'Dogs'}`;
  } else if (booking.petType === 'cat') {
    petTypeLabel = `${booking.petCount} ${booking.petCount === 1 ? 'Cat' : 'Cats'}`;
  }

  const specialNeedsList: string[] = [];
  if (booking.hasSeniorPets) specialNeedsList.push('High-Energy or Reactive Dogs / Senior Care');
  if (booking.hasMedications) specialNeedsList.push('Specialized Medical Needs & Medication');
  if (booking.largeGarden) specialNeedsList.push('Garden, Lawn & Plant Management');
  const specialNeedsHtml =
    specialNeedsList.length > 0
      ? specialNeedsList.map((item) => `<div style="margin-bottom: 2px;">• ${item}</div>`).join('')
      : 'None';

  let durationStr = 'Not specified';
  if (booking.duration && booking.duration > 0) {
    const n = booking.duration;
    if (n < 7) {
      durationStr = `${n} ${n === 1 ? 'night' : 'nights'}`;
    } else if (n < 30) {
      const weeks = Math.floor(n / 7);
      const days = n % 7;
      durationStr = `${n} nights (${weeks} ${weeks === 1 ? 'week' : 'weeks'}${days > 0 ? `, ${days} ${days === 1 ? 'day' : 'days'}` : ''})`;
    } else {
      const months = Math.floor(n / 30);
      const days = n % 30;
      durationStr = `${n} nights (~${months} ${months === 1 ? 'month' : 'months'}${days > 0 ? `, ${days} ${days === 1 ? 'day' : 'days'}` : ''})`;
    }
  }

  const p = booking.pricing;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h2 style="color: #b08c40; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Sit Request</h2>
        <p style="color: #666666; font-size: 14px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Services</p>
      </div>
      
      <!-- Client Details Card -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Client Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Client Name:</td>
            <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${booking.name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Email Address:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">
              <a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email || 'Not provided'}</a>
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
            <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Dates:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${booking.startDate || 'Not specified'} to ${booking.endDate || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Duration:</td>
            <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${durationStr}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500;">Pets:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${petTypeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666666; font-weight: 500; vertical-align: top;">Specialized Care:</td>
            <td style="padding: 6px 0; color: #1a1a1a;">${specialNeedsHtml}</td>
          </tr>
        </table>
      </div>

      <!-- Estimated Cost Breakdown Card -->
      ${
        p && p.total !== undefined
          ? `
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-top: 16px;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Estimated Cost Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
          ${
            p.baseRate !== undefined
              ? `
          <tr>
            <td style="padding: 6px 0; color: #666666;">Base Rate (${booking.duration || 1} ${booking.duration === 1 ? 'night' : 'nights'}):</td>
            <td style="padding: 6px 0; color: #1a1a1a; text-align: right; font-weight: 500;">$${p.baseRate}</td>
          </tr>`
              : ''
          }
          ${
            p.petSurcharge && p.petSurcharge > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #666666;">Additional Pets Surcharge ($10/night):</td>
            <td style="padding: 6px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.petSurcharge}</td>
          </tr>`
              : ''
          }
          ${
            p.seniorSurcharge && p.seniorSurcharge > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #666666;">High Energy / Senior / Puppy Care ($2.50/night):</td>
            <td style="padding: 6px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.seniorSurcharge}</td>
          </tr>`
              : ''
          }
          ${
            p.medsSurcharge && p.medsSurcharge > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #666666;">Medication Administration ($2.50/night):</td>
            <td style="padding: 6px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.medsSurcharge}</td>
          </tr>`
              : ''
          }
          ${
            p.gardenSurcharge && p.gardenSurcharge > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #666666;">Garden & Plant Care ($2.50/night):</td>
            <td style="padding: 6px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.gardenSurcharge}</td>
          </tr>`
              : ''
          }
          ${
            p.durationDiscount && p.durationDiscount > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #15803d; font-weight: 500;">Long-Stay Discount:</td>
            <td style="padding: 6px 0; color: #15803d; text-align: right; font-weight: 600;">-$${p.durationDiscount}</td>
          </tr>`
              : ''
          }
          <tr style="background-color: #fcfaf7; border-top: 2px solid #f3ebd8;">
            <td style="padding: 10px 8px; color: #1a1a1a; font-weight: 700; font-size: 15px;">Total Estimate:</td>
            <td style="padding: 10px 8px; color: #b08c40; text-align: right; font-weight: 700; font-size: 18px;">$${p.total}</td>
          </tr>
          ${
            p.perDay !== undefined
              ? `
          <tr>
            <td style="padding: 6px 8px; color: #666666; font-size: 13px;" colspan="2">
              Average Nightly Rate: <strong>~$${p.perDay.toFixed(2)} / night</strong>
            </td>
          </tr>`
              : ''
          }
        </table>
      </div>
      `
          : ''
      }

      <!-- Specific Instructions Card -->
      ${
        booking.notes
          ? `
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-top: 16px;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Specific Instructions & Routines</h3>
        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap;">${booking.notes}</p>
      </div>
      `
          : ''
      }

      <!-- Footer Branding & Action -->
      <div style="text-align: center; margin-top: 28px; font-size: 12px; color: #999999; line-height: 1.4;">
        This request was securely routed using Resend via your website portal.<br>
        To reply directly to this client, email <a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email}</a>.
      </div>
    </div>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }

  try {
    let booking = req.body;
    if (typeof booking === 'string') {
      try {
        booking = JSON.parse(booking);
      } catch (e) {
        console.error('Failed to parse string body:', e);
      }
    }

    if (!booking || typeof booking !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing JSON payload.',
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY in Vercel Environment Variables');
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY environment variable is not configured on Vercel.',
      });
    }

    const recipient = process.env.SITTER_EMAIL_TO;
    if (!recipient) {
      console.error('Missing SITTER_EMAIL_TO in Vercel Environment Variables');
      return res.status(500).json({
        success: false,
        message: 'SITTER_EMAIL_TO environment variable is not configured on Vercel.',
      });
    }

    const sender = process.env.SITTER_EMAIL_FROM || 'onboarding@resend.dev';

    const resend = new Resend(apiKey);
    const emailHtml = generateBookingEmailHtml(booking);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: recipient,
      subject: `New Sit Request from ${booking.name || 'Client'} (${booking.location || 'Location'})`,
      html: emailHtml,
      replyTo: booking.email || recipient,
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Resend failed to send email notification.',
        resendError: error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking request captured and email alert sent successfully.',
      bookingId: Math.random().toString(36).substring(2, 9),
      resendData: data,
    });
  } catch (error: unknown) {
    console.error('Serverless function exception in /api/submit-booking:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Serverless function execution error.',
      error: errorMessage,
    });
  }
}
