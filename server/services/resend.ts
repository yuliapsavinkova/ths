import { Resend } from 'resend';
import { CONFIG } from '../config';

export function getResendClient(apiKey?: string): Resend {
  const key = apiKey || process.env.RESEND_API_KEY || CONFIG.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY environment variable is missing.');
  }
  return new Resend(key);
}
