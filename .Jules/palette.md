## 2023-10-27 - Explicit ARIA Labels Required for Icon-Only Toolbar Buttons
**Learning:** Relying purely on the `title` attribute for icon-only toolbar buttons is insufficient for robust accessibility in screen readers (and violates WCAG SC 4.1.2 Name, Role, Value). Screen reader users need explicit `.aria-label`s on icon-only interactive elements to understand their purpose, especially in complex toolbars like zoom docks or topbar actions.
**Action:** Always add explicit `aria-label`s to `button` elements that only contain an icon, regardless of whether a `title` attribute is present.
