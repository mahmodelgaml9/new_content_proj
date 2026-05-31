# CMO-Prime: System Architecture

## 1. Core Principles

The backend architecture is designed with three core principles in mind:

*   **Modularity (Separation of Concerns):** Each core feature (Auth, Business, Strategy, Planning, Execution, Creative) is a self-contained module with its own routes, controller, and service. This makes the system easy to maintain, debug, and scale.
*   **Scalability:** By containerizing our services (app, db, redis) and designing a stateless application logic, we can scale horizontally in the future.
*   **Strategic Data Flow:** The architecture mirrors a real-world marketing agency's workflow, ensuring that each step logically builds upon the previous one.

## 2. Directory Structure (`/src`)

/src
|-- auth/ # Handles user authentication (signup, login, JWT)
|-- business/ # Manages core business profiles
|-- creative/ # The "Creative Spark" engine for content generation (batch & stream)
|-- execution/ # The "Operations Room" with specialized AI experts (Content, Ads, etc.)
|-- generation/ # Low-level AI generation logic (currently being merged into other services)
|-- planning/ # The "Mastermind" engine for generating master marketing plans
|-- services/ # Shared services (Prisma, OpenAI, Gemini)
|-- strategy/ # The "Strategist Prime" engine for the Unified Strategic Blueprint
`-- index.ts # Main Express server entry point and middleware registration
Generated code
## 3. End-to-End Data Flow

1.  **Onboarding:** A `User` signs up and creates a `Business` profile.
2.  **Diagnosis:** The user triggers the `Strategy` module, which performs analysis and populates the `MarketAnalysis`, `BrandIdentity`, and `CustomerBlueprint` models.
3.  **Strategy:** The user triggers the `Planning` module, which uses the diagnosis data to create multiple `MarketingPlan` scenarios.
4.  **Execution:** The user selects a `MarketingPlan` and triggers the `Execution` module to generate a specialized, monthly plan (e.g., a `ContentExecutionPlan` for Month 1).
5.  **Creation:** The user selects tasks from the monthly plan and uses the `Creative` module to generate the actual content, either in a batch or as a live stream.

---