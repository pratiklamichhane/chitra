## 2024-05-18 - [Tooltips on Disabled Buttons]
**Learning:** Native `title` attributes (tooltips) on disabled buttons are often suppressed by browsers because disabled elements swallow mouse/focus events.
**Action:** Wrap disabled buttons in a `span` with `title` and conditional `tabIndex={!condition ? 0 : undefined}`, and use layout utility classes (like `inline-flex w-full min-w-0`) to prevent layout shifts in CSS Grids.
