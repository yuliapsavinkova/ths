import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getResendClient } from '../services/resend';
import {
  generateBookingEmailHtml,
  generateBookingConfirmationEmailHtml,
  formatHumanDate,
} from '../utils/bookingEmail';
import { CONFIG } from '../config';

export async function handleBookingSubmit(req: Request, res: Response) {
  let booking = req.body;
  if (typeof booking === 'string') {
    try {
      booking = JSON.parse(booking);
    } catch (e) {
      console.error('Failed to parse JSON body string:', e);
    }
  }

  console.log('Received booking request on server:', booking);

  if (!booking || typeof booking !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking data received.',
    });
  }

  // Sanitize and limit field lengths to prevent abuse
  const isRepeatClient = Boolean(booking.isRepeatClient);
  const rawPricing = booking.pricing || {};
  let repeatDiscount = Number(rawPricing.repeatClientDiscount || 0);
  if (isRepeatClient && (!repeatDiscount || repeatDiscount <= 0)) {
    const base = Number(rawPricing.baseRate || 0);
    const pet = Number(rawPricing.petSurcharge || 0);
    const senior = Number(rawPricing.seniorSurcharge || 0);
    const meds = Number(rawPricing.medsSurcharge || 0);
    const garden = Number(rawPricing.gardenSurcharge || 0);
    const subtotal = base + pet + senior + meds + garden;
    if (subtotal > 0) {
      repeatDiscount = Math.round(subtotal * 0.1);
    }
  }

  const sanitizedBooking = {
    ...booking,
    name: String(booking.name || '').slice(0, 150).trim(),
    email: String(booking.email || '').slice(0, 150).trim(),
    phone: String(booking.phone || '').slice(0, 50).trim(),
    location: String(booking.location || '').slice(0, 150).trim(),
    referredBy: String(booking.referredBy || '').slice(0, 200).trim(),
    isRepeatClient,
    notes: String(booking.notes || '').slice(0, 3000).trim(),
    pricing: {
      ...rawPricing,
      ...(repeatDiscount > 0 ? { repeatClientDiscount: repeatDiscount } : {}),
    },
  };

  const bookingId = Math.random().toString(36).substring(2, 9);

  // 1. Locally persist booking to bookings.json if filesystem is available
  try {
    const filePath = path.join(process.cwd(), 'bookings.json');
    let bookingsList: Array<Record<string, unknown>> = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = await fs.promises.readFile(filePath, 'utf-8');
        bookingsList = JSON.parse(fileData);
      } catch (parseErr) {
        console.warn('Error reading existing bookings.json, resetting list:', parseErr);
        bookingsList = [];
      }
    }

    const newRecord = {
      id: bookingId,
      timestamp: new Date().toISOString(),
      ...sanitizedBooking,
    };

    bookingsList.push(newRecord);
    await fs.promises.writeFile(filePath, JSON.stringify(bookingsList, null, 2));
    console.log(`[Booking] Saved booking locally. Total stored: ${bookingsList.length}`);
  } catch (fsError) {
    console.warn('[Booking] Could not write to bookings.json (read-only runtime):', fsError);
  }

  const apiKey = process.env.RESEND_API_KEY || CONFIG.RESEND_API_KEY;
  const recipient = process.env.SITTER_EMAIL_TO || CONFIG.SITTER_EMAIL_TO;
  const sender = process.env.SITTER_EMAIL_FROM || CONFIG.SITTER_EMAIL_FROM;

  let sitterData = null;
  let clientConfirmationSent = false;
  let clientDeliveryNote: string | undefined;

  // 2. Dispatch email notification via Resend if credentials are present
  if (apiKey && recipient && sender) {
    try {
      const resend = getResendClient();
      const emailHtml = generateBookingEmailHtml(sanitizedBooking);

      // Send detailed notification alert to the sitter
      const { data, error: sitterError } = await resend.emails.send({
        from: sender,
        to: recipient,
        subject: `New Sit Request from ${sanitizedBooking.name || 'Client'} (${sanitizedBooking.location || 'Location'})`,
        html: emailHtml,
        replyTo: sanitizedBooking.email || recipient,
      });

      if (sitterError) {
        console.warn('Resend error delivering sitter notification:', sitterError);
      } else {
        sitterData = data;
        console.log('Sitter notification email sent successfully via Resend:', sitterData);
      }

      // Send instant confirmation / thank you email to the client if an email is provided
      if (sanitizedBooking.email && typeof sanitizedBooking.email === 'string' && sanitizedBooking.email.includes('@')) {
        try {
          const clientEmailHtml = generateBookingConfirmationEmailHtml(sanitizedBooking);
          const clientFirstName = sanitizedBooking.name ? sanitizedBooking.name.trim().split(' ')[0] : '';
          const clientSubject = sanitizedBooking.startDate
            ? `Thank You for Your Request${clientFirstName ? `, ${clientFirstName}` : ''}! (${formatHumanDate(sanitizedBooking.startDate)})`
            : `Thank You for Your Request${clientFirstName ? `, ${clientFirstName}` : ''}!`;

          const { data: clientData, error: clientError } = await resend.emails.send({
            from: sender,
            to: sanitizedBooking.email.trim(),
            subject: clientSubject,
            html: clientEmailHtml,
            replyTo: recipient,
          });

          if (clientError) {
            console.warn('Resend client confirmation notice:', clientError);
            clientDeliveryNote = clientError.message;
          } else {
            console.log('Client confirmation email sent successfully:', clientData);
            clientConfirmationSent = true;
          }
        } catch (clientEmailErr) {
          console.error('Failed to send confirmation email to client:', clientEmailErr);
        }
      }
    } catch (error: unknown) {
      console.warn('[Booking] Resend dispatch exception:', error);
    }
  } else {
    console.warn('[Booking] RESEND_API_KEY, SITTER_EMAIL_TO, or SITTER_EMAIL_FROM not configured. Booking saved without email dispatch.');
  }

  return res.status(200).json({
    success: true,
    message: 'Booking request captured successfully.',
    bookingId,
    resendData: sitterData,
    clientConfirmationSent,
    clientDeliveryNote,
  });
}

