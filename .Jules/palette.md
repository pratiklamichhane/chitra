## 2024-05-30 - Tooltips for Disabled Buttons
**Learning:** Because `disabled` HTML elements swallow mouse events in many browsers, native tooltips won't appear directly on them. To fix this, wrap the disabled button in a `<span>` containing the `title` attribute, and use `style={{ display: 'inline-block' }}` to preserve layout and capture hover events.
**Action:** When adding tooltips to buttons that can be disabled, always wrap the button in a `<span>` to ensure the tooltip remains visible when the button is inactive.
