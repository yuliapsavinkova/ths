import type { Request, Response } from 'express';
import { Resend } from 'resend';
import { generateBookingEmailHtml } from '../src/utils/bookingEmail';

export default async function handler(req: Request, res: Response) {
  // Set CORS headers
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
        console.error('Failed to parse JSON body string:', e);
      }
    }

    if (!booking || typeof booking !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking data payload received.'
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY in process.env');
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY is not configured in Vercel Environment Variables.'
      });
    }

    const recipient = process.env.SITTER_EMAIL_TO;
    if (!recipient) {
      console.error('Missing SITTER_EMAIL_TO in process.env');
      return res.status(500).json({
        success: false,
        message: 'SITTER_EMAIL_TO is not configured in Vercel Environment Variables.'
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
      replyTo: booking.email || recipient
    });

    if (error) {
      console.error('Resend API returned delivery error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send booking email notification via Resend.',
        resendError: error
      });
    }

    console.log('Email sent successfully via Resend:', data);

    return res.status(200).json({
      success: true,
      message: 'Booking request captured and email alert sent successfully.',
      bookingId: Math.random().toString(36).substring(2, 9),
      resendData: data
    });
  } catch (error: unknown) {
    console.error('Unhandled serverless exception in /api/submit-booking:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Serverless execution error processing booking.',
      error: errorMessage
    });
  }
}
