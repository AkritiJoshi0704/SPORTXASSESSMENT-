# Quick Start Guide

## One-Command Setup (Requires Two Terminals)

### Terminal 1: Backend
```bash
cd backend
npm install
npm start
```
Backend will run at `http://localhost:3001`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`

---

## Environment Setup (Optional)

Create `.env` files from the examples for custom configuration:

**Backend** (`backend/.env`):
```
API_KEY=your-custom-api-key
PORT=3001
NODE_ENV=production
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3001
VITE_API_KEY=your-custom-api-key
```

---

## Testing the API

**Get all campaigns:**
```bash
curl -X GET http://localhost:3001/campaigns \
  -H "X-API-Key: spotx-secret-key-2024"
```

**Missing API key (should fail):**
```bash
curl -X GET http://localhost:3001/campaigns
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` on frontend | Make sure backend is running on port 3001 |
| Port 3001 already in use | Change `PORT` in `backend/.env` or kill process on port 3001 |
| `Cannot find module` | Run `npm install` in both frontend and backend |
| CORS errors | Check that `cors` middleware is enabled in backend |

---

## Features Checklist ✅

- [x] Ad Card Component (responsive, hover state, all metrics)
- [x] Filter UI (status, search, sort, combined filters)
- [x] Campaign API (GET all, GET single, POST create, PATCH status)
- [x] Authentication middleware (API key validation)
- [x] Input validation (backend)
- [x] Error handling (frontend and backend)
- [x] No results state (frontend)
- [x] Loading indicator (frontend)
- [x] No UI library dependencies (Tailwind only)
- [x] Responsive design (320px - 1280px+)
- [x] Environment variables support
