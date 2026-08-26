import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { generateBookingEmailHtml, generateBookingConfirmationEmailHtml } from '../src/utils/bookingEmail';

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
      message: 'Method Not Allowed'
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
        message: 'Invalid or missing JSON payload.'
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY in Vercel Environment Variables');
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY environment variable is not configured on Vercel.'
      });
    }

    const recipient = process.env.SITTER_EMAIL_TO;
    if (!recipient) {
      console.error('Missing SITTER_EMAIL_TO in Vercel Environment Variables');
      return res.status(500).json({
        success: false,
        message: 'SITTER_EMAIL_TO environment variable is not configured on Vercel.'
      });
    }

    const sender = process.env.SITTER_EMAIL_FROM;
    if (!sender) {
      console.error('Missing SITTER_EMAIL_FROM in environment variables.');
      return res.status(500).json({
        success: false,
        message: 'SITTER_EMAIL_FROM is not configured in Vercel Environment Variables.'
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
      replyTo: booking.email || recipient
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Resend failed to send email notification.',
        resendError: error
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
      clientConfirmationSent
    });
  } catch (error: unknown) {
    console.error('Serverless function exception in /api/submit-booking:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Serverless function execution error.',
      error: errorMessage
    });
  }
}
