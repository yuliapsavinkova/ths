import { Request, Response } from 'express';
import { getResendClient } from '../services/resend';
import { generateBookingEmailHtml } from '../../src/utils/bookingEmail';
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

  const apiKey = process.env.RESEND_API_KEY || CONFIG.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY');
    return res.status(500).json({
      success: false,
      message: 'RESEND_API_KEY is not configured in Vercel Environment Variables.',
    });
  }

  const recipient = process.env.SITTER_EMAIL_TO || CONFIG.SITTER_EMAIL_TO;
  if (!recipient) {
    console.error('Missing SITTER_EMAIL_TO');
    return res.status(500).json({
      success: false,
      message: 'SITTER_EMAIL_TO is not configured in Vercel Environment Variables.',
    });
  }

  const sender =
    process.env.SITTER_EMAIL_FROM || CONFIG.SITTER_EMAIL_FROM || 'onboarding@resend.dev';

  try {
    const resend = getResendClient();
    const emailHtml = generateBookingEmailHtml(booking);

    const data = await resend.emails.send({
      from: sender,
      to: recipient,
      subject: `New Sit Request from ${booking.name || 'Client'} (${booking.location || 'Location'})`,
      html: emailHtml,
      replyTo: booking.email || recipient,
    });

    console.log('Email sent successfully via Resend:', data);

    return res.status(200).json({
      success: true,
      message: 'Booking request captured and email alert sent successfully.',
      bookingId: Math.random().toString(36).substring(2, 9),
      resendData: data,
    });
  } catch (error: unknown) {
    console.error('Error sending email via Resend:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send booking email notification.',
      error: errorMessage,
    });
  }
}
