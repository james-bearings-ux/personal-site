import styles from "./Icon.module.css";

export type IconName =
  | "arrow_forward"
  | "check_circle"
  | "close"
  | "keyboard_arrow_down"
  | "keyboard_arrow_up"
  | "search";

export type IconSize = "small" | "medium" | "large";

interface IconProps {
  name: IconName;
  /** Applies a token-backed size. Omit to size via className instead. */
  size?: IconSize;
  className?: string;
}

export function Icon({ name, size, className = "" }: IconProps) {
  const sizeClass = size ? styles[size] : "";
  return (
    <span
      className={`${styles.icon} ${sizeClass} ${className}`.trim()}
      aria-hidden="true"
      style={{ maskImage: `url('/img/${name}.svg')` }}
    />
  );
}
