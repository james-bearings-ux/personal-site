import type { GlobalProvider } from "@ladle/react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axe from "@axe-core/react";
import "../src/app/globals.css";
import "../src/styles/tokens.css";
import "../src/styles/tokens.semantic.css";
import "../src/styles/tokens.component.css";
import "../src/styles/tokens.breakpoints.css";
import "../src/styles/tokens.typography.css";
import "../src/styles/motion.css";
import "./ladle.css";

export const Provider: GlobalProvider = ({ children }) => {
  useEffect(() => {
    // Initialize axe after mount. Must run client-side after React has
    // rendered; calling at module level breaks React 18's concurrent renderer.
    axe(React, ReactDOM, 1000);
  }, []);

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
