import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

interface PricingBreakdown {
  baseRate: number;
  petSurcharge: number;
  seniorSurcharge: number;
  medsSurcharge: number;
  gardenSurcharge: number;
  durationDiscount: number;
  total: number;
  perDay: number;
}

interface BookingRequest {
  id?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  petType?: string;
  petCount?: number;
  dogCount?: number;
  catCount?: number;
  otherCount?: number;
  seniorCare?: boolean;
  medication?: boolean;
  gardenCare?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  referredBy?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'rejected' | 'completed';
  createdAt?: string;
  pricing?: PricingBreakdown;
}

function formatHumanDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);
    const date = new Date(Date.UTC(year, monthIndex, day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
}

function formatPetTypeLabel(booking: BookingRequest): string {
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

function formatStayDatesHtml(startDate?: string, endDate?: string): string {
  const startHuman = startDate ? formatHumanDate(startDate) : '';
  const endHuman = endDate ? formatHumanDate(endDate) : '';

  return `
    <tr>
      <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Start Date:</td>
      <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">
        ${startDate ? `<span style="color: #1a1a1a;">${startHuman}</span> <span style="color: #888888; font-weight: 400; font-size: 13px;">(${startDate})</span>` : 'Not specified'}
      </td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #666666; font-weight: 500;">End Date:</td>
      <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">
        ${endDate ? `<span style="color: #1a1a1a;">${endHuman}</span> <span style="color: #888888; font-weight: 400; font-size: 13px;">(${endDate})</span>` : 'Not specified'}
      </td>
    </tr>
  `;
}

function formatClientDetailsHtml(booking: BookingRequest): string {
  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">
        Contact Details
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
        <tr>
          <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${booking.name || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Email:</td>
          <td style="padding: 6px 0; color: #1a1a1a;">
            ${booking.email ? `<a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email}</a>` : 'Not provided'}
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Phone:</td>
          <td style="padding: 6px 0; color: #1a1a1a;">${booking.phone ? `<a href="tel:${booking.phone}" style="color: #1a1a1a; text-decoration: none;">${booking.phone}</a>` : 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Location / Area:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 500;">${booking.location || 'Not provided'}</td>
        </tr>
        ${booking.referredBy ? `
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Referred By:</td>
          <td style="padding: 6px 0; color: #1a1a1a;">${booking.referredBy}</td>
        </tr>` : ''}
      </table>
    </div>
  `;
}

function formatBookingDuration(booking: BookingRequest): string {
  if (!booking.duration || booking.duration <= 0) {
    return 'Not specified';
  }
  const nights = booking.duration;
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
}

function formatStayDetailsHtml(booking: BookingRequest): string {
  const petTypeLabel = formatPetTypeLabel(booking);
  const durationStr = formatBookingDuration(booking);

  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Stay & Care Details</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
        ${formatStayDatesHtml(booking.startDate, booking.endDate)}
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Duration:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${durationStr}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Pets:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${petTypeLabel}</td>
        </tr>
      </table>
    </div>
  `;
}

function formatNotesHtml(notes?: string): string {
  if (!notes || !notes.trim()) {
    return '';
  }

  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 12px;">
        Notes
      </h3>
      <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap; font-style: italic; background-color: #fcfaf7; padding: 12px; border-radius: 8px; border-left: 3px solid #b08c40;">
        "${notes.trim()}"
      </p>
    </div>
  `;
}

function formatPricingBreakdownHtml(p?: Partial<PricingBreakdown>): string {
  if (!p || p.total === undefined) {
    return '';
  }

  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">Estimated Pricing Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
        ${p.baseRate !== undefined ? `
        <tr>
          <td style="padding: 4px 0; color: #666666;">Base Rate:</td>
          <td style="padding: 4px 0; color: #1a1a1a; text-align: right; font-weight: 500;">$${p.baseRate}</td>
        </tr>` : ''}
        ${p.petSurcharge ? `
        <tr>
          <td style="padding: 4px 0; color: #666666;">Additional Pets Surcharge:</td>
          <td style="padding: 4px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.petSurcharge}</td>
        </tr>` : ''}
        ${p.seniorSurcharge ? `
        <tr>
          <td style="padding: 4px 0; color: #666666;">High-Energy / Senior Care:</td>
          <td style="padding: 4px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.seniorSurcharge}</td>
        </tr>` : ''}
        ${p.medsSurcharge ? `
        <tr>
          <td style="padding: 4px 0; color: #666666;">Specialized Medical Care:</td>
          <td style="padding: 4px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.medsSurcharge}</td>
        </tr>` : ''}
        ${p.gardenSurcharge ? `
        <tr>
          <td style="padding: 4px 0; color: #666666;">Garden / Plant Care:</td>
          <td style="padding: 4px 0; color: #1a1a1a; text-align: right; font-weight: 500;">+$${p.gardenSurcharge}</td>
        </tr>` : ''}
        ${p.durationDiscount ? `
        <tr>
          <td style="padding: 4px 0; color: #2e7d32;">Long-Stay Savings:</td>
          <td style="padding: 4px 0; color: #2e7d32; text-align: right; font-weight: 500;">-$${p.durationDiscount}</td>
        </tr>` : ''}
        <tr style="border-top: 1px solid #f0f2f5; font-size: 15px;">
          <td style="padding: 10px 0 4px 0; color: #1a1a1a; font-weight: 700;">Total Estimated Cost:</td>
          <td style="padding: 10px 0 4px 0; color: #b08c40; text-align: right; font-weight: 700; font-size: 18px;">$${p.total}</td>
        </tr>
        ${p.perDay !== undefined ? `
        <tr>
          <td style="padding: 2px 0 4px 0; color: #888888; font-size: 12px;" colspan="2">
            Average daily rate: ~$${p.perDay.toFixed(2)} / night
          </td>
        </tr>` : ''}
      </table>
    </div>
  `;
}

function generateBookingEmailHtml(booking: BookingRequest): string {
  const p = booking.pricing;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #b08c40; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Booking Request</h2>
        <p style="color: #666666; font-size: 14px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Services</p>
      </div>
      
      ${formatStayDetailsHtml(booking)}
      ${formatClientDetailsHtml(booking)}
      ${formatNotesHtml(booking.notes)}
      ${formatPricingBreakdownHtml(p)}

      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #888888; line-height: 1.6;">
        Yulia House & Pet Sitting • Professional & Dedicated Care
      </div>
    </div>
  `;
}

function generateBookingConfirmationEmailHtml(booking: BookingRequest): string {
  const durationStr = formatBookingDuration(booking);
  const p = booking.pricing;
  const clientFirstName = booking.name ? booking.name.trim().split(' ')[0] : 'there';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #b08c40; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Thank You for Your Request!</h2>
        <p style="color: #666666; font-size: 14px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Services</p>
      </div>

      <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 12px;">Hi ${clientFirstName},</h3>
        <p style="margin: 0 0 14px 0; font-size: 15px; color: #333333; line-height: 1.6;">
          Thank you for reaching out! I've received your booking request for <strong>${booking.startDate ? formatHumanDate(booking.startDate) : 'your selected dates'}</strong> to <strong>${booking.endDate ? formatHumanDate(booking.endDate) : 'selected end date'}</strong> (${durationStr}). I'm looking forward to connecting with you!
        </p>
        <div style="background-color: #fcfaf7; border-left: 3px solid #b08c40; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500; line-height: 1.5;">
            🕒 <strong>What happens next:</strong> I will review my calendar and reach out to you directly <strong>within 24 hours</strong> to confirm availability and coordinate the details.
          </p>
        </div>
        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
          I look forward to meeting you and giving your home and pets the attentive, loving care they deserve.
        </p>
      </div>

      ${formatStayDetailsHtml(booking)}
      ${formatClientDetailsHtml(booking)}
      ${formatNotesHtml(booking.notes)}
      ${formatPricingBreakdownHtml(p)}

      <div style="text-align: center; margin-top: 24px; font-size: 13px; color: #666666; line-height: 1.6;">
        <div style="margin-bottom: 4px;">
          💬 <strong>Questions or updates?</strong> You can simply reply directly to this email or reach out to <a href="mailto:sitterjourney@gmail.com" style="color: #b08c40; text-decoration: none; font-weight: 600;">sitterjourney@gmail.com</a>.
        </div>
        <div style="font-size: 12px; color: #888888; margin-top: 6px;">
          Yulia House & Pet Sitting • Professional & Dedicated Care
        </div>
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
    let booking: BookingRequest = req.body;
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

    const sender = process.env.SITTER_EMAIL_FROM;
    if (!sender) {
      console.error('Missing SITTER_EMAIL_FROM in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'SITTER_EMAIL_FROM is not configured in Vercel Environment Variables.',
      });
    }

    const resend = new Resend(apiKey);
    const emailHtml = generateBookingEmailHtml(booking);

    // 1. Send detailed notification alert to the sitter
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

    // 2. Send instant confirmation / thank you email to the client if email is provided
    let clientConfirmationSent = false;
    if (booking.email && typeof booking.email === 'string' && booking.email.includes('@')) {
      try {
        const clientEmailHtml = generateBookingConfirmationEmailHtml(booking);
        await resend.emails.send({
          from: sender,
          to: booking.email.trim(),
          subject: 'Thank You for Your Request!',
          html: clientEmailHtml,
          replyTo: recipient,
        });
        clientConfirmationSent = true;
      } catch (clientEmailErr) {
        console.error('Failed to send confirmation email to client:', clientEmailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking request captured and email alert sent successfully.',
      bookingId: Math.random().toString(36).substring(2, 9),
      resendData: data,
      clientConfirmationSent,
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
