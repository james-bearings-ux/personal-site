"use client";

import React, { createContext, useContext, useId, useState } from "react";
import { Icon } from "./Icon";
import styles from "./Accordion.module.css";

// ── Context ────────────────────────────────────────────────────────────────────
// Provided by Accordion group; absent when AccordionItem is used standalone.

interface AccordionContextValue {
  openItems: Set<number>;
  toggle: (index: number) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

// ── AccordionItem ──────────────────────────────────────────────────────────────

export interface AccordionItemProps {
  label: string;
  headingLevel?: "h2" | "h3" | "h4";
  defaultOpen?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
  /** @internal — injected by Accordion via cloneElement, not part of the public API */
  _index?: number;
}

export function AccordionItem({
  label,
  headingLevel = "h3",
  defaultOpen = false,
  noPadding = false,
  children,
  _index,
}: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  const uid = useId();
  const panelId = `${uid}-panel`;
  const triggerId = `${uid}-trigger`;

  // Standalone mode — item manages its own state
  const [standaloneOpen, setStandaloneOpen] = useState(defaultOpen);

  const isOpen = ctx && _index !== undefined ? ctx.openItems.has(_index) : standaloneOpen;
  const handleToggle =
    ctx && _index !== undefined
      ? () => ctx.toggle(_index)
      : () => setStandaloneOpen((v) => !v);

  const HeadingTag = headingLevel as React.ElementType;

  return (
    <div className={styles.item} data-open={isOpen}>
      <HeadingTag className={styles.heading}>
        <button
          id={triggerId}
          className={styles.face}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className={`type-ui-large ${styles.label}`}>{label}</span>
          <Icon name="keyboard_arrow_down" className={styles.icon} />
        </button>
      </HeadingTag>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={styles.content}
      >
        <div className={styles.contentInner}>
          <div className={`${styles.contentPadding}${noPadding ? ` ${styles.noPadding}` : ""}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Accordion ──────────────────────────────────────────────────────────────────

interface AccordionProps {
  allowMultiple?: boolean;
  children: React.ReactNode;
}

export function Accordion({ allowMultiple = false, children }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    // Seed initial state from defaultOpen props on children.
    // If allowMultiple is false, only the first defaultOpen child wins.
    const initial = new Set<number>();
    React.Children.forEach(children, (child, i) => {
      if (React.isValidElement<AccordionItemProps>(child) && child.props.defaultOpen) {
        if (allowMultiple || initial.size === 0) initial.add(i);
      }
    });
    return initial;
  });

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={styles.accordion}>
        {React.Children.map(children, (child, i) =>
          React.isValidElement<AccordionItemProps>(child)
            ? React.cloneElement(child, { _index: i })
            : child
        )}
      </div>
    </AccordionContext.Provider>
  );
}
