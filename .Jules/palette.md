## 2026-06-11 - [Tooltips for Disabled Buttons]
**Learning:** Native tooltips do not appear on disabled HTML elements because they swallow mouse events. Wrapping disabled buttons in a `<span>` element with the `title` attribute allows the tooltip to be visible, but requires matching layout classes to preserve flex and grid spacing.
**Action:** When adding tooltips to disabled buttons, wrap them in a `<span title="...">`, ensuring the wrapper has `display: inline-flex` and both elements have appropriate sizing classes like `w-full` to capture hover events without breaking layouts.
