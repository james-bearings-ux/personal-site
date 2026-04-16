import { Icon, IconName } from "./Icon";
import styles from "./Button.module.css";

export type ButtonHierarchy = "primary" | "alt" | "secondary" | "ghost";

interface ButtonBaseProps {
  hierarchy?: ButtonHierarchy;
  label?: string;
  iconBefore?: IconName;
  iconAfter?: IconName;
  iconOnly?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  hierarchy = "primary",
  label,
  iconBefore,
  iconAfter,
  iconOnly = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const cls = `${styles.btn} ${styles[hierarchy]} ${iconOnly ? styles.iconOnly : ""} ${className}`.trim();
  const content = (
    <>
      {iconBefore && <Icon name={iconBefore} className={styles.icon} />}
      {label ?? children}
      {iconAfter && <Icon name={iconAfter} className={styles.icon} />}
    </>
  );

  if ((props as ButtonAsLink).href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsLink;
    return <a href={href} className={cls} {...anchorProps}>{content}</a>;
  }

  return (
    <button className={cls} {...(props as ButtonAsButton)}>
      {content}
    </button>
  );
}
