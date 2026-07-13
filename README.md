# PermitFlow 🚧

PermitFlow is an AI-powered construction compliance and permit automation platform designed for contractors, architects, and municipal officers. It helps users turn complex construction blueprints into clear compliance insights, faster permit decisions, and smoother approval workflows.

## 🌟 What this project does

PermitFlow makes the permit process easier by combining AI with a simple dashboard experience:

- 🏗️ AI-assisted blueprint analysis for construction projects
- ✅ Real-time compliance checks for zoning, fire safety, structural, and environmental requirements
- 📋 Permit workflow simulation with status tracking and approval/rejection scenarios
- 🗣️ Multilingual support for Indian construction and municipal use cases
- 🤖 Smart assistant experience that helps users understand next steps quickly

## 🧰 Tech stack

- React 19 + TypeScript
- Vite for fast frontend development
- Express server for API and app hosting
- Tailwind CSS, lucide-react, and motion for modern UI experience
- Google Gemini API via @google/genai

## ▶️ Quick start

### Prerequisites

- Node.js 18+ and npm

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a local environment file from the example:

```bash
copy .env.example .env.local
```

Then update the values in [.env.local](.env.local):

- GEMINI_API_KEY: required for Gemini-powered AI features
- APP_URL: optional app URL for hosted environments
- SARVAM_API_KEY: optional for translation and speech-related features

> If GEMINI_API_KEY is not set, the app will still run in a rule-based demo mode.

### 3. Run the app locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## ⚙️ Available scripts

```bash
npm run dev     # start the development server
npm run build   # build the app for production
npm run start   # start the production build
npm run lint    # run TypeScript checks
```

## 📁 Project structure

- src/components: landing page, dashboard, project wizard, officer/admin panels, and AI assistant views
- src/types.ts: shared TypeScript interfaces
- server.ts: Express server and mock API routes
- vite.config.ts: Vite configuration

## 📝 Notes

This project includes a demo-style permit automation experience with sample project data and simulated municipal review flows for presentation and development purposes.

## 🚀 Future improvements

The journey of PermitFlow is just beginning. Future upgrades may include deeper government regulation integration, real document upload workflows, smarter AI scoring, and a more complete end-to-end permit management experience.

Built with ❤️ by Tanya, Prerna, and Kritika.
