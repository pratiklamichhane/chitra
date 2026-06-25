## 2026-06-25 - Explaining Disabled States
**Learning:** Users with screen readers or keyboard navigation cannot interact with `disabled` elements, making tooltips on them unreachable directly. Wrapping disabled buttons in a `<span>` with a conditional `tabIndex={0}` and `title` is an effective pattern for maintaining accessibility.
**Action:** Use conditional `tabIndex` and `title` on wrapper spans for disabled buttons, taking care to use `inline-flex w-full` to preserve the button layout.
