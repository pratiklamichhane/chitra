## 2024-09-04 - Disabled buttons in grid layout
**Learning:** When adding tooltips to disabled buttons by wrapping them in a `span` (because disabled elements swallow hover/focus events), the wrapper can break flex or grid layouts if the child button originally dictated dimensions.
**Action:** Apply `className="inline-flex w-full min-w-0"` to the `span` wrapper and ensure the button has `w-full` to perfectly replicate the original layout behavior.
