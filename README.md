# mao

Desktop prototype for a focused Mandarin conversation path. It includes onboarding, a short placement check, the home screen, a phrasebook, and a curated Level 1 flow. Speaking practice records a short clip and uses Cloudflare Workers AI to transcribe it. Progress is stored in the browser.

The React app runs alongside a local Cloudflare Worker API. The Worker exposes `GET /api/health` and `POST /api/transcribe`. Recordings are sent to the Worker for transcription and are not stored. Transcription checks recognized words, not pronunciation or tones. The approved phrase samples remain local static files; no database is connected yet.

## Run locally

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite. Run `npm run build` to check the production build.

The local API health check is available at `http://localhost:5173/api/health`.

To try speaking practice, open Level 1 in Chrome on localhost, click the microphone, allow access, say the phrase, and click the microphone again. The Worker uses the remote AI binding in `wrangler.jsonc`, so transcription requests use your Cloudflare Workers AI allocation.
