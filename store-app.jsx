/* ARMOR BIKE Storefront */
(function () {
  const DS = window.BIKE24DesignSystem_2233bc;
  const { Button, Badge, Checkbox, ColorSwatch, FilterGroup, SearchInput } = DS;
  const STORE = window.STORE;

  const TOTALS = {
    bikes: 103, parts: 1240, accessories: 864, electronics: 312,
    clothing: 978, shoes: 246, outdoor: 531, moresports: 489, brands: 207, sale: 248
  };
  const SORTS = ['Popularity', 'Price: low to high', 'Price: high to low', 'Newest'];

  function parsePrice(p) { return parseFloat(String(p).replace(/\./g, '').replace(',', '.')) || 0; }
  function fmtPrice(n) { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function loadLS(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }
  function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  function prodKey(p) { return (p.manufacturer || '') + '|' + (p.name || ''); }
  function getImages(p) {
    if (Array.isArray(p.images) && p.images.length > 0) return p.images;
    if (p.image) return [{ url: p.image, alt: p.name || '' }];
    return [];
  }

  const iconBtn = { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' };

  // ── Icons ──────────────────────────────────────────────────────────────────
  const Icon = {
    burger: (p) => React.createElement('svg', { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', ...p },
      React.createElement('line', { x1: 3, y1: 6, x2: 21, y2: 6 }),
      React.createElement('line', { x1: 3, y1: 12, x2: 21, y2: 12 }),
      React.createElement('line', { x1: 3, y1: 18, x2: 21, y2: 18 })),
    heart: (p) => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' })),
    user: (p) => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('circle', { cx: 12, cy: 8, r: 4 }),
      React.createElement('path', { d: 'M4 21a8 8 0 0 1 16 0' })),
    cart: (p) => React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('circle', { cx: 9, cy: 20, r: 1.4 }),
      React.createElement('circle', { cx: 18, cy: 20, r: 1.4 }),
      React.createElement('path', { d: 'M2 3h3l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L22 7H6' })),
    chevron: (p) => React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('polyline', { points: '6 9 12 15 18 9' })),
    sliders: (p) => React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', ...p },
      React.createElement('line', { x1: 4, y1: 6, x2: 20, y2: 6 }),
      React.createElement('line', { x1: 4, y1: 12, x2: 20, y2: 12 }),
      React.createElement('line', { x1: 4, y1: 18, x2: 20, y2: 18 }),
      React.createElement('circle', { cx: 9, cy: 6, r: 2, fill: '#fff' }),
      React.createElement('circle', { cx: 15, cy: 12, r: 2, fill: '#fff' }),
      React.createElement('circle', { cx: 8, cy: 18, r: 2, fill: '#fff' })),
    trash: (p) => React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('polyline', { points: '3 6 5 6 21 6' }),
      React.createElement('path', { d: 'M19 6l-1 14H6L5 6' }),
      React.createElement('path', { d: 'M10 11v6M14 11v6M9 6V4h6v2' })),
    check: (p) => React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', ...p },
      React.createElement('polyline', { points: '20 6 9 17 4 12' }))
  };

  // ── Drawer shell ───────────────────────────────────────────────────────────
  function Drawer({ open, onClose, width, children }) {
    return React.createElement(React.Fragment, null,
      React.createElement('div', {
        onClick: onClose,
        style: {
          position: 'fixed', inset: 0, background: 'rgba(22,24,29,0.42)', zIndex: 190,
          opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.25s ease'
        }
      }),
      React.createElement('div', {
        style: {
          position: 'fixed', top: 0, right: 0, bottom: 0, width: width || 440,
          background: '#fff', zIndex: 200, display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.16)'
        }
      }, children)
    );
  }

  function DrawerHead({ title, count, onClose }) {
    return React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 10 } },
        React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--text-strong)' } }, title),
        count > 0 && React.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 } }, '(' + count + ')')
      ),
      React.createElement('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: 'var(--text-muted)', lineHeight: 1, padding: '0 4px', display: 'flex' } }, '×')
    );
  }

  function DrawerEmpty({ icon, title, sub, onBrowse }) {
    return React.createElement('div', { style: { textAlign: 'center', padding: '80px 22px 40px' } },
      React.createElement('div', { style: { fontSize: 52, marginBottom: 16 } }, icon),
      React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 } }, title),
      React.createElement('div', { style: { fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 } }, sub),
      React.createElement('button', { onClick: onBrowse, style: { background: 'var(--brand-primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14 } }, 'Browse Products')
    );
  }

  // ── Cart drawer ────────────────────────────────────────────────────────────
  function CartItem({ item, onRemove, onUpdateQty }) {
    const imgs = getImages(item.product);
    const lineTotal = parsePrice(item.product.price) * item.qty;
    return React.createElement('div', { style: { display: 'flex', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--border-subtle)' } },
      React.createElement('div', { style: { width: 80, height: 80, flexShrink: 0, background: 'var(--surface-media)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 6 } },
        imgs[0] ? React.createElement('img', { src: imgs[0].url, style: { width: '100%', height: '100%', objectFit: 'contain' } }) : null
      ),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 2 } }, item.product.manufacturer),
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 10 } }, item.product.name),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', border: '1px solid var(--border-default)', borderRadius: 7, overflow: 'hidden' } },
            React.createElement('button', { onClick: () => onUpdateQty(item.key, -1), style: { width: 28, height: 28, background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 16 } }, '−'),
            React.createElement('span', { style: { width: 32, textAlign: 'center', fontSize: 13, fontWeight: 700 } }, item.qty),
            React.createElement('button', { onClick: () => onUpdateQty(item.key, 1), style: { width: 28, height: 28, background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 16 } }, '+')
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--text-strong)' } }, fmtPrice(lineTotal), ' €'),
            React.createElement('button', { onClick: () => onRemove(item.key), style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 } },
              React.createElement(Icon.trash, { stroke: '#9ca3af' }))
          )
        )
      )
    );
  }

  function CartDrawer({ open, onClose, cart, onRemove, onUpdateQty, cartTotal }) {
    const totalItems = cart.reduce((s, x) => s + x.qty, 0);
    const shipping = cartTotal > 199 ? 0 : 9.99;
    return React.createElement(Drawer, { open, onClose, width: 460 },
      React.createElement(DrawerHead, { title: '購物車', count: totalItems, onClose }),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto' } },
        cart.length === 0
          ? React.createElement(DrawerEmpty, { icon: '🛒', title: 'Your cart is empty', sub: 'Browse products and add items to your cart.', onBrowse: onClose })
          : cart.map(item => React.createElement(CartItem, { key: item.key, item, onRemove, onUpdateQty }))
      ),
      cart.length > 0 && React.createElement('div', { style: { padding: '16px 22px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 } },
          React.createElement('span', null, '小計 (' + totalItems + ' 件)'),
          React.createElement('span', { style: { fontWeight: 600, color: 'var(--text-body)' } }, fmtPrice(cartTotal) + ' €')
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 14 } },
          React.createElement('span', { style: { color: 'var(--text-muted)' } }, '運費'),
          React.createElement('span', { style: { fontWeight: 700, color: shipping === 0 ? '#16a34a' : 'var(--text-body)' } }, shipping === 0 ? '免費 🎉' : fmtPrice(shipping) + ' €')
        ),
        shipping > 0 && React.createElement('div', { style: { fontSize: 12, color: 'var(--text-muted)', background: '#f8fafc', padding: '6px 10px', borderRadius: 6, marginBottom: 12 } }, '訂單滿 199 € 享免運費'),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0 16px', borderTop: '1px solid var(--border-subtle)' } },
          React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 } }, '總計'),
          React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--text-strong)' } }, fmtPrice(cartTotal + shipping) + ' €*')
        ),
        React.createElement('button', { style: { width: '100%', padding: '13px 0', background: 'var(--brand-primary)', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, cursor: 'pointer' } }, '前往結帳 →'),
        React.createElement('div', { style: { marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10 } },
          ['Visa', 'Mastercard', 'PayPal'].map(m => React.createElement('span', { key: m, style: { fontSize: 11, color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 } }, m))
        )
      )
    );
  }

  // ── Wishlist drawer ────────────────────────────────────────────────────────
  function WishlistItem({ product, onSelect, onRemove }) {
    const imgs = getImages(product);
    return React.createElement('div', { style: { display: 'flex', gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' } },
      React.createElement('div', { onClick: () => onSelect(product), style: { width: 76, height: 76, flexShrink: 0, background: 'var(--surface-media)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 6, cursor: 'pointer' } },
        imgs[0] ? React.createElement('img', { src: imgs[0].url, style: { width: '100%', height: '100%', objectFit: 'contain' } }) : React.createElement('span', { style: { fontSize: 10, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)' } }, 'img')
      ),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 3 } }, product.manufacturer),
        React.createElement('button', { onClick: () => onSelect(product), style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text-strong)', lineHeight: 1.3, display: 'block', marginBottom: 5 } }, product.name),
        React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: product.oldPrice ? 'var(--text-sale)' : 'var(--text-strong)' } }, product.price, ' €', React.createElement('span', { style: { fontSize: 11 } }, '*'))
      ),
      React.createElement('button', { onClick: () => onRemove(product), title: 'Remove', style: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, flexShrink: 0 } },
        React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: '#e0004b', stroke: '#e0004b', strokeWidth: 2 },
          React.createElement('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' }))
      )
    );
  }

  function WishlistDrawer({ open, onClose, wishlist, onSelect, onToggleWishlist }) {
    return React.createElement(Drawer, { open, onClose, width: 440 },
      React.createElement(DrawerHead, { title: '願望清單', count: wishlist.length, onClose }),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto' } },
        wishlist.length === 0
          ? React.createElement(DrawerEmpty, { icon: '♡', title: 'Wishlist is empty', sub: 'Click ♡ on any product to save it here.', onBrowse: onClose })
          : wishlist.map((p, i) => React.createElement(WishlistItem, { key: i, product: p,
              onSelect: (p) => { onSelect(p); onClose(); },
              onRemove: onToggleWishlist }))
      )
    );
  }

  // ── Account drawer ─────────────────────────────────────────────────────────
  function AccountDrawer({ open, onClose, account, onSave, cartCount, wishlistCount, onOpenCart, onOpenWishlist }) {
    const [form, setForm] = React.useState(account || { name: '', email: '' });
    const [editing, setEditing] = React.useState(!account);
    const [savedMsg, setSavedMsg] = React.useState(false);
    const inp = { width: '100%', height: 42, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 8, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-strong)', background: '#fff', outline: 'none', boxSizing: 'border-box' };

    const save = () => {
      if (!form.name.trim() || !form.email.trim()) return;
      onSave({ ...form }); setEditing(false); setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    };
    const signOut = () => { onSave(null); setForm({ name: '', email: '' }); setEditing(true); };

    return React.createElement(Drawer, { open, onClose, width: 400 },
      React.createElement(DrawerHead, { title: '我的帳號', count: 0, onClose }),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '22px' } },

        account && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 } },
          React.createElement('button', { onClick: () => { onClose(); setTimeout(onOpenWishlist, 300); }, style: { background: '#fdf2f8', border: '1px solid #f0abfc', borderRadius: 10, padding: '14px', textAlign: 'left', cursor: 'pointer' } },
            React.createElement('div', { style: { fontSize: 22, marginBottom: 4 } }, '♡'),
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22 } }, wishlistCount),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 } }, '願望清單')
          ),
          React.createElement('button', { onClick: () => { onClose(); setTimeout(onOpenCart, 300); }, style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '14px', textAlign: 'left', cursor: 'pointer' } },
            React.createElement('div', { style: { fontSize: 22, marginBottom: 4 } }, '🛒'),
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22 } }, cartCount),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 } }, '購物車')
          )
        ),

        React.createElement('div', { style: { background: '#f8fafc', borderRadius: 12, padding: 18 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } },
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 } }, account ? '個人資料' : '建立帳號'),
            account && !editing && React.createElement('button', { onClick: () => setEditing(true), style: { background: 'none', border: '1px solid var(--border-default)', borderRadius: 7, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 } }, '編輯')
          ),
          !editing && account
            ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
                React.createElement('div', null, React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 } }, '姓名'), React.createElement('div', { style: { fontSize: 15, fontWeight: 600 } }, account.name)),
                React.createElement('div', null, React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 } }, 'Email'), React.createElement('div', { style: { fontSize: 14 } }, account.email))
              )
            : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
                React.createElement('div', null,
                  React.createElement('label', { style: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 } }, '姓名 *'),
                  React.createElement('input', { style: inp, value: form.name, onChange: ev => setForm(f => ({ ...f, name: ev.target.value })), placeholder: '你的名字' })
                ),
                React.createElement('div', null,
                  React.createElement('label', { style: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 } }, 'Email *'),
                  React.createElement('input', { style: inp, type: 'email', value: form.email, onChange: ev => setForm(f => ({ ...f, email: ev.target.value })), placeholder: 'your@email.com' })
                ),
                React.createElement('div', { style: { display: 'flex', gap: 8 } },
                  React.createElement('button', { onClick: save, style: { flex: 1, height: 40, background: 'var(--brand-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14 } }, '儲存'),
                  editing && account && React.createElement('button', { onClick: () => setEditing(false), style: { height: 40, padding: '0 14px', background: 'none', border: '1px solid var(--border-default)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 } }, '取消')
                ),
                savedMsg && React.createElement('div', { style: { fontSize: 13, color: '#16a34a', fontWeight: 700, display: 'flex', gap: 5, alignItems: 'center' } },
                  React.createElement(Icon.check, { stroke: '#16a34a' }), '已儲存！')
              ),
          account && !editing && React.createElement('button', { onClick: signOut, style: { marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600 } }, '登出 →')
        ),

        account && React.createElement('div', { style: { marginTop: 16, background: '#f8fafc', borderRadius: 12, padding: 18 } },
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 12 } }, '訂單記錄'),
          React.createElement('div', { style: { textAlign: 'center', padding: '20px 0', fontSize: 13, color: 'var(--text-muted)' } }, '暫無訂單記錄')
        )
      )
    );
  }

  // ── Product card with image carousel ──────────────────────────────────────
  function ProductCardCarousel({ product, onSelect, isWishlisted, onToggleWishlist }) {
    const imgs = getImages(product);
    const [idx, setIdx] = React.useState(0);
    const [hover, setHover] = React.useState(false);
    const multi = imgs.length > 1;

    const prev = (ev) => { ev.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); };
    const next = (ev) => { ev.stopPropagation(); setIdx(i => (i + 1) % imgs.length); };

    return React.createElement('div', {
      onClick: () => onSelect(product),
      onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
      style: { display: 'flex', flexDirection: 'column', background: 'var(--surface-card)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow .18s, border-color .18s', boxShadow: hover ? 'var(--shadow-card-hover)' : 'none', borderColor: hover ? 'var(--border-subtle)' : 'transparent' }
    },
      React.createElement('div', { style: { position: 'relative', aspectRatio: '1 / 1', background: 'var(--surface-media)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', overflow: 'hidden' } },
        product.badge && React.createElement('div', { style: { position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', zIndex: 2 } }, React.createElement(Badge, { variant: 'sale' }, product.badge)),
        React.createElement('button', {
          onClick: ev => { ev.stopPropagation(); onToggleWishlist(product); },
          style: { position: 'absolute', top: 10, right: 10, zIndex: 3, background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.15)', opacity: hover || isWishlisted ? 1 : 0, transition: 'opacity .15s', padding: 0 }
        },
          React.createElement('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: isWishlisted ? '#e0004b' : 'none', stroke: isWishlisted ? '#e0004b' : '#666', strokeWidth: 2 },
            React.createElement('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' }))
        ),
        imgs.length > 0
          ? React.createElement('img', { src: imgs[idx].url, alt: imgs[idx].alt || product.name || '', style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply', display: 'block' }, onError: ev => { ev.target.style.display = 'none'; } })
          : React.createElement('span', { style: { color: 'var(--gray-300)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' } }, 'image'),
        hover && multi && React.createElement('button', { onClick: prev, style: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 10, background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,.18)' } }, '‹'),
        hover && multi && React.createElement('button', { onClick: next, style: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 10, background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,.18)' } }, '›'),
        multi && React.createElement('div', { style: { position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(22,24,29,.60)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20, zIndex: 2 } }, (idx + 1) + ' / ' + imgs.length)
      ),
      React.createElement('div', { style: { padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' } },
        React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-strong)' } }, product.manufacturer),
        React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--text-md)', color: 'var(--text-strong)', lineHeight: 'var(--leading-snug)' } }, product.name),
        product.spec && React.createElement('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-snug)' } }, product.spec),
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginTop: 'var(--space-3)' } },
          React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 'var(--fw-extra)', fontSize: 'var(--text-2xl)', color: product.oldPrice ? 'var(--text-sale)' : 'var(--text-strong)' } },
            product.price, ' ', product.currency || '€', React.createElement('span', { style: { fontSize: 'var(--text-md)' } }, '*')
          ),
          product.oldPrice && React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textDecoration: 'line-through' } }, product.oldPrice, ' ', product.currency || '€')
        ),
        product.note && React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-sale)', fontWeight: 'var(--fw-semibold)', marginTop: 'var(--space-1)' } }, product.note)
      )
    );
  }

  // ── Product detail page ────────────────────────────────────────────────────
  function ProductDetail({ product, onBack, isWishlisted, onToggleWishlist, onAddToCart }) {
    const imgs = getImages(product);
    const [idx, setIdx] = React.useState(0);
    const [qty, setQty] = React.useState(1);
    const [added, setAdded] = React.useState(false);

    const handleAdd = () => { onAddToCart(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2200); };

    return React.createElement('main', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px 80px' } },
      React.createElement('button', { onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-primary)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-md)', padding: '18px 0 16px' } }, '‹ Back to catalog'),
      React.createElement('div', { style: { display: 'flex', gap: 60, alignItems: 'flex-start' } },
        React.createElement('div', { style: { flex: '0 0 480px' } },
          React.createElement('div', { style: { position: 'relative', background: 'var(--surface-media)', borderRadius: 12, aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 24 } },
            imgs[0]
              ? React.createElement('img', { src: imgs[idx].url, alt: imgs[idx].alt || '', style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' } })
              : React.createElement('span', { style: { color: 'var(--gray-300)', fontFamily: 'var(--font-mono)' } }, 'No image'),
            imgs.length > 1 && React.createElement('button', { onClick: () => setIdx(i => (i - 1 + imgs.length) % imgs.length), style: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 16, background: 'rgba(255,255,255,.95)', border: '1px solid var(--border-subtle)', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,.12)', zIndex: 2 } }, '‹'),
            imgs.length > 1 && React.createElement('button', { onClick: () => setIdx(i => (i + 1) % imgs.length), style: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 16, background: 'rgba(255,255,255,.95)', border: '1px solid var(--border-subtle)', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,.12)', zIndex: 2 } }, '›'),
            imgs.length > 1 && React.createElement('div', { style: { position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(22,24,29,.60)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20 } }, (idx + 1) + ' / ' + imgs.length)
          ),
          imgs.length > 1 && React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' } },
            imgs.map((img, i) => React.createElement('button', { key: i, onClick: () => setIdx(i), style: { width: 72, height: 72, background: 'var(--surface-media)', border: '2px solid ' + (i === idx ? 'var(--brand-primary)' : 'transparent'), borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color .12s' } },
              React.createElement('img', { src: img.url, alt: img.alt || '', style: { width: '100%', height: '100%', objectFit: 'contain' } })
            ))
          )
        ),
        React.createElement('div', { style: { flex: 1, paddingTop: 8 } },
          product.badge && React.createElement('div', { style: { marginBottom: 10 } }, React.createElement(Badge, { variant: 'sale' }, product.badge)),
          React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 8 } }, product.manufacturer),
          React.createElement('h1', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--text-strong)', margin: '0 0 10px', lineHeight: 1.2 } }, product.name),
          product.spec && React.createElement('div', { style: { fontSize: 15, color: 'var(--text-muted)', marginBottom: 22, lineHeight: 1.5 } }, product.spec),
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 14 } },
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 38, color: product.oldPrice ? 'var(--text-sale)' : 'var(--text-strong)' } },
              product.price, ' ', product.currency || '€', React.createElement('span', { style: { fontSize: 20 } }, '*')
            ),
            product.oldPrice && React.createElement('span', { style: { fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' } }, product.oldPrice, ' ', product.currency || '€')
          ),
          product.note && React.createElement('div', { style: { fontSize: 13, color: 'var(--text-sale)', fontWeight: 600, marginTop: 6 } }, product.note),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 28, marginBottom: 14 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' } },
              React.createElement('button', { onClick: () => setQty(q => Math.max(1, q - 1)), style: { width: 40, height: 46, background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 20 } }, '−'),
              React.createElement('span', { style: { width: 44, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 } }, qty),
              React.createElement('button', { onClick: () => setQty(q => q + 1), style: { width: 40, height: 46, background: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: 20 } }, '+')
            ),
            React.createElement('button', { onClick: handleAdd, style: { flex: 1, height: 46, background: added ? '#16a34a' : 'var(--brand-primary)', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s' } },
              added ? React.createElement(Icon.check, { stroke: '#fff' }) : null,
              added ? '已加入購物車！' : '加入購物車'
            )
          ),
          React.createElement('button', { onClick: () => onToggleWishlist(product), style: { width: '100%', height: 44, background: 'none', cursor: 'pointer', borderRadius: 8, border: '1px solid ' + (isWishlisted ? '#e0004b' : 'var(--border-default)'), color: isWishlisted ? '#e0004b' : 'var(--text-body)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .15s' } },
            React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: isWishlisted ? '#e0004b' : 'none', stroke: isWishlisted ? '#e0004b' : 'currentColor', strokeWidth: 2 },
              React.createElement('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' })),
            isWishlisted ? '已加入願望清單' : '加入願望清單'
          )
        )
      )
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────────
  function Header({ cartCount, wishlistCount, onCart, onWishlist, onAccount }) {
    return React.createElement('header', { style: { background: 'var(--surface-header)', color: '#fff' } },
      React.createElement('div', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', height: 'var(--header-bar-h)', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 26 } },
        React.createElement('button', { 'aria-label': 'Menu', style: iconBtn }, React.createElement(Icon.burger, null)),
        React.createElement('img', { src: 'assets/logo-armorbike-on-blue.svg', alt: 'ARMOR BIKE', style: { height: 34, display: 'block' } }),
        React.createElement('div', { style: { flex: 1, maxWidth: 720, margin: '0 8px' } }, React.createElement(SearchInput, { placeholder: 'Search for bikes, gear & clothing…' })),
        React.createElement(HeaderAction, { icon: Icon.heart, label: 'Wishlist', badge: wishlistCount || null, onClick: onWishlist }),
        React.createElement(HeaderAction, { icon: Icon.user, label: 'Account', onClick: onAccount }),
        React.createElement(HeaderAction, { icon: Icon.cart, label: 'Cart', badge: cartCount || null, onClick: onCart })
      )
    );
  }
  function HeaderAction({ icon, label, badge, onClick }) {
    return React.createElement('button', { onClick, style: { ...iconBtn, flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600 } },
      React.createElement('span', { style: { position: 'relative', display: 'block' } },
        React.createElement(icon, null),
        badge ? React.createElement('span', { style: { position: 'absolute', top: -6, right: -8, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 999, background: 'var(--brand-accent)', color: 'var(--gray-900)', fontSize: 10, fontWeight: 800, lineHeight: '17px', textAlign: 'center' } }, badge) : null
      ),
      React.createElement('span', null, label)
    );
  }

  // ── NavBar + MegaMenu ──────────────────────────────────────────────────────
  function HeroButton({ children, tone, onClick }) {
    const [state, setState] = React.useState('rest');
    const isPrimary = tone === 'primary';
    const active = state === 'active';
    const lifted = state === 'hover' || state === 'focus';
    return React.createElement('button', {
      onClick,
      onMouseEnter: () => setState('hover'),
      onMouseLeave: () => setState('rest'),
      onMouseDown: () => setState('active'),
      onMouseUp: () => setState('hover'),
      onFocus: () => setState('focus'),
      onBlur: () => setState('rest'),
      style: {
        height: 42,
        padding: '0 18px',
        borderRadius: 'var(--radius-sm)',
        border: isPrimary ? '1px solid var(--brand-accent)' : '1px solid rgba(255,255,255,.34)',
        background: isPrimary ? 'var(--brand-accent)' : 'rgba(255,255,255,.08)',
        color: isPrimary ? 'var(--gray-900)' : '#fff',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 800,
        letterSpacing: 'var(--tracking-normal)',
        boxShadow: lifted ? '0 12px 28px rgba(255,209,5,.22)' : '0 4px 12px rgba(0,0,0,.18)',
        transform: active ? 'translateY(1px)' : (lifted ? 'translateY(-1px)' : 'translateY(0)'),
        transition: 'transform var(--dur-normal) var(--ease-out), opacity var(--dur-fast) var(--ease-standard), box-shadow var(--dur-normal) var(--ease-out)'
      }
    }, children);
  }

  function HeroSystem() {
    const heroImgs = React.useMemo(() => {
      // Prefer the dedicated hero array set via CMS admin
      if (STORE.hero && STORE.hero.length > 0) return STORE.hero;
      // Fallback: filter image library for images with "hero" in alt text
      return (STORE.images || [])
        .filter(img => /hero/i.test(img.alt || ''))
        .sort((a, b) => (a.alt || '').localeCompare(b.alt || '', undefined, { numeric: true }));
    }, []);

    const [active, setActive] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [ratios, setRatios] = React.useState({});
    const INTERVAL = 5000;
    const count = heroImgs.length;
    const activeImg = heroImgs[active] || heroImgs[0] || {};
    const activeKey = activeImg.url || activeImg.id || active;
    const activeRatio = ratios[activeKey] || 1.5;

    React.useEffect(() => {
      if (count <= 1 || paused) { setProgress(0); return; }
      setProgress(0);
      let start = null;
      let raf;
      const tick = (ts) => {
        if (!start) start = ts;
        const pct = Math.min((ts - start) / INTERVAL, 1);
        setProgress(pct);
        if (pct < 1) { raf = requestAnimationFrame(tick); }
        else { setActive(a => (a + 1) % count); }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [active, paused, count]);

    if (!count) return null;

    const go = (n) => { setProgress(0); setActive(a => (a + n + count) % count); };

    const arrowStyle = (side) => ({
      position: 'absolute', [side]: 18, top: '50%', transform: 'translateY(-50%)',
      zIndex: 10, background: 'rgba(0,0,0,0.36)', border: '1.5px solid rgba(255,255,255,0.22)',
      borderRadius: '50%', width: 46, height: 46, cursor: 'pointer', color: '#fff',
      fontSize: 26, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      transition: 'background 0.18s', padding: 0, outline: 'none',
      boxShadow: '0 2px 12px rgba(0,0,0,0.28)'
    });

    return React.createElement('section', {
      'aria-label': 'Hero carousel',
      style: { position: 'relative', overflow: 'hidden', background: '#05080d', userSelect: 'none', aspectRatio: String(activeRatio), transition: 'opacity 0.2s var(--ease-standard)' },
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false)
    },
      // Slides — crossfade
      heroImgs.map((img, i) => React.createElement('div', {
        key: img.id || i,
        'aria-hidden': i !== active,
        style: {
          position: 'absolute',
          inset: 0,
          opacity: i === active ? 1 : 0,
          transition: 'opacity 0.85s cubic-bezier(0.4,0,0.2,1)',
          zIndex: i === active ? 1 : 0
        }
      },
        React.createElement('img', {
          src: img.url, alt: img.alt || '',
          onLoad: ev => {
            const el = ev.currentTarget;
            if (!el.naturalWidth || !el.naturalHeight) return;
            const key = img.url || img.id || i;
            const ratio = el.naturalWidth / el.naturalHeight;
            setRatios(prev => prev[key] === ratio ? prev : { ...prev, [key]: ratio });
          },
          style: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' }
        })
      )),

      // Left arrow
      count > 1 && React.createElement('button', {
        onClick: () => go(-1), 'aria-label': 'Previous slide',
        style: arrowStyle('left'),
        onMouseEnter: e => e.currentTarget.style.background = 'rgba(0,0,0,0.62)',
        onMouseLeave: e => e.currentTarget.style.background = 'rgba(0,0,0,0.36)'
      }, '‹'),

      // Right arrow
      count > 1 && React.createElement('button', {
        onClick: () => go(1), 'aria-label': 'Next slide',
        style: arrowStyle('right'),
        onMouseEnter: e => e.currentTarget.style.background = 'rgba(0,0,0,0.62)',
        onMouseLeave: e => e.currentTarget.style.background = 'rgba(0,0,0,0.36)'
      }, '›'),

      // Dot navigation
      count > 1 && React.createElement('div', {
        style: { position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 8 }
      },
        heroImgs.map((_, i) => React.createElement('button', {
          key: i,
          onClick: () => go(i - active),
          'aria-label': 'Go to slide ' + (i + 1),
          style: {
            width: i === active ? 28 : 8, height: 8, borderRadius: 999, border: 'none', padding: 0,
            background: i === active ? '#fff' : 'rgba(255,255,255,0.46)',
            cursor: 'pointer',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), background 0.18s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
          }
        }))
      ),

      // Progress bar
      React.createElement('div', {
        style: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, height: 3, background: 'rgba(255,255,255,0.14)' }
      },
        React.createElement('div', {
          style: { height: '100%', width: (progress * 100) + '%', background: 'var(--brand-primary)', transition: 'none' }
        })
      )
    );
  }

  function NavBar({ openMenu, activeCat, onTopClick, onTopEnter, onSubClick, onClose }) {
    return React.createElement('div', { onMouseLeave: onClose, style: { position: 'relative', borderBottom: '1px solid var(--border-subtle)', background: '#fff', zIndex: 40 } },
      React.createElement('nav', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px', height: 'var(--nav-bar-h)', display: 'flex', alignItems: 'stretch', gap: 4 } },
        STORE.categories.map(c => {
          const open = openMenu === c.id, active = activeCat === c.id, sale = !!c.accent;
          return React.createElement('button', { key: c.id, onClick: () => onTopClick(c), onMouseEnter: () => onTopEnter(c), style: { position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', fontWeight: sale ? 800 : (open || active ? 700 : 600), color: sale ? 'var(--brand-sale)' : (open ? 'var(--brand-primary)' : 'var(--text-strong)'), borderBottom: '3px solid ' + (open ? 'var(--brand-primary)' : 'transparent'), marginBottom: -1, transition: 'color .12s, border-color .12s' } }, c.label);
        })
      ),
      openMenu ? React.createElement(MegaMenu, { cat: STORE.map[openMenu], onSubClick }) : null
    );
  }
  function MegaMenu({ cat, onSubClick }) {
    return React.createElement('div', { style: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderTop: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' } },
      React.createElement('div', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 28px 38px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 300px', gap: 28 } },
        cat.mega.map((col, ci) =>
          React.createElement('div', { key: ci, style: { display: 'flex', flexDirection: 'column', gap: 26 } },
            col.map((grp, gi) =>
              React.createElement('div', { key: gi },
                React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-strong)', marginBottom: 12 } }, grp.title),
                React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 } },
                  grp.links.map(lk => React.createElement('li', { key: lk },
                    React.createElement('a', { href: '#', onClick: ev => { ev.preventDefault(); onSubClick(cat, lk); }, style: { textDecoration: 'none', color: 'var(--text-body)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', cursor: 'pointer', transition: 'color .12s' }, onMouseEnter: ev => ev.currentTarget.style.color = 'var(--brand-primary)', onMouseLeave: ev => ev.currentTarget.style.color = 'var(--text-body)' }, lk)
                  ))
                )
              )
            )
          )
        ),
        React.createElement(BestSellers, { cat, onSubClick })
      )
    );
  }
  function BestSellers({ cat, onSubClick }) {
    return React.createElement('div', { style: { borderLeft: '1px solid var(--border-subtle)', paddingLeft: 26 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 } },
        React.createElement('span', { style: { width: 8, height: 8, borderRadius: 2, background: 'var(--brand-sale)' } }),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-strong)' } }, "This Week's Best Sellers")
      ),
      cat.products.slice(0, 3).map((p, i) =>
        React.createElement('a', { key: i, href: '#', onClick: ev => { ev.preventDefault(); onSubClick(cat, cat.leaf); }, style: { display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', padding: '6px 0' } },
          React.createElement('div', { style: { width: 60, height: 60, flexShrink: 0, background: 'var(--surface-media)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontFamily: 'var(--font-mono)', fontSize: 10 } }, 'IMG'),
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-strong)' } }, p.manufacturer),
            React.createElement('div', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', lineHeight: 1.25, margin: '2px 0 4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } }, p.name),
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: p.oldPrice ? 'var(--text-sale)' : 'var(--text-strong)' } }, p.price + ' €*')
          )
        )
      ),
      React.createElement('a', { href: '#', onClick: ev => { ev.preventDefault(); onSubClick(cat, cat.leaf); }, style: { display: 'block', marginTop: 2, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-link)', textDecoration: 'none' } }, 'See all best sellers →')
    );
  }

  // ── Catalog layout (Breadcrumb / Sidebar / Main) ───────────────────────────
  function Breadcrumb({ cat, leaf }) {
    const parts = ['Home'].concat(cat.crumb || [], [leaf]);
    return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: '18px 0 4px' } },
      parts.map((p, i) => React.createElement('span', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { color: i === parts.length - 1 ? 'var(--text-body)' : 'var(--text-link)', fontWeight: i === parts.length - 1 ? 600 : 400 } }, p),
        i < parts.length - 1 && React.createElement('span', { style: { color: 'var(--border-default)' } }, '›')
      ))
    );
  }
  function Sidebar({ cat, checked, toggleCheck, colors, toggleColor }) {
    return React.createElement('aside', { style: { width: 290, flexShrink: 0 } },
      (cat.facets || []).map((f, i) => React.createElement(Facet, { key: cat.id + i, facet: f, fkey: cat.id + i, checked, toggleCheck, colors, toggleColor })),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '22px 0 8px' } },
        React.createElement(Button, { variant: 'ghost', iconLeft: React.createElement(Icon.sliders, { stroke: 'var(--brand-primary)' }), style: { color: 'var(--brand-primary)' } }, 'More filter')
      )
    );
  }
  function Facet({ facet, fkey, checked, toggleCheck, colors, toggleColor }) {
    if (facet.kind === 'range') return React.createElement(RangeFacet, { facet });
    if (facet.kind === 'toggles') return React.createElement('div', { style: { padding: 'var(--space-5) 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
      (facet.options || []).map(o => React.createElement(Checkbox, { key: o.label, checked: !!checked[fkey + ':' + o.label], onChange: () => toggleCheck(fkey, o.label), count: o.count, label: React.createElement('span', { style: { color: o.sale ? 'var(--text-sale)' : 'var(--text-body)', fontWeight: o.sale ? 700 : 400 } }, o.label) })));
    if (facet.kind === 'color') return React.createElement(FilterGroup, { title: facet.title },
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 14, paddingTop: 4 } },
        (facet.options || []).map((o, i) => React.createElement(ColorSwatch, { key: i, color: o.color, count: o.count, selected: !!colors[fkey + ':' + i], onClick: () => toggleColor(fkey, i) }))));
    return React.createElement(FilterGroup, { title: facet.title },
      (facet.options || []).map(o => React.createElement(Checkbox, { key: o.label, checked: !!checked[fkey + ':' + o.label], onChange: () => toggleCheck(fkey, o.label), label: o.label, count: o.count })),
      facet.more && React.createElement('button', { style: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', color: 'var(--text-link)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600 } }, React.createElement(Icon.chevron, { stroke: 'var(--text-link)' }), 'Show more')
    );
  }
  function RangeFacet({ facet }) {
    return React.createElement('div', { style: { padding: '4px 0 var(--space-6)', borderBottom: '1px solid var(--border-subtle)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
        React.createElement(PriceBox, { value: facet.min }), React.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' } }, 'To'), React.createElement(PriceBox, { value: facet.max })),
      React.createElement('div', { style: { position: 'relative', height: 4, background: 'var(--gray-200)', borderRadius: 999, margin: '22px 6px 6px' } },
        React.createElement('div', { style: { position: 'absolute', left: '4%', right: '4%', top: 0, bottom: 0, background: 'var(--brand-primary)', borderRadius: 999 } }),
        React.createElement('span', { style: { position: 'absolute', left: '4%', top: '50%', width: 16, height: 16, transform: 'translate(-50%,-50%)', background: '#fff', border: '2px solid var(--brand-primary)', borderRadius: '50%' } }),
        React.createElement('span', { style: { position: 'absolute', left: '96%', top: '50%', width: 16, height: 16, transform: 'translate(-50%,-50%)', background: '#fff', border: '2px solid var(--brand-primary)', borderRadius: '50%' } })
      )
    );
  }
  function PriceBox({ value }) {
    return React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: 'var(--text-strong)' } },
      React.createElement('span', { style: { color: 'var(--text-muted)' } }, '€'), React.createElement('span', null, value));
  }
  function Main({ cat, leaf, sort, setSort, onSelect, isWishlisted, onToggleWishlist }) {
    const products = React.useMemo(() => {
      const arr = (cat.products || []).slice();
      if (sort === 'Price: low to high') arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      else if (sort === 'Price: high to low') arr.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      else if (sort === 'Newest') arr.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
      return arr;
    }, [cat, sort]);
    return React.createElement('section', { style: { flex: 1, minWidth: 0 } },
      React.createElement('h1', { style: { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-4xl)', letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '0 0 18px' } }, leaf),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('span', { style: { background: 'var(--gray-100)', color: 'var(--text-strong)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' } }, (TOTALS[cat.id] || 0).toLocaleString()),
          React.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: 'var(--text-muted)' } }, 'products')
        ),
        React.createElement(SortMenu, { sort, setSort })
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 } },
        products.map((p, i) => React.createElement(ProductCardCarousel, { key: cat.id + i, product: p, onSelect, isWishlisted: isWishlisted(p), onToggleWishlist }))
      )
    );
  }
  function SortMenu({ sort, setSort }) {
    const [open, setOpen] = React.useState(false);
    return React.createElement('div', { style: { position: 'relative' }, onMouseLeave: () => setOpen(false) },
      React.createElement('button', { onClick: () => setOpen(o => !o), style: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--brand-primary)' } },
        sort, React.createElement(Icon.chevron, { stroke: 'var(--brand-primary)', style: { transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' } })
      ),
      open && React.createElement('div', { style: { position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', minWidth: 200, zIndex: 30, overflow: 'hidden' } },
        SORTS.map(s => React.createElement('button', { key: s, onClick: () => { setSort(s); setOpen(false); }, style: { display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: s === sort ? 'var(--blue-50)' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', color: s === sort ? 'var(--brand-primary)' : 'var(--text-body)', fontWeight: s === sort ? 700 : 400 } }, s))
      )
    );
  }

  // ── App ────────────────────────────────────────────────────────────────────
  function App() {
    const [openMenu, setOpenMenu] = React.useState(null);
    const [activeCat, setActiveCat] = React.useState('bikes');
    const [leaf, setLeaf] = React.useState(STORE.map.bikes.leaf);
    const [sort, setSort] = React.useState('Popularity');
    const [checked, setChecked] = React.useState({});
    const [colors, setColors] = React.useState({});
    const [detailProduct, setDetailProduct] = React.useState(null);
    const [openDrawer, setOpenDrawer] = React.useState(null); // 'cart' | 'wishlist' | 'account' | null
    const [cart, setCart] = React.useState(() => loadLS('armor_cart', []));
    const [wishlist, setWishlist] = React.useState(() => loadLS('armor_wishlist', []));
    const [account, setAccount] = React.useState(() => loadLS('armor_account', null));

    const cat = STORE.map[activeCat];
    const cartCount = cart.reduce((s, x) => s + x.qty, 0);
    const cartTotal = cart.reduce((s, x) => s + parsePrice(x.product.price) * x.qty, 0);

    const toggleCheck = (fkey, label) => setChecked(s => { const k = fkey + ':' + label, n = { ...s }; n[k] ? delete n[k] : (n[k] = true); return n; });
    const toggleColor = (fkey, i) => setColors(s => { const k = fkey + ':' + i, n = { ...s }; n[k] ? delete n[k] : (n[k] = true); return n; });
    const resetFilters = () => { setChecked({}); setColors({}); setSort('Popularity'); };

    const isWishlisted = (p) => wishlist.some(x => prodKey(x) === prodKey(p));
    const toggleWishlist = (p) => setWishlist(wl => {
      const key = prodKey(p);
      const next = wl.some(x => prodKey(x) === key) ? wl.filter(x => prodKey(x) !== key) : [...wl, p];
      saveLS('armor_wishlist', next); return next;
    });
    const addToCart = (product, qty) => setCart(c => {
      const key = prodKey(product), ex = c.find(x => x.key === key);
      const next = ex ? c.map(x => x.key === key ? { ...x, qty: x.qty + qty } : x) : [...c, { key, product, qty }];
      saveLS('armor_cart', next); return next;
    });
    const removeFromCart = (key) => setCart(c => { const n = c.filter(x => x.key !== key); saveLS('armor_cart', n); return n; });
    const updateCartQty = (key, delta) => setCart(c => { const n = c.map(x => x.key === key ? { ...x, qty: Math.max(1, x.qty + delta) } : x); saveLS('armor_cart', n); return n; });
    const saveAccount = (a) => { setAccount(a); a ? saveLS('armor_account', a) : localStorage.removeItem('armor_account'); };

    const onTopClick = (c) => { setActiveCat(c.id); setLeaf(c.leaf); resetFilters(); setDetailProduct(null); setOpenMenu(null); };
    const onTopEnter = (c) => setOpenMenu(c.id);
    const onSubClick = (c, lk) => { setActiveCat(c.id); setLeaf(lk); resetFilters(); setDetailProduct(null); setOpenMenu(null); };
    const onHeroBrowseParts = () => { onSubClick(STORE.map.parts, STORE.map.parts.leaf); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const onHeroContactSales = () => { window.location.href = 'mailto:?subject=Rainbow%20CNC%20MTB%20Pedals%20Inquiry'; };
    const onCloseMenu = () => setOpenMenu(null);
    const onSelectProduct = (p) => { setDetailProduct(p); setOpenMenu(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const onBack = () => setDetailProduct(null);

    const closeDrawer = () => setOpenDrawer(null);

    const content = detailProduct
      ? React.createElement(ProductDetail, { product: detailProduct, onBack, isWishlisted: isWishlisted(detailProduct), onToggleWishlist: toggleWishlist, onAddToCart: addToCart })
      : React.createElement('main', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px 80px' } },
          React.createElement(Breadcrumb, { cat, leaf }),
          React.createElement('div', { style: { display: 'flex', gap: 40, alignItems: 'flex-start', marginTop: 14 } },
            React.createElement(Sidebar, { cat, checked, toggleCheck, colors, toggleColor }),
            React.createElement(Main, { cat, leaf, sort, setSort, onSelect: onSelectProduct, isWishlisted, onToggleWishlist: toggleWishlist })
          )
        );

    return React.createElement(React.Fragment, null,
      React.createElement(Header, { cartCount, wishlistCount: wishlist.length, onCart: () => setOpenDrawer('cart'), onWishlist: () => setOpenDrawer('wishlist'), onAccount: () => setOpenDrawer('account') }),
      React.createElement(NavBar, { openMenu, activeCat, onTopClick, onTopEnter, onSubClick, onClose: onCloseMenu }),
      !detailProduct && React.createElement(HeroSystem, { onBrowseParts: onHeroBrowseParts, onContactSales: onHeroContactSales }),
      openMenu && React.createElement('div', { onClick: onCloseMenu, style: { position: 'fixed', inset: 0, background: 'rgba(22,24,29,0.28)', zIndex: 20 } }),
      content,
      // Three right-side drawers — always in DOM so the slide animation works
      React.createElement(CartDrawer, { open: openDrawer === 'cart', onClose: closeDrawer, cart, onRemove: removeFromCart, onUpdateQty: updateCartQty, cartTotal }),
      React.createElement(WishlistDrawer, { open: openDrawer === 'wishlist', onClose: closeDrawer, wishlist, onSelect: onSelectProduct, onToggleWishlist: toggleWishlist }),
      React.createElement(AccountDrawer, { open: openDrawer === 'account', onClose: closeDrawer, account, onSave: saveAccount, cartCount, wishlistCount: wishlist.length, onOpenCart: () => { closeDrawer(); setTimeout(() => setOpenDrawer('cart'), 300); }, onOpenWishlist: () => { closeDrawer(); setTimeout(() => setOpenDrawer('wishlist'), 300); } })
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
