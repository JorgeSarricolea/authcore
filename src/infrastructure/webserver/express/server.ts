import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import Config from '@/infrastructure/config/index';
import { globalRateLimiter } from '@/interfaces/middlewares/rate-limiter.middleware';
import {
  errorHandler,
  setupUncaughtExceptionHandler,
  setupUnhandledRejectionHandler,
} from './error.handler';

import appRoutes from '@/interfaces/routes/app.router';
import authRoutes from '@/interfaces/routes/auth.router';
import testRoutes from '@/interfaces/routes/test.router';

const app = express();

// Disable X-Powered-By header for security
app.disable('x-powered-by');

// Parse cookies first - needed for auth tokens
app.use(cookieParser());

// CORS configuration - needed before routes
app.use(cors(Config.corsConfig));

// Parse JSON bodies
app.use(express.json());

// Global rate limiting
app.use(globalRateLimiter);

const MAIN_ENDPOINT = `/api/v${Config.apiVersion}`;

// Routes
app.use(MAIN_ENDPOINT, appRoutes);
app.use(MAIN_ENDPOINT, authRoutes);
app.use(MAIN_ENDPOINT, testRoutes);

// Error handling middleware
app.use(errorHandler);

// Setup global error handlers
setupUncaughtExceptionHandler();
setupUnhandledRejectionHandler();

export default app;
