import React from 'react';

/**
 * ARMOR BIKE SearchInput — the pill-shaped search field from the header bar.
 * Renders a leading magnifier icon and rounded-pill container.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search for bikes, gear & clothing…',
  size = 'md',
  style = {},
  ...rest
}) {
  const h = size === 'lg' ? 52 : 44;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        height: h,
        padding: '0 20px',
        background: '#fff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-xs)',
        ...style,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-md)',
          color: 'var(--text-strong)',
        }}
        {...rest}
      />
    </div>
  );
}
