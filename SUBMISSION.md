# Submission Notes

This file summarizes what to include when submitting the assessment and provides a single-command helper to start both services for local verification.

## Completed Sections
- Frontend: Task A1 (Ad Card Component) and Task A2 (Campaign Filter UI)
- Backend: Task B1 (Campaign API) and Task B2 (Basic API key auth middleware)

## How to run locally (single command)

1. Build the frontend and then start both services with the helper script:

```powershell
# from repository root (Windows PowerShell)
cd frontend
npm install
npm run build
cd ..
npm install
npm run start-all
```

This will:
- Start the backend API on `http://localhost:3001`
- Serve the built frontend on `http://localhost:3000`

Or run the services individually (recommended when developing):

Backend (port 3001):
```powershell
cd backend
npm install
# start on port 3001
cmd /c "set PORT=3001&& npm start"
```

Frontend (port 3000 - serve built files):
```powershell
cd frontend
npm install
npm run build
npx http-server dist -p 3000 -c-1
```

## Data persistence
- Campaigns are persisted to `backend/data/campaigns.json` so creating or updating campaigns from the frontend will persist between server restarts.

## CI
- A GitHub Actions workflow is included to run backend tests and build the frontend.

## Assumptions and tradeoffs
See README.md for details.

## GitHub
Please push this repository to your GitHub account and include the link in the submission. Optionally, provide branch or access details if the repo is private.
