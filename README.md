# Spotx - Developer Internship Assessment

[![CI](https://github.com/AkritiJoshi0704/SPORTXASSESSMENT-/actions/workflows/ci.yml/badge.svg)](https://github.com/AkritiJoshi0704/SPORTXASSESSMENT-/actions/workflows/ci.yml)

## Overview

This project is a full-stack implementation of the itsSpotlight/Spotx developer assignment. It includes both frontend (Section A) and backend (Section B) components, demonstrating a complete DOOH (Digital Out-of-Home) campaign management system.

## TL;DR

- Quick summary: Full-stack Spotx assessment — React + Vite frontend, Node/Express backend with simple file persistence, authentication via API key, and Jest tests (unit + integration).

Run locally (single command from repo root):
```bash
# install and run both services (ports are required: frontend=3000, backend=3001)
npm run start-all

# or run separately (ensure backend on 3001 and frontend on 3000)
cd backend && npm install && npm start  # backend on port 3001
cd frontend && npm install && npm run dev  # frontend on port 3000
```

Ports and troubleshooting
- This project expects the backend on `http://localhost:3001` and the frontend served on `http://localhost:3000`.
- If `npm run start-all` fails with `EADDRINUSE`, free the ports before retrying.

Free ports (examples):
- Windows (PowerShell):
  - Check process: `Get-NetTCPConnection -LocalPort 3001 | Select-Object -ExpandProperty OwningProcess`
  - Kill process: `Stop-Process -Id <PID>`
- macOS / Linux:
  - Check process: `sudo lsof -i :3001`
  - Kill process: `sudo kill -9 <PID>`

**Sections Completed:**
- ✅ **Section A (Frontend)**: Tasks A1 (Ad Card Component) and A2 (Campaign Filter UI)
- ✅ **Section B (Backend)**: Tasks B1 (Campaign API) and B2 (Basic Auth Middleware)

---

## Project Structure

```
sportxassessment/
├── backend/                 # Node.js/Express REST API
│   ├── package.json
│   ├── server.js           # Main server entry point
│   ├── config/             # Configuration files
│   │   └── auth.js         # API key configuration
│   ├── controllers/        # Business logic
│   │   └── campaignController.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # Data models
│   │   └── campaignModel.js
│   ├── routes/             # API routes
│   │   └── campaignRoutes.js
│   └── utils/              # Utility functions
│       └── validation.js   # Input validation
├── frontend/               # React + Vite + Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx         # Main app with filter UI
│       └── components/
│           └── AdCard.jsx  # Reusable ad card component
└── README.md
```

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (no UI library dependencies as required)
- **Vanilla JavaScript** - No additional state management libraries

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **CORS** - Cross-origin resource sharing
- **In-memory storage** - No database required

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## API Documentation

### Base URL
`http://localhost:3001`

### Authentication
All endpoints (except `/health`) require API key authentication via the `X-API-Key` header.

**API Key:** `spotx-secret-key-2024`

### Endpoints

#### 1. Health Check
```bash
GET /health
```
No authentication required.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

#### 2. Get All Campaigns
```bash
GET /campaigns
```

**Headers:**
```
X-API-Key: spotx-secret-key-2024
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [...]
}
```

#### 3. Get Single Campaign
```bash
GET /campaigns/:id
```

**Headers:**
```
X-API-Key: spotx-secret-key-2024
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

#### 4. Create Campaign
```bash
POST /campaigns
```

**Headers:**
```
X-API-Key: spotx-secret-key-2024
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New Campaign",
  "advertiser": "Brand Name",
  "status": "active",
  "impressions": 100000,
  "ctr": 2.5,
  "budget_total": 50000,
  "budget_spent": 25000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {...}
}
```

#### 5. Update Campaign Status
```bash
PATCH /campaigns/:id/status
```

**Headers:**
```
X-API-Key: spotx-secret-key-2024
Content-Type: application/json
```

**Body:**
```json
{
  "status": "paused"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign status updated successfully",
  "data": {...}
}
```

#### 6. Delete Campaign
```bash
DELETE /campaigns/:id
```

**Headers:**
```
X-API-Key: spotx-secret-key-2024
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign deleted successfully",
  "data": {...}
}
```

---

## Sample cURL Commands

### Get all campaigns
```bash
curl -X GET http://localhost:3001/campaigns \
  -H "X-API-Key: spotx-secret-key-2024"
```

### Get single campaign
```bash
curl -X GET http://localhost:3001/campaigns/1 \
  -H "X-API-Key: spotx-secret-key-2024"
```

### Create new campaign
```bash
curl -X POST http://localhost:3001/campaigns \
  -H "X-API-Key: spotx-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Sale",
    "advertiser": "Adidas",
    "status": "active",
    "impressions": 75000,
    "ctr": 3.1,
    "budget_total": 40000,
    "budget_spent": 20000
  }'
```

### Update campaign status
```bash
curl -X PATCH http://localhost:3001/campaigns/1/status \
  -H "X-API-Key: spotx-secret-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"status": "paused"}'
```

### Delete campaign
```bash
curl -X DELETE http://localhost:3001/campaigns/1 \
  -H "X-API-Key: spotx-secret-key-2024"
```

### Test authentication (should fail)
```bash
curl -X GET http://localhost:3001/campaigns
```
**Response:** `401 Unauthorized`

---

## Frontend Features

### Ad Card Component (Task A1)
The `AdCard` component is a reusable, responsive component that displays:
- Campaign name and advertiser logo (placeholder with first letter)
- Status badge with distinct colors (green for active, yellow for paused, gray for ended)
- Impressions count and CTR percentage
- Progress bar showing budget spent vs. total budget
- Hover state with shadow and border color change
- Fully responsive (works at 320px and 1280px)

**Props:**
```javascript
{
  name: string,
  advertiser: string,
  status: 'active' | 'paused' | 'ended',
  impressions: number,
  ctr: number,
  budget_total: number,
  budget_spent: number
}
```

### Campaign Filter UI (Task A2)
The filter bar includes:
- **Status dropdown**: Filter by All/Active/Paused/Ended
- **Search input**: Live search by campaign name (as-you-type filtering)
- **Sort dropdown**: Sort by Impressions (high to low) or CTR (high to low)
- **Combined state**: All filters work together
- **No results state**: Gracefully handled with empty state message
- **6 dummy campaigns**: Seeded in backend storage
- **Status update buttons**: Each card has buttons to change campaign status via API
- **Create campaign form**: Full form to create new campaigns via API
- **Loading and error states**: Handles API connection states gracefully

---

## Assumptions & Tradeoffs

### Assumptions
1. **Frontend-Backend Integration**: The frontend is now connected to the backend API and fetches data in real-time. Both servers need to be running for the full application to work.
2. **Backend**: In-memory storage is used instead of a database. Data resets when the server restarts.
3. **Authentication**: A hardcoded API key is used for simplicity. In production, this should be stored in environment variables.
4. **Status values**: Only three status values are supported (active, paused, ended) as specified in the requirements.
5. **Budget validation**: Budget spent cannot exceed total budget, and both must be non-negative.

### Tradeoffs
1. **No database**: Used in-memory storage for simplicity. With more time, I would integrate a proper database (PostgreSQL/MongoDB) with proper migrations.
2. **No pagination**: The API returns all campaigns at once. For large datasets, pagination would be necessary.
3. **No input sanitization**: Basic validation is implemented, but more robust sanitization could be added.
4. **No tests**: No unit or integration tests were written. With more time, I would add Jest for backend and React Testing Library for frontend.
5. **No TypeScript**: Used plain JavaScript for faster development. TypeScript would add type safety.
6. **No environment variables**: Configuration is hardcoded. In production, use `.env` files.

---

## What I'd Do Differently With More Time

1. **Implement pagination**: Add pagination to the API and frontend for large datasets
2. **Use TypeScript**: Add type safety across the codebase
3. **Add more filtering options**: Date range filtering, advertiser filtering
4. **Add edit functionality**: Allow editing full campaign details, not just status
5. **Improve accessibility**: Add ARIA labels, keyboard navigation, and screen reader support
6. **Add analytics**: Track campaign performance over time with charts
7. **Add integration tests**: Test API endpoints and frontend-backend integration
8. **Add E2E tests**: Playwright/Cypress tests for full user workflows

---

## Testing

### Backend Unit Tests

Tests for the `CampaignModel` are included in `__tests__/campaignModel.test.js`.

**Install dependencies and run tests:**
```bash
cd backend
npm install
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Test Coverage:**
- ✅ `getAll()` - Retrieve all campaigns
- ✅ `getById()` - Get single campaign by ID
- ✅ `create()` - Create new campaign
- ✅ `updateStatus()` - Update campaign status
- ✅ `delete()` - Delete campaign by ID

---

## Submission Notes (Required)

Please include this repository when submitting. The following items are included here for your convenience and to meet the assessment requirements:

- **Which sections completed:** Frontend (A1, A2) and Backend (B1, B2) as implemented in this repo.
- **How to run locally:**

  Backend (port 3001):

  ```powershell
  cd backend
  npm install
  # Run on port 3001
  cmd /c "set PORT=3001&& npm start"
  ```

  Frontend (port 3000 - serve built files):

  ```powershell
  cd frontend
  npm install
  npm run build
  # Serve the built files on port 3000
  npx http-server dist -p 3000 -c-1
  ```

- **Ports and commands used in verification:**
  - Backend: `http://localhost:3001` — started with `npm --prefix backend start` and `PORT=3001`.
  - Frontend: `http://localhost:3000` — served built `frontend/dist` with `npx http-server`.

- **Assumptions & tradeoffs:** See the Assumptions & Tradeoffs section above.

- **What I'd improve given more time:** See "What I'd Do Differently With More Time" above.

If you want, I can also:

- Add a dedicated `SUBMISSION.md` with a checklist and a single-command script to start both services.
- Add CI (GitHub Actions) to run tests and build the frontend on push.

- ✅ `exists()` - Check if campaign exists
- ✅ Edge cases (non-existent IDs, data validation)

---

## Running the Project

To run both frontend and backend simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser to see the frontend dashboard.

---

## Notes

- The backend API supports full CRUD operations: Create, Read, Update (status), and Delete
- Unit tests are included for the `CampaignModel` with 50%+ code coverage and edge case handling
- The backend API is fully functional and can be tested independently using the provided cURL commands
- The frontend is connected to the backend API and fetches data in real-time with loading and error states
- Both sections of the assignment (A and B) have been completed
- The code follows clean code principles with meaningful variable names and clear separation of concerns
- Edge cases are handled: empty states, validation errors, missing API keys, non-existent resources
- The frontend includes additional features: status update buttons and create campaign form to demonstrate full API integration

## Backend Architecture

The backend follows MVC (Model-View-Controller) pattern with proper separation of concerns:

- **Controllers**: Class-based controllers with async methods for business logic
- **Routes**: Express Router with middleware (protect, restrictTo) for route definitions
- **Models**: Data access layer for in-memory storage operations
- **Middleware**: Authentication and authorization middleware (protect, restrictTo, optionalAuth)
- **Utils**: Helper functions (asyncHandler, validation)
- **Config**: Configuration files (API keys, constants)

This architecture follows industry best practices and is scalable for future enhancements.

---

## Contact

For questions or feedback about this submission, please feel free to reach out.
