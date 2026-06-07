## 2024-03-20 - Adding tooltips to disabled buttons
**Learning:** Improve UX for conditionally disabled buttons by explaining the disabled state using `title` attributes. Because `disabled` HTML elements swallow mouse events in many browsers, native tooltips won't appear directly on them. To fix this, wrap the disabled button in a `<span>` containing the `title` attribute, and use `style={{ display: 'inline-block' }}` to preserve layout and capture hover events.
**Action:** When adding `title` for disabled buttons, wrap them in a span wrapper.
