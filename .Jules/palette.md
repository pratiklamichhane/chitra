
## 2024-08-25 - Accessible Tooltips for Disabled Buttons
**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning native tooltips (`title` attribute) won't appear directly on them. This makes it impossible for screen reader and keyboard users to understand *why* a button is disabled.
**Action:** When adding tooltips to disabled buttons, wrap the button in a `<span>` containing the `title` attribute. Conditionally apply `tabIndex` to the wrapper (`tabIndex={isDisabled ? 0 : undefined}`) to allow keyboard focus when disabled, but prevent a double tab-stop when enabled. To maintain layout in flex/grid containers, ensure the wrapper has appropriate sizing classes like `inline-flex w-full min-w-0` and the inner button uses `w-full`.
