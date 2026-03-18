import styles from "./Button.module.css";

export type ButtonHierarchy = "primary" | "alt" | "secondary" | "ghost";

interface ButtonBaseProps {
  hierarchy?: ButtonHierarchy;
  label?: string;
  iconBefore?: string;
  iconAfter?: string;
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

function Icon({ src }: { src: string }) {
  return (
    <span
      className={styles.icon}
      aria-hidden="true"
      style={{ maskImage: `url('/img/${src}')` }}
    />
  );
}

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
      {iconBefore && <Icon src={iconBefore} />}
      {label ?? children}
      {iconAfter && <Icon src={iconAfter} />}
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
