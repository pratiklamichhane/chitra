## 2024-05-18 - Improve Disabled Button UX
**Learning:** Users often get stuck when action buttons (like Export) are disabled without explanation.
**Action:** Always add dynamic `title` attributes (tooltips) to conditionally disabled buttons, explaining *why* they are disabled (e.g., "Upload an image to enable export") and what they do when enabled.