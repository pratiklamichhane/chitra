## 2026-07-18 - Tooltips for disabled buttons
**Learning:** Native `disabled` elements swallow mouse events and cannot receive keyboard focus, meaning tooltips (via `title` attribute) applied directly to them will not appear.
**Action:** Wrap the conditionally disabled button in a `<span>` containing the `title` attribute. Apply `tabIndex={!canEnable ? 0 : undefined}` conditionally on the wrapper to prevent double tab-stops when enabled. Use `inline-flex w-full` on the wrapper and `w-full` on the button for proper grid layout.
