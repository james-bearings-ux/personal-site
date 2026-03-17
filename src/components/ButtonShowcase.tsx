"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Button } from "./Button";
import styles from "./ButtonShowcase.module.css";

export function ButtonShowcase() {
  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Button</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.buttonRow}>
          <Button hierarchy="primary" label="Primary" />
          <Button hierarchy="alt" label="Alt" />
          <Button hierarchy="secondary" label="Secondary" />
          <Button hierarchy="ghost" label="Ghost" />
        </div>
      </ScrollReveal>
    </div>
  );
}
