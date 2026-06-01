# Project: CMO-Prime - The AI-Powered Marketing OS

**Version:** 2.1 (The Interactive, Context-Aware, & Culturally-Adapted Engine)

## Legendary Vision & Core Philosophy

CMO-Prime is not a tool; it is an AI-Powered Chief Marketing Officer delivered as a SaaS platform. Our mission is to provide businesses of all sizes with a strategic partner that is capable of diagnosing their market position, architecting bespoke marketing strategies, and executing them with creative precision. We aim to democratize world-class marketing intelligence, making it accessible, fast, and actionable.

**Core Philosophy:** To create a digital platform that emulates a real-world, hyper-competent strategic marketing partner for any business, with a core focus on hyper-personalization, cultural relevance, and real-world applicability.

## Strategic Differentiators

*   **Interactive Strategy (The "Strategic Dialogue")**
*   **Cultural & Linguistic Adaptation**
*   **Hyper-Local Competitive Analysis**
*   **Embedded Strategic DNA**

## Core Features

The platform is built on four strategic pillars:

*   **Diagnose:** A comprehensive analysis engine that generates a "Unified Strategic Blueprint" by understanding the business, market, competitors, and audience on a deep level.
*   **Strategize:** A planning engine that transforms the blueprint into multiple, scenario-based master marketing plans (e.g., based on budget).
*   **Execute:** An "Operations Room" of specialized AI experts (Content, Ads, SEO) that break down the master plan into actionable, monthly execution calendars.
*   **Creative Direction:** Through the diagnosis to creation steps, the system defines the best creative angle, detailing exactly how the creative should be structured and designed with comprehensive specifications.
*   **Create:** A hybrid creative engine that generates high-quality, on-brand content (text and eventually visuals) in both interactive streams and efficient batches.

## Current Status & Roadmap

**Status:** Under Active Development & Debugging

The project is currently in its initial development and debugging phase. We are actively working to complete and polish the core features. The ultimate goal is to evolve CMO-Prime into a genuinely powerful, globally capable Chief Marketing Officer that drives real-world growth and sales.

## Specialized AI Experts (The Future of The Operations Room)

The "Specialized Experts" architecture is the foundation for our future growth. Our guiding principle for all future experts is **Hyper-Realism and Hyper-Personalization**. Each new expert module will not just generate a plan, but will do so by deeply integrating all available context.

### a. The "Ads General" (خبير الإعلانات)
*   **Core Function:** To generate monthly advertising plans (`AdExecutionPlan`) that are ruthlessly focused on the user's `strategicGoal`.
*   **Hyper-Personalization Inputs:** Budget-Aware, Asset-Aware (e.g., Custom Audiences/Retargeting), and Persona-Driven.
*   **Hyper-Realistic Outputs:** Ad Creatives (including detailed visual prompts for AI image generators) and Landing Page Briefs.

### b. The "SEO Specialist" (خبير السيو)
*   **Core Function:** To generate monthly SEO action plans (`SeoExecutionPlan`).
*   **Hyper-Personalization Inputs:** Competitor-Aware (identifying keyword opportunities) and Content-Aware (on-page optimization for content plans).
*   **Hyper-Realistic Outputs:** Actionable Technical SEO Tasks, On-Page SEO Tasks (meta titles, descriptions, alt-text), and Off-Page SEO Strategy (local directories, backlinks).

### c. The "PR & Outreach Maven" (خبير العلاقات العامة)
*   **Core Function:** To generate monthly PR and outreach plans.
*   **Hyper-Personalization Inputs:** Industry-Aware (identifying top journalists, bloggers, influencers locally and industry-wide).
*   **Hyper-Realistic Outputs:** Personalized Email Pitches and Press Release Angles.

## Technology Stack

Our robust tech stack leverages modern frameworks to ensure performance and scalability:

*   **Backend:** Node.js with Express.js (`express-async-errors`, `cors`)
*   **Frontend:** React (`react-hook-form`, `lucide-react`, `zustand`, `clsx`), Next.js, Tailwind CSS, Vite
*   **Language:** TypeScript
*   **Database:** PostgreSQL with Redis caching
*   **ORM:** Prisma (`@prisma/client`)
*   **AI/ML:** OpenAI (GPT-4o), Google Gemini (`@google/genai`)
*   **Web Scraping & Automation:** Puppeteer
*   **Security:** `bcryptjs`, `jsonwebtoken`
*   **Networking:** `axios`, `dotenv`
*   **Containerization:** Docker & Docker Compose

## Getting Started & Local Development

The project is fully containerized for a seamless development experience.

1.  **Prerequisites:** Ensure you have Docker and Docker Compose installed.
2.  **Environment:** Create a `.env` file in the project root and populate it with the necessary keys (e.g., `DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET`).
3.  **Build & Run:** The primary command to build, migrate the database, and run the application is:
    ```bash
    docker-compose up -d --build
    ```
4.  **Stopping the environment:** To stop all services and remove volumes (for a clean restart), use:
    ```bash
    docker-compose down -v
    ```

This forward-looking vision ensures that as we build, we are always moving towards our ultimate goal: a truly integrated, intelligent, and indispensable marketing OS.