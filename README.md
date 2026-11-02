# ChaosForge AI

**Your chat. Their chaos. One legendary stream.** ChaosForge turns Twitch chat requests into animated, safe visual events for a transparent OBS browser source.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then try `/dashboard`. The dashboard demo works without Twitch or OpenAI credentials. Use the event buttons to send demo events into the embedded overlay.

## Configure Twitch and AI

Set these values in `.env.local` (or in Vercel project environment variables):

```env
NEXT_PUBLIC_TWITCH_CHANNEL=your_channel_name
OPENAI_API_KEY=your_openai_api_key
```

The channel is a Twitch username without `#`. The overlay connects to public Twitch IRC from the browser using anonymous read-only access. A live channel is required to see real chat commands; viewers can use `!chaos <request>`, `!vote <option>`, and `!help`. Chaos commands have an 8-second per-viewer cooldown and a 300-character input cap. Voting is local to that overlay instance and lasts 30 seconds; this lightweight MVP accepts free-text options and counts one current vote per username.

The server-side `POST /api/chaos` endpoint uses the OpenAI Node SDK (`gpt-4o-mini`) when `OPENAI_API_KEY` is set. The result is checked against a Zod schema and a fixed event preset list. No model output is executed as HTML, JavaScript, or CSS. If the key is absent or the AI request fails, a deterministic keyword fallback keeps events working. Do not put `OPENAI_API_KEY` in a `NEXT_PUBLIC_` variable or commit `.env.local`.

## OBS setup

1. Start the app or deploy it to Vercel.
2. In OBS, add a **Browser Source** and set its URL to `https://your-deployment/overlay?channel=your_channel_name`.
3. Set width to **1920**, height to **1080**. The page background is transparent while idle.
4. In Dashboard, use the controls and preview to try the ten event presets.

The dashboard's preview uses `?demo=1`; its test buttons send events by `postMessage` to the same-origin iframe. The direct overlay works independently in OBS and listens to real chat. `?demo=1` labels the page as a demo; demo messages are not represented as real Twitch chat. Dashboard preview changes use the Twitch channel query parameter.

## Commands

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Deploy to Vercel

Import this repository in Vercel, set `OPENAI_API_KEY` (optional) and `NEXT_PUBLIC_TWITCH_CHANNEL` (optional) as environment variables, then deploy. The AI route is server-side; the Twitch IRC connection runs in the viewer's browser, so no persistent server process or event bus is needed. The app does not require a database or Twitch login.

## Current MVP boundaries

- Twitch read-only chat connection is real when a valid public channel is configured and reachable.
- Dashboard preview events are local demo controls. Separate OBS browser sources and dashboard instances do not share an event bus.
- `!vote` opens a simple per-overlay local poll, with per-username vote replacement; there is no persistent vote round or cross-instance synchronization.
- The cooldown selector is exposed in the dashboard UI; the chat overlay currently enforces an 8-second per-user command cooldown.
- Add a valid OpenAI key to enable model interpretation. Without it, keyword fallback remains available.
