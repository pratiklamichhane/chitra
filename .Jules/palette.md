## 2024-05-18 - Tooltips for Disabled Buttons
**Learning:** Disabled HTML buttons swallow mouse events, preventing standard `title` attributes on the buttons themselves from showing tooltips when hovered. This makes it hard to communicate to users *why* an action is currently unavailable.
**Action:** Wrap the disabled button in a `<span>` containing the `title` attribute. To preserve layout (like in a grid or flex container), use `className="inline-flex w-full"` on the span and `className="w-full"` on the inner disabled button.
