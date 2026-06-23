## 2024-05-18 - [Add Tooltip and Focus to Disabled Export Buttons]
**Learning:** Disabled buttons in the Export Panel lack context for why they are disabled and also are skipped in tab order, creating accessibility issues.
**Action:** Wrap disabled buttons in a `<span>` element with a conditionally applied `title` describing the requirement, and conditionally add `tabIndex={0}` to the span when the button is disabled to make it focusable by screen readers and keyboards. Applied necessary grid/flex classes (`inline-flex w-full`) to maintain the layout.
