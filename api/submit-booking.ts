import type { Request, Response } from 'express';
import { handleBookingSubmit } from '../server/routes/booking';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return await handleBookingSubmit(req, res);
  } catch (error: unknown) {
    console.error('Unhandled serverless exception in /api/submit-booking:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Serverless function execution error.',
      error: msg,
    });
  }
}
