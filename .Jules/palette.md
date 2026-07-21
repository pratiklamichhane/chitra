## 2024-07-21 - Accessible Disabled Tooltips
**Learning:** Disabled elements swallow mouse and keyboard events, meaning native `title` tooltips and focus states won't work on them.
**Action:** Wrap disabled buttons in a `<span>` with `title` and conditionally apply `tabIndex={0}` to the span only when the button is disabled. If the layout is flex/grid, use `className="inline-flex w-full"` on the wrapper to maintain layout.
