## 2024-07-07 - Form Accessibility: Disconnected Labels
**Learning:** Found a pattern in modal components (`SaveCustomerModal.tsx`) where `<label>` elements were visually placed near `<input>` fields but lacked programmatic association via `htmlFor` and `id` attributes. This breaks form accessibility for screen readers.
**Action:** Always ensure custom form groups explicitly link their labels and inputs using matching `htmlFor` and `id` attributes, rather than relying on visual proximity or generic wrapper classes.
