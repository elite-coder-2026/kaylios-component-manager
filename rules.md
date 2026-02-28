# Objective
Create 4 reusable React button components with consistent sizing/typography and clear visual variants, implemented with `styled-components`.

# Deliverables
- `PrimaryButton.js`
- `SecondaryButton.js`
- `InfoButton.js`
- `ErrorButton.js`

# Technical Requirements
- React 17+ functional components only (no class components).
- Use React + `styled-components` only (no CSS files).
- Each component renders a native `<button>` element.
- Each file exports its component as the default export (ESM).

# Props (Same For All Buttons)
- `children` (required)
- `onClick` (optional)
- `disabled` (optional, default `false`)
- `type` (optional, default `"button"`)
- Forward any other props to `<button>` (e.g. `aria-*`, `data-*`, `title`, `name`, `value`).

## Prop Precedence / Spreading Rules
- `disabled` must set the native `disabled` attribute on `<button>`.
- `type` must default to `"button"` unless explicitly provided.
- Spread remaining props onto `<button>` without overriding `disabled` or `type`.

# Interaction States (Required)
Implement and visually distinguish all of the following:
- `:hover`
- `:active`
- `:focus-visible`
- `:disabled`

# Accessibility Requirements
- Provide a clearly visible focus ring on `:focus-visible` for all variants (not just a subtle color change).
- Use the native `disabled` attribute when disabled.
- Maintain readable text contrast:
  - Target WCAG 2.1 AA contrast for normal text (>= 4.5:1) between text and background in default and disabled states.
- `:focus-visible` fallback:
  - If you implement a fallback, avoid showing focus styles on mouse click (e.g. use `:focus` with `:not(:focus-visible)` patterns).

# Styling Consistency (Minimal + Predictable)
Use the same base styling across all variants:
- Padding: `10px 14px`
- Font size: `14px`
- Font weight: `600`
- Line height: `1.2`
- Border radius: `8px`
- Transition: `150ms ease` for background/border/color/box-shadow

Additional shared expectations:
- `cursor: pointer` when enabled; `cursor: not-allowed` when disabled.
- Disabled styles should reduce emphasis (e.g. muted colors and/or opacity) while preserving legibility.

# Variant Scope
- Primary: solid “main action” style.
- Secondary: neutral/outlined or muted style.
- Info: informational accent style.
- Error: destructive accent style.

# Non-Goals
- No icons.
- No loading spinner.
- No theming system unless required by `styled-components` defaults.
- No shared base file unless absolutely necessary (simple duplication is acceptable to keep scope small).

# Acceptance Checklist
- Each file exports a working component usable like:
  - `<PrimaryButton onClick={...}>Save</PrimaryButton>`
- `disabled` correctly disables interaction and uses the native `disabled` attribute.
- All required states work and are visually distinct (including `:disabled` + `:focus-visible`).
- Components forward `aria-*` / `data-*` props to the underlying `<button>`.
