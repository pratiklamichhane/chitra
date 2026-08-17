## 2024-06-25 - Explaining Disabled Buttons
**Learning:** Disabled buttons drop out of the tab order and swallow pointer events, meaning native `title` tooltips won't show.
**Action:** Wrap disabled buttons in a `span` with the `title` attribute, and conditionally add `tabIndex={0}` to the span so keyboard users can still receive the explanatory tooltip.
