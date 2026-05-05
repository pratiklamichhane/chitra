## 2024-05-05 - Icon-only Buttons Missing Screen Reader Support
**Learning:** Found an accessibility issue pattern across the app where icon-only controls (like zoom controls, export actions, and crop resets) rely solely on `title` attributes. While `title` provides a mouse tooltip, it is inconsistently announced by screen readers depending on the user's verbosity settings and the specific browser/screen reader combination.
**Action:** Always add explicit `aria-label` attributes to icon-only buttons to ensure reliable accessible names, even if a `title` attribute is present for sighted users.
