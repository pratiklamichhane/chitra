## 2024-11-20 - Disabled Button Tooltips
**Learning:** Native `title` tooltips on disabled `<button>` elements do not appear because disabled HTML elements swallow mouse events. This prevents users from understanding why an action is disabled.
**Action:** Wrap the disabled button in a `<span>` containing the `title` attribute. Conditionally apply `tabIndex={!canExport ? 0 : undefined}` to the wrapper to prevent double focus-stops when the button becomes enabled. Apply layout preserving classes (like `inline-flex w-full`) to the span and `w-full` to the button to maintain UI structure.
