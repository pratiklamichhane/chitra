
## 2024-06-25 - Improve accessibility and clarity of disabled icon-only buttons
**Learning:** For conditionally disabled buttons, especially icon-only ones, it's crucial to provide both screen-reader accessibility (`aria-label`) and visual/hover explanations (`title`). Conditionally disabled buttons often leave users wondering *why* they can't click them. A dynamic `title` provides context (e.g., "Upload a photo to export").
**Action:** When adding disabled states to buttons, always evaluate if a dynamic `title` would help clarify the required action. Remember to pair this with `aria-label` for icon-only buttons, but avoid `aria-label` when visible text is already present.
