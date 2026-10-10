# Zira3i AI

Zira3i AI is a Vite + React frontend backed by an Express API. The API provides
plant diagnosis and chat through Google Gemini, weather data, irrigation
calculations, and IoT telemetry endpoints.

## Run locally

**Prerequisite:** Node.js `^20.19.0` or `>=22.12.0`.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` to your Google
   Gemini API key.
3. Start the app with `npm run dev`.

The development server runs the frontend and API together at
`http://localhost:3000`.

## Deploy to Vercel

1. Import this repository into Vercel, or run `vercel` from the project
   directory after logging in with `vercel login`.
2. Keep the detected Vite build settings: `npm run build` and `dist`.
3. Add `GEMINI_API_KEY` under the Vercel project's Environment Variables for
   each environment where Gemini-backed features should be enabled.
4. Deploy with `vercel --prod` for a production deployment.

The Express API is exposed as a Vercel serverless function in `api/`. Weather
and other non-Gemini endpoints do not require the Gemini key. Vercel Functions
have a 4.5 MB request-body size limit, so resize very large image uploads
before diagnosis.
