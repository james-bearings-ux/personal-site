import type { GlobalProvider } from "@ladle/react";
import { ThemeState } from "@ladle/react";
import "../src/app/globals.css";
import "../src/styles/tokens.css";
import "../src/styles/tokens.semantic.css";
import "../src/styles/tokens.component.css";
import "../src/styles/tokens.breakpoints.css";
import "../src/styles/tokens.typography.css";
import "../src/styles/motion.css";
import "./ladle.css";

export const Provider: GlobalProvider = ({ children, globalState }) => {
  // Mirror Ladle's own light/dark toggle onto data-theme so semantic color
  // tokens respond to it. "auto" defers to the OS preference.
  const theme =
    globalState.theme === ThemeState.Dark ? "dark"
    : globalState.theme === ThemeState.Auto
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : "light";

  return (
    <div
      data-theme={theme}
      data-density="default"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--semantic-color-surface-high)",
        padding: "40px",
      }}
    >
      {children}
    </div>
  );
};
