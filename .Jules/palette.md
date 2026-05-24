## 2026-05-24 - Accessibility & CI Strictness
**Learning:** Cloudflare Workers CI builds in this repo fail on *any* ESLint/TypeScript warning or error. This makes it critical to resolve or suppress seemingly minor issues (like unused variables, next/image warnings, set-state-in-effect hook warnings, and 'any' types in catch blocks).
**Action:** Always fix or suppress all lint warnings across the codebase during any UX or a11y task to ensure the build passes cleanly.
