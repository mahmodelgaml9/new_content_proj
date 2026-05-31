// src/planning/planning.controller.ts

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { planningService } from './planning.service';
import { prisma } from '../services/prisma.service';

class PlanningController {
  /**
   * Provides the client with the set of strategic choices they can make.
   * This is a static response, it does not require AI.
   */
  public getStrategicOptions(req: Request, res: Response): void {
    const options = {
      strategicGoals: [
        { id: 'BRAND_AWARENESS', name: 'Brand Awareness', description: 'I want everyone to know about my brand and what I stand for.' },
        { id: 'LEAD_GENERATION', name: 'Lead Generation', description: 'I want to collect contact information (emails, phone numbers) of potential customers.' },
        { id: 'DIRECT_SALES', name: 'Direct Sales', description: 'I want people to click and buy my product/service immediately.' },
        { id: 'CUSTOMER_LOYALTY', name: 'Customer Loyalty', description: 'I want to re-engage my existing customers to increase their lifetime value.' },
      ],
      ambitionLevels: [
        { id: 'SAFE_AND_STEADY', name: 'Safe & Steady', description: 'Focus on low-cost, organic methods for long-term growth.' },
        { id: 'BALANCED_GROWTH', name: 'Balanced Growth', description: 'A mix of organic methods and calculated, paid advertising.' },
        { id: 'AGGRESSIVE_DOMINATION', name: 'Aggressive Domination', description: 'Invest heavily to capture the market and achieve rapid results.' },
      ],
      existingAssets: [
        { id: 'EMAIL_LIST', name: 'Email List (>500 contacts)' },
        { id: 'ACTIVE_SOCIAL_MEDIA', name: 'Active Social Media Page' },
        { id: 'EXISTING_WEBSITE_TRAFFIC', name: 'Blog/Website with existing traffic' },
        { id: 'DEFINED_AD_BUDGET', name: 'I have a defined monthly ad budget' },
        { id: 'TEAM_SUPPORT', name: 'I have a team to help with execution' },
      ],
    };
    res.status(200).json(options);
  }

  /**
   * Generates and saves the master marketing plans based on user's custom choices.
   */
  public async generateCustomizedPlans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      const { strategicGoal, ambitionLevel, existingAssets } = req.body;

      // --- Validation ---
      if (!strategicGoal || !ambitionLevel || !existingAssets) {
        res.status(400).json({ message: 'strategicGoal, ambitionLevel, and existingAssets are required.' });
        return;
      }

      // --- Fetch Context ---
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: { marketAnalysis: true, brandIdentity: true, customerBlueprint: true },
      });
      if (!business) {
        res.status(404).json({ message: 'Business with its full analysis not found.' });
        return;
      }

      // --- Call the new, intelligent service ---
      const plansData = await planningService.generateCustomizedMasterPlan(business, {
        strategicGoal,
        ambitionLevel,
        existingAssets,
      });

      // --- Save the generated plans to the database ---
      await prisma.marketingPlan.deleteMany({ where: { businessId: businessId } });

      const createdPlans = [];
      for (const plan of plansData) {
        const newPlan = await prisma.marketingPlan.create({
          data: {
            businessId: businessId,
            // Save the user's intent along with the plan
            userDefinedGoal: strategicGoal,
            ambitionLevel: ambitionLevel,
            existingAssets: existingAssets,
            // AI-generated data
            planName: plan.planName,
            targetBusinessGoal: plan.targetBusinessGoal,
            coreMarketingStrategy: plan.coreMarketingStrategy,
            durationInMonths: plan.durationInMonths,
            budgetScenario: plan.budgetScenario,
            estimatedBudget: plan.estimatedBudget || {},
            strategicPillars: plan.strategicPillars || {},
            contentEngineStrategy: plan.contentEngineStrategy || {},
            campaignRoadmap: plan.campaignRoadmap || [],
            kpiDashboard: plan.kpiDashboard || {},
            riskAnalysis: plan.riskAnalysis || {},
            quickWins: plan.quickWins || {},
          }
        });
        createdPlans.push(newPlan);
      }
      res.status(201).json({ message: 'Customized master marketing plans generated successfully!', data: createdPlans });
    } catch (error) {
      console.error("Custom plan generation error:", error);
      res.status(500).json({ message: 'An error occurred during custom plan generation.' });
    }
  }
  public async generateRecommendedPlans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: { marketAnalysis: true, brandIdentity: true, customerBlueprint: true },
      });

      if (!business) {
        res.status(404).json({ message: 'Business with its full analysis not found.' });
        return;
      }

      // Call the new service function
      const result = await planningService.generateRecommendedMasterPlan(business);
      
      if (!result || !result.plans || !result.aiRecommendation) {
        throw new Error("AI failed to return the expected recommended plan structure.");
      }

      const plansData = result.plans;
      const recommendation = result.aiRecommendation;

      // Delete any old plans to make way for the new ones
      await prisma.marketingPlan.deleteMany({ where: { businessId: businessId } });

      const createdPlans = [];
      for (const plan of plansData) {
        const newPlan = await prisma.marketingPlan.create({
          data: {
            businessId: businessId,
            // IMPORTANT: We save the AI's choices as the user's choices
            userDefinedGoal: recommendation.chosenGoal,
            ambitionLevel: recommendation.chosenAmbition,
            existingAssets: [], // We can't know the assets in this path, so we leave it empty
            // AI-generated data
            planName: plan.planName,
            targetBusinessGoal: plan.targetBusinessGoal,
            coreMarketingStrategy: plan.coreMarketingStrategy,
            durationInMonths: plan.durationInMonths,
            budgetScenario: plan.budgetScenario,
            estimatedBudget: plan.estimatedBudget || {},
            strategicPillars: plan.strategicPillars || {},
            contentEngineStrategy: plan.contentEngineStrategy || {},
            campaignRoadmap: plan.campaignRoadmap || [],
            kpiDashboard: plan.kpiDashboard || {},
            riskAnalysis: plan.riskAnalysis || {},
            quickWins: plan.quickWins || {},
          }
        });
        createdPlans.push(newPlan);
      }

      res.status(201).json({ message: 'AI-Recommended master plans generated successfully!', recommendation, data: createdPlans });
    } catch (error) {
      console.error("Recommended plan generation error:", error);
      res.status(500).json({ message: 'An error occurred during recommended plan generation.' });
    }
  }
}
export const planningController = new PlanningController();
