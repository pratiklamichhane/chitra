## 2024-05-07 - Icon-only buttons lack ARIA labels
**Learning:** In React components using lucide-react icons for toolbars, many buttons rely only on the `title` attribute, which screen readers might not reliably announce compared to `aria-label`. This pattern is prevalent in the studio toolbars (cleanup, crop, export).
**Action:** Always add explicit `aria-label` attributes (often matching the `title` text) to any icon-only button to ensure robust screen reader support without relying on tooltips alone.
