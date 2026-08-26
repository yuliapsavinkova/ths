import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { generateNewsletterEmailHtml } from '../server/utils/newsletterEmail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse string body:', e);
      }
    }

    const email = body?.email;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.SITTER_EMAIL_TO;
    const sender = process.env.SITTER_EMAIL_FROM;

    let emailSent = false;
    let resendData = null;

    if (apiKey && recipient) {
      try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
          from: sender,
          to: recipient,
          subject: `New Newsletter Subscriber: ${email}`,
          html: generateNewsletterEmailHtml(email)
        });

        if (error) {
          console.warn('Resend error for newsletter subscription alert:', error);
        } else {
          emailSent = true;
          resendData = data;
        }
      } catch (e) {
        console.warn('Could not send notification email via Resend:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to monthly updates.',
      email,
      emailSent,
      resendData
    });
  } catch (error: unknown) {
    console.error('Unhandled serverless exception in /api/subscribe:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription.',
      error: errorMessage
    });
  }
}
