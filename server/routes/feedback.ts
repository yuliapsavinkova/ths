import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getResendClient } from '../services/resend';
import { CONFIG } from '../config';
import { FeedbackPayload, generateFeedbackEmailHtml } from '../../src/utils/feedbackEmail';

export type { FeedbackPayload };
export { generateFeedbackEmailHtml };

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
  const sender = process.env.SITTER_EMAIL_FROM || CONFIG.SITTER_EMAIL_FROM;
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
