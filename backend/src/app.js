import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.use(errorHandler);
