## 2024-06-28 - Tooltips for Disabled Buttons
**Learning:** Disabled HTML elements swallow mouse events and cannot receive keyboard focus, meaning native `title` tooltips won't appear for disabled buttons. This is bad for UX as users don't know *why* an action is disabled.
**Action:** Wrap conditionally disabled buttons in a `<span className="inline-flex">` with the `title` attribute, and apply `tabIndex={!isEnabled ? 0 : undefined}` so it's focusable by keyboard only when the button itself isn't. Added explicit `aria-label`s to icon-only buttons while at it.
