# PermitFlow

PermitFlow is an AI-powered construction compliance and permit automation platform for contractors, architects, and municipal officers. It helps users review blueprint data, evaluate zoning and safety compliance, simulate permit workflows, and collaborate with multilingual AI assistance.

## What the app does

- AI-assisted blueprint analysis for construction projects
- Real-time compliance checks for zoning, fire safety, structural, and environmental requirements
- Permit workflow simulation with status tracking and approval/rejection scenarios
- Multilingual support with an assistant experience for Indian construction and municipal workflows

## Tech stack

- React 19 + TypeScript
- Vite for frontend development
- Express server for API and app hosting
- Tailwind CSS, lucide-react, and motion for UI
- Google Gemini API via @google/genai

## Quick start

### Prerequisites

- Node.js 18+ and npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file from the example:

```bash
copy .env.example .env.local
```

Then update the values in [.env.local](.env.local):

- GEMINI_API_KEY: required for Gemini-powered AI features
- APP_URL: optional app URL for hosted environments
- SARVAM_API_KEY: optional for translation and speech-related features

> If GEMINI_API_KEY is not set, the app falls back to rule-based demo behavior.

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available scripts

```bash
npm run dev     # start the development server
npm run build   # build the app for production
npm run start   # start the production build
npm run lint    # run TypeScript checks
```

## Project structure

- src/components: UI screens for landing, dashboard, wizard, officer/admin panels, and AI assistants
- src/types.ts: shared TypeScript interfaces
- server.ts: Express server and mock API routes
- vite.config.ts: Vite configuration

## Notes

This project includes a demo-style permit automation experience with mock project data and simulated municipal review flows for presentation and development purposes.
