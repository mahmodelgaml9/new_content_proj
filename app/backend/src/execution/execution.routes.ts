// src/execution/execution.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { executionController } from './execution.controller';

const executionRouter = Router();
executionRouter.use(authMiddleware);

/**
 * @route POST /api/execution/marketing-plan/:marketingPlanId/content-plan
 * @desc Generates a detailed CONTENT execution plan for a specific month.
 * @access Private
 * @body { "month": 1 }
 */
executionRouter.post(
  '/marketing-plan/:marketingPlanId/content-plan',
  executionController.generateContentPlan
);

// In the future, we will add other routes here, like:
// executionRouter.post('/marketing-plan/:marketingPlanId/ad-plan', ...);

export default executionRouter;