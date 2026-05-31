// // src/ads/ads.routes.ts

// import { Router } from 'express';
// import { adsController } from './ads.controller';
// import { authMiddleware } from '../auth/auth.middleware';

// const adsRouter = Router();
// adsRouter.use(authMiddleware);

// /**
//  * @route POST /api/ads/generate/:marketingPlanId
//  * @desc Generates a full ad campaign based on a marketing plan.
//  */
// adsRouter.post('/generate/:marketingPlanId', adsController.generateAdCampaign);

// export default adsRouter;