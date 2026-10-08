# Security Policy

Unwall renders content that comes from outside: pasted answers, shared links, bookmarklet payloads and imported backups. Problems like XSS, a link that wipes a visitor's library, or a short link that leaks its contents matter here.

## Reporting a vulnerability

Report it privately through GitHub. Don't open a public issue.

1. Go to the [Security tab](https://github.com/tinker20/unwall/security) of this repository.
2. Click **Report a vulnerability**.
3. Include the steps to reproduce. A proof-of-concept link or payload is ideal.

I aim to acknowledge reports within a few days. The fix ships to https://unwall.triagic.com as soon as it's ready, and you'll be credited in the advisory unless you'd rather not be.

## Scope

In scope:
- `index.html`, the app served at unwall.triagic.com
- `api/s.js`, the optional short-link store

Out of scope:
- The third-party CDNs and fonts the page loads
- The chat sites the bookmarklet runs on
- Issues that need a compromised browser or device

## Supported versions

Only the latest version on the `main` branch and the live site is supported.
