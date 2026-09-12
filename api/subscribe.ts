import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

function generateNewsletterEmailHtml(email: string, totalSubscribers?: number): string {
  const subscribedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #f3ebd8; color: #b08c40; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px; margin-bottom: 8px;">
          Availability Updates
        </span>
        <h2 style="color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">New Newsletter Subscriber!</h2>
        <p style="color: #666666; font-size: 13px; margin: 6px 0 0 0;">Yulia's House Sitting &amp; Pet Care Services</p>
      </div>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555; line-height: 1.5;">
          A new subscriber signed up to receive your monthly calendar availability and updates:
        </p>
        <div style="font-size: 18px; font-weight: 600; background-color: #fcfaf7; color: #b08c40; padding: 12px 20px; border-radius: 8px; display: inline-block; border: 1px solid #f3ebd8; word-break: break-all;">
          <a href="mailto:${email}" style="color: #b08c40; text-decoration: none;">${email}</a>
        </div>
      </div>

      <div style="background-color: #ffffff; padding: 18px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 5px 0; color: #666666; width: 140px; font-weight: 500;">Subscribed Date:</td>
            <td style="padding: 5px 0; color: #1a1a1a;">${subscribedAt} (PT)</td>
          </tr>
          ${
            typeof totalSubscribers === 'number'
              ? `
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Total Active List:</td>
            <td style="padding: 5px 0; color: #2e7d32; font-weight: 600;">${totalSubscribers} subscribers</td>
          </tr>`
              : ''
          }
        </table>
      </div>

      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #888888; line-height: 1.6;">
        Yulia House &amp; Pet Sitting • Availability &amp; Travel Updates
      </div>
    </div>
  `;
}

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
