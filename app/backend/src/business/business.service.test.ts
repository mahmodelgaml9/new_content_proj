import { businessService } from './business.service';
import { prisma } from '../services/prisma.service';
import { strategyService } from '../strategy/strategy.service';
import { Prisma } from '@prisma/client';

// Mock dependencies
jest.mock('../services/prisma.service', () => ({
  prisma: {
    business: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../strategy/strategy.service', () => ({
  strategyService: {
    scrapeUrl: jest.fn(),
  },
}));

describe('BusinessService', () => {
  const mockUserId = 'user-123';
  const mockBusinessId = 'business-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBusiness', () => {
    it('should create a business without source URL', async () => {
      const mockData = {
        name: 'Test Business',
        description: 'A test description',
        industry: 'Tech',
        location: 'Remote',
        businessSize: 'Small',
        targetAudienceLocale: 'en-US',
        preferredLanguage: 'English',
        someOtherDetail: 'extra',
      };

      const expectedBusiness = { id: mockBusinessId, ...mockData, ownerId: mockUserId };
      (prisma.business.create as jest.Mock).mockResolvedValue(expectedBusiness);

      const result = await businessService.createBusiness(mockUserId, mockData);

      expect(prisma.business.create).toHaveBeenCalledWith({
        data: {
          name: mockData.name,
          sourceUrl: undefined,
          description: mockData.description,
          industry: mockData.industry,
          location: mockData.location,
          businessSize: mockData.businessSize,
          targetAudienceLocale: mockData.targetAudienceLocale,
          preferredLanguage: mockData.preferredLanguage,
          details: { someOtherDetail: 'extra' },
          owner: {
            connect: { id: mockUserId },
          },
        },
      });
      expect(result).toEqual(expectedBusiness);
      expect(strategyService.scrapeUrl).not.toHaveBeenCalled();
    });

    it('should create a business and scrape source URL successfully', async () => {
      const mockData = {
        name: 'Test Business',
        sourceUrl: 'https://example.com',
      };
      const scrapedText = 'Scraped description';

      const expectedBusiness = { id: mockBusinessId, ...mockData, description: scrapedText, ownerId: mockUserId };

      (strategyService.scrapeUrl as jest.Mock).mockResolvedValue(scrapedText);
      (prisma.business.create as jest.Mock).mockResolvedValue(expectedBusiness);

      const result = await businessService.createBusiness(mockUserId, mockData);

      expect(strategyService.scrapeUrl).toHaveBeenCalledWith(mockData.sourceUrl);
      expect(prisma.business.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          description: scrapedText,
          sourceUrl: mockData.sourceUrl,
        }),
      }));
      expect(result).toEqual(expectedBusiness);
    });

    it('should handle scrape error gracefully and still create business', async () => {
      const mockData = {
        name: 'Test Business',
        sourceUrl: 'https://example.com',
      };

      (strategyService.scrapeUrl as jest.Mock).mockRejectedValue(new Error('Scraping error'));
      const expectedBusiness = {
        id: mockBusinessId,
        ...mockData,
        description: `Scraping of ${mockData.sourceUrl} failed. Please provide a manual description.`,
        ownerId: mockUserId
      };
      (prisma.business.create as jest.Mock).mockResolvedValue(expectedBusiness);

      const result = await businessService.createBusiness(mockUserId, mockData);

      expect(strategyService.scrapeUrl).toHaveBeenCalledWith(mockData.sourceUrl);
      expect(prisma.business.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          description: `Scraping of ${mockData.sourceUrl} failed. Please provide a manual description.`,
        }),
      }));
      expect(result).toEqual(expectedBusiness);
    });
  });

  describe('getBusinessById', () => {
    it('should return a business if found', async () => {
      const mockBusiness = { id: mockBusinessId, name: 'Test Business', ownerId: mockUserId };
      (prisma.business.findFirst as jest.Mock).mockResolvedValue(mockBusiness);

      const result = await businessService.getBusinessById(mockBusinessId, mockUserId);

      expect(prisma.business.findFirst).toHaveBeenCalledWith({
        where: { id: mockBusinessId, ownerId: mockUserId },
      });
      expect(result).toEqual(mockBusiness);
    });

    it('should return null if not found', async () => {
      (prisma.business.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await businessService.getBusinessById(mockBusinessId, mockUserId);

      expect(prisma.business.findFirst).toHaveBeenCalledWith({
        where: { id: mockBusinessId, ownerId: mockUserId },
      });
      expect(result).toBeNull();
    });
  });

  describe('getBusinessesByUserId', () => {
    it('should return a list of businesses', async () => {
      const mockBusinesses = [
        { id: 'b1', name: 'Biz 1', ownerId: mockUserId },
        { id: 'b2', name: 'Biz 2', ownerId: mockUserId },
      ];
      (prisma.business.findMany as jest.Mock).mockResolvedValue(mockBusinesses);

      const result = await businessService.getBusinessesByUserId(mockUserId);

      expect(prisma.business.findMany).toHaveBeenCalledWith({
        where: { ownerId: mockUserId },
        include: {
          marketAnalysis: true, brandIdentity: true, customerBlueprint: true,
          marketingPlans: true, generatedContents: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockBusinesses);
    });
  });

  describe('updateBusiness', () => {
    it('should return null if business not found', async () => {
      (prisma.business.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await businessService.updateBusiness(mockBusinessId, mockUserId, { name: 'New Name' });

      expect(prisma.business.findFirst).toHaveBeenCalledWith({
        where: { id: mockBusinessId, ownerId: mockUserId },
      });
      expect(result).toBeNull();
      expect(prisma.business.update).not.toHaveBeenCalled();
    });

    it('should update business if found', async () => {
      const existingBusiness = { id: mockBusinessId, name: 'Old Name', ownerId: mockUserId };
      const updateData = { name: 'New Name' };
      const updatedBusiness = { ...existingBusiness, ...updateData };

      (prisma.business.findFirst as jest.Mock).mockResolvedValue(existingBusiness);
      (prisma.business.update as jest.Mock).mockResolvedValue(updatedBusiness);

      const result = await businessService.updateBusiness(mockBusinessId, mockUserId, updateData);

      expect(prisma.business.findFirst).toHaveBeenCalledWith({
        where: { id: mockBusinessId, ownerId: mockUserId },
      });
      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: mockBusinessId },
        data: updateData,
      });
      expect(result).toEqual(updatedBusiness);
    });

    it('should update business and set details to Prisma.JsonNull if passed as null', async () => {
      const existingBusiness = { id: mockBusinessId, name: 'Biz', details: { key: 'value' }, ownerId: mockUserId };
      const updateData = { details: null as any };
      const updatedBusiness = { ...existingBusiness, details: null };

      (prisma.business.findFirst as jest.Mock).mockResolvedValue(existingBusiness);
      (prisma.business.update as jest.Mock).mockResolvedValue(updatedBusiness);

      const result = await businessService.updateBusiness(mockBusinessId, mockUserId, updateData);

      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: mockBusinessId },
        data: { details: Prisma.JsonNull },
      });
      expect(result).toEqual(updatedBusiness);
    });
  });
});
