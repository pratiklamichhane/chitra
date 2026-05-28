## 2024-05-28 - Dynamic tooltips for disabled actions
**Learning:** Conditionally disabled buttons without an explanation can lead to user confusion about how to enable them, especially for core actions like Export or Print.
**Action:** When conditionally disabling a button based on application state, add a dynamic `title` attribute that clearly explains the reason for the disabled state and what the button does when enabled (e.g., `title={canExport ? 'Export' : 'Process photo to export'}`).
