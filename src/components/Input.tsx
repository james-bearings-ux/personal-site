import { Icon, IconName } from "./Icon";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconName;
  hasError?: boolean;
  wrapClassName?: string;
}

export function Input({ icon, hasError = false, className = "", wrapClassName = "", ...props }: InputProps) {
  return (
    <div className={`${styles.wrap}${hasError ? ` ${styles.error}` : ""}${wrapClassName ? ` ${wrapClassName}` : ""}`}>
      <input
        className={`${styles.input}${className ? ` ${className}` : ""}`}
        aria-invalid={hasError || undefined}
        {...props}
      />
      {icon && <Icon name={icon} className={styles.icon} />}
    </div>
  );
}
