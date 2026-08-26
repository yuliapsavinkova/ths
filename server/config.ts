import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  // Resend API Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',

  // Email Notification Settings
  // Verified sender address configured in Resend (e.g., 'Yulia House & Pet Sitting <bookings@sitterjourney.com>')
  SITTER_EMAIL_FROM: process.env.SITTER_EMAIL_FROM || '',

  // Destination email address for booking alerts and newsletter notifications
  SITTER_EMAIL_TO: process.env.SITTER_EMAIL_TO || '',
};
