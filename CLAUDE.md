# Unwall

A single-file web app. You paste an AI answer written in Markdown and get a digest with four lenses: Overview, Cards, Read and Story. The repo is public under MIT, and the live site is https://unwall.triagic.com.

## Product rules

These rules are the product, not style preferences. Get the maintainer's explicit OK before changing one.

- **Client-only.** Everything runs in the page, and data persists only in `localStorage`. A server feature can ship only as an optional add-on with a client fallback, the way `api/s.js` short links fall back to long `#d=` links.
- **Deterministic.** The digest reshapes the answer's own Markdown, so every word it shows comes from the original. The core makes no LLM or API calls.
- **One file, no build.** `index.html` holds all the markup, CSS and JS. Libraries load from cdnjs or jsDelivr through pinned `<script>` tags. There are no npm dependencies and no bundler.

## Map

Each section of `index.html` opens with a `/* ============ name ============ */` banner. Grep for that banner to get the outline.

The pipeline runs `normalize` → `deFluff` → `analyze`. `analyze` lexes with marked, splits into sections, calls `kindOf` and `keyIdeas`, and builds the TL;DR with `lede`. The lens renderers then draw the result: `renderOverview`, `renderCards`, `renderRead` and `openStory`.

## Invariants

- **Sanitise at render.** Markdown becomes HTML only through `mdHtml` or `inl`, which run DOMPurify with `PURIFY`. Every other value interpolated into a template literal goes through `esc()`. Shared links and bookmarklet payloads are attacker-controlled input.
- **Measure the real layout.** Cards and Story pages are paginated by measuring the real DOM with `paginate()`. They are re-measured on resize and when fonts load. Summaries are cut at whole sentences with `lede()`.
- **Keep the bookmarklet self-contained.** `grabAnswer` is serialised to a `javascript:` link and runs on the chat site itself. It uses only its own locals and DOM methods: chat-site CSP blocks external scripts, and Trusted Types blocks `innerHTML` writes. The selectors are verified on public share pages:
  - ChatGPT: `[data-message-author-role=assistant]`
  - Claude: `.font-claude-response`
  - Gemini: `message-content`

  Keep new selectors that specific. `[class*=markdown]` once matched Gemini's page wrapper and grabbed the whole page.
- **Links in the wild keep working.** Shared links and saved libraries already exist, so extend these formats in backward-compatible ways only:
  - `#d=`: the deflated answer
  - `#add=`: bookmarklet HTML
  - `#topic~<14-char secret>`: an encrypted short link
  - the `unwall.v1.docs` storage key
- **Imports are untrusted.** Backups and `.md` files pass through `docFrom()`, which re-derives or type-checks every field.

## Verify

1. Run `npm run dev` and open http://127.0.0.1:4173/#selftest. A toast should say "Self-test passed".
2. The self-test asserts on the built-in examples `#ex-salary` and `#ex-db`. If an intended analysis change moves a result, update the expectation in `selfTest()` in the same change.
3. For UI changes, check light and dark themes and a 375px-wide viewport.

## Style

Match the code around your change: dense one-line helpers, `$` and `$$` for DOM queries, and short comments that explain why. Production deploys only `index.html`.
