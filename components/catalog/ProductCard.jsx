import React from 'react';
import { Badge } from './Badge.jsx';

/**
 * ARMOR BIKE ProductCard — the catalog grid tile: light-gray media area on top,
 * uppercase manufacturer eyebrow, product name, spec line, and bold price.
 */
export function ProductCard({
  manufacturer,
  name,
  spec,
  price,
  oldPrice = null,
  currency = '€',
  image = null,
  badge = null,
  note = null,
  onClick,
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: '1px solid transparent',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-normal) var(--ease-standard)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'none',
        borderColor: hover ? 'var(--border-subtle)' : 'transparent',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Media */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: 'var(--surface-media)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
        }}
      >
        {badge && (
          <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
            <Badge variant="sale">{badge}</Badge>
          </div>
        )}
        {image
          ? <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          : <span style={{ color: 'var(--gray-300)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>image</span>}
      </div>

      {/* Body */}
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>
          {manufacturer}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-md)', color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)' }}>
          {name}
        </div>
        {spec && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-snug)' }}>{spec}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-extra)', fontSize: 'var(--text-2xl)', color: oldPrice ? 'var(--text-sale)' : 'var(--text-strong)' }}>
            {price}&nbsp;{currency}<span style={{ fontSize: 'var(--text-md)' }}>*</span>
          </span>
          {oldPrice && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{oldPrice}&nbsp;{currency}</span>
          )}
        </div>
        {note && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-sale)', fontWeight: 'var(--fw-semibold)', marginTop: 'var(--space-1)' }}>{note}</div>
        )}
      </div>
    </div>
  );
}
