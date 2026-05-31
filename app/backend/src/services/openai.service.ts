// src/services/openai.service.ts

import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not defined in environment variables.');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Calls the OpenAI API to generate a response.
   * Can handle both structured JSON and plain text responses.
   * @param systemPrompt The instructions for the AI model.
   * @param userPrompt The user's input.
   * @param expectJson A boolean to indicate if we expect a JSON object back. Defaults to true.
   * @returns A parsed JSON object or a raw text string.
   */
  public async call(systemPrompt: string, userPrompt: string, expectJson: boolean = true): Promise<any> {
    console.log(`[OpenAIService] Calling OpenAI API. Expecting response type: ${expectJson ? 'JSON' : 'Text'}`);
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        // This is the dynamic part. We set the response format based on what we expect.
        response_format: { type: expectJson ? 'json_object' : 'text' },
      });

      const result = response.choices[0].message?.content;
      if (!result) {
        throw new Error('OpenAI returned an empty response.');
      }

      // If we expected JSON, we parse it.
      if (expectJson) {
        console.log('[OpenAIService] Successfully received and parsed JSON response.');
        return JSON.parse(result);
      }
      
      // Otherwise, we return the raw text.
      console.log('[OpenAIService] Successfully received raw text response.');
      return result;

    } catch (error) {
      console.error('[OpenAIService] Error calling OpenAI API:', error);
      throw new Error('Failed to get a valid response from OpenAI.');
    }
  }

  /**
   * Calls the OpenAI API and returns a stream of text chunks.
   * This function remains unchanged as it's already specialized for streaming.
   * @param systemPrompt The instructions for the AI model.
   * @param userPrompt The user's input for content generation.
   * @returns A stream object that can be iterated over.
   */
  public async callStream(
    systemPrompt: string, 
    userPrompt: string
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    console.log('[OpenAIService] Calling OpenAI API for STREAMING...');
    return this.openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
    });
  }
}

export const openAIService = new OpenAIService();