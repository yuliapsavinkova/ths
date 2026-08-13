import { Request, Response } from 'express';
import { getResendClient } from '../services/resend';
import { generateBookingEmailHtml } from '../../src/utils/bookingEmail';
import { CONFIG } from '../config';

export async function handleBookingSubmit(req: Request, res: Response) {
  const booking = req.body;
  console.log('Received booking request on server:', booking);
  
  try {
    const resend = getResendClient();
    const emailHtml = generateBookingEmailHtml(booking);

    const data = await resend.emails.send({
      from: CONFIG.SITTER_EMAIL_FROM,
      to: CONFIG.SITTER_EMAIL_TO,
      subject: `New Sit Request from ${booking.name} (${booking.location})`,
      html: emailHtml,
      replyTo: booking.email
    });

    console.log('Email sent successfully via Resend:', data);

    res.status(200).json({
      success: true,
      message: 'Booking request captured and email alert sent successfully.',
      bookingId: Math.random().toString(36).substring(2, 9),
      resendData: data
    });
  } catch (error: unknown) {
    console.error('Error sending email via Resend:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: 'Failed to send booking email notification.',
      error: errorMessage
    });
  }
}
