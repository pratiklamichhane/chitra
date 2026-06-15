## 2024-05-18 - Tooltips for disabled buttons in flex/grid layouts
**Learning:** Adding a title directly to a disabled button doesn't work because it swallows mouse events.
**Action:** Wrap disabled buttons in a `span` with `className="inline-flex w-full"` and apply `className="w-full"` to the button itself to maintain grid layouts and capture pointer events for tooltips. Added `tabIndex` for keyboard accessibility.
