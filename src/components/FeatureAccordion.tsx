"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { ScrollReveal } from "./ScrollReveal";
import { surfaceTokens, Surface } from "@/styles/tokens.surface";
import { Accordion, AccordionItem } from "./Accordion";
import styles from "./FeatureAccordion.module.css";

export { AccordionItem };

type Density = "compact" | "default" | "spacious";
interface DensityBreakpoint { minWidth: number; density: Density; }

interface FeatureAccordionProps {
  heading: string;
  body: string;
  surface?: Surface;
  showCta?: boolean;
  label?: string;
  href?: string;
  onClick?: () => void;
  densityByBreakpoint?: DensityBreakpoint[];
  children: React.ReactNode;
}

export function FeatureAccordion({
  heading,
  body,
  surface = "base",
  showCta,
  label,
  href,
  onClick,
  densityByBreakpoint,
  children,
}: FeatureAccordionProps) {
  const [density, setDensity] = useState<Density | undefined>(undefined);

  React.useEffect(() => {
    if (!densityByBreakpoint?.length) return;
    const evaluate = () => {
      const sorted = [...densityByBreakpoint].sort((a, b) => b.minWidth - a.minWidth);
      const match = sorted.find((bp) => window.innerWidth >= bp.minWidth);
      if (match) setDensity(match.density);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [densityByBreakpoint]);

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: surfaceTokens[surface] }}
      {...(density ? { "data-density": density } : {})}
    >
      <div className={styles.headingCol}>
        <ScrollReveal>
          <div className={styles.headingBlock}>
            <h2 className={`type-heading-2 ${styles.heading}`}>{heading}</h2>
            <p className={`type-body-large ${styles.body}`}>{body}</p>
            {showCta && (
              <Button label={label} href={href} onClick={onClick} hierarchy="alt" />
            )}
          </div>
        </ScrollReveal>
      </div>
      <div className={styles.contentCol}>
        <ScrollReveal delay={120}>
          <Accordion>
            {children}
          </Accordion>
        </ScrollReveal>
      </div>
    </div>
  );
}
