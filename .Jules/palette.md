
## 2024-06-27 - Disabled Buttons Swallowing Events
**Learning:** In React, disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning native tooltips won't appear directly.
**Action:** Wrap the disabled button in a `<span>` containing the `title` attribute. Apply `tabIndex={!canExport ? 0 : undefined}` on the wrapper conditionally to prevent a double tab-stop accessibility regression when the button is enabled. Use `display: inline-flex` (e.g., `className="inline-flex w-full"`) on the wrapper and `width: 100%` on the button to preserve flex/grid layout constraints.
