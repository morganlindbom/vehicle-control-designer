# vehicle-control-designer

Visual Vehicle Control Unit Designer for RP2350 and Raspberry Pi Pico 2.

## Project Structure

- `frontend/` - React app built with Vite
- `backend/` - Express API for projects, templates, components, and connections

## Requirements

- Node.js 20 or later
- npm

## Install

Install dependencies from the repository root and from each app folder:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Run Everything From Root

Start the frontend and backend together from the repository root:

```bash
npm run dev
```

This uses `concurrently` to run both services in parallel.

## Run Each App Separately

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

## Notes

- The frontend uses Vite and will pick another available port if `5173` is already in use.
- The backend API runs with Express and serves the project data used by the dashboard.
