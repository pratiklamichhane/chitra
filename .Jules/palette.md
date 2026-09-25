## 2024-05-17 - Tooltips on disabled buttons
**Learning:** Native `title` tooltips don't work on disabled buttons because disabled elements do not trigger mouse events and cannot receive focus.
**Action:** Wrap disabled buttons in a `<span>` element with the `title` attribute. To preserve accessibility, add `tabIndex={0}` to the span only when the button is disabled, ensuring keyboard users can reach it. To prevent layout breakage in flex/grid containers, use `inline-flex`, `w-full` and `min-w-0` on the wrapper, and `w-full` on the button itself.
