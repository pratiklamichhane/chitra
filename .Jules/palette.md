## 2024-06-22 - Explain Disabled States with Tooltips
**Learning:** Disabled buttons drop out of the tab flow, hiding their \`title\` tooltips from keyboard users, and swallow mouse events so hover titles won't natively show for sighted users.
**Action:** Wrap disabled buttons in a \`<span title="..." tabIndex={isDisabled ? 0 : undefined}>\` element. Use \`className="inline-flex w-full"\` and make the button \`w-full\` if they are inside grid or flex layouts to ensure the button maintains its intended width.
