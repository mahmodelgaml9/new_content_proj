// src/execution/execution.service.ts

import { openAIService } from '../services/openai.service';
import { prisma } from '../services/prisma.service';

class ExecutionService {
  /**
   * The "Content Commander" expert.
   * Generates an intelligent, context-aware, and culturally-adapted 30-day content execution plan.
   * @param marketingPlan The full marketing plan object, which contains the business context.
   * @param month The month number (1, 2, or 3) for which to generate the plan.
   * @returns A JSON object containing the detailed content plan for one month.
   */
  public async generateContentPlanForMonth(marketingPlan: any, month: number): Promise<any> {
    console.log(`[ExecutionService] Activating "Content Commander" for MONTH #${month}...`);

    // The "Memory" Feature: Fetch previous months' content plans to ensure continuity.
    const previousContentPlans = await prisma.contentExecutionPlan.findMany({
      where: {
        marketingPlanId: marketingPlan.id,
        month: { lt: month }, // Less than the current month
      },
      orderBy: { month: 'asc' },
    });

    // Build the powerful, context-aware prompt using a dedicated helper function.
    const systemPrompt = this.buildContentCommanderPrompt(marketingPlan, month, previousContentPlans);

    console.log(`[ExecutionService] Sending intelligent prompt to AI for Month #${month}.`);
    // Pass the full marketing plan as context to the AI.
    const result = await openAIService.call(systemPrompt, JSON.stringify(marketingPlan));
    return result;
  }

  /**
   * Private helper function to construct the detailed prompt for the Content Commander AI.
   */
  private buildContentCommanderPrompt(marketingPlan: any, month: number, previousPlans: any[]): string {
    // Extract the user's chosen goal and language preference from the marketing plan's context.
    const userGoal = marketingPlan.userDefinedGoal || marketingPlan.targetBusinessGoal;
    const languageStyle = marketingPlan.business.preferredLanguage || 'en-US';

    let prompt = `
      You are "Content Commander," a world-class marketing director specializing in content strategy. Your task is to generate a detailed, day-by-day, 30-day content execution plan for MONTH #${month}.
      
      --- PRIMARY DIRECTIVE ---
      This entire plan must be laser-focused on achieving the client's primary strategic goal: "${userGoal}".
      
      --- LANGUAGE & CULTURAL CONTEXT (CRITICAL) ---
      The output language for all user-facing text (tasks, topics, hooks, CTAs) MUST be: "${languageStyle}". You must adapt your tone, vocabulary, and examples to be perfectly natural for this style.

      --- REQUIRED JSON STRUCTURE ---
      The final output MUST be a single, valid JSON object containing "monthlyTheme" and "dailyTasks".
      For EACH object in the "dailyTasks" array, you MUST generate the following keys:
      - "day": The day number (1-30).
      - "taskId": A unique ID for the task (e.g., "w1d1", "w4d3").
      - "focus": A single keyword for the marketing area (e.g., "Content Marketing", "SEO").
      - "task": A specific, actionable content topic or headline.
      - "keywords": An array of 3-5 primary keywords for the content.
      - "seoKeywords": An array of 2-3 long-tail keywords for SEO.
      - "details": A JSON object containing:
          - "format": The content format (e.g., "Blog Post", "Instagram Reel").
          - "targetPersona": The name of the target customer persona.
          - "suggestedHook": A compelling opening line or hook to grab attention.
          - "suggestedCTA": A clear call-to-action for the content piece.
      - "strategicLink": A short string explaining how THIS specific task helps achieve the main goal of "${userGoal}". (e.g., "This blog post builds authority, which is key for long-term Lead Generation."). This is a mandatory field.
    `;

    // Add context from previous months to avoid repetition.
    if (previousPlans.length > 0) {
      prompt += `
        \n--- IMPORTANT CONTEXT: PLANS FOR PREVIOUS MONTHS ---
        You have already created content plans for the previous months. DO NOT REPEAT their themes. Build upon them. Create a plan for Month #${month} that is a logical continuation.
        ${previousPlans.map(p => `Month ${p.month} Theme: ${p.planContent.monthlyTheme}`).join('\n')}
        ----------------------------------------------------
      `;
    }

    prompt += `\nNow, generate the unique, strategic, and culturally-adapted content plan for Month #${month}.`;
    return prompt;
  }
}

export const executionService = new ExecutionService();