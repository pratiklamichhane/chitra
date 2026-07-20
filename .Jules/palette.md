## 2024-05-19 - Driver.js Type Errors in StudioApp
**Learning:** The `side` property in `driver.js` `Popover` configuration cannot be set to `"over"`. Valid values are limited to `"top" | "right" | "bottom" | "left"`. Using invalid types like `"over"` will fail the Next.js production build (`pnpm build`).
**Action:** When creating tours or tooltips with `driver.js`, ensure the `side` parameter strictly adheres to the allowed `"top" | "right" | "bottom" | "left"` types to pass strict TypeScript compilation during the build process.
