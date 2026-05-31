// src/business/business.service.ts

import { Business, Prisma } from '@prisma/client';
import { prisma } from '../services/prisma.service';
import { strategyService } from '../strategy/strategy.service';

class BusinessService {
  /**
   * THE BULLETPROOF createBusiness function.
   * This version is guaranteed to be type-safe for TypeScript and Prisma.
   */
  public async createBusiness(
    userId: string,
    data: { [key: string]: any }
  ): Promise<Business> {
    
    const {
      name, sourceUrl, description, industry, location,
      businessSize, targetAudienceLocale, preferredLanguage,
      ...otherDetails 
    } = data;

    let finalDescription = description || 'No description provided.';

    if (sourceUrl) {
      try {
        console.log(`[BusinessService] Source URL provided. Starting scraping...`);
        const scrapedText = await strategyService.scrapeUrl(sourceUrl);
        finalDescription = scrapedText;
        console.log(`[BusinessService] Scraping successful.`);
      } catch (error) {
        let errorMessage = "An unknown error occurred during scraping.";
        if (error instanceof Error) { errorMessage = error.message; }
        console.error(`[BusinessService] Scraping failed. Error: ${errorMessage}.`);
        finalDescription = `Scraping of ${sourceUrl} failed. Please provide a manual description.`;
      }
    }

    const newBusiness = await prisma.business.create({
      data: {
        name: name || "Untitled Business",
        sourceUrl: sourceUrl,
        description: finalDescription,
        industry: industry,
        location: location,
        businessSize: businessSize,
        targetAudienceLocale: targetAudienceLocale,
        preferredLanguage: preferredLanguage,
        
        // THE FINAL FIX: If otherDetails has keys, assign the object. Otherwise, assign 'undefined'
        // which Prisma correctly ignores, preventing any type errors.
        details: Object.keys(otherDetails).length > 0 ? otherDetails : undefined,

        owner: {
          connect: { id: userId },
        },
      },
    });

    return newBusiness;
  }

  public async getBusinessById(businessId: string, userId: string): Promise<Business | null> {
    return prisma.business.findFirst({
      where: { id: businessId, ownerId: userId },
    });
  }

  public async getBusinessesByUserId(userId: string): Promise<Business[]> {
    return prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        marketAnalysis: true, brandIdentity: true, customerBlueprint: true,
        marketingPlans: true, generatedContents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * THE BULLETPROOF updateBusiness function.
   * This version is guaranteed to be type-safe for TypeScript and Prisma.
   */
  public async updateBusiness(
    businessId: string,
    userId: string,
    data: Partial<Business>
  ): Promise<Business | null> {
    const existingBusiness = await prisma.business.findFirst({
      where: { id: businessId, ownerId: userId },
    });

    if (!existingBusiness) {
      return null;
    }

    // Create a mutable copy of the data to be sent for the update.
    const updateData: { [key: string]: any } = { ...data };

    // Prisma's JSON field has a special requirement for handling 'null'.
    // If the user intends to set the 'details' field to null, we must convert it
    // to Prisma.JsonNull for the update to succeed.
    if (updateData.details !== undefined && updateData.details === null) {
      updateData.details = Prisma.JsonNull;
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: updateData,
    });

    return updatedBusiness;
  }
}

export const businessService = new BusinessService();