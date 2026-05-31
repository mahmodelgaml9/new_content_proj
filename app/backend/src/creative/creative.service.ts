// src/creative/creative.service.ts

import { openAIService } from '../services/openai.service';
import { prisma } from '../services/prisma.service';
import { Stream } from 'openai/streaming';
import OpenAI from 'openai';

interface CreativeInputs {
  platform?: string;
  length?: string;
  tone?: string;
  extraInstructions?: string;
  customCTA?: string;
  customHook?: string;
}

class CreativeService {
  /**
   * ABILITY 1: BATCH GENERATION (No Streaming)
   */
  public async generateCreativeBatch(
    contentPlan: any,
    taskIds: string[],
    variationsPerTask: number,
    userInput: CreativeInputs
  ): Promise<any[]> {
    console.log(`[CreativeService] Starting BATCH generation for ${taskIds.length} tasks, with ${variationsPerTask} variations each.`);

    const allGeneratedContent = [];
    const planContent = contentPlan.planContent as any;
    const businessContext = contentPlan.marketingPlan.business;

    for (const taskId of taskIds) {
      const task = (planContent?.dailyTasks || []).find((d: any) => d.taskId === taskId);
      if (!task) {
        console.warn(`[CreativeService] Task with ID "${taskId}" not found in plan. Skipping.`);
        continue;
      }

      for (let i = 1; i <= variationsPerTask; i++) {
        console.log(`- Generating variation #${i} for task: "${task.task}"`);

        const systemPrompt = this.buildLegendaryCreativePrompt(businessContext, task, userInput, i, variationsPerTask);
        const generatedText = await openAIService.call(systemPrompt, '', false);

        const savedContent = await prisma.generatedContent.create({
          data: {
            content: generatedText,
            prompt: systemPrompt,
            modelUsed: 'gpt-4o',
            contentExecutionPlanId: contentPlan.id,
            taskId: taskId,
            variationNumber: i,
            businessId: businessContext.id,
            userId: businessContext.ownerId,
          },
        });
        allGeneratedContent.push(savedContent);
      }
    }

    console.log(`[CreativeService] Batch generation complete. Total pieces created: ${allGeneratedContent.length}`);
    return allGeneratedContent;
  }

  /**
   * ABILITY 2: STREAMING GENERATION (Interactive UI)
   */
  public async generateCreativeStream(
    businessContext: any,
    task: any,
    userInput: CreativeInputs,
    variationNumber: number = 1,
    totalVariations: number = 1
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    console.log(`[CreativeService] Streaming creative for task: ${task.task}`);

    const systemPrompt = this.buildLegendaryCreativePrompt(
      businessContext,
      task,
      userInput,
      variationNumber,
      totalVariations
    );

    return openAIService.callStream(systemPrompt, '');
  }

  /**
   * Builds a high-context, localized creative prompt.
   */
  private buildLegendaryCreativePrompt(
    businessContext: any,
    task: any,
    userInput: CreativeInputs,
    currentVariation: number,
    totalVariations: number
  ): string {
    const languageStyle = businessContext.preferredLanguage || 'en-US';
    const ambition = businessContext.masterPlan?.aiRecommendation?.chosenAmbition || 'BALANCED_GROWTH';
    const persona = businessContext.customerBlueprint.audiencePersonas.find((p: any) => p.name === task.details.targetPersona) || businessContext.customerBlueprint.audiencePersonas[0];

    let prompt = `
    You are a world-class, emotionally intelligent marketing copywriter with 20+ years of experience writing across cultures.
    Your mission is to create a SINGLE, mind-blowingly effective piece of content tailored for the target persona.

    --- BRAND & STRATEGIC CONTEXT ---
    - Brand Archetype: ${businessContext.brandIdentity?.brandArchetype?.primary}
    - Brand Voice Keywords: [${(businessContext.brandIdentity?.brandVoiceKeywords || []).join(', ')}]
    - Strategic Goal: "${task.strategicLink}"
    - Ambition Level: ${ambition} (this defines the tone: safe, bold, or aggressive)

    --- TARGET AUDIENCE ---
    - Persona Name: ${persona.name}
    - Emotional Drivers: [${(persona.psychologicalProfile?.emotionalDrivers || []).join(', ')}]
    - Barriers to Purchase: [${(persona.psychologicalProfile?.barriersToPurchase || []).join(', ')}]
    - Influence Points: [${(persona.psychologicalProfile?.influencePoints || []).join(', ')}]
    - Communication Style: ${persona.psychologicalProfile?.communicationStyle || 'direct'}

    --- CONTENT BRIEF ---
    - Platform/Format: ${userInput.platform || task.details?.format}
    - Topic/Headline: "${task.task}"
    - Suggested Hook: "${userInput.customHook || task.details?.suggestedHook}"
    - Call to Action: "${userInput.customCTA || task.details?.suggestedCTA}"
    - Content Purpose: ${task.strategicLink} — focus on results, persuasion, and emotional connection
    - This is variation ${currentVariation} of ${totalVariations}. You MUST use a DIFFERENT creative angle.

    --- LANGUAGE & TONE RULES ---
    Language Style: ${languageStyle}
    - Match tone to ambition:
        - SAFE_AND_STEADY: helpful, calming, informative
        - BALANCED_GROWTH: clear, persuasive, benefit-driven
        - AGGRESSIVE_DOMINATION: urgent, bold, emotionally-charged
    - Mirror the persona's language preferences: ${persona.psychologicalProfile?.communicationStyle}
    `;

    if (languageStyle === 'ar-EG' || languageStyle === 'ar-EG-colloquial') {
      prompt += `
      --- EGYPTIAN COLLOQUIAL ARABIC RULESET ---
      - Be witty, sharp, and friendly — as if chatting over coffee in Cairo.
      - Vocabulary examples:
          - Use "بس" not "لكن", "عمرك فكرت؟" not "هل فكرت يومًا؟"
          - Say "اعرف أكتر عن الحلول" not "اكتشف الحلول"
      - Use phrases like: "بص يا سيدي", "خليني أقولك على حاجة", "الفكرة كلها في..."
      - NEVER use Fusha Arabic. No classical tone. No complex literary terms.
      - Example: "عايز تكبر البيزنس بتاعك؟ الموضوع أبسط من ما تتخيل..."
      `;
    }

    if (userInput.extraInstructions) {
      prompt += `
      --- CUSTOM USER INSTRUCTIONS ---
      ${userInput.extraInstructions}
      `;
    }

    prompt += `
    --- EXECUTION INSTRUCTIONS ---
    - Apply a proven copywriting formula (choose one):
        - PAS (Problem-Agitate-Solution)
        - AIDA (Attention-Interest-Desire-Action)
        - FAB (Features-Advantages-Benefits)
        - Storytelling (if persona is highly emotional)
    - Use impactful opening lines.
    - End with a clear, tailored CTA.
    - WRITE ONLY THE FINAL RAW CONTENT. No introductions, no formatting hints.
    `;

    return prompt;
  }
}

export const creativeService = new CreativeService();