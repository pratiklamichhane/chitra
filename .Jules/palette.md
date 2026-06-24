## 2026-06-24 - [Add tooltips to disabled export buttons]
**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning native tooltips (`title` attribute) won't appear.
**Action:** Wrap disabled buttons in a `<span>` containing the `title` attribute. Crucially, apply `tabIndex` conditionally on the wrapper (e.g., `tabIndex={!canExport ? 0 : undefined}`) to prevent a double tab-stop accessibility regression when the button is enabled. Use inline-flex and w-full utility classes to preserve CSS grids.
