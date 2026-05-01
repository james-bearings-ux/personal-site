"use client";

import { ScrollReveal } from "./ScrollReveal";
import { surfaceTokens, Surface } from "@/styles/tokens.surface";
import { Accordion, AccordionItem } from "./Accordion";
import styles from "./FaqRow.module.css";

export { AccordionItem };

interface FaqRowProps {
  heading: string;
  surface?: Surface;
  children: React.ReactNode;
}

export function FaqRow({ heading, surface = "base", children }: FaqRowProps) {
  return (
    <div className={styles.container} style={{ backgroundColor: surfaceTokens[surface] }} data-density="spacious">
      <ScrollReveal>
        <h2 className={`type-heading-2 ${styles.heading}`}>{heading}</h2>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <Accordion>{children}</Accordion>
      </ScrollReveal>
    </div>
  );
}
