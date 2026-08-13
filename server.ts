import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleBookingSubmit } from './server/routes/booking';
import { handleSubscribe } from './server/routes/subscribe';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;


// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// 1. Submit Booking Request via Resend Email Service
app.post('/api/submit-booking', handleBookingSubmit);

// 2. Submit Newsletter Subscription via JSON file & optional Resend alert
app.post('/api/subscribe', handleSubscribe);


// ----------------------------------------------------
// VITE AND STATIC ASSETS SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Yulia's Sitting Service running on http://localhost:${PORT}`);
  });
}

startServer();
