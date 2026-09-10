## 2024-03-24 - Tooltips on disabled buttons inside grid layouts
**Learning:** Adding a wrapper span around a disabled button to provide a tooltip (`title` and `tabIndex`) can break CSS grid layouts (like `.export-grid`) if the wrapper doesn't inherit full-width characteristics.
**Action:** Always add `className="inline-flex w-full min-w-0"` to the wrapper span and `className="w-full"` (or equivalent flex-grow classes) to the button itself when applying this accessibility pattern inside flex or grid containers.
## 2024-03-24 - driver.js popover typings
**Learning:** When using `driver.js` for tours or popovers, the `side` property in the `Popover` configuration must strictly use the predefined types (`"top" | "right" | "bottom" | "left"`). Using invalid string literals like `"over"` will bypass standard runtime errors but cause strict TypeScript compilation to fail during `pnpm build`.
**Action:** Always verify library-specific string literal types (e.g., placement/alignment props) against the library's TypeScript definitions instead of guessing, especially when migrating or updating dependencies.
