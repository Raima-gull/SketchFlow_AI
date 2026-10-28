const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const path = require('path');
const { env } = require('./config/env');
const { logger } = require('./config/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimit');
const routes = require('./routes');

const app = express();

// Trust the reverse proxy (needed for secure cookies behind Render/Heroku/Nginx)
app.set('trust proxy', 1);

// 1. Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// 2. CORS — frontend (localhost:5173) ko credentials ke saath allow karo
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsers — req.body mein data aane ke liye
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Cookie Parser — JWT auth_token cookie read karne ke liye
app.use(cookieParser());

// 5. Logger — har request log hogi
app.use(pinoHttp({ logger }));

// 6. Static Folders — uploads aur public files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// 7. Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', time: new Date().toISOString() },
  });
});

// 8. API Routes — Auth, Projects, AI, Media, Generations
app.use('/api', apiLimiter, routes);

// 9. 404 Handler — agar koi route match na ho
app.use(notFound);

// 10. Global Error Handler — hamesha last mein
app.use(errorHandler);

module.exports = app;