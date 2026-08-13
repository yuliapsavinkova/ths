import type { Request, Response } from 'express';
import { handleSubscribe } from '../server/routes/subscribe';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return handleSubscribe(req, res);
}
