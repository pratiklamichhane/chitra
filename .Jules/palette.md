## 2026-05-06 - Adding ARIA labels to icon-only buttons
**Learning:** This app heavily uses `lucide-react` icons inside `button` tags without text content. Many of these buttons had `title` attributes for tooltips but lacked `aria-label` attributes, which are essential for screen reader accessibility.
**Action:** Always ensure icon-only buttons have explicit `aria-label` attributes that match or expand upon their visual function, even if a `title` attribute is present.
