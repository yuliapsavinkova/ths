import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getResendClient } from '../services/resend';
import { CONFIG } from '../config';
import { generateNewsletterEmailHtml } from '../utils/newsletterEmail';

export async function handleSubscribe(req: Request, res: Response) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse JSON body string:', e);
    }
  }

  const email = body?.email;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  console.log(`Received newsletter subscription for: ${email}`);

  const recipient = process.env.SITTER_EMAIL_TO || CONFIG.SITTER_EMAIL_TO;
  const sender = process.env.SITTER_EMAIL_FROM || CONFIG.SITTER_EMAIL_FROM;

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
      if (recipient) {
        const resend = getResendClient();
        resendData = await resend.emails.send({
          from: sender,
          to: recipient,
          subject: `New Newsletter Subscriber: ${email}`,
          html: generateNewsletterEmailHtml(email, subscribers.length)
        });
        emailSent = true;
        console.log('Newsletter subscription email notification sent successfully via Resend');
      }
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
