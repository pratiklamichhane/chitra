## 2026-08-08 - Disabled Button Tooltips Accessibility
**Learning:** Native `disabled` elements swallow mouse events and cannot receive keyboard focus, meaning `title` attributes or tooltips placed directly on them will not appear.
**Action:** Wrap disabled buttons in a `<span>` containing the `title` attribute. Apply `tabIndex={0}` conditionally on the wrapper only when the button is disabled to allow keyboard focus, and use `className="inline-flex w-full min-w-0"` (with `w-full` on the button itself) to preserve grid/flex layouts.
