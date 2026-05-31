# Project: CMO-Prime - The AI-Powered Marketing OS

## 1. Legendary Vision

CMO-Prime is not a tool; it is an AI-Powered Chief Marketing Officer delivered as a SaaS platform. Our mission is to provide businesses of all sizes with a strategic partner that is capable of diagnosing their market position, architecting bespoke marketing strategies, and executing them with creative precision. We aim to democratize world-class marketing intelligence, making it accessible, fast, and actionable.

## 2. Core Features

The platform is built on four strategic pillars:

*   **Diagnose:** A comprehensive analysis engine that generates a "Unified Strategic Blueprint" by understanding the business, market, competitors, and audience on a deep level.
*   **Strategize:** A planning engine that transforms the blueprint into multiple, scenario-based master marketing plans (e.g., based on budget).
*   **Execute:** An "Operations Room" of specialized AI experts (Content, Ads, SEO) that break down the master plan into actionable, monthly execution calendars.
*   **Create:** A hybrid creative engine that generates high-quality, on-brand content (text and eventually visuals) in both interactive streams and efficient batches.

## 3. Technology Stack

*   **Backend:** Node.js with Express.js
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **AI/ML:** OpenAI (GPT-4o), Google Gemini
*   **Web Scraping:** Puppeteer
*   **Containerization:** Docker & Docker Compose

## 4. Getting Started & Local Development

The project is fully containerized for a seamless development experience.

1.  **Prerequisites:** Ensure you have Docker and Docker Compose installed.
2.  **Environment:** Create a `.env` file in the project root and populate it with the necessary keys (`DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET`).
3.  **Build & Run:** The primary command to build, migrate the database, and run the application is:
    ```bash
    docker-compose up -d --build
    ```
4.  **Stopping the environment:** To stop all services and remove volumes (for a clean restart), use:
    ```bash
    docker-compose down -v
    ```

---