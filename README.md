
# Cville Travel Companion — Frontend (Next.js App Router)

**One-liner:** MCP-enabled, beer-savvy travel companion for Charlottesville—nicknamed “Sam”—with chat, voice, and live tap-list summaries.

## Stack
- **Next.js App Router** (`app/`)
- **Tailwind CSS** via `@tailwindcss/postcss`
- Client chat UI + optional TTS playback
- Talks to the backend via `NEXT_PUBLIC_BACKEND_URL`

---

## Env

Create `.env.local`:

```

```bash
app/
  layout.tsx
  page.tsx                 # main app (onboarding → chat/voice)
  404/page.tsx             # optional custom 404
  not-found.tsx            # optional fallback
screens/
  onboarding/OnboardingFlow.tsx
  chat/ChatScreen.tsx
  chat/VoiceChatScreen.tsx
styles/
  globals.css
tailwind.config.js
postcss.config.js
```
Deploy (Render)
Start: uvicorn main:app --host 0.0.0.0 --port $PORT

Architecture
Frontend → /chat → OpenAI ↘ tools: /breweries, /restaurants, /speak

## Known issues
Tap-list delay (first request). Working on caching + headless fetch + JSON feed detection.

“There” follow-ups: session memory stores the last brewery to avoid calling every taplist.

Render port binding: use 0.0.0.0 + $PORT.

Roadmap
Cache, Playwright, STT, narrowed CORS.

License
MIT
'''
bash
git add README.md
git commit -m "docs: add MCP-enabled backend README (endpoints, setup, deploy, known issues)"
git push -u origin docs/readme
gh pr create -t "docs: backend README" -b "Add MCP-enabled overview, endpoints, setup/deploy, known issues (tap-list delay) and roadmap."
'''
