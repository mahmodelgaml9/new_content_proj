// src/ads/ads.strategy.service.ts

import { openAIService } from '../services/openai.service';

class AdsStrategyService {
  /**
   * Builds a multi-channel ad strategy for a given marketing plan.
   * The output includes campaign structure, creative ideas, targeting, and platform suggestions.
   */
  public async generateAdCampaignPlan(marketingPlan: any, businessContext: any): Promise<any> {
    const persona = businessContext.customerBlueprint?.audiencePersonas?.[0];
    const languageStyle = businessContext.preferredLanguage || 'en-US';
    const ambition = marketingPlan.ambitionLevel || 'BALANCED_GROWTH';

    const prompt = `
      You are an award-winning advertising strategist. Your task is to generate a complete, multi-channel advertising campaign plan based on the following data:

      --- BUSINESS CONTEXT ---
      - Industry: ${businessContext.industry}
      - Description: ${businessContext.description}
      - Location: ${businessContext.location}
      - Locale: ${businessContext.targetAudienceLocale}
      - Language Style: ${languageStyle}
      - Ambition Level: ${ambition}

      --- STRATEGIC GOAL ---
      - ${marketingPlan.targetBusinessGoal}

      --- PERSONA SNAPSHOT ---
      - Name: ${persona?.name || 'Target Audience'}
      - Emotional Drivers: [${persona?.psychologicalProfile?.emotionalDrivers?.join(', ') || ''}]
      - Barriers to Purchase: [${persona?.psychologicalProfile?.barriersToPurchase?.join(', ') || ''}]
      - Communication Style: ${persona?.psychologicalProfile?.communicationStyle || 'direct'}

      --- REQUIRED OUTPUT ---
      You must return a valid JSON with the following structure:
      {
        "campaignName": string,
        "objective": string, // e.g. Awareness / Lead Gen / Conversions
        "recommendedPlatforms": string[],
        "adSets": [
          {
            "platform": string,
            "creativeType": string, // e.g. Image, Video, Carousel
            "primaryText": string,
            "headline": string,
            "hook": string,
            "cta": string,
            "targetingSummary": string, // short human-readable breakdown
            "visualDescription": string // describe what the image/video should show
          }
        ]
      }

      You must use clear, localized, persuasive language tailored to the persona's psychology and market environment.
    `;

    const result = await openAIService.call(prompt, JSON.stringify(businessContext));
    return result;
  }
}

export const adsStrategyService = new AdsStrategyService();
