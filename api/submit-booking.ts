import type { Request, Response } from 'express';
import { handleBookingSubmit } from '../server/routes/booking';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return handleBookingSubmit(req, res);
}
