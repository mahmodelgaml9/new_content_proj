// src/planning/planning.service.ts

import { openAIService } from '../services/openai.service';

interface StrategicInputs {
  strategicGoal: 'BRAND_AWARENESS' | 'LEAD_GENERATION' | 'DIRECT_SALES' | 'CUSTOMER_LOYALTY';
  ambitionLevel: 'SAFE_AND_STEADY' | 'BALANCED_GROWTH' | 'AGGRESSIVE_DOMINATION';
  existingAssets: string[];
}

class PlanningService {
  /**
   * ABILITY 1: Generates CUSTOMIZED plans based on user's direct input.
   */
  public async generateCustomizedMasterPlan(business: any, strategicInputs: StrategicInputs): Promise<any> {
    console.log(`[PlanningService] Generating CUSTOMIZED Master Plan with goal: ${strategicInputs.strategicGoal}`);
    const systemPrompt = this.buildMastermindPrompt(business, strategicInputs);
    const result = await openAIService.call(systemPrompt, JSON.stringify(business));
    return result.plans || [];
  }

  /**
   * ABILITY 2: Generates AI-RECOMMENDED plans where the AI decides the best strategy.
   */
  public async generateRecommendedMasterPlan(business: any): Promise<any> {
    console.log(`[PlanningService] Generating RECOMMENDED Master Plan for "${business.name}"...`);
    
    const systemPrompt = `
      You are "Mastermind," the world's most advanced AI marketing strategist. You will be given a complete "Unified Strategic Blueprint."
      Your first and most critical task is to ACT AS THE STRATEGIST. Based on the entire analysis (SWOT, competitors, customer profile), you must decide on the single most logical "Primary Strategic Goal" for this business for the next 3 months (Choose from: BRAND_AWARENESS, LEAD_GENERATION, DIRECT_SALES, CUSTOMER_LOYALTY). Also, determine the most realistic "Ambition Level" (Choose from: SAFE_AND_STEADY, BALANCED_GROWTH, AGGRESSIVE_DOMINATION).

      After making that decision, your second task is to create a comprehensive, multi-scenario marketing plan (Low, Medium, High budget) that is laser-focused on the goal YOU just decided on.
      
      The output MUST be a single, valid JSON object. This object must contain a top-level key called "aiRecommendation" and another top-level key called "plans".
      The "aiRecommendation" key must hold a JSON object with three keys: "chosenGoal", "chosenAmbition", and "justification" (a string explaining why you made this choice).
      The "plans" key must hold an array of THREE plan objects.

      --- REQUIRED JSON STRUCTURE (For EACH of the 3 plans in the "plans" array) ---
      1.  "planName": A descriptive name reflecting the goal and budget (e.g., "Aggressive Lead Generation Plan (High Budget)").
      2.  "targetBusinessGoal": A more detailed version of the client's chosen goal, written in the target language.
      3.  "coreMarketingStrategy": The main strategic approach to achieve the goal.
      4.  "strategicPillars": A JSON object with 3-4 keys representing the core pillars of the strategy.
      5.  "contentEngineStrategy": What kind of content will achieve this goal? (e.g., for Lead Gen, focus on 'Webinars', 'E-books').
      6.  "campaignRoadmap": An array of campaigns. Each campaign must have "month", "campaignName", "objective", "channels", "keyMessage", and "activities".
      7.  "kpiDashboard": KPIs that DIRECTLY measure the success of the chosen strategic goal (e.g., for Lead Gen, KPIs are 'Cost Per Lead', 'Conversion Rate').
      8.  "quickWins": High-impact actions for the first 10 days that leverage the client's existing assets.
      9.  "riskAnalysis": Risks related to this specific strategy.
      10. "durationInMonths": 3.
      11. "budgetScenario": "Low", "Medium", or "High".
      12. "estimatedBudget": A JSON object with a "total" and allocation notes.
    `;
    
    const result = await openAIService.call(systemPrompt, JSON.stringify(business));
    return result; 
  }

  /**
   * Private helper function to construct the detailed, multi-layered prompt for the Mastermind AI.
   */
  private buildMastermindPrompt(business: any, inputs: StrategicInputs): string {
    const languageStyle = business.preferredLanguage || 'en-US';

    return `
      You are "Mastermind," the ultimate AI marketing strategist. You will be given a "Unified Strategic Blueprint" for a business, and most importantly, the client's direct strategic intent.
      Your mission is to create a comprehensive, multi-scenario marketing plan that is laser-focused on the client's goals.
      The output MUST be a single, valid JSON object with a key "plans", which is an array of THREE distinct plan objects, one for each budget scenario: "Low", "Medium", and "High".

      --- CLIENT'S STRATEGIC INTENT (CRITICAL - ALL PLANS MUST ADHERE TO THIS) ---
      1.  Primary Goal: ${inputs.strategicGoal}. Every single part of your plan must serve this primary objective.
      2.  Ambition Level: ${inputs.ambitionLevel}. This dictates the risk and investment style. A 'SAFE' plan must use organic, low-cost methods. An 'AGGRESSIVE' plan must use high-impact, paid methods.
      3.  Existing Assets to Leverage: [${inputs.existingAssets.join(', ')}]. The plan must build on these assets first before suggesting entirely new channels.

      --- LANGUAGE & CULTURAL CONTEXT (VERY IMPORTANT) ---
      4.  Target Language Style: "${languageStyle}". This is the language you must use for all generated examples, key messages, and campaign names.
          - If 'ar-EG-colloquial', use modern Egyptian slang and common English loanwords.
          - If 'ar-SA-formal', use formal, professional Arabic suitable for the Saudi market.
          - If 'ar-EG-mixed', blend English terms naturally as is common in Egyptian business.
          - If 'en-US', use standard American English.
      5.  Cultural Context: The business location is "${business.location}". All examples and campaign ideas (e.g., holiday campaigns) MUST be culturally relevant to this region.

      --- REQUIRED JSON STRUCTURE (For EACH of the 3 plans) ---
      For EACH of the three plan objects, you must generate the following keys, all tailored to the client's intent:
      1.  "planName": A descriptive name reflecting the goal and budget (e.g., "Aggressive Lead Generation Plan (High Budget)").
      2.  "targetBusinessGoal": A more detailed version of the client's chosen goal, written in the target language.
      3.  "coreMarketingStrategy": The main strategic approach to achieve the goal.
      4.  "strategicPillars": A JSON object with 3-4 keys representing the core pillars of the strategy.
      5.  "contentEngineStrategy": What kind of content will achieve this goal? (e.g., for Lead Gen, focus on 'Webinars', 'E-books').
      6.  "campaignRoadmap": An array of campaigns. Each campaign must have "month", "campaignName", "objective", "channels", "keyMessage", and "activities".
      7.  "kpiDashboard": KPIs that DIRECTLY measure the success of the chosen strategic goal (e.g., for Lead Gen, KPIs are 'Cost Per Lead', 'Conversion Rate').
      8.  "quickWins": High-impact actions for the first 10 days that leverage the client's existing assets.
      9.  "riskAnalysis": Risks related to this specific strategy.
      10. "durationInMonths": 3.
      11. "budgetScenario": "Low", "Medium", or "High".
      12. "estimatedBudget": A JSON object with a "total" and allocation notes.

      This is not a generic plan. It is a bespoke strategic response to a client's specific request. Be brilliant.
    `;
  }
}

export const planningService = new PlanningService();