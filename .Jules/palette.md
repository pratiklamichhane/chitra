
## 2023-10-24 - Native Tooltips on Disabled Elements
**Learning:** Disabled HTML elements (like `<button disabled>`) swallow mouse events and cannot receive keyboard focus, meaning native tooltips (`title` attribute) won't appear directly on them. This makes it hard to explain *why* a button is disabled to a user.
**Action:** Wrap the disabled button in a `<span>` containing the `title` attribute. Crucially, apply `tabIndex` conditionally on the wrapper (e.g., `tabIndex={!canExport ? 0 : undefined}`) to prevent a double tab-stop accessibility regression when the button is enabled. If within a flex/grid layout, ensure the wrapper preserves layout using `inline-flex w-full min-w-0` and the button uses `w-full`.
