import React from 'react';

/**
 * ARMOR BIKE ColorSwatch — round color chip with a count badge, as used in the
 * "Colors" facet. Multi-color values render as a conic gradient.
 */
export function ColorSwatch({ color = '#000', count = null, selected = false, onClick, title, style = {} }) {
  const isMulti = Array.isArray(color);
  const bg = isMulti
    ? `conic-gradient(${color.map((c, i) => `${c} ${(i * 100) / color.length}% ${((i + 1) * 100) / color.length}%`).join(', ')})`
    : color;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        position: 'relative',
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-circle)',
        background: bg,
        border: selected ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
        boxShadow: selected ? '0 0 0 2px #fff inset' : 'none',
        cursor: 'pointer',
        padding: 0,
        ...style,
      }}
    >
      {count != null && (
        <span
          style={{
            position: 'absolute',
            right: -4,
            bottom: -4,
            minWidth: 18,
            height: 18,
            padding: '0 4px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gray-900)',
            color: '#fff',
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--fw-bold)',
            fontSize: 10,
            lineHeight: '18px',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
