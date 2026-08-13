import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

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
      message: 'Method Not Allowed',
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
        message: 'Please provide a valid email address.',
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.SITTER_EMAIL_TO;
    const sender = process.env.SITTER_EMAIL_FROM || 'onboarding@resend.dev';

    let emailSent = false;
    let resendData = null;

    if (apiKey && recipient) {
      try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
          from: sender,
          to: recipient,
          subject: `New Newsletter Subscriber: ${email}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #bc9c5d; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">New Newsletter Subscriber!</h2>
              <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">You have a new subscriber for your California availability and monthly updates:</p>
              <div style="font-size: 18px; font-weight: bold; background-color: #fcfaf7; color: #bc9c5d; padding: 12px 20px; border-radius: 6px; display: inline-block; border: 1px solid #f3ebd8; margin: 12px 0;">
                ${email}
              </div>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
                This notification was automatically sent by your Home & Pet Sitter Web Portal.
              </p>
            </div>
          `,
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
      resendData,
    });
  } catch (error: unknown) {
    console.error('Unhandled serverless exception in /api/subscribe:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription.',
      error: errorMessage,
    });
  }
}
