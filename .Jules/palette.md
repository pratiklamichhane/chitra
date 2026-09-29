## 2024-05-18 - [Tooltips on Disabled Buttons]
**Learning:** Native `title` attributes (tooltips) on disabled buttons are often suppressed by browsers because disabled elements swallow mouse/focus events.
**Action:** Wrap disabled buttons in a `span` with `title` and conditional `tabIndex={!condition ? 0 : undefined}`, and use layout utility classes (like `inline-flex w-full min-w-0`) to prevent layout shifts in CSS Grids.
## 2024-05-18 - [Next.js SSR Image Creation]
**Learning:** Instantiating `new window.Image()` or `new Image()` in Next.js components can cause silent SSR build failures on edge networks (like Cloudflare Workers) because `window` and `Image` globals are undefined.
**Action:** Use `document.createElement("img")` and precede it with an explicit SSR guard (`if (typeof document === "undefined") return;`) to safely instantiate native DOM images without crashing strict CI builds.
