## 2025-01-20 - Adding explicit disabled tooltips
**Learning:** Native disabled buttons swallow mouse events, so tooltips placed directly on them won't appear. Wrapping them in a span with a tabIndex is required to show a helpful message why a button is disabled, improving UX.
**Action:** When conditionally disabling buttons, wrap them in `<span title="..." tabIndex={0} className="inline-flex w-full">`. Need to ensure layout isn't broken by this span wrapper.
