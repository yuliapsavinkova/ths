import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleBookingSubmit } from './server/routes/booking';
import { handleSubscribe } from './server/routes/subscribe';
import { handleFeedbackSubmit } from './server/routes/feedback';

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

// 3. Submit Visitor Feedback / Thoughts via JSON storage & Resend alert
app.post('/api/submit-feedback', handleFeedbackSubmit);


// ----------------------------------------------------
// VITE AND STATIC ASSETS SERVING
// ----------------------------------------------------
async function startServer() {
  // Always serve public static assets reliably
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve hashed static assets with long cache
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));

    // Serve other static files
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    // SPA fallback: always serve index.html with NO CACHING
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Yulia's Sitting Service running on http://localhost:${PORT}`);
  });
}

startServer();
