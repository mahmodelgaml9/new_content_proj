// src/creative/creative.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { creativeService } from './creative.service';
import { prisma } from '../services/prisma.service';

class CreativeController {
  public async generateBatchContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { contentPlanId } = req.params;
      const { taskIds, variationsPerTask = 1, userInput } = req.body;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        res.status(400).json({ message: "Request must include a non-empty 'taskIds' array." });
        return;
      }

      if (taskIds.length > 5) {
        res.status(400).json({ message: "Max 5 tasks per request allowed for quality reasons." });
        return;
      }

      const contentPlan = await prisma.contentExecutionPlan.findUnique({
        where: { id: contentPlanId },
        include: {
          marketingPlan: {
            include: {
              business: {
                include: { brandIdentity: true, customerBlueprint: true },
              },
            },
          },
        },
      });

      if (!contentPlan || !contentPlan.marketingPlan?.business) {
        res.status(404).json({ message: 'Content plan or associated business not found.' });
        return;
      }

      const generatedContent = await creativeService.generateCreativeBatch(
        contentPlan,
        taskIds,
        variationsPerTask,
        userInput || {}
      );

      res.status(201).json({
        message: 'Batch content generated successfully.',
        data: generatedContent,
      });
    } catch (error) {
      console.error("Creative batch generation error:", error);
      res.status(500).json({ message: 'Error during batch content generation.' });
    }
  }

  public async streamSingleCreativeContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { contentPlanId } = req.params;
      const { taskId, variationNumber = 1, totalVariations = 1, userInput } = req.body;

      if (!taskId) {
        res.status(400).json({ message: "'taskId' is required." });
        return;
      }

      const contentPlan = await prisma.contentExecutionPlan.findUnique({
        where: { id: contentPlanId },
        include: {
          marketingPlan: {
            include: {
              business: {
                include: { brandIdentity: true, customerBlueprint: true },
              },
            },
          },
        },
      });

      if (!contentPlan || !contentPlan.marketingPlan?.business) {
        res.status(404).json({ message: 'Content plan or business not found.' });
        return;
      }

      const task = (contentPlan.planContent as any)?.dailyTasks?.find((d: any) => d.taskId === taskId);

      if (!task) {
        res.status(404).json({ message: `Task "${taskId}" not found.` });
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      const stream = await creativeService.generateCreativeStream(
        contentPlan.marketingPlan.business,
        task,
        userInput || {},
        variationNumber,
        totalVariations
      );

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    } catch (error) {
      console.error("Creative streaming error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error during creative stream.' });
      }
    } finally {
      res.end();
    }
  }
}

export const creativeController = new CreativeController();
