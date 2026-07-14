## 2026-07-14 - Explaining Disabled States for Layout Grids
**Learning:** When wrapping disabled buttons in a `<span>` to provide a tooltip via the `title` attribute, the wrapper can break flex/grid layouts if not styled correctly.
**Action:** Use `className="inline-flex w-full"` on the wrapper and ensure the inner button also has a `w-full` class to preserve the layout structure while ensuring the disabled tooltip is accessible via mouse hover and keyboard focus (when `tabIndex` is set).
