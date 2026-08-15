import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getResendClient } from '../services/resend';
import { CONFIG } from '../config';

export interface FeedbackPayload {
  message: string;
  category?: string;
  name?: string;
  email?: string;
  rating?: string;
}

export function generateFeedbackEmailHtml(feedback: FeedbackPayload): string {
  const categoryLabel = feedback.category || 'General Feedback';
  const nameLabel = feedback.name?.trim() ? feedback.name.trim() : 'Anonymous Visitor';
  const emailLabel = feedback.email?.trim() ? feedback.email.trim() : 'Not provided';
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #f3ebd8; color: #b08c40; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px; margin-bottom: 8px;">
          ${categoryLabel}
        </span>
        <h2 style="color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">New Website Feedback & Thoughts</h2>
        <p style="color: #666666; font-size: 13px; margin: 6px 0 0 0;">Yulia's House Sitting & Pet Care Website</p>
      </div>

      <!-- Feedback Content Box -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2; margin-bottom: 16px;">
        <h3 style="margin-top: 0; color: #b08c40; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Message</h3>
        <p style="margin: 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap; font-style: normal; background-color: #fcfaf7; padding: 14px 16px; border-radius: 8px; border-left: 3px solid #b08c40;">
          ${feedback.message}
        </p>
      </div>

      <!-- Sender Details Card -->
      <div style="background-color: #ffffff; padding: 18px 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #eef0f2;">
        <h3 style="margin-top: 0; color: #1a1a1a; font-size: 15px; font-weight: 600; border-bottom: 1px solid #f0f2f5; padding-bottom: 8px; margin-bottom: 12px;">Submitted By</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 5px 0; color: #666666; width: 130px; font-weight: 500;">Name:</td>
            <td style="padding: 5px 0; color: #1a1a1a; font-weight: 600;">${nameLabel}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Email:</td>
            <td style="padding: 5px 0; color: #1a1a1a;">
              ${feedback.email?.trim() ? `<a href="mailto:${feedback.email.trim()}" style="color: #b08c40; text-decoration: none; font-weight: 500;">${feedback.email.trim()}</a>` : 'Not provided'}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Category:</td>
            <td style="padding: 5px 0; color: #1a1a1a; font-weight: 600;">${categoryLabel}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666666; font-weight: 500;">Submitted Time:</td>
            <td style="padding: 5px 0; color: #666666; font-size: 13px;">${submittedAt} (PT)</td>
          </tr>
        </table>
      </div>

      <!-- Footer Branding & Action -->
      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #999999; line-height: 1.4;">
        This feedback was submitted via the feedback box on <a href="https://yulia.sitterjourney.com" style="color: #b08c40; text-decoration: none;">yulia.sitterjourney.com</a>.<br>
        ${feedback.email?.trim() ? `To reply directly, message <a href="mailto:${feedback.email.trim()}" style="color: #b08c40; text-decoration: none;">${feedback.email.trim()}</a>.` : 'No return email was provided by the sender.'}
      </div>
    </div>
  `;
}

export async function handleFeedbackSubmit(req: Request, res: Response) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse JSON body string in feedback handler:', e);
    }
  }

  const message = body?.message?.trim();
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a feedback message before submitting.'
    });
  }

  const feedbackData: FeedbackPayload = {
    message,
    category: body?.category || 'General Feedback',
    name: body?.name || '',
    email: body?.email || '',
    rating: body?.rating || ''
  };

  console.log('[Feedback] Received feedback submission:', {
    category: feedbackData.category,
    name: feedbackData.name,
    email: feedbackData.email,
    messageLength: message.length
  });

  const recipient = process.env.SITTER_EMAIL_TO || CONFIG.SITTER_EMAIL_TO;
  const sender = process.env.SITTER_EMAIL_FROM || CONFIG.SITTER_EMAIL_FROM || 'onboarding@resend.dev';
  const apiKey = process.env.RESEND_API_KEY || CONFIG.RESEND_API_KEY;

  // 1. Locally persist feedback to feedback.json if filesystem is available
  try {
    const filePath = path.join(process.cwd(), 'feedback.json');
    let feedbackList: Array<FeedbackPayload & { id: string; timestamp: string }> = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = await fs.promises.readFile(filePath, 'utf-8');
        feedbackList = JSON.parse(fileData);
      } catch (parseErr) {
        console.warn('Error reading existing feedback.json, creating fresh list:', parseErr);
        feedbackList = [];
      }
    }

    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ...feedbackData
    };

    feedbackList.push(newRecord);
    await fs.promises.writeFile(filePath, JSON.stringify(feedbackList, null, 2));
    console.log(`[Feedback] Saved feedback locally. Total stored: ${feedbackList.length}`);
  } catch (fsError) {
    console.warn('[Feedback] Could not write to feedback.json (read-only runtime):', fsError);
  }

  // 2. Dispatch email notification via Resend
  let emailSent = false;
  let resendData = null;

  if (apiKey && recipient) {
    try {
      const resend = getResendClient();
      const emailHtml = generateFeedbackEmailHtml(feedbackData);
      const subjectCategory = feedbackData.category ? `[${feedbackData.category}]` : '[Thoughts]';
      const senderName = feedbackData.name?.trim() ? feedbackData.name.trim() : 'Website Visitor';

      resendData = await resend.emails.send({
        from: sender,
        to: recipient,
        subject: `💡 New Feedback ${subjectCategory} from ${senderName}`,
        html: emailHtml,
        replyTo: feedbackData.email?.trim() || recipient
      });

      emailSent = true;
      console.log('[Feedback] Email sent successfully via Resend:', resendData);
    } catch (emailError: unknown) {
      const errorMsg = emailError instanceof Error ? emailError.message : String(emailError);
      console.warn('[Feedback] Could not send email via Resend:', errorMsg);
    }
  } else {
    console.warn('[Feedback] RESEND_API_KEY or SITTER_EMAIL_TO not configured, skipped email dispatch.');
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you for sharing your thoughts! Your feedback has been received.',
    emailSent,
    resendData
  });
}
