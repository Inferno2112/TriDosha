# TriDosha — dev & testing notes

## Stack
- Vite 8 + React 19 SPA, JavaScript (not TypeScript). Tailwind v4 via `@tailwindcss/vite`. Routing via `react-router-dom` v7.
- **No standalone backend.** The single server-side concern is `/api/chat` (Gemini chat), implemented as a Web-Fetch-style handler in `api/chat.js`. The same file works as a Vercel serverless function in production and is mounted during `npm run dev` by `vite-plugins/api-plugin.js`.

## Local dev
```bash
cp .env.example .env     # fill in GOOGLE_GENERATIVE_AI_API_KEY
npm install
npm run dev              # http://localhost:5173, /api/chat auto-mounted
```
- `npm run lint` — must stay at 0 errors. The flat ESLint config has a separate section exposing Node globals to `vite.config.js`, `vite-plugins/**`, and `api/**`; `eslint-plugin-react`'s `jsx-uses-vars` is enabled so JSX-only references (e.g. `<motion.div/>`) aren't flagged.
- `npm run build` — production build must succeed. The bundle is ~1.1 MB gzipped ~300 KB; the existing chunk-size warning is pre-existing and not a regression.
- Pre-commit hooks: none. Husky not installed.

## Required secrets
- `GOOGLE_GENERATIVE_AI_API_KEY` — server-side only. Read by `@ai-sdk/google` (`x-goog-api-key` header). **Never** prefix with `VITE_` — `VITE_*` would be inlined into the client bundle. Generate at https://aistudio.google.com/app/apikey.
- `vite.config.js` copies all non-`VITE_`-prefixed `.env` values into `process.env` so the serverless handler can read them during `npm run dev`.

## Auth model (demo-grade)
- `/login` accepts any email+password and writes `{ email }` to `localStorage.user`. `ProtectedRoute` gates routes on the mere presence of that key. Good enough for dev and testing — do not trust for production.
- Protected routes today: `/dashboard`, `/chat`.

## How to verify the AI chat feature end-to-end
These checks distinguish a working chat from a broken one (e.g. a non-streaming shortcut or a leaked key). Run them whenever touching the chat API, the Vite plugin, the model config, or the Chat UI.

1. **Streaming shape — the sharpest distinguisher.** A broken / non-streaming implementation would return a single JSON blob. Live-probe from the browser console while on `/chat`:
   ```js
   const r = await fetch('/api/chat', { method: 'POST', headers: {'content-type':'application/json'},
     body: JSON.stringify({ messages: [{ id:'1', role:'user', parts:[{type:'text',text:'hi'}] }] }) });
   console.log(r.status, r.headers.get('content-type'));
   // expect: 200, text/event-stream
   // body should contain multiple lines starting with: data: {"type":"text-delta", ...
   ```
2. **Context handoff.** Monkey-patch `window.fetch` before sending a follow-up, capture `init.body`, and assert the `messages` array length is ≥ 3 and alternates roles (`user,assistant,user,…`). If the follow-up request body has length 1, the UI is resetting history.
3. **Key leakage.** In the browser console on `/chat`:
   ```js
   const scripts = await Promise.all([...document.scripts].map(s => s.src ? fetch(s.src).then(r=>r.text()).catch(()=>'') : s.textContent||''));
   const hits = (scripts.join('\n').match(/AIza[A-Za-z0-9_-]+/g) || []).length;
   console.log('bundleAIzaMatches=', hits); // must be 0
   ```
   Also check the Network tab: the `POST /api/chat` request must NOT contain the key in any header or in the body; the body must only contain `messages`.
4. **Stop button.** Send a prompt that produces a long response (e.g. "Write a detailed 500-word essay on …"), click **Stop** as soon as the button appears, wait 15s, and assert the assistant bubble did not grow further. If tokens keep arriving, `useChat`'s `stop()` isn't wired.
5. **System prompt wired.** For the prompt "What are the three doshas?", the reply must mention at least two of `Vata`, `Pitta`, `Kapha`. If the reply is generic / not Ayurveda-flavored, the `TRIDOSHA_SYSTEM_PROMPT` constant in `api/chat.js` isn't being passed through.

## Known pre-existing quirks (not regressions)
- `src/utils/api.js` points at `http://localhost:5001/api`, which is not implemented in this repo. The Dashboard's "API Status" cards show "Loading…" permanently and the browser console logs `TypeError: Failed to fetch`. Unrelated to `/chat`.
- Sidebar links `/symptoms`, `/reports`, `/history`, `/settings` exist but the pages do not — they route to the fallback `<Navigate to="/" />` catch-all.

## Useful references
- AI SDK Google provider docs: https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
- AI SDK `useChat` transport layer: https://v5.ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat
