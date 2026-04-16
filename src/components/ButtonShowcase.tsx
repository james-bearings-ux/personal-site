"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import styles from "./ButtonShowcase.module.css";

export function ButtonShowcase() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Button</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.buttonRows}>
          <div className={styles.buttonRow}>
            <Button hierarchy="primary" label="Primary" />
            <Button hierarchy="alt" label="Alt" />
            <Button hierarchy="secondary" label="Secondary" />
            <Button hierarchy="ghost" label="Ghost" />
          </div>
          <div className={styles.buttonRow}>
            <Button hierarchy="primary" iconOnly iconBefore="arrow_forward" aria-label="Forward" />
            <Button hierarchy="alt" iconOnly iconBefore="arrow_forward" aria-label="Forward" />
            <Button hierarchy="secondary" iconOnly iconBefore="arrow_forward" aria-label="Forward" />
            <Button hierarchy="ghost" iconOnly iconBefore="arrow_forward" aria-label="Forward" />
          </div>
          <div className={styles.buttonRow}>
            <ButtonGroup>
              <Button hierarchy="primary" label="Action" />
              <Button hierarchy="primary" iconOnly iconBefore="keyboard_arrow_down" aria-label="More options" />
            </ButtonGroup>
            <ButtonGroup>
              <Button hierarchy="alt" label="Action" />
              <Button hierarchy="alt" iconOnly iconBefore="keyboard_arrow_down" aria-label="More options" />
            </ButtonGroup>
            <ButtonGroup>
              <Button hierarchy="secondary" label="Action" />
              <Button hierarchy="secondary" iconOnly iconBefore="keyboard_arrow_down" aria-label="More options" />
            </ButtonGroup>
          </div>
          <div className={styles.buttonRow}>
            <ButtonGroup>
              {["One", "Two", "Three"].map((label, i) => (
                <Button
                  key={label}
                  hierarchy={selected === i ? "primary" : "secondary"}
                  label={label}
                  onClick={() => setSelected(i)}
                />
              ))}
            </ButtonGroup>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
