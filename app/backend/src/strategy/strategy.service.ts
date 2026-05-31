// src/strategy/strategy.service.ts

import fs from 'fs';
import puppeteer from 'puppeteer';
import { openAIService } from '../services/openai.service';

class StrategyService {
  public async scrapeUrl(url: string): Promise<string> {
    console.log(`[StrategyService] Scraping single URL: ${url}`);
    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const scrapedText = await page.evaluate(() => document.body.innerText);
      console.log(`[StrategyService] Successfully scraped ${scrapedText.length} characters.`);
      return scrapedText;
    } catch (error) {
      let errorMessage = `Failed to scrape ${url}.`;
      if (error instanceof Error) { errorMessage += ` Reason: ${error.message}`; }
      console.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      if (browser) { await browser.close(); }
    }
  }
  // This is the robust, dual-search system we built. It stays.
  public async searchGoogleMapsForCompetitors(query: string): Promise<string[]> {
    console.log(`[StrategyService] Attempting HYPER-LOCAL search on Google Maps for: "${query}"`);
    let browser;
    try {
      browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], headless: true });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(mapsUrl, { waitUntil: 'networkidle2' });

      await page.waitForSelector('div[role="feed"]', { timeout: 15000 });

      const competitorNames = await page.evaluate(() => {
        const placeCards = Array.from(document.querySelectorAll('div[role="feed"] > div > div > a'));
        const names = placeCards.map(card => (card.getAttribute('aria-label') || '').trim());
        return names.filter(name => name).slice(0, 5);
      });

      if (competitorNames.length > 0) {
        console.log(`[StrategyService] Google Maps search SUCCEEDED. Found competitors:`, competitorNames);
      } else {
        console.warn('[StrategyService] Google Maps search ran but found 0 competitors.');
      }
      return competitorNames;
    } catch (error) {
      console.error('[StrategyService] Google Maps search FAILED critically.', error);
      return [];
    } finally {
      if (browser) { await browser.close(); }
    }
  }

  public async searchGoogleWebForCompetitors(query: string): Promise<string[]> {
    console.log(`[StrategyService] Fallback Activated: Performing GENERAL web search for: "${query}"`);
    let browser;
    try {
      browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], headless: true });
      const page = await browser.newPage();
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`);
      await page.waitForSelector('div.g');
      
      const competitors = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll('div.g'));
        return results.map(r => {
          const titleEl = r.querySelector('h3');
          return titleEl ? titleEl.innerText.split(' - ')[0].split(' | ')[0].trim() : '';
        }).filter(name => name).slice(0, 3);
      });
      
      console.log(`[StrategyService] Fallback Web search found competitors:`, competitors);
      return competitors;
    } catch (error) {
      console.error(`[StrategyService] Fallback Web search FAILED.`, error);
      return [];
    } finally {
      if (browser) { await browser.close(); }
    }
  }

  /**
   * The LEGENDARY analysis function, restored to its full power and enhanced.
   * This version enforces the exact data structure to prevent all validation errors.
   * @param businessInfo The full business object from the database.
   * @param localCompetitors An array of competitor names found via Google Maps or Web Search.
   * @returns The complete, detailed, and correctly structured Unified Strategic Blueprint.
   */
  public async generateUnifiedBlueprint(businessInfo: any, localCompetitors: string[]): Promise<any> {
    console.log(`[StrategyService] Generating the FINAL LEGENDARY Unified Strategic Blueprint...`);
    
    const systemPrompt = `
      You are "Strategist Prime," the world's most advanced AI business consultant. Your task is to generate a "Unified Strategic Blueprint."
      The output MUST be a single, valid JSON object with the exact top-level keys: "strategicSummary", "marketAnalysis", "brandIdentity", and "customerBlueprint".
      You MUST adhere strictly to the specified data types and structures for every key.

      --- DETAILED STRUCTURE FOR EACH KEY (MANDATORY) ---

      1.  "marketAnalysis": This MUST be a JSON object containing these exact keys:
          - "swotAnalysis": A JSON object with keys "strengths", "weaknesses", "opportunities", "threats". Each key must hold an array of strings.
          - "pestelAnalysis": A JSON object with keys "political", "economic", "social", "technological", "environmental", "legal". Each key must hold an array of strings.
          - "portersFiveForces": A JSON object with keys "threatOfNewEntrants", "bargainingPowerOfBuyers", "bargainingPowerOfSuppliers", "threatOfSubstituteProducts", "industryRivalry". Each key must hold a string describing the force's level (e.g., "High") and a justification.
          - "competitorAnalysis": An array of objects. Each object represents ONE local competitor and MUST have these keys: "name"(string), "website"(string), "summary"(string), and "competitorSwot"(a full SWOT object for that competitor).
          - "vrioAnalysis": A JSON object analyzing the client's resources (Value, Rarity, Imitability, Organization).
          - "marketSizing": A JSON object with keys "tam", "sam", "som", each with a string value.
          - "executionChallenges": A SINGLE string summarizing potential challenges. DO NOT use an array.

      2.  "strategicSummary": This MUST be a JSON object containing these exact keys:
          - "towsMatrix": An object with keys "ST", "SW", "WT", "WO", each holding an array of actionable strategies.
          - "marketPositioning": A string recommending a clear market positioning strategy.
          - "keyMarketingAngles": An array of strings.
          - "uniqueSellingPoints": An array of strings.

      3.  "brandIdentity": This MUST be a JSON object containing these exact keys:
          - "brandArchetype": A JSON object with "primary" and "secondary" archetypes and justifications.
          - "brandVoiceKeywords": An array of strings.
          - "visualPreferences": A JSON object describing the ideal visual style.

      4.  "customerBlueprint": This MUST be a JSON object containing these exact keys:
          - "valueProposition": The full Value Proposition Canvas object.
          - "audiencePersonas": An array of up to 2 detailed persona objects. Each persona MUST contain standard keys (name, demographics, goals, painPoints) AND a nested object called "psychologicalProfile".
          - The "psychologicalProfile" object MUST contain these exact keys: "uspResonance"(string), "barriersToPurchase"(array of strings), "influencePoints"(array of strings), "emotionalDrivers"(array of strings), "communicationStyle"(string).
          - "customerJourneyMap": A summary of the key stages in the customer journey.

      --- CONTEXT FOR YOUR ANALYSIS ---
      - The client's business information is in the user prompt.
      - The list of TOP LOCAL COMPETITORS to analyze is: [${localCompetitors.join(', ')}]. Focus your competitor analysis on them. If the list is empty, state that and perform a general analysis for one or two typical competitors.

      Now, analyze the business information and populate this precise JSON structure. Adhere strictly to the data types. Do not invent new keys or deviate from this structure.
    `;
    
    const result = await openAIService.call(systemPrompt, JSON.stringify(businessInfo));
    return result;
  }
}

export const strategyService = new StrategyService();