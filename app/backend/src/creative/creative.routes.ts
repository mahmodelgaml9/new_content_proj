// src/creative/creative.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { creativeController } from './creative.controller';

const creativeRouter = Router();
creativeRouter.use(authMiddleware);

/**
 * @route POST /api/creative/content-plan/:contentPlanId/generate-batch
 * @desc Generates multiple pieces of content and saves them. Returns a full JSON response.
 */
creativeRouter.post('/content-plan/:contentPlanId/generate-batch', creativeController.generateBatchContent);

/**
 * @route POST /api/creative/content-plan/:contentPlanId/generate-stream
 * @desc Generates a single piece of content as a real-time stream for interactive UX.
 */
creativeRouter.post('/content-plan/:contentPlanId/generate-stream', creativeController.streamSingleCreativeContent);

export default creativeRouter;
