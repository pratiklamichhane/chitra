## 2024-05-18 - Tooltips on disabled buttons in CSS Grid/Flexbox
**Learning:** Adding a wrapper element (like a span) to a disabled button to surface a `title` tooltip can break CSS flex or grid layouts if not styled carefully.
**Action:** When wrapping buttons inside grid/flex layouts, ensure the wrapper uses `inline-flex w-full min-w-0` and the button uses `w-full` to preserve layout constraints and prevent overflow.
