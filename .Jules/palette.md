## 2024-06-25 - Explanatory Tooltips for Disabled States
**Learning:** Users can be confused by disabled buttons if there's no feedback on *why* they are disabled or what they need to do to enable them. Conditionally adding tooltips that explain the disabled state (e.g., "Process an image first to export") significantly improves UX by providing actionable feedback.
**Action:** When implementing conditionally disabled buttons, add a dynamic `title` attribute that explains the reason for the disabled state and what the button does when enabled.
