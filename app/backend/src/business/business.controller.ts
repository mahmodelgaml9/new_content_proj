import { Request, Response } from 'express';
import { businessService } from './business.service';

// Extend Request type to include the user property from the auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

class BusinessController {
  public async createBusiness(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const newBusiness = await businessService.createBusiness(req.user.id, req.body);
      res.status(201).json(newBusiness);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create business', error });
    }
  }

  public async getUserBusinesses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const businesses = await businessService.getBusinessesByUserId(req.user.id);
      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve businesses', error });
    }
  }

  public async getBusinessById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { id } = req.params;
      const business = await businessService.getBusinessById(id, req.user.id);
      if (!business) {
        res.status(404).json({ message: 'Business not found or you do not have permission to view it.' });
        return;
      }
      res.status(200).json(business);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve business', error });
    }
  }
  // Add this new function inside the BusinessController class

  public async updateBusiness(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { id } = req.params; // Get the business ID from the URL
      const updatedData = req.body; // Get the new data from the request body

      const updatedBusiness = await businessService.updateBusiness(id, req.user.id, updatedData);

      if (!updatedBusiness) {
        res.status(404).json({ message: 'Business not found or you do not have permission to update it.' });
        return;
      }

      res.status(200).json({ message: 'Business updated successfully!', data: updatedBusiness });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update business', error });
    }
  }
}

export const businessController = new BusinessController();