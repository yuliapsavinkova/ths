import type { BookingRequest, PricingBreakdown } from '../../src/types.ts';

export type { BookingRequest, PricingBreakdown };

export function formatHumanDate(dateStr?: string): string {
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

export function formatStayDatesHtml(startDate?: string, endDate?: string): string {
  const startHuman = startDate ? formatHumanDate(startDate) : '';
  const endHuman = endDate ? formatHumanDate(endDate) : '';

  return `
    <tr>
      <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Start Date:</td>
      <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">
        ${startDate ? `<span style="color: #1a1a1a;">${startHuman}</span>` : 'Not specified'}
      </td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #666666; font-weight: 500;">End Date:</td>
      <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">
        ${endDate ? `<span style="color: #1a1a1a;">${endHuman}</span>` : 'Not specified'}
      </td>
    </tr>
  `;
}

export function formatClientDetailsHtml(booking: BookingRequest): string {
  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 14px;">
        Contact Details
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
        <tr>
          <td style="padding: 6px 0; color: #666666; width: 140px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">${booking.name || ''}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Email:</td>
          <td style="padding: 6px 0; color: #1a1a1a;">
            ${booking.email ? `<a href="mailto:${booking.email}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${booking.email}</a>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Phone:</td>
          <td style="padding: 6px 0; color: #1a1a1a;">${booking.phone ? `<a href="tel:${booking.phone}" style="color: #1a1a1a; text-decoration: none;">${booking.phone}</a>` : ''}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Location / Area:</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-weight: 500;">${booking.location || ''}</td>
        </tr>
        ${booking.isRepeatClient ? `
        <tr>
          <td style="padding: 6px 0; color: #666666; font-weight: 500;">Client Status:</td>
          <td style="padding: 6px 0; color: #2e7d32; font-weight: 600;">Repeat Client (10% Discount Applied)</td>
        </tr>` : ''}
      </table>
    </div>
  `;
}

export function formatBookingDuration(booking: BookingRequest): string {
  if (!booking.duration || booking.duration <= 0) {
    return 'Not specified';
  }
  const nights = booking.duration;
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
}

export function formatStayDetailsHtml(booking: BookingRequest): string {
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

export function formatNotesHtml(notes?: string): string {
  if (!notes || !notes.trim()) {
    return '';
  }

  return `
    <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
      <h3 style="margin-top: 0; color: #1a1a1a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; margin-bottom: 12px;">
        Notes
      </h3>
      <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap; font-style: italic; background-color: #fcfaf7; padding: 12px 14px; border-radius: 8px; border-left: 3px solid #b08c40;">
        "${notes.trim()}"
      </p>
    </div>
  `;
}

export function formatPricingBreakdownHtml(p?: Partial<PricingBreakdown>, booking?: BookingRequest): string {
  if (!p || p.total === undefined) {
    return '';
  }

  const isRepeat = Boolean(booking?.isRepeatClient || (p.repeatClientDiscount && p.repeatClientDiscount > 0));
  const repeatDiscount = (p.repeatClientDiscount && p.repeatClientDiscount > 0)
    ? p.repeatClientDiscount
    : (isRepeat && p.baseRate
      ? Math.round(((p.baseRate || 0) + (p.petSurcharge || 0) + (p.seniorSurcharge || 0) + (p.medsSurcharge || 0) + (p.gardenSurcharge || 0)) * 0.1)
      : 0);

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
        ${isRepeat ? `
        <tr>
          <td style="padding: 4px 0; color: #2e7d32; font-weight: 500;">Repeat Client (10% Off):</td>
          <td style="padding: 4px 0; color: #2e7d32; text-align: right; font-weight: 600;">-${repeatDiscount > 0 ? `$${repeatDiscount}` : '10% Off'}</td>
        </tr>` : ''}
        <tr style="border-top: 1px solid #f0f2f5; font-size: 15px;">
          <td style="padding: 10px 0 4px 0; color: #1a1a1a; font-weight: 700;">Total Estimated Cost:</td>
          <td style="padding: 10px 0 4px 0; color: #b08c40; text-align: right; font-weight: 700; font-size: 18px;">$${p.total}</td>
        </tr>
        ${p.perDay !== undefined ? `
        <tr>
          <td style="padding: 4px 0 4px 0; font-size: 13px;" colspan="2">
            <span style="color: #666666;">Average daily rate:</span> <span style="color: #2e7d32; font-weight: 700;">~$${p.perDay.toFixed(2)} / night</span>
          </td>
        </tr>` : ''}
      </table>
      <div style="background-color: #f7f8fa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 14px; font-size: 12px; color: #555555; line-height: 1.5;">
        <strong style="color: #2d3748;">📌 Estimate only:</strong> Final rates and booking are confirmed during our intro call.
      </div>
    </div>
  `;
}

export function formatReferralPerkHtml(): string {
  return `
    <div style="background-color: #faf7f2; border: 1px dashed #d4c5ad; border-radius: 8px; padding: 14px 18px; margin: 0 0 16px 0; text-align: left;">
      <div style="margin-bottom: 6px;">
        <span style="display: inline-block; background-color: #f2e9dc; color: #7d5b1d; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 4px;">Referral Perk</span>
      </div>
      <div style="font-weight: 700; font-size: 14px; color: #2d241e; margin-bottom: 6px; line-height: 1.35;">
        🎁 Recommend your friend or neighbor and your next sit is on me!
      </div>
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #4a4439; line-height: 1.5;">
        Know someone who travels or needs a trusted house &amp; pet sitter? When you recommend a friend or neighbor and they complete a booked stay with me, your next sit is complimentary!
      </p>
      <div style="font-size: 11px; color: #8a7350; font-style: italic;">
        Subject to calendar availability.
      </div>
    </div>
  `;
}

export function generateBookingEmailHtml(booking: BookingRequest): string {
  const durationStr = formatBookingDuration(booking);
  const p = booking.pricing;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #b08c40; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Booking Request</h2>
        <p style="color: #666666; font-size: 14px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Services</p>
      </div>

      <div style="background-color: #ffffff; padding: 18px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
        <p style="margin: 0; font-size: 15px; color: #1a1a1a; line-height: 1.5;">
          You received a new booking request for <strong>${booking.startDate ? formatHumanDate(booking.startDate) : 'selected dates'}</strong> to <strong>${booking.endDate ? formatHumanDate(booking.endDate) : 'selected end date'}</strong> (${durationStr}).
        </p>
      </div>

      ${formatReferralPerkHtml()}
      ${formatStayDetailsHtml(booking)}
      ${formatClientDetailsHtml(booking)}
      ${formatNotesHtml(booking.notes)}
      ${formatPricingBreakdownHtml(p, booking)}

      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #999999; line-height: 1.5;">
        <p style="margin: 0;">Yulia's House Sitting &amp; Pet Care Services</p>
      </div>
      <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #fafafa;">
        ${booking.id ? `Ref: ${booking.id}` : ''}
      </div>
    </div>
  `;
}

export function generateBookingConfirmationEmailHtml(booking: BookingRequest): string {
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
          Thank you for reaching out! I've received your booking request for <strong>${booking.startDate ? formatHumanDate(booking.startDate) : 'your selected dates'}</strong> to <strong>${booking.endDate ? formatHumanDate(booking.endDate) : 'selected end date'}</strong> (${durationStr}). I look forward to connecting with you and caring for your home and pets!
        </p>
        <div style="background-color: #fcfaf7; border-left: 3px solid #b08c40; padding: 12px 16px; border-radius: 4px; margin-top: 14px;">
          <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500; line-height: 1.5;">
            🕒 <strong>What happens next:</strong> I will review my calendar and reach out to you directly <strong>within 24 hours</strong> to confirm availability and coordinate details.
          </p>
        </div>
      </div>

      ${formatReferralPerkHtml()}
      ${formatStayDetailsHtml(booking)}
      ${formatClientDetailsHtml(booking)}
      ${formatNotesHtml(booking.notes)}
      ${formatPricingBreakdownHtml(p, booking)}

      <div style="background-color: #ffffff; padding: 22px 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-top: 16px; text-align: left;">
        <div style="font-size: 15px; color: #333333; line-height: 1.6; margin-bottom: 14px;">
          Warm regards,<br>
          <strong style="color: #1a1a1a; font-size: 16px; display: inline-block; margin-top: 4px;">Yulia</strong>
        </div>
        <div style="border-top: 1px solid #f0f2f5; padding-top: 14px; font-size: 13px; color: #555555; line-height: 1.5;">
          💬 <strong>Questions or updates?</strong> Reply directly to this email or contact me at <a href="mailto:sitterjourney@gmail.com" style="color: #b08c40; text-decoration: none; font-weight: 600;">sitterjourney@gmail.com</a> anytime.
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999999; line-height: 1.5;">
        <p style="margin: 0;">Yulia's House Sitting &amp; Pet Care Services</p>
      </div>
      <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #fafafa;">
        ${booking.id ? `Ref: ${booking.id}` : ''}
      </div>
    </div>
  `;
}
