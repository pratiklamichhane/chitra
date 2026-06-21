## 2024-06-21 - Tooltips for disabled buttons
**Learning:** Disabled elements swallow mouse events and cannot receive keyboard focus natively, making them inaccessible for tooltips.
**Action:** Wrap disabled buttons in a `<span>` with the `title` attribute. Conditionally set `tabIndex={0}` only when the inner button is disabled to avoid double tab-stop accessibility regressions. If the element is within a flex or grid layout, apply `className="inline-flex w-full"` to the wrapper and `w-full` to the inner button to preserve layout.
