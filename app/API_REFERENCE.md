# CMO-Prime: API Reference

## Authentication

All endpoints (except `/api/auth/signup` and `/api/auth/login`) are protected. You must include an `Authorization` header with a Bearer Token.
`Authorization: Bearer <YOUR_JWT_TOKEN>`

## Main Workflow Endpoints

### 1. Generate Master Plans
Generates 3 strategic marketing plan scenarios for a business.
*   **Endpoint:** `POST /api/planning/:businessId/generate-plan`
*   **Body:** None
*   **Response:** `201 Created` with an array of 3 `MarketingPlan` objects.

### 2. Generate Monthly Content Plan
Generates a detailed, 30-day content plan for a specific month.
*   **Endpoint:** `POST /api/execution/marketing-plan/:marketingPlanId/content-plan`
*   **Body:**
    ```json
    {
      "month": 1
    }
    ```
*   **Response:** `201 Created` with the newly created `ContentExecutionPlan` object.

### 3. Generate Content (Batch Mode)
Generates multiple content pieces for various tasks/variations and saves them to the DB.
*   **Endpoint:** `POST /api/creative/content-plan/:contentPlanId/generate-batch`
*   **Body:**
    ```json
    {
      "taskIds": ["w1d1", "w1d2"],
      "variationsPerTask": 2,
      "userInput": { "tone": "inspirational" }
    }
    ```
*   **Response:** `201 Created` with an array of the saved `GeneratedContent` objects.

### 4. Generate Content (Stream Mode)
Generates a single piece of content as a real-time stream for interactive UX.
*   **Endpoint:** `POST /api/creative/content-plan/:contentPlanId/generate-stream`
*   **Body:**
    ```json
    {
      "taskId": "w1d3",
      "variationNumber": 1,
      "totalVariations": 1
    }
    ```
*   **Response:** A text/event-stream response with content chunks.

---