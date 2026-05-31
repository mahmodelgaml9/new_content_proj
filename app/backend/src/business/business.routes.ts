// This is the full content of the business.routes.ts file

import { Router } from 'express';
import { businessController } from './business.controller';
import { authMiddleware } from '../auth/auth.middleware';

const businessRouter = Router();

// Apply the authentication middleware to all routes below
businessRouter.use(authMiddleware);

// Route to create a new business and get all businesses for the logged-in user
businessRouter.route('/')
  .post(businessController.createBusiness)
  .get(businessController.getUserBusinesses);

// Route to get, AND NOW UPDATE, a specific business by its ID
businessRouter.route('/:id')
  .get(businessController.getBusinessById)
  .patch(businessController.updateBusiness); // <-- THIS IS THE NEW LINE

export default businessRouter;