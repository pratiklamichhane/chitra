## 2024-05-24 - Explain Disabled Buttons
**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, so native tooltips won't appear directly.
**Action:** Fix this by wrapping the disabled button in a `<span>` containing the `title` attribute. Apply `tabIndex` conditionally (e.g., `tabIndex={!disabled ? undefined : 0}`) on the wrapper to allow focus when disabled but prevent a double tab-stop when enabled. Also ensure layout properties like `inline-flex` or `w-full` are preserved.
