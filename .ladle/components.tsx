import type { GlobalProvider } from "@ladle/react";
import React from "react";
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

// Run axe after every render and report violations to the browser console.
// 1000ms debounce gives components time to finish rendering before analysis.
axe(React, ReactDOM, 1000);

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
