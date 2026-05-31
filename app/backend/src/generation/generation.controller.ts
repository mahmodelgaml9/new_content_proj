import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { generationService } from './generation.service';
import { prisma } from '../services/prisma.service'; // This was the missing line

class GenerationController {
  // streamContent function remains the same
  public async streamContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const stream = await generationService.generateContentStream(prompt);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      res.write(`data: {"error": "An error occurred during streaming."}\n\n`);
    } finally {
      res.end();
      console.log("[GenerationController] Stream finished and connection closed.");
    }
  }

  /**
   * Saves a piece of generated content to the database.
   */
  public async saveGeneratedContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const { content, prompt, modelUsed, businessId } = req.body;

      if (!content || !prompt || !businessId) {
        res.status(400).json({ message: 'Content, prompt, and businessId are required.' });
        return;
      }

      const savedContent = await prisma.generatedContent.create({
        data: {
          content: content,
          prompt: prompt,
          modelUsed: modelUsed || 'gpt-4o',
          business: { connect: { id: businessId } },
          user: { connect: { id: req.user.id } },
        }
      });

      res.status(201).json({ message: 'Content saved successfully!', data: savedContent });
    } catch (error) {
      console.error("Save content error:", error);
      res.status(500).json({ message: 'An error occurred while saving content.' });
    }
  }
}
export const generationController = new GenerationController();