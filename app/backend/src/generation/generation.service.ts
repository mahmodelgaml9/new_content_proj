import { openAIService } from '../services/openai.service';

class GenerationService {
  public async generateContentStream(prompt: string) {
    const systemPrompt = "You are a world-class creative copywriter. Write a compelling piece of content based on the user's request. Be creative, engaging, and follow the requested tone and style.";
    return openAIService.callStream(systemPrompt, prompt);
  }
}
export const generationService = new GenerationService();