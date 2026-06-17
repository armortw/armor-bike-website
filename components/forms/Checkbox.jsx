import React from 'react';

/**
 * ARMOR BIKE Checkbox — the square filter checkbox used throughout the facet sidebar,
 * with an optional trailing count badge (e.g. "In stock  75").
 */
export function Checkbox({
  checked = false,
  onChange,
  label,
  count = null,
  disabled = false,
  style = {},
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-md)',
        color: 'var(--text-body)',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 18,
          height: 18,
          flexShrink: 0,
          borderRadius: 'var(--radius-sm)',
          border: `2px solid ${checked ? 'var(--brand-primary)' : 'var(--border-default)'}`,
          background: checked ? 'var(--brand-primary)' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--dur-fast) var(--ease-standard)',
        }}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{count}</span>
      )}
    </label>
  );
}
