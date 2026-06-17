import React from 'react';

/**
 * ARMOR BIKE FilterGroup — a collapsible facet section from the sidebar:
 * bold title, chevron toggle, and a body of options (checkboxes, swatches…).
 */
export function FilterGroup({ title, children, defaultOpen = true, style = {} }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: 'var(--space-5) 0', ...style }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-bold)',
          fontSize: 'var(--text-lg)',
          color: 'var(--text-strong)',
        }}
      >
        {title}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-strong)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-standard)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
