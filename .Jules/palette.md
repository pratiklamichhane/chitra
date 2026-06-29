
## 2026-06-29 - Tooltips on disabled buttons
**Learning:** Disabled HTML elements swallow pointer events and cannot receive keyboard focus, meaning native `title` attributes on them will not appear.
**Action:** Wrap disabled buttons in a `<span class="inline-flex" title="...">` wrapper. Ensure you only set `tabIndex={0}` on the wrapper *when* the button is actually disabled, to prevent double tab-stops when it is enabled.
