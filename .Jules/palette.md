## 2024-05-30 - Tooltips on Disabled Buttons

**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning users won't see native tooltips explaining why a button is disabled. This degrades both UX and accessibility.

**Action:** Wrap conditionally disabled buttons in a `<span>` containing the `title` attribute. Apply `tabIndex={!canExport ? 0 : undefined}` on the wrapper to allow hover tooltips and keyboard focus when disabled, while preventing a double tab-stop accessibility regression when the button is enabled. If within a flex/grid layout, ensure the wrapper has `display: inline-flex` (e.g., `className="inline-flex w-full min-w-0"`) and the button spans the full width (e.g., `className="w-full"`) to preserve layout structure.
