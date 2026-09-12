## 2024-05-18 - Tooltips on disabled buttons in CSS Grid/Flexbox
**Learning:** Adding a wrapper element (like a span) to a disabled button to surface a `title` tooltip can break CSS flex or grid layouts if not styled carefully.
**Action:** When wrapping buttons inside grid/flex layouts, ensure the wrapper uses `inline-flex w-full min-w-0` and the button uses `w-full` to preserve layout constraints and prevent overflow.

## 2024-05-18 - CI failures from seemingly unrelated files
**Learning:** Sometimes tasks can break due to strict typescript checks catching pre-existing issues when `pnpm build` is executed by GitHub CI. This is especially true for type issues inside `any` and third-party type definitions (like `driver.js`).
**Action:** Always make sure to resolve specific reported CI errors even in files unrelated to the UX feature, explicitly addressing type safety warnings to keep the build green.

## 2024-05-18 - Further SSR fixes for DOM usage
**Learning:** Sometimes the `document` object is used dynamically inside client interactions but the file itself is loaded in SSR. This happens primarily on utility functions (e.g. `exportUtils.ts`) or inside `useEffect` (which is technically client-only, but strict static typing/linting in some frameworks mandates it).
**Action:** When fixing DOM SSR issues in Next.js/Cloudflare Workers environments, ensure all functions using `document` have `if (typeof document === "undefined") return;` guards.
