## 2024-03-24 - Tooltips on disabled buttons inside grid layouts
**Learning:** Adding a wrapper span around a disabled button to provide a tooltip (`title` and `tabIndex`) can break CSS grid layouts (like `.export-grid`) if the wrapper doesn't inherit full-width characteristics.
**Action:** Always add `className="inline-flex w-full min-w-0"` to the wrapper span and `className="w-full"` (or equivalent flex-grow classes) to the button itself when applying this accessibility pattern inside flex or grid containers.
