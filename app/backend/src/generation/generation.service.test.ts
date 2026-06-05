import { generationService } from './generation.service';
import { openAIService } from '../services/openai.service';

// Mock the openai service to avoid making actual API calls during tests
jest.mock('../services/openai.service', () => ({
  openAIService: {
    callStream: jest.fn(),
  },
}));

describe('GenerationService', () => {
  beforeEach(() => {
    // Clear mock data before each test
    jest.clearAllMocks();
  });

  describe('generateContentStream', () => {
    it('should call openAIService.callStream with the correct system and user prompts', async () => {
      // Arrange
      const userPrompt = 'Write a tagline for a tech company';
      const expectedSystemPrompt = "You are a world-class creative copywriter. Write a compelling piece of content based on the user's request. Be creative, engaging, and follow the requested tone and style.";

      const mockStream = {} as any; // Simulating a stream object returned by OpenAI
      (openAIService.callStream as jest.Mock).mockResolvedValue(mockStream);

      // Act
      const result = await generationService.generateContentStream(userPrompt);

      // Assert
      expect(openAIService.callStream).toHaveBeenCalledTimes(1);
      expect(openAIService.callStream).toHaveBeenCalledWith(expectedSystemPrompt, userPrompt);
      expect(result).toBe(mockStream);
    });

    it('should propagate errors thrown by openAIService', async () => {
      // Arrange
      const userPrompt = 'Write a tagline for a tech company';
      const error = new Error('OpenAI API Error');
      (openAIService.callStream as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(generationService.generateContentStream(userPrompt)).rejects.toThrow('OpenAI API Error');
      expect(openAIService.callStream).toHaveBeenCalledTimes(1);
    });
  });
});
