// server.js - Main server file for the MERN blog application

// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import winston from 'winston';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Import routes
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Initialize Sentry (error + performance)
Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  environment: process.env.NODE_ENV,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.2,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {}

app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

app.get('/readyz', (req, res) => {
  const state = mongoose.connection.readyState;
  if (state === 1) return res.status(200).send('ready');
  return res.status(503).send('not-ready');
});

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MERN Blog API is running');
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { err });
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { err });
  // Close server & exit process
  process.exit(1);
});

export default app;