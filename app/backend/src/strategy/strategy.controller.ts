// src/strategy/strategy.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { strategyService } from './strategy.service';
import { prisma } from '../services/prisma.service';

class StrategyController {
  public async triggerFullAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      const business = await prisma.business.findUnique({ where: { id: businessId } });
      if (!business) {
        res.status(404).json({ message: 'Business not found.' });
        return;
      }

      console.log(`[Controller] Starting analysis for "${business.name}".`);

      // --- The Dual-Search Intelligence Gathering System ---
      let competitors: string[] = [];
      if (business.industry && business.location) {
        const searchQuery = `${business.industry} in ${business.location}`;
        
        // 1. Attempt the hyper-local search first.
        competitors = await strategyService.searchGoogleMapsForCompetitors(searchQuery);
        
        // 2. If it fails or returns empty, activate the fallback mechanism.
        if (competitors.length === 0) {
          console.log('[Controller] Maps search yielded no results. Activating fallback web search.');
          competitors = await strategyService.searchGoogleWebForCompetitors(searchQuery);
        }
      }
      
      console.log(`[Controller] Proceeding to generate blueprint with the following competitors:`, competitors);
      
      // Generate the blueprint using the definitive list of competitors.
      const blueprint = await strategyService.generateUnifiedBlueprint(business, competitors);

      // Deconstruct and Save the Blueprint into our structured database.
      await prisma.marketAnalysis.upsert({
        where: { businessId: businessId },
        update: { ...blueprint.marketAnalysis },
        create: { businessId: businessId, ...blueprint.marketAnalysis }
      });

      await prisma.brandIdentity.upsert({
        where: { businessId: businessId },
        update: { ...blueprint.brandIdentity },
        create: { businessId: businessId, ...blueprint.brandIdentity }
      });

      await prisma.customerBlueprint.upsert({
        where: { businessId: businessId },
        update: { ...blueprint.customerBlueprint },
        create: { businessId: businessId, ...blueprint.customerBlueprint }
      });

      // Fetch the final, complete result to send back to the user.
      const finalResult = await prisma.business.findUnique({
        where: { id: businessId },
        include: { 
          marketAnalysis: true, 
          brandIdentity: true,
          customerBlueprint: true
        },
      });

      res.status(201).json({ message: 'The Legendary Unified Strategic Blueprint has been generated successfully!', data: finalResult });
    } catch (error) {
      console.error("Blueprint generation error:", error);
      res.status(500).json({ message: 'An error occurred during blueprint generation.' });
    }
  }
}
export const strategyController = new StrategyController();