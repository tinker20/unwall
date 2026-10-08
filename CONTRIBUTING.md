# Contributing to Unwall

Thanks for helping. Unwall is small on purpose: one HTML file, no build step and no npm dependencies. A few ground rules keep it that way.

## The most useful contribution

Send an AI answer that still looks like a wall after you Unwall it. Open a [bug report](https://github.com/tinker20/unwall/issues/new?template=bug_report.yml) with the Markdown, say which chat it came from, and describe what you expected. Real answers are what improve the parser.

## Ground rules

- **Client-only.** Everything runs in the browser, and data stays in `localStorage`. Anything that needs a server has to be optional and fall back gracefully, the way short links do.
- **No AI in the core.** Unwall reshapes the answer's own Markdown and never rewrites it. Changes to that are a product decision, so open an issue first.
- **No build step.** Keep the app in `index.html`. If you need a library, load it from cdnjs or jsDelivr at a pinned version, and explain in the PR why a few lines of code wouldn't do.
- **Backward compatibility.** Shared links (`#d=`, `#add=`, `#topic~secret`) and saved libraries (`unwall.v1.docs`) are already out in the world. They must keep working.

For bigger changes, such as a new lens, a new share format or anything that touches storage, open an issue first so we can agree on the approach before you write the code.

## Development

You need Node.js 20.11 or later. There's nothing to install.

```bash
npm run dev
```

Then open http://127.0.0.1:4173.

Before you open a pull request:

1. **Run the self-test.** Open http://127.0.0.1:4173/#selftest and check that it says "Self-test passed". If you changed the analysis on purpose, update the expectations in `selfTest()` in the same PR.
2. **Check the UI.** Try light and dark themes, a phone-width window (about 375px), and keyboard navigation.
3. **Keep untrusted input sanitised.** Anything rendered from an answer, a link or an import must go through `mdHtml`, `inl` or `esc()`.

## Code style

Match the code around your change. The codebase uses dense, readable one-liners, `$` and `$$` for DOM queries, and short comments that explain *why* rather than *what*. Keep diffs focused on one change.

## Pull requests

- Use one topic per PR, with a clear title and a short description of the change and the reason for it.
- Include before and after screenshots for anything visual.
- Link the issue the PR fixes.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE). Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
