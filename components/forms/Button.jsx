import React from 'react';

/**
 * ARMOR BIKE Button — square-cornered, bold-label action button.
 * Variants: primary (blue), accent (yellow), sale (magenta), secondary (outline), ghost.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { height: 34, padding: '0 14px', font: 'var(--text-sm)' },
    md: { height: 44, padding: '0 20px', font: 'var(--text-md)' },
    lg: { height: 52, padding: '0 28px', font: 'var(--text-lg)' },
  };
  const variants = {
    primary: { bg: 'var(--brand-primary)', color: '#fff', border: 'transparent', hover: 'var(--brand-primary-hover)' },
    accent:  { bg: 'var(--brand-accent)', color: 'var(--gray-900)', border: 'transparent', hover: 'var(--yellow-600)' },
    sale:    { bg: 'var(--brand-sale)', color: '#fff', border: 'transparent', hover: 'var(--sale-600)' },
    secondary: { bg: 'transparent', color: 'var(--brand-primary)', border: 'var(--brand-primary)', hover: 'var(--blue-50)' },
    ghost:   { bg: 'transparent', color: 'var(--text-strong)', border: 'transparent', hover: 'var(--gray-100)' },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const [hover, setHover] = React.useState(false);
  const bg = hover && !disabled
    ? (variant === 'secondary' || variant === 'ghost' ? v.hover : v.hover)
    : v.bg;

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-bold)',
        fontSize: s.font,
        lineHeight: 1,
        color: v.color,
        background: bg,
        border: `2px solid ${v.border === 'transparent' ? bg : v.border}`,
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
