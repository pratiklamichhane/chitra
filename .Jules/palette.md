
## 2024-06-04 - UX Tooltips for disabled icons
**Learning:** Adding explanation tooltips on disabled icon buttons improves UX by letting users know *why* an action is not available (e.g. "Process a photo to enable export"). However, `disabled` buttons swallow pointer events in React/HTML, preventing native tooltips from showing.
**Action:** Wrap disabled buttons in a `<span title="..." style={{ display: 'inline-block' }}>` block to capture the hover event and show the tooltip, and add explicit `aria-label` to the button for screen-readers.
