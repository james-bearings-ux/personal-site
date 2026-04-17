import type { GlobalProvider } from "@ladle/react";
import "../src/app/globals.css";
import "../src/styles/tokens.css";
import "../src/styles/tokens.semantic.css";
import "../src/styles/tokens.component.css";
import "../src/styles/tokens.breakpoints.css";
import "../src/styles/tokens.typography.css";
import "../src/styles/motion.css";
import "./ladle.css";

export const Provider: GlobalProvider = ({ children }) => (
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
