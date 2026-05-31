import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import all routers
import authRouter from './auth/auth.routes';
import businessRouter from './business/business.routes';
import strategyRouter from './strategy/strategy.routes';
import planningRouter from './planning/planning.routes';
import executionRouter from './execution/execution.routes';
import creativeRouter from './creative/creative.routes';
import generationRouter from './generation/generation.routes';
// import adsRouter from './ads/ads.routes';


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes Registration
app.use('/api/auth', authRouter);
app.use('/api/businesses', businessRouter);
app.use('/api/strategy', strategyRouter);
app.use('/api/planning', planningRouter);
app.use('/api/execution', executionRouter);
app.use('/api/creative', creativeRouter);
app.use('/api/generation', generationRouter);
// app.use('/api/ads', adsRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});