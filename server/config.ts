import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  // Resend API Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',

  // Email Notification Settings
  // Verified sender address configured in Resend (e.g., 'Home & Pet Sitting <onboarding@resend.dev>')
  SITTER_EMAIL_FROM: process.env.SITTER_EMAIL_FROM || 'onboarding@resend.dev',

  // Destination email address for booking alerts and newsletter notifications
  SITTER_EMAIL_TO: process.env.SITTER_EMAIL_TO || '',
};
