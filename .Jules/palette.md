## 2024-05-19 - Adding title to disabled buttons
**Learning:** Disabled elements don't receive focus or mouse events natively, so tooltips won't show.
**Action:** Wrap disabled elements in a `<span title="..." tabIndex={!enabled ? 0 : undefined}>` to explain their disabled state and ensure they're accessible. Make sure to use flex layout properties if they are inside grid or flex layouts to preserve styling.
