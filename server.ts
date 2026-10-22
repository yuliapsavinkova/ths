import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleBookingSubmit } from './server/routes/booking.ts';
import { handleSubscribe } from './server/routes/subscribe.ts';
import { handleFeedbackSubmit } from './server/routes/feedback.ts';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50kb' }));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;


// ----------------------------------------------------
// API & MANIFEST ENDPOINTS
// ----------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Explicitly serve ARD AI Catalog manifests with correct application/json headers
const serveAiCatalog = (_req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  const catalogPath = path.join(process.cwd(), 'public', '.well-known', 'ai-catalog.json');
  res.sendFile(catalogPath);
};

app.get('/.well-known/ai-catalog.json', serveAiCatalog);
app.get('/ai-catalog.json', serveAiCatalog);
app.get('/.well-known/ard.json', serveAiCatalog);

// OpenAPI specification endpoint
app.get('/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.sendFile(path.join(process.cwd(), 'public', 'openapi.json'));
});

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
  // Always serve public static assets reliably (enable dotfiles for .well-known)
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      dotfiles: 'allow',
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // Serve hashed static assets with long cache
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      }),
    );

    // Serve other static files (allowing .well-known dotfiles)
    app.use(
      express.static(distPath, {
        dotfiles: 'allow',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }
        },
      }),
    );

    // Prevent soft-404 for missing static or well-known files before the SPA fallback
    app.use((req, res, next) => {
      const isStaticOrWellKnown =
        req.path.startsWith('/.well-known/') ||
        /\.(json|xml|txt|ico|png|jpe?g|webp|svg|css|js|map|woff2?|ttf|eot)$/i.test(req.path);

      if (isStaticOrWellKnown) {
        return res.status(404).type('text/plain').send('404 Not Found');
      }
      next();
    });

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
