import React from 'react';

/**
 * ARMOR BIKE Badge — small square label. Used for sale flags, "New", stock states.
 */
export function Badge({ children, variant = 'sale', style = {} }) {
  const variants = {
    sale:    { bg: 'var(--brand-sale)', color: '#fff' },
    accent:  { bg: 'var(--brand-accent)', color: 'var(--gray-900)' },
    info:    { bg: 'var(--brand-primary)', color: '#fff' },
    success: { bg: 'var(--status-success-surface)', color: 'var(--green-600)' },
    neutral: { bg: 'var(--gray-100)', color: 'var(--text-body)' },
  };
  const v = variants[variant] || variants.sale;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 8px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-bold)',
        fontSize: 'var(--text-2xs)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-sm)',
        background: v.bg,
        color: v.color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
