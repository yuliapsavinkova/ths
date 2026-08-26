import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { FeedbackPayload, generateFeedbackEmailHtml } from '../src/utils/feedbackEmail';

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
        console.error('Failed to parse string body in feedback handler:', e);
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

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.SITTER_EMAIL_TO;
    const sender = process.env.SITTER_EMAIL_FROM;

    let emailSent = false;
    let resendData = null;

    if (apiKey && recipient) {
      try {
        const resend = new Resend(apiKey);
        const emailHtml = generateFeedbackEmailHtml(feedbackData);
        const subjectCategory = feedbackData.category ? `[${feedbackData.category}]` : '[Thoughts]';
        const senderName = feedbackData.name?.trim() ? feedbackData.name.trim() : 'Website Visitor';

        const { data, error } = await resend.emails.send({
          from: sender,
          to: recipient,
          subject: `💡 New Feedback ${subjectCategory} from ${senderName}`,
          html: emailHtml,
          replyTo: feedbackData.email?.trim() || recipient
        });

        if (error) {
          console.warn('Resend feedback delivery warning:', error);
        } else {
          emailSent = true;
          resendData = data;
        }
      } catch (e) {
        console.warn('Could not send feedback email via Resend on Vercel:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for sharing your thoughts! Your feedback has been received.',
      emailSent,
      resendData
    });
  } catch (error: unknown) {
    console.error('Unhandled serverless exception in /api/submit-feedback:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process feedback.',
      error: errorMessage
    });
  }
}
