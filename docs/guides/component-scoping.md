# Component Scoping Guide

A process template for defining a new component before writing any code.
The goal is to make implicit decisions explicit and repeatable — and to ensure
the component's purpose, API, tokens, and stories are agreed on upfront.

## Why scope first

Skipping this step produces components that are either under-built (missing
features that surface later as rework) or over-built (features added
speculatively that complicate the API). It also delays a11y and token
decisions to implementation time, where they're harder to change.

The scoping process often reveals that one component should be two, or that
two planned components should share a base.

---

## Process

### 1. Free list

Exhaustive, unconstrained brainstorming. Every feature either party can think
of or find in examples. No pruning yet.

**James:** Review UI examples — what content, UI elements, and purpose does
each represent? What is the component *communicating*?

**Claude:** Review API surface of common implementations — what did engineers
find necessary to parameterize? What props appear consistently?

The overlap between these two lists is the confident in-scope set. The gaps
are where interesting decisions live.

### 2. In / out prioritization

Explicitly place every free-list feature in one of three buckets:

- **In scope** — required for this component at this time
- **Out of scope (future)** — valid feature, parked for a future version or
  companion component
- **Out of scope (not this component)** — belongs to a different component or
  is handled by composition

A feature that is "out" should be named and parked, not forgotten.

### 3. Synthesis

What does the in-scope set imply?

- Single component, or a pair (e.g. Tabs + TabbedSlideshow)?
- Base component + variant, or two distinct components?
- Does the aggregate feature set suggest a purpose that wasn't obvious top-down?
- Does anything in the out-of-scope list suggest a follow-on component to
  create an issue for?

### 4. A11y constraints

Accessibility belongs here, not at the end. For interactive components:

- What ARIA role and pattern applies?
- What keyboard navigation is required?
- What focus management decisions affect the API?

These are feature-level decisions that shape prop design. Identify them before
writing a line of code.

### 5. Story first

Before writing the component, define the stories:

- What are the axes of variation? (hierarchy, density, state, content length…)
- What does "correct" look like for each axis?
- What token failures would these stories catch?
- How should the stories be structured to make comparisons legible?

Stories are token validation tools, not demos. Structure them to reveal
meaningful differences across variants.

### 6. Naming pass

Agree on names before implementation:

- Component name(s)
- Prop names and types
- Token names (new tokens this component needs)
- Story export names

Naming is design. Changing names later is friction.

---

## Outputs

A scoping session should produce, at minimum:

- In/out feature list
- Component structure decision (single / pair / base+variant)
- A11y pattern identified
- Story structure sketched
- Any new tokens identified and added to the backlog or Figma

These can live as a GitHub issue description or comment — they don't need a
separate document unless the component is complex enough to warrant one.
