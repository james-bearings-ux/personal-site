import type { GlobalProvider } from "@ladle/react";
import { useEffect } from "react";
import axe from "axe-core";
import "../src/app/globals.css";
import "../src/styles/tokens.css";
import "../src/styles/tokens.semantic.css";
import "../src/styles/tokens.component.css";
import "../src/styles/tokens.breakpoints.css";
import "../src/styles/tokens.typography.css";
import "../src/styles/motion.css";
import "./ladle.css";

export const Provider: GlobalProvider = ({ children }) => {
  // Run axe after every render with a 1s debounce. axe-core is pre-bundled
  // via optimizeDeps in .ladle/config.mjs so the default import resolves correctly.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      const results = await axe.run();
      if (cancelled || results.violations.length === 0) return;
      console.group(`%c axe: ${results.violations.length} violation(s)`, "color: #e06c75; font-weight: bold");
      for (const v of results.violations) {
        console.warn(`[${v.impact}] ${v.id}: ${v.description}`, v.nodes);
      }
      console.groupEnd();
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  });

  return (
    <div
      data-theme="light"
      data-density="default"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--semantic-color-surface-ground)",
        padding: "40px",
      }}
    >
      {children}
    </div>
  );
};
