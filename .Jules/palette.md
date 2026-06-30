
## 2024-06-25 - Improve accessibility of disabled buttons
**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning tooltips (via the `title` attribute) on disabled buttons do not show up for users trying to understand why they are disabled.
**Action:** Wrap the disabled button in a `<span>` containing the `title` attribute, set `tabIndex={!canExport ? 0 : undefined}` on the span to make it focusable only when disabled, and use `inline-flex w-full` along with a `w-full` class on the button to preserve grid layout behavior.
