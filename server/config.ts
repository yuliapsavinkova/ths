import dotenv from 'dotenv';
dotenv.config();

//TODO: remove hardcoded values
export const CONFIG = {
  // Resend API Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // Email Notification Settings
  // The verified sender address or domain configured in your Resend account.
  SITTER_EMAIL_FROM: process.env.SITTER_EMAIL_FROM,

  // The destination email address to receive booking request and subscriber alerts.
  SITTER_EMAIL_TO: process.env.SITTER_EMAIL_TO,
};