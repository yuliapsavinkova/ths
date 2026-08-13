import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getResendClient } from '../services/resend';
import { CONFIG } from '../config';

export async function handleSubscribe(req: Request, res: Response) {
  const { email } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  console.log(`Received newsletter subscription for: ${email}`);

  try {
    // A. Locally persist the email to subscribers.json if filesystem is writable
    const filePath = path.join(process.cwd(), 'subscribers.json');
    let subscribers: string[] = [];

    try {
      if (fs.existsSync(filePath)) {
        try {
          const fileData = await fs.promises.readFile(filePath, 'utf-8');
          subscribers = JSON.parse(fileData);
        } catch (parseError) {
          console.error('Error parsing subscribers.json, resetting list:', parseError);
          subscribers = [];
        }
      }

      if (!subscribers.includes(email)) {
        subscribers.push(email);
        await fs.promises.writeFile(filePath, JSON.stringify(subscribers, null, 2));
        console.log(`Email ${email} successfully written to subscribers.json. Total count: ${subscribers.length}`);
      } else {
        console.log(`Email ${email} is already subscribed (skipped writing).`);
      }
    } catch (fsError) {
      console.warn('Could not update subscribers.json (read-only environment or serverless runtime):', fsError);
    }

    // B. Send notification email to Yulia via Resend
    let emailSent = false;
    let resendData = null;
    try {
      const resend = getResendClient();
      resendData = await resend.emails.send({
        from: CONFIG.SITTER_EMAIL_FROM,
        to: CONFIG.SITTER_EMAIL_TO,
        subject: `New Newsletter Subscriber: ${email}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #bc9c5d; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">New Newsletter Subscriber!</h2>
            <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">You have a new subscriber for your California availability and monthly updates:</p>
            <div style="font-size: 18px; font-weight: bold; background-color: #fcfaf7; color: #bc9c5d; padding: 12px 20px; border-radius: 6px; display: inline-block; border: 1px solid #f3ebd8; margin: 12px 0;">
              ${email}
            </div>
            <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Total active local subscribers: <strong>${subscribers.length}</strong></p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
              This notification was automatically sent by your Home & Pet Sitter Web Applet.
            </p>
          </div>
        `
      });
      emailSent = true;
      console.log('Newsletter subscription email notification sent successfully via Resend');
    } catch (emailError: unknown) {
      const msg = emailError instanceof Error ? emailError.message : String(emailError);
      console.warn('Could not send notification email via Resend:', msg);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to monthly updates.',
      email,
      emailSent,
      resendData
    });
  } catch (error: unknown) {
    console.error('Error saving subscription:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process subscription. Please try again.',
      error: errorMessage
    });
  }
}
