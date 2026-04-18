# ADR-015: Accordion Component Architecture

## Status
Accepted

## Context
Accordion is a progressive disclosure pattern used in two contexts in this project:

1. **FeatureAccordion** — a full-row section component with a fixed two-column layout, heading block, and an accordion list embedded in the content column. Previously implemented with an internal `AccordionPanel` data-carrier component and `AccordionItem` render component, both private to `FeatureAccordion.tsx`.

2. **Standalone accordion** — needed as an atomic component for use in other compositions, without FeatureAccordion's layout constraints.

The goal was to extract the accordion behavior into a reusable atomic component while keeping FeatureAccordion's layout and surface concerns separate.

## Options Considered

**Option A: Single `AccordionItem` component with a `grouped` prop**
One exported component that manages its own state by default, optionally accepting external `open` and `onToggle` props for grouped use. Callers construct the group manually.

Simple, but requires every consumer to implement exclusive/multiple behavior themselves. The group contract is implicit — nothing enforces that items sharing a group actually coordinate.

**Option B: Two components — `AccordionItem` + `Accordion` group wrapper**
`AccordionItem` is the atomic unit. `Accordion` is a group wrapper that owns open state and coordinates behavior via React context. `AccordionItem` reads context when present; falls back to internal state when used standalone.

More surface area, but the group contract is explicit and enforced. Consumers get correct exclusive/multiple behavior without implementing it themselves.

**Option C: Single flat `Accordion` component that owns all items internally**
All items declared as props (e.g. `items={[{ label, children }]}`). Group behavior trivial to implement, but the slot model is lost — content must be serializable, ruling out rich slot content.

## Decision
**Option B** — `AccordionItem` + `Accordion` group wrapper.

Specific choices:

**State management via React context.** `Accordion` provides `openItems: Set<number>` and `toggle(index)` via context. `AccordionItem` consumes context when available; uses `useState(defaultOpen)` when used standalone. Index assignment uses `React.cloneElement` to inject `_index` — an intentionally internal prop prefixed with `_` to signal it is not part of the public API.

**`defaultOpen` initialisation.** `Accordion` seeds initial state by reading `defaultOpen` from children props via `React.Children.forEach` in the `useState` initializer. If `allowMultiple` is false and multiple children declare `defaultOpen`, the first-declared wins — consistent with document order and predictable without runtime warnings.

**`allowMultiple` defaults to false.** Exclusive behavior (one open at a time) is the more common design intent and the safer default. Opt-in to multiple with `allowMultiple`.

**`headingLevel` prop.** The trigger button is wrapped in a semantic heading element (`h2`–`h4`, default `h3`) to maintain correct document outline. This is a required accessibility decision, not a cosmetic one — heading level affects screen reader navigation of the page.

**ARIA pattern.** Full accordion pattern per ARIA Authoring Practices:
- Trigger: `<button>` with `aria-expanded` and `aria-controls`
- Panel: `id` matching `aria-controls`, `role="region"`, `aria-labelledby` pointing to trigger
- Heading wraps button: `<h3><button>…</button></h3>`

**FeatureAccordion refactor.** The previous `AccordionPanel` data-carrier (a component that rendered `null` and existed only to pass props to its parent) is replaced by `AccordionItem` children passed directly through to an `Accordion` group. FeatureAccordion now owns only layout, surface color, scroll reveal, and responsive density logic.

## Consequences
- `AccordionItem` works standalone (no `Accordion` wrapper required) for single-disclosure use cases.
- `FeatureAccordion` is thinner and delegates all accordion behavior to the atomic layer.
- Adding a new accordion-based composition (e.g. a FAQ section, settings panel) requires only `Accordion` + `AccordionItem` — no new behavior to implement.
- The `_index` internal prop is a coupling between `Accordion` and `AccordionItem`. Any refactor that changes how indices are assigned (e.g. switching to string keys) must update both components together.
- Controlled mode (`open` + `onOpenChange` per item) is not implemented. If an external system needs to drive accordion state, the context pattern would need to be extended or replaced with a fully controlled API.
