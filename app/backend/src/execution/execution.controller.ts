// src/execution/execution.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { executionService } from './execution.service';
import { prisma } from '../services/prisma.service';

class ExecutionController {
  /**
   * Generates and saves a new monthly CONTENT execution plan.
   */
  public async generateContentPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { marketingPlanId } = req.params;
      const { month } = req.body;

      if (!month || typeof month !== 'number' || month < 1 || month > 3) {
        res.status(400).json({ message: 'A valid month number (1, 2, or 3) is required.' });
        return;
      }

      const existingPlan = await prisma.contentExecutionPlan.findUnique({
        where: { marketingPlanId_month: { marketingPlanId, month } },
      });

      if (existingPlan) {
        res.status(409).json({ message: `A content execution plan for month ${month} already exists.`, data: existingPlan });
        return;
      }

      const marketingPlan = await prisma.marketingPlan.findUnique({
        where: { id: marketingPlanId },
        include: { business: { include: { marketAnalysis: true, brandIdentity: true, customerBlueprint: true } } }
      });

      if (!marketingPlan) {
        res.status(404).json({ message: 'Marketing plan with its context not found.' });
        return;
      }

      const planContentJson = await executionService.generateContentPlanForMonth(marketingPlan, month);

      const newContentPlan = await prisma.contentExecutionPlan.create({
        data: {
          marketingPlanId: marketingPlanId,
          month: month,
          planContent: planContentJson || {},
        }
      });

      res.status(201).json({ message: `Content execution plan for month ${month} generated successfully!`, data: newContentPlan });

    } catch (error) {
      console.error("Content plan generation error:", error);
      res.status(500).json({ message: 'An error occurred during content plan generation.' });
    }
  }

  // In the future, we will add other controllers here, like:
  // public async generateAdPlan(...) { ... }
}

export const executionController = new ExecutionController();