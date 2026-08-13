import { Resend } from 'resend';
import { CONFIG } from '../config';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    // Lazy-load API key safely from central CONFIG
    const key = CONFIG.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY configuration or environment variable is required');
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}
