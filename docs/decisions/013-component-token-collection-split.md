# ADR 013: Split component token collection into density and component

**Date:** 2026-04-16
**Status:** Accepted

---

## Context

The design token architecture uses a Figma Variables collection named `component` to hold component-level tokens. This collection has three modes — `compact`, `default`, and `spacious` — representing the density system.

As the component library expanded toward full component token coverage (every CSS attribute in a component referencing a component token rather than a primitive directly), a structural problem emerged: the `component` collection conflates two categorically different concerns:

1. **Density-variable attributes** — padding, height, font-size, gap, and other values that genuinely differ across compact/default/spacious. These need three mode values and are the reason the collection has modes at all.

2. **Fixed component attributes** — border-radius, font-weight, motion references, and other values that represent design decisions but do not vary by density. These have no need for modes, but adding them to the existing collection forces three identical values to be defined for every token — one per density mode.

The redundancy is not merely inconvenient. It obscures which attributes actually vary by density (the signal the collection is meant to carry) and makes maintenance error-prone: a change to a fixed attribute must be applied three times with no enforcement that all three values match.

---

## Options considered

### Option A: Keep a single `component` collection, accept redundancy

Add fixed-attribute tokens to the existing density-modal collection with identical values across all three modes. Keeps a single collection and a single `--component-*` CSS prefix, but produces dozens to hundreds of redundant values as the component library grows. The collection's density signal is diluted.

### Option B: Split into two Figma collections — `density` and `component`

Rename the existing collection from `component` to `density`. It retains its three density modes and continues to hold only attributes that vary across them. Create a new `component` collection with no modes, holding fixed component attributes.

In Figma, authors work with two clearly-scoped collections. In code, the Style Dictionary config normalizes both to a single `--component-*` CSS variable prefix, making the split invisible to CSS consumers.

### Option C: Add a secondary collection with a different prefix

Keep the `component` collection unchanged and add a new `component-fixed` or `component-static` collection for fixed attributes. Avoids renaming but introduces a second prefix in CSS, increasing the surface area CSS authors need to know.

---

## Decision

**Option B.** Rename the existing `component` collection to `density`. Create a new modeless `component` collection for fixed component attributes.

---

## Rationale

The rename makes the existing collection's purpose explicit and self-documenting: it holds density-variable values, nothing else. A new author can read the Figma collection name and immediately understand its scope without consulting documentation.

The new `component` collection is lighter to maintain — no modes, no redundant values. The design intent of a fixed attribute (e.g. "this button always uses infinite border-radius") is captured once, explicitly, in Figma, rather than implied by direct primitive references in CSS.

The Style Dictionary config unifies both collections under the `--component-*` CSS prefix by normalizing the collection name during transformation. CSS consumers see one consistent namespace. The two-collection structure is a Figma authoring concern, not a CSS concern.

This split also enables a stronger linting rule: `*.module.css` files should reference only `--component-*` tokens, never `--primitives-*` directly. With full component token coverage across both collections, this rule becomes enforceable without false positives.

---

## Consequences

**Positive:**
- Collection purpose is explicit and self-documenting in Figma
- Fixed attributes are defined once, not three times
- Density signal is preserved — the `density` collection contains only attributes that actually vary
- CSS namespace remains unified under `--component-*`
- Enables a stricter linting rule against direct primitive references in component CSS
- Scales cleanly as the component library grows

**Negative:**
- Component tokens are now split across two Figma collections; authors must know which collection to consult when adding a new token
- Requires a Style Dictionary config update to normalize both collection prefixes to `--component-*`
- Existing `--component-*` variable names in CSS are unchanged, but the underlying Figma collection name changes — relevant if any tooling references the collection name directly

**Mitigations:**
- Naming convention documentation should note the two-collection structure and the rule: variable attributes go in `density`, fixed attributes go in `component`
- The `/new-component` skill should be updated to reflect the split

---

## Related

- ADR 007: Token architecture (overall collection structure)
- ADR 012: Spacing token architecture (two-tier space scale, same principle of separating variable from fixed)
- GitHub issue #25: Full component token coverage migration
