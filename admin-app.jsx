/* ARMOR BIKE — CMS Admin Panel */
(function () {
  const e = React.createElement;
  const { useState, useMemo, useRef, useEffect } = React;

  const BRAND = '#006ee0';
  const SALE_COLOR = '#e0004b';
  const CMS_KEY = 'ARMOR_BIKE_CMS';
  const AUTH_KEY = 'ARMOR_BIKE_AUTH';
  const USERS_KEY = 'ARMOR_BIKE_USERS';

  // ── storage ──────────────────────────────────────────────────────────────
  const loadCMS = () => { try { const r = localStorage.getItem(CMS_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
  const saveCMS = (d) => localStorage.setItem(CMS_KEY, JSON.stringify(d));
  const loadAuth = () => { try { const r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
  const saveAuth = (u) => u ? localStorage.setItem(AUTH_KEY, JSON.stringify(u)) : localStorage.removeItem(AUTH_KEY);
  const loadUsers = () => { try { const r = localStorage.getItem(USERS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } };
  const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

  const CLOUDINARY_KEY = 'ARMOR_BIKE_CDN';
  const loadCldConfig = () => { try { return JSON.parse(localStorage.getItem(CLOUDINARY_KEY)) || {}; } catch { return {}; } };
  const saveCldConfig = (c) => localStorage.setItem(CLOUDINARY_KEY, JSON.stringify(c));

  const GITHUB_KEY = 'ARMOR_BIKE_GITHUB';
  const loadGithubConfig = () => { try { return JSON.parse(localStorage.getItem(GITHUB_KEY)) || {}; } catch { return {}; } };
  const saveGithubConfig = (c) => localStorage.setItem(GITHUB_KEY, JSON.stringify(c));

  // ── cross-origin config sync (users + GitHub token + Cloudinary) ───────────
  // localStorage is per-origin (localhost / 192.168.x / pages.dev don't share it),
  // so settings move between devices via this one-blob export/import.
  const exportConfigBlob = () => JSON.stringify({ v: 1, exported: new Date().toISOString(), users: loadUsers(), github: loadGithubConfig(), cloudinary: loadCldConfig() }, null, 2);
  const importConfigBlob = (txt) => {
    const d = JSON.parse(txt);
    let total = loadUsers().length;
    if (Array.isArray(d.users)) {
      // merge by username (incoming wins for duplicates) so no account on either side is lost
      const cur = loadUsers();
      const inNames = new Set(d.users.map(u => u.username));
      const merged = [...cur.filter(u => !inNames.has(u.username)), ...d.users];
      saveUsers(merged);
      total = merged.length;
    }
    if (d.github && typeof d.github === 'object') saveGithubConfig(d.github);
    if (d.cloudinary && typeof d.cloudinary === 'object') saveCldConfig(d.cloudinary);
    return { users: total };
  };

  function getInitialData() {
    const cms = loadCMS();
    const published = {
      categories: JSON.parse(JSON.stringify(window.STORE.categories)),
      images: JSON.parse(JSON.stringify(window.STORE.images || [])),
      badges: [],
      hero: JSON.parse(JSON.stringify(window.STORE.hero || []))
    };
    if (cms && cms.categories && cms.categories.length > 0) {
      const merged = { ...published, ...cms };
      if (!Array.isArray(cms.images) || !cms.images.length) merged.images = published.images;
      if (!Array.isArray(cms.hero) || !cms.hero.length) merged.hero = published.hero;
      return merged;
    }
    return published;
  }

  function generateStoreJS(data) {
    const HEX = window.STORE.HEX;
    const hexLines = Object.entries(HEX).map(([k, v]) => `    ${k}: '${v}'`).join(',\n');
    const ts = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
    return [
      `/* ARMOR BIKE Storefront — published ${ts} */`,
      `(function () {`,
      `  var HEX = {\n${hexLines}\n  };`,
      `  var categories = ${JSON.stringify(data.categories, null, 2)};`,
      `  var images = ${JSON.stringify(data.images || [], null, 2)};`,
      `  var hero = ${JSON.stringify(data.hero || [], null, 2)};`,
      `  var map = {};`,
      `  categories.forEach(function (c) { map[c.id] = c; });`,
      `  try {`,
      `    var _cms = localStorage.getItem('ARMOR_BIKE_CMS');`,
      `    if (_cms) { var _d = JSON.parse(_cms); if (_d) { if (Array.isArray(_d.categories) && _d.categories.length) { categories = _d.categories; map = {}; categories.forEach(function (c) { map[c.id] = c; }); } if (Array.isArray(_d.images) && _d.images.length) { images = _d.images; } if (Array.isArray(_d.hero) && _d.hero.length) { hero = _d.hero; } } }`,
      `  } catch (_e) {}`,
      `  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, hero: hero };`,
      `})();`,
    ].join('\n');
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const S = {
    heading: { fontSize: 26, fontWeight: 800, color: '#16181d', margin: '0 0 24px', letterSpacing: '-0.02em' },
    card: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)', padding: 24, marginBottom: 20 },
    label: { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' },
    input: { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' },
    btnPrimary: { padding: '9px 20px', background: BRAND, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
    btnGhost: { padding: '9px 20px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    btnSm: { padding: '5px 10px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    btnDanger: { padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    th: { textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #f1f5f9', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 14, color: '#374151' },
  };

  const Field = ({ label, children }) => e('div', null, e('label', { style: S.label }, label), children);
  const Input = (props) => e('input', { style: S.input, ...props });
  const Select = ({ children, ...props }) => e('select', { style: S.input, ...props }, children);

  const IconPencil = ({ size = 18 }) =>
    e('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { display: 'block', flexShrink: 0 } },
      e('path', { d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' })
    );

  // ── Modal ─────────────────────────────────────────────────────────────────
  function Modal({ title, onClose, children, width = 520 }) {
    return e('div', { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }, onClick: onClose },
      e('div', { style: { background: '#fff', borderRadius: 14, padding: 32, width, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto' }, onClick: ev => ev.stopPropagation() },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 } },
          e('h3', { style: { margin: 0, fontSize: 18, fontWeight: 800 } }, title),
          e('button', { onClick: onClose, style: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 } }, '×')
        ),
        children
      )
    );
  }

  // ── FirstTimeSetup ────────────────────────────────────────────────────────
  function FirstTimeSetup({ onSetup, onCancel }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [err, setErr] = useState('');
    const submit = (ev) => {
      ev.preventDefault();
      if (!username.trim()) return setErr('請輸入帳號');
      if (password.length < 6) return setErr('密碼至少需要 6 個字元');
      if (password !== confirm) return setErr('兩次密碼不一致');
      const existing = loadUsers();
      const admin = { id: Date.now(), username: username.trim(), password, role: 'admin', name: displayName.trim() || username.trim() };
      saveUsers([...existing, admin]);
      saveAuth(admin);
      onSetup(admin);
    };
    return e('div', { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)' } },
      e('div', { style: { background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.25)', padding: '48px 40px', width: 420 } },
        e('div', { style: { textAlign: 'center', marginBottom: 32 } },
          e('img', { src: 'assets/logo-armorbike-on-light.svg', alt: 'ARMOR BIKE', style: { height: 38 } }),
          e('h2', { style: { margin: '14px 0 4px', fontSize: 22, fontWeight: 800, color: '#16181d' } }, '建立管理員帳號'),
          e('p', { style: { margin: 0, fontSize: 13, color: '#94a3b8' } }, '設定一組登入帳號與密碼')
        ),
        e('form', { onSubmit: submit },
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, '顯示名稱'), e(Input, { value: displayName, onChange: ev => setDisplayName(ev.target.value), placeholder: 'Administrator', autoFocus: true })),
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, '帳號'), e(Input, { value: username, onChange: ev => setUsername(ev.target.value), placeholder: 'admin' })),
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, '密碼（至少 6 位）'), e(Input, { type: 'password', value: password, onChange: ev => setPassword(ev.target.value), placeholder: '••••••••' })),
          e('div', { style: { marginBottom: 20 } }, e('label', { style: S.label }, '確認密碼'), e(Input, { type: 'password', value: confirm, onChange: ev => setConfirm(ev.target.value), placeholder: '••••••••' })),
          err ? e('div', { style: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 } }, err) : null,
          e('button', { type: 'submit', style: { ...S.btnPrimary, width: '100%', padding: 13, fontSize: 15 } }, '建立帳號並登入'),
          onCancel ? e('button', { type: 'button', onClick: onCancel, style: { ...S.btnGhost, width: '100%', padding: 11, fontSize: 13, marginTop: 10 } }, '← 返回登入') : null
        )
      )
    );
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  function Login({ onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' | 'setup'
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [err, setErr] = useState('');
    const [showImport, setShowImport] = useState(false);
    const [blob, setBlob] = useState('');
    const noUsers = loadUsers().length === 0;
    if (mode === 'setup') return e(FirstTimeSetup, { onSetup: onLogin, onCancel: () => setMode('login') });
    const submit = (ev) => {
      ev.preventDefault();
      const user = loadUsers().find(x => x.username === u && x.password === p);
      if (user) { saveAuth(user); onLogin(user); }
      else setErr('帳號或密碼錯誤');
    };
    const doImport = () => {
      try { const r = importConfigBlob(blob); setErr(''); setShowImport(false); setBlob(''); alert('設定已匯入（' + r.users + ' 個帳號）。請使用同步後的帳號登入。'); }
      catch (_) { setErr('匯入失敗：設定格式錯誤'); }
    };
    return e('div', { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)' } },
      e('div', { style: { background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.25)', padding: '48px 40px', width: 400 } },
        e('div', { style: { textAlign: 'center', marginBottom: 32 } },
          e('img', { src: 'assets/logo-armorbike-on-light.svg', alt: 'ARMOR BIKE', style: { height: 38 } }),
          e('h2', { style: { margin: '14px 0 4px', fontSize: 22, fontWeight: 800, color: '#16181d' } }, 'CMS Admin Panel'),
          e('p', { style: { margin: 0, fontSize: 13, color: '#94a3b8' } }, 'Sign in to manage your store content')
        ),
        noUsers ? e('div', { style: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: 12.5, color: '#92400e', lineHeight: 1.5 } },
          '此裝置尚無帳號。可在其他已設定的裝置（後台 → Settings → 匯出設定）複製設定後，於此「匯入設定」，或建立新帳號。'
        ) : null,
        e('form', { onSubmit: submit },
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, 'Username'), e(Input, { value: u, onChange: ev => setU(ev.target.value), placeholder: 'admin', autoFocus: true })),
          e('div', { style: { marginBottom: 20 } }, e('label', { style: S.label }, 'Password'), e(Input, { type: 'password', value: p, onChange: ev => setP(ev.target.value), placeholder: '••••••••' })),
          err ? e('div', { style: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 } }, err) : null,
          e('button', { type: 'submit', style: { ...S.btnPrimary, width: '100%', padding: 13, fontSize: 15 } }, 'Sign In')
        ),
        e('div', { style: { marginTop: 18, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 } },
          e('div', { style: { display: 'flex', gap: 14, justifyContent: 'center', fontSize: 13 } },
            e('button', { type: 'button', onClick: () => setShowImport(v => !v), style: { background: 'none', border: 'none', color: BRAND, cursor: 'pointer', fontWeight: 600 } }, '⬇ 匯入設定'),
            e('span', { style: { color: '#cbd5e1' } }, '·'),
            e('button', { type: 'button', onClick: () => setMode('setup'), style: { background: 'none', border: 'none', color: BRAND, cursor: 'pointer', fontWeight: 600 } }, '＋ 建立帳號')
          ),
          showImport ? e('div', null,
            e('textarea', { value: blob, onChange: ev => setBlob(ev.target.value), placeholder: '貼上從其他裝置匯出的設定 JSON…', style: { ...S.input, width: '100%', height: 90, fontFamily: 'monospace', fontSize: 12, marginTop: 6 } }),
            e('button', { type: 'button', onClick: doImport, disabled: !blob.trim(), style: { ...S.btnPrimary, width: '100%', padding: 10, fontSize: 13, marginTop: 8, opacity: blob.trim() ? 1 : 0.5 } }, '匯入並同步')
          ) : null
        )
      )
    );
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────
  function Sidebar({ section, setSection, user, onLogout }) {
    const nav = [
      { id: 'dashboard', icon: '◈', label: 'Dashboard' },
      { id: 'hero', icon: '▶', label: 'Hero Carousel' },
      { id: 'categories', icon: '☰', label: 'Navigation Menu' },
      { id: 'megamenu', icon: '▦', label: 'Mega Menu' },
      { id: 'filters', icon: '▽', label: 'Left-side Filters' },
      { id: 'products', icon: '◻', label: 'Products' },
      { id: 'badges', icon: '◈', label: 'Tags & Badges' },
      { id: 'images', icon: '▣', label: 'Image Library' },
      ...(user.role === 'admin' ? [{ id: 'users', icon: '◉', label: 'Users' }] : []),
      { id: 'settings', icon: '⚙', label: 'Settings' },
    ];
    return e('aside', { style: { width: 230, background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 } },
      e('div', { style: { padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' } },
        e('div', { style: { fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' } }, 'ARMOR BIKE'),
        e('div', { style: { fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' } }, 'CMS Admin')
      ),
      e('nav', { style: { flex: 1, padding: '12px 10px' } },
        nav.map(item => e('button', {
          key: item.id, onClick: () => setSection(item.id),
          style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 14px', background: section === item.id ? BRAND : 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: section === item.id ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: section === item.id ? 700 : 500, marginBottom: 2 }
        }, e('span', { style: { fontSize: 15 } }, item.icon), item.label))
      ),
      e('div', { style: { padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,.07)' } },
        e('div', { style: { fontSize: 13, fontWeight: 600, color: '#e2e8f0' } }, user.name),
        e('div', { style: { fontSize: 11, color: '#475569', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.05em' } }, user.role),
        e('button', { onClick: onLogout, style: { marginTop: 10, padding: '5px 12px', background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 6, color: '#64748b', fontSize: 12, cursor: 'pointer', width: '100%' } }, 'Sign Out')
      )
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  function Dashboard({ data }) {
    const totalProducts = data.categories.reduce((a, c) => a + (c.products || []).length, 0);
    const stats = [
      { label: 'Categories', value: data.categories.length, color: BRAND },
      { label: 'Products', value: totalProducts, color: '#16a34a' },
      { label: 'Images', value: (data.images || []).length, color: '#f97316' },
      { label: 'Users', value: loadUsers().length, color: '#7c3aed' },
    ];
    return e('div', null,
      e('h1', { style: S.heading }, 'Dashboard'),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 } },
        stats.map(s => e('div', { key: s.label, style: { background: '#fff', borderRadius: 12, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,.06)', borderLeft: `4px solid ${s.color}` } },
          e('div', { style: { fontSize: 30, fontWeight: 900, color: '#16181d' } }, s.value),
          e('div', { style: { fontSize: 13, color: '#64748b', marginTop: 4 } }, s.label)
        ))
      ),
      e('div', { style: S.card },
        e('h2', { style: { margin: '0 0 16px', fontSize: 17, fontWeight: 700 } }, 'Category Overview'),
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['Category', 'Products', 'Mega Columns', 'Filters'].map(h => e('th', { key: h, style: S.th }, h)))),
          e('tbody', null,
            data.categories.map((cat, i) => e('tr', { key: cat.id, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
              e('td', { style: S.td }, e('span', { style: { fontWeight: 700, color: cat.accent ? SALE_COLOR : '#16181d' } }, cat.label)),
              e('td', { style: S.td }, (cat.products || []).length),
              e('td', { style: S.td }, (cat.mega || []).length),
              e('td', { style: S.td }, (cat.facets || []).length)
            ))
          )
        )
      )
    );
  }

  // ── Categories ────────────────────────────────────────────────────────────
  function CategoriesManager({ data, setData, user }) {
    const [editId, setEditId] = useState(null);
    const [ef, setEf] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [af, setAf] = useState({ id: '', label: '', accent: false, leaf: '', crumb: '' });
    const cats = data.categories;

    const update = (cats) => setData({ ...data, categories: cats });

    const startEdit = (c) => { setEditId(c.id); setEf({ label: c.label, accent: !!c.accent, leaf: c.leaf, crumb: (c.crumb || []).join(' > ') }); };
    const saveEdit = (id) => { update(cats.map(c => c.id === id ? { ...c, ...ef, crumb: ef.crumb.split('>').map(s => s.trim()).filter(Boolean) } : c)); setEditId(null); };
    const del = (id) => { if (confirm('Delete category and all its data?')) update(cats.filter(c => c.id !== id)); };
    const move = (i, dir) => { const a = [...cats]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; update(a); };

    const add = () => {
      if (!af.id || !af.label) return alert('ID and Label are required');
      const c = { id: af.id.toLowerCase().replace(/\s+/g, '-'), label: af.label, accent: af.accent, leaf: af.leaf || af.label, crumb: af.crumb ? af.crumb.split('>').map(s => s.trim()).filter(Boolean) : [af.label], mega: [], facets: [], products: [] };
      update([...cats, c]); setAf({ id: '', label: '', accent: false, leaf: '', crumb: '' }); setShowAdd(false);
    };

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('h1', { style: S.heading }, 'Navigation Menu'),
        e('button', { onClick: () => setShowAdd(v => !v), style: S.btnPrimary }, '+ Add Category')
      ),
      showAdd && e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 18px', fontSize: 16, fontWeight: 700 } }, 'New Category'),
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: 'ID (slug)' }, e(Input, { value: af.id, onChange: ev => setAf({ ...af, id: ev.target.value }), placeholder: 'e.g. helmets' })),
          e(Field, { label: 'Label' }, e(Input, { value: af.label, onChange: ev => setAf({ ...af, label: ev.target.value }), placeholder: 'e.g. Helmets' })),
          e(Field, { label: 'Leaf / Page Title' }, e(Input, { value: af.leaf, onChange: ev => setAf({ ...af, leaf: ev.target.value }), placeholder: 'e.g. All Helmets' })),
          e(Field, { label: 'Breadcrumb  (A > B)' }, e(Input, { value: af.crumb, onChange: ev => setAf({ ...af, crumb: ev.target.value }), placeholder: 'e.g. Cycling > Helmets' })),
        ),
        e('label', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 18 } },
          e('input', { type: 'checkbox', checked: af.accent, onChange: ev => setAf({ ...af, accent: ev.target.checked }) }), 'Sale / Accent style (red label)'
        ),
        e('div', { style: { display: 'flex', gap: 10 } }, e('button', { onClick: add, style: S.btnPrimary }, 'Add'), e('button', { onClick: () => setShowAdd(false), style: S.btnGhost }, 'Cancel'))
      ),
      e('div', { style: S.card },
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['Order', 'ID', 'Label', 'Leaf Title', 'Breadcrumb', 'Style', 'Actions'].map(h => e('th', { key: h, style: S.th }, h)))),
          e('tbody', null,
            cats.map((cat, i) => editId === cat.id
              ? e('tr', { key: cat.id },
                  e('td', { style: S.td }, i + 1),
                  e('td', { style: S.td }, e('code', { style: { fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 } }, cat.id)),
                  e('td', { style: S.td }, e(Input, { value: ef.label, onChange: ev => setEf({ ...ef, label: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Input, { value: ef.leaf, onChange: ev => setEf({ ...ef, leaf: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Input, { value: ef.crumb, onChange: ev => setEf({ ...ef, crumb: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e('input', { type: 'checkbox', checked: ef.accent, onChange: ev => setEf({ ...ef, accent: ev.target.checked }) })),
                  e('td', { style: S.td },
                    e('button', { onClick: () => saveEdit(cat.id), style: { ...S.btnSm, background: '#dcfce7', color: '#16a34a' } }, '✓ Save'), ' ',
                    e('button', { onClick: () => setEditId(null), style: S.btnSm }, '✕')
                  )
                )
              : e('tr', { key: cat.id, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
                  e('td', { style: S.td },
                    e('div', { style: { display: 'flex', gap: 4 } },
                      e('button', { onClick: () => move(i, -1), disabled: i === 0, style: S.btnSm }, '↑'),
                      e('button', { onClick: () => move(i, 1), disabled: i === cats.length - 1, style: S.btnSm }, '↓')
                    )
                  ),
                  e('td', { style: S.td }, e('code', { style: { fontSize: 12, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 } }, cat.id)),
                  e('td', { style: S.td }, e('span', { style: { fontWeight: 700, color: cat.accent ? SALE_COLOR : '#16181d' } }, cat.label)),
                  e('td', { style: S.td }, cat.leaf),
                  e('td', { style: S.td }, (cat.crumb || []).join(' › ')),
                  e('td', { style: S.td }, cat.accent
                    ? e('span', { style: { background: '#fef2f2', color: SALE_COLOR, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 } }, 'SALE')
                    : e('span', { style: { background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 20, fontSize: 11 } }, 'Normal')
                  ),
                  e('td', { style: S.td },
                    e('button', { onClick: () => startEdit(cat), style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), 'Edit'), ' ',
                    user.role === 'admin' && e('button', { onClick: () => del(cat.id), style: S.btnDanger }, '🗑')
                  )
                )
            )
          )
        )
      )
    );
  }

  // ── Mega Menu ─────────────────────────────────────────────────────────────
  function MegaMenuManager({ data, setData }) {
    const [catId, setCatId] = useState(data.categories[0]?.id || '');
    const [modal, setModal] = useState(null); // { mode:'add'|'edit', ci, gi?, form }

    const cat = data.categories.find(c => c.id === catId) || data.categories[0];
    if (!cat) return null;

    const updateCat = (c) => setData({ ...data, categories: data.categories.map(x => x.id === catId ? c : x) });

    const addCol = () => updateCat({ ...cat, mega: [...(cat.mega || []), []] });
    const delCol = (ci) => { if (confirm('Remove column?')) updateCat({ ...cat, mega: cat.mega.filter((_, i) => i !== ci) }); };
    const delGrp = (ci, gi) => { const m = cat.mega.map((col, i) => i === ci ? col.filter((_, j) => j !== gi) : col); updateCat({ ...cat, mega: m }); };

    const openAdd = (ci) => setModal({ mode: 'add', ci, form: { title: '', links: '' } });
    const openEdit = (ci, gi) => setModal({ mode: 'edit', ci, gi, form: { title: cat.mega[ci][gi].title, links: cat.mega[ci][gi].links.join('\n') } });

    const saveModal = () => {
      const { mode, ci, gi, form } = modal;
      const grp = { title: form.title, links: form.links.split('\n').map(l => l.trim()).filter(Boolean) };
      let mega;
      if (mode === 'add') {
        mega = cat.mega.map((col, i) => i === ci ? [...col, grp] : col);
      } else {
        mega = cat.mega.map((col, i) => i === ci ? col.map((g, j) => j === gi ? grp : g) : col);
      }
      updateCat({ ...cat, mega });
      setModal(null);
    };

    return e('div', null,
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 } },
        e('h1', { style: { ...S.heading, margin: 0 } }, 'Mega Menu Editor'),
        e('select', { value: catId, onChange: ev => setCatId(ev.target.value), style: { ...S.input, width: 180 } },
          data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
        )
      ),
      modal && e(Modal, { title: modal.mode === 'add' ? 'Add Group' : 'Edit Group', onClose: () => setModal(null) },
        e(Field, { label: 'Group Title' }, e(Input, { value: modal.form.title, onChange: ev => setModal({ ...modal, form: { ...modal.form, title: ev.target.value } }), style: { ...S.input, marginBottom: 14 }, autoFocus: true })),
        e(Field, { label: 'Links — one per line' },
          e('textarea', { value: modal.form.links, onChange: ev => setModal({ ...modal, form: { ...modal.form, links: ev.target.value } }), rows: 9, style: { ...S.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 } })
        ),
        e('div', { style: { display: 'flex', gap: 10, marginTop: 20 } },
          e('button', { onClick: saveModal, style: S.btnPrimary }, modal.mode === 'add' ? 'Add Group' : 'Save Changes'),
          e('button', { onClick: () => setModal(null), style: S.btnGhost }, 'Cancel')
        )
      ),
      e('div', { style: { display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, alignItems: 'flex-start' } },
        (cat.mega || []).map((col, ci) =>
          e('div', { key: ci, style: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)', padding: 18, minWidth: 210, flexShrink: 0 } },
            e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
              e('span', { style: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' } }, `Column ${ci + 1}`),
              e('button', { onClick: () => delCol(ci), style: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 18, lineHeight: 1 } }, '×')
            ),
            col.map((grp, gi) =>
              e('div', { key: gi, style: { background: '#f8fafc', borderRadius: 8, padding: '10px 12px', marginBottom: 8 } },
                e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 } },
                  e('span', { style: { fontWeight: 700, fontSize: 13, color: '#16181d' } }, grp.title),
                  e('div', { style: { display: 'flex', gap: 4 } },
                    e('button', { onClick: () => openEdit(ci, gi), style: { background: 'none', border: 'none', cursor: 'pointer', color: BRAND, display: 'inline-flex', alignItems: 'center', padding: 2 } }, e(IconPencil, { size: 18 })),
                    e('button', { onClick: () => delGrp(ci, gi), style: { background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16 } }, '×')
                  )
                ),
                e('ul', { style: { margin: 0, padding: '0 0 0 14px' } },
                  grp.links.map((lk, li) => e('li', { key: li, style: { fontSize: 12, color: '#64748b', lineHeight: 1.9 } }, lk))
                )
              )
            ),
            e('button', { onClick: () => openAdd(ci), style: { width: '100%', padding: 8, background: '#f0f9ff', color: BRAND, border: `1px dashed ${BRAND}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, marginTop: 4 } }, '+ Add Group')
          )
        ),
        e('button', { onClick: addCol, style: { background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 12, minWidth: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start', marginTop: 0 } }, '+ Column')
      )
    );
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const BADGE_OPTS = ['', 'New', 'Bestseller', 'Hot Deal', '-10%', '-13%', '-15%', '-18%', '-20%', '-24%', '-28%', '-30%', '-32%', '-36%'];
  const emptyProduct = () => ({ manufacturer: '', name: '', spec: '', badge: '', note: '', leaf: '', images: [] });

  // Flatten a category's Mega Menu into selectable sub-items (group › link)
  const megaLeaves = (cat) => {
    const out = [];
    (cat && cat.mega || []).forEach(col => (col || []).forEach(g => (g.links || []).forEach(lnk => out.push({ group: g.title || '', link: lnk }))));
    return out;
  };

  // Required fields for a product; returns array of missing field labels
  const missingProductFields = (f) => {
    const miss = [];
    if (!f.manufacturer || !f.manufacturer.trim()) miss.push('Manufacturer (品牌)');
    if (!f.name || !f.name.trim()) miss.push('Product Name (產品名稱)');
    return miss;
  };

  // Backward-compat: old products may have `image` (string); normalise to array of {url,alt}
  const getImages = (p) => {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    if (p.image) return [{ url: p.image, alt: p.name || '' }];
    return [];
  };
  const imgUrl = (img) => (typeof img === 'string' ? img : img.url);

  // Multi-image editor used inside ProductForm
  // ── Cloudinary Setup Modal ────────────────────────────────────────────────
  function CloudinarySetupModal({ onClose, onSaved }) {
    const current = loadCldConfig();
    const [cloudName, setCloudName] = useState(current.cloudName || '');
    const [preset, setPreset] = useState(current.uploadPreset || '');

    const save = () => {
      if (!cloudName.trim() || !preset.trim()) return;
      saveCldConfig({ cloudName: cloudName.trim(), uploadPreset: preset.trim() });
      onSaved();
    };

    return e(Modal, { title: '☁️ Cloudinary 設定', onClose, width: 520 },
      e('div', { style: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '14px 16px', marginBottom: 22, fontSize: 13, color: '#1e40af', lineHeight: 1.7 } },
        e('strong', null, '初次設定步驟：'), e('br'),
        '1. 前往 ', e('a', { href: 'https://cloudinary.com/users/register/free', target: '_blank', style: { color: BRAND, fontWeight: 700 } }, 'cloudinary.com'), ' 建立免費帳號（25 GB 儲存）', e('br'),
        '2. 儀表板左上角複製你的 ', e('strong', null, 'Cloud Name'), e('br'),
        '3. 前往 Settings → Upload → Upload presets → Add preset', e('br'),
        '4. 將 Signing Mode 設為 ', e('code', { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: 4, fontWeight: 700 } }, 'Unsigned'), ' 後儲存'
      ),
      e(Field, { label: 'Cloud Name' },
        e(Input, { value: cloudName, onChange: ev => setCloudName(ev.target.value), placeholder: 'e.g. my-store-abc123', autoFocus: true })
      ),
      e('div', { style: { marginTop: 12 } },
        e(Field, { label: 'Upload Preset（必須為 Unsigned）' },
          e(Input, { value: preset, onChange: ev => setPreset(ev.target.value), placeholder: 'e.g. armor_unsigned' })
        )
      ),
      e('div', { style: { display: 'flex', gap: 10, marginTop: 20 } },
        e('button', { onClick: save, disabled: !cloudName.trim() || !preset.trim(), style: { ...S.btnPrimary, opacity: (!cloudName.trim() || !preset.trim()) ? 0.5 : 1 } }, '儲存並繼續上傳'),
        e('button', { onClick: onClose, style: S.btnGhost }, '取消')
      )
    );
  }

  // ── Cloudinary: upload remote URL to CDN ─────────────────────────────────
  async function uploadToCloudinaryByUrl(imageUrl) {
    const cfg = loadCldConfig();
    if (!cfg.cloudName || !cfg.uploadPreset) throw new Error('NOCFG');
    const fd = new FormData();
    fd.append('file', imageUrl);
    fd.append('upload_preset', cfg.uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, { method: 'POST', body: fd });
    const d = await res.json();
    if (d.error) {
      const msg = d.error.message || '';
      if (msg.toLowerCase().includes('whitelisted') || msg.toLowerCase().includes('unsigned')) {
        throw new Error('PRESET_NOT_UNSIGNED');
      }
      throw new Error(msg);
    }
    const pathPart = imageUrl.split('?')[0].split('#')[0];
    const guessName = pathPart.split('/').pop().replace(/\.[^.]+$/, '') || d.original_filename || d.public_id;
    return { url: d.secure_url, alt: guessName };
  }

  function PresetErrorMsg() {
    return e('span', null,
      'Upload Preset 未設為 Unsigned。請至 ',
      e('a', { href: 'https://cloudinary.com', target: '_blank', style: { color: BRAND } }, 'Cloudinary'),
      ' → Settings → Upload Presets，將 Signing Mode 改為 ',
      e('strong', null, 'Unsigned'),
      ' 後儲存。'
    );
  }

  // ── Cloudinary Upload Button ───────────────────────────────────────────────
  function CloudinaryUploadButton({ multiple = true, onComplete, children, style }) {
    const [showSetup, setShowSetup] = useState(false);

    const openWidget = (cfg) => {
      const config = cfg || loadCldConfig();
      if (!config.cloudName || !config.uploadPreset) { setShowSetup(true); return; }
      if (!window.cloudinary) { alert('Cloudinary widget 尚未載入，請稍後再試。'); return; }
      const collected = [];
      const widget = window.cloudinary.createUploadWidget({
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        multiple,
        sources: ['local', 'url', 'camera'],
        resourceType: 'image',
        maxFileSize: 10000000,
        styles: { palette: { window: '#FFFFFF', windowBorder: '#e2e8f0', tabIcon: BRAND, link: BRAND, action: BRAND, inProgress: BRAND, complete: '#16a34a', error: '#dc2626', textDark: '#16181d', textLight: '#ffffff', menuIcons: '#64748b', sourceBg: '#f8fafc' } }
      }, (error, result) => {
        if (error) { console.error('Cloudinary error:', error); return; }
        if (result.event === 'success') {
          collected.push({ url: result.info.secure_url, alt: result.info.original_filename || result.info.public_id });
        }
        if (result.event === 'close' && collected.length > 0) {
          onComplete([...collected]);
        }
      });
      widget.open();
    };

    return e(React.Fragment, null,
      e('button', { onClick: () => openWidget(), style: style || S.btnGhost }, children || 'Upload via Cloudinary'),
      showSetup && e(CloudinarySetupModal, { onClose: () => setShowSetup(false), onSaved: () => { setShowSetup(false); openWidget(loadCldConfig()); } })
    );
  }

  function ImagesEditor({ images, onChange }) {
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [presetErr, setPresetErr] = useState(false);

    const addByUrl = async () => {
      const v = urlInput.trim();
      if (!v) return;
      setErrMsg(''); setPresetErr(false);
      setUploading(true);
      try {
        const img = await uploadToCloudinaryByUrl(v);
        onChange([...images, img]);
        setUrlInput('');
      } catch (err) {
        if (err.message === 'NOCFG') {
          onChange([...images, { url: v, alt: v.split('?')[0].split('/').pop().replace(/\.[^.]+$/, '') || 'image' }]);
          setUrlInput('');
        } else if (err.message === 'PRESET_NOT_UNSIGNED') {
          setPresetErr(true);
        } else {
          setErrMsg('上傳失敗：' + err.message);
        }
      } finally {
        setUploading(false);
      }
    };

    const remove = (i) => onChange(images.filter((_, j) => j !== i));
    const move = (i, dir) => { const a = [...images]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; onChange(a); };

    return e('div', null,
      // thumbnail strip
      images.length > 0 && e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 } },
        images.map((img, i) =>
          e('div', { key: i, style: { position: 'relative', width: 96, flexShrink: 0 } },
            e('div', { style: { width: 96, height: 72, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', border: i === 0 ? `2px solid ${BRAND}` : '1px solid #e2e8f0' } },
              e('img', { src: imgUrl(img), alt: img.alt || '', style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
            ),
            i === 0 && e('span', { style: { position: 'absolute', top: 4, left: 4, background: BRAND, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em' } }, 'MAIN'),
            e('div', { style: { display: 'flex', justifyContent: 'center', gap: 3, marginTop: 5 } },
              e('button', { onClick: () => move(i, -1), disabled: i === 0, style: { ...S.btnSm, padding: '2px 6px', fontSize: 12 } }, '←'),
              e('button', { onClick: () => move(i, 1), disabled: i === images.length - 1, style: { ...S.btnSm, padding: '2px 6px', fontSize: 12 } }, '→'),
              e('button', { onClick: () => remove(i), style: { ...S.btnDanger, padding: '2px 6px', fontSize: 12 } }, '×')
            )
          )
        )
      ),
      // add controls
      e('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } },
        e('div', { style: { display: 'flex', gap: 6, flex: 1, minWidth: 220 } },
          e(Input, {
            value: urlInput,
            onChange: ev => { setUrlInput(ev.target.value); setErrMsg(''); },
            placeholder: '貼上任意圖片 URL，自動上傳至 Cloudinary…',
            onKeyDown: ev => ev.key === 'Enter' && !uploading && addByUrl(),
            disabled: uploading,
          }),
          e('button', {
            onClick: addByUrl,
            disabled: uploading || !urlInput.trim(),
            style: { ...S.btnPrimary, whiteSpace: 'nowrap', padding: '9px 14px', opacity: uploading ? 0.7 : 1 }
          }, uploading ? '上傳中…' : '☁️ 上傳')
        ),
        e(CloudinaryUploadButton, {
          multiple: true,
          onComplete: (newImgs) => onChange([...images, ...newImgs]),
          style: { ...S.btnGhost, whiteSpace: 'nowrap', padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 13 }
        }, '📁 本機上傳')
      ),
      (errMsg || presetErr) && e('p', { style: { margin: '6px 0 0', fontSize: 12, color: '#dc2626' } }, presetErr ? e(PresetErrorMsg) : errMsg),
      images.length === 0 && e('p', { style: { margin: '10px 0 0', fontSize: 12, color: '#94a3b8' } }, '尚無圖片 — 貼上 URL 自動轉存至 Cloudinary，或點擊「本機上傳」。第一張圖片為主圖。')
    );
  }

  function ProductForm({ form, setForm, onSave, onCancel, saveLabel, cat }) {
    const imgs = form.images || [];
    const missing = missingProductFields(form);
    const req = (label) => e('span', null, label, ' ', e('span', { style: { color: SALE_COLOR } }, '*'));
    const leaves = megaLeaves(cat);
    return e('div', { style: { ...S.card, border: `2px solid ${BRAND}30` } },
      e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 } },
        e(Field, { label: req('Manufacturer') }, e(Input, { value: form.manufacturer, onChange: ev => setForm({ ...form, manufacturer: ev.target.value }) })),
        e(Field, { label: req('Product Name') }, e(Input, { value: form.name, onChange: ev => setForm({ ...form, name: ev.target.value }) })),
        e(Field, { label: 'Spec / Description' }, e(Input, { value: form.spec, onChange: ev => setForm({ ...form, spec: ev.target.value }) })),
        e(Field, { label: 'Mega Menu 子項目' }, e(Select, { value: form.leaf || '', onChange: ev => setForm({ ...form, leaf: ev.target.value }) },
          e('option', { value: '' }, leaves.length ? '（不指定）' : '（此分類尚無 Mega Menu 子項目）'),
          leaves.map((m, i) => e('option', { key: i, value: m.link }, (m.group ? m.group + ' › ' : '') + m.link))
        )),
        e(Field, { label: 'Badge' }, e(Select, { value: form.badge || '', onChange: ev => setForm({ ...form, badge: ev.target.value }) },
          BADGE_OPTS.map(b => e('option', { key: b, value: b }, b || '(none)'))
        )),
        e(Field, { label: 'Note (optional)' }, e(Input, { value: form.note || '', onChange: ev => setForm({ ...form, note: ev.target.value }), placeholder: 'Ships in 24h / Only 3 left' })),
      ),
      missing.length > 0 && e('div', { style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 } },
        '尚有必填欄位未填寫：', missing.join('、')
      ),
      // ── full-width image section ──
      e('div', { style: { borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 18 } },
        e('label', { style: { ...S.label, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 } },
          'Product Images',
          imgs.length > 0 && e('span', { style: { background: BRAND, color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 10 } }, imgs.length)
        ),
        e(ImagesEditor, { images: imgs, onChange: imgs => setForm({ ...form, images: imgs }) })
      ),
      e('div', { style: { display: 'flex', gap: 10 } },
        e('button', { onClick: onSave, style: S.btnPrimary }, saveLabel),
        e('button', { onClick: onCancel, style: S.btnGhost }, 'Cancel')
      )
    );
  }

  // Product card with image carousel dots
  function ProductCardView({ p, onEdit, onDelete }) {
    const imgs = getImages(p);
    const [idx, setIdx] = useState(0);
    const safeIdx = Math.min(idx, imgs.length - 1);
    const mainImg = imgs.length > 0 ? imgUrl(imgs[safeIdx]) : null;
    const badgeColor = (b) => b.startsWith('-') ? SALE_COLOR : b === 'New' ? '#16a34a' : '#f97316';

    return e('div', { style: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)', overflow: 'hidden' } },
      // image area
      e('div', { style: { height: 160, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: imgs.length > 1 ? 'pointer' : 'default' },
          onClick: imgs.length > 1 ? () => setIdx((safeIdx + 1) % imgs.length) : undefined },
        mainImg
          ? e('img', { src: mainImg, alt: p.name, style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
          : e('span', { style: { fontSize: 40 } }, '🚲'),
        // badge
        p.badge ? e('span', { style: { position: 'absolute', top: 8, left: 8, background: badgeColor(p.badge), color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 } }, p.badge) : null,
        // photo count chip
        imgs.length > 1 ? e('span', { style: { position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 4 } },
          e('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 2 },
            e('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }),
            e('circle', { cx: 8.5, cy: 8.5, r: 1.5 }),
            e('polyline', { points: '21 15 16 10 5 21' })
          ),
          imgs.length
        ) : null,
        // dot indicators
        imgs.length > 1 ? e('div', { style: { position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 } },
          imgs.map((_, i) => e('button', {
            key: i,
            onClick: (ev) => { ev.stopPropagation(); setIdx(i); },
            style: { width: i === safeIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === safeIdx ? '#fff' : 'rgba(255,255,255,.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width .15s' }
          }))
        ) : null
      ),
      // info
      e('div', { style: { padding: '14px 16px' } },
        e('div', { style: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 3 } }, p.manufacturer),
        e('div', { style: { fontSize: 13, fontWeight: 700, color: '#16181d', lineHeight: 1.35, marginBottom: 3 } }, p.name),
        e('div', { style: { fontSize: 12, color: '#64748b', marginBottom: 10 } }, p.spec),
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          e('div', null,
            p.leaf ? e('span', { style: { fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 } }, p.leaf) : null
          ),
          e('div', { style: { display: 'flex', gap: 6 } },
            e('button', { onClick: onEdit, style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), 'Edit'),
            e('button', { onClick: onDelete, style: S.btnDanger }, '🗑')
          )
        )
      )
    );
  }

  function ProductsManager({ data, setData }) {
    const [catId, setCatId] = useState(data.categories[0]?.id || '');
    const [editIdx, setEditIdx] = useState(null);
    const [ef, setEf] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [af, setAf] = useState(emptyProduct());

    const cat = data.categories.find(c => c.id === catId) || data.categories[0];
    const products = cat?.products || [];

    const save = (prods) => setData({ ...data, categories: data.categories.map(c => c.id === catId ? { ...c, products: prods } : c) });

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('h1', { style: { ...S.heading, margin: 0 } }, 'Products'),
          e('select', { value: catId, onChange: ev => { setCatId(ev.target.value); setEditIdx(null); setShowAdd(false); }, style: { ...S.input, width: 180 } },
            data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
          ),
          e('span', { style: { fontSize: 13, color: '#64748b' } }, `${products.length} products`)
        ),
        e('button', { onClick: () => { setShowAdd(v => !v); setEditIdx(null); }, style: S.btnPrimary }, '+ Add Product')
      ),
      showAdd && e(ProductForm, { form: af, setForm: setAf, cat, onSave: () => { const m = missingProductFields(af); if (m.length) { alert('無法儲存，請填寫必填欄位：\n• ' + m.join('\n• ')); return; } save([...products, af]); setAf(emptyProduct()); setShowAdd(false); }, onCancel: () => setShowAdd(false), saveLabel: 'Add Product' }),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 } },
        products.map((p, i) => editIdx === i
          ? e('div', { key: i, style: { gridColumn: '1/-1' } },
              e(ProductForm, { form: ef, setForm: setEf, cat, onSave: () => { const m = missingProductFields(ef); if (m.length) { alert('無法儲存，請填寫必填欄位：\n• ' + m.join('\n• ')); return; } save(products.map((x, j) => j === i ? ef : x)); setEditIdx(null); }, onCancel: () => setEditIdx(null), saveLabel: 'Save Changes' })
            )
          : e(ProductCardView, {
              key: i, p,
              onEdit: () => { setEditIdx(i); setEf({ ...p, images: getImages(p) }); setShowAdd(false); },
              onDelete: () => { if (confirm('Delete product?')) save(products.filter((_, j) => j !== i)); }
            })
        )
      )
    );
  }

  // ── Badges ────────────────────────────────────────────────────────────────
  function BadgesManager({ data, setData }) {
    const [newB, setNewB] = useState('');
    const [renameFrom, setRenameFrom] = useState(null);
    const [renameTo, setRenameTo] = useState('');

    const usageCount = (b) => data.categories.reduce((a, c) => a + (c.products || []).filter(p => p.badge === b).length, 0);
    const allBadges = useMemo(() => {
      const s = new Set(data.badges || []);
      data.categories.forEach(c => (c.products || []).forEach(p => { if (p.badge) s.add(p.badge); }));
      return [...s];
    }, [data]);

    const addBadge = () => {
      if (!newB.trim() || allBadges.includes(newB)) return;
      setData({ ...data, badges: [...(data.badges || []), newB] });
      setNewB('');
    };

    const rename = (from, to) => {
      if (!to.trim()) return;
      const categories = data.categories.map(c => ({ ...c, products: (c.products || []).map(p => p.badge === from ? { ...p, badge: to } : p) }));
      const badges = (data.badges || []).map(b => b === from ? to : b);
      setData({ ...data, categories, badges });
      setRenameFrom(null);
    };

    const remove = (b) => {
      if (!confirm(`Remove badge "${b}" from all products?`)) return;
      const categories = data.categories.map(c => ({ ...c, products: (c.products || []).map(p => p.badge === b ? { ...p, badge: '' } : p) }));
      setData({ ...data, categories, badges: (data.badges || []).filter(x => x !== b) });
    };

    const chipColor = (b) => b.startsWith('-') ? { bg: '#fef2f2', color: SALE_COLOR, border: '#fca5a5' } : b === 'New' ? { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' } : b === 'Bestseller' ? { bg: '#fff7ed', color: '#ea580c', border: '#fdba74' } : { bg: '#eff6ff', color: BRAND, border: '#93c5fd' };

    return e('div', null,
      e('h1', { style: S.heading }, 'Tags & Badges'),
      e('div', { style: S.card },
        e('div', { style: { display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' } },
          e(Input, { value: newB, onChange: ev => setNewB(ev.target.value), style: { ...S.input, width: 220 }, placeholder: 'New badge label…', onKeyDown: ev => ev.key === 'Enter' && addBadge() }),
          e('button', { onClick: addBadge, style: S.btnPrimary }, '+ Add Badge')
        ),
        e('p', { style: { margin: '0 0 14px', fontSize: 13, color: '#64748b' } }, `${allBadges.length} badges · click the pencil icon to rename, × to remove from all products`),
        e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
          allBadges.length === 0 && e('p', { style: { color: '#94a3b8', fontSize: 13 } }, 'No badges found. Add one above or assign badges to products.'),
          allBadges.map(b => {
            const cc = chipColor(b);
            return renameFrom === b
              ? e('div', { key: b, style: { display: 'flex', gap: 8, alignItems: 'center' } },
                  e(Input, { value: renameTo, onChange: ev => setRenameTo(ev.target.value), style: { ...S.input, width: 150, padding: '5px 10px' }, autoFocus: true, onKeyDown: ev => ev.key === 'Enter' && rename(b, renameTo) }),
                  e('button', { onClick: () => rename(b, renameTo), style: { ...S.btnSm, background: '#dcfce7', color: '#16a34a' } }, '✓'),
                  e('button', { onClick: () => setRenameFrom(null), style: S.btnSm }, '✕')
                )
              : e('div', { key: b, style: { display: 'flex', alignItems: 'center', gap: 8, background: cc.bg, border: `1px solid ${cc.border}`, borderRadius: 30, padding: '6px 14px' } },
                  e('span', { style: { fontWeight: 800, color: cc.color, fontSize: 13 } }, b),
                  e('span', { style: { fontSize: 11, color: '#94a3b8' } }, `×${usageCount(b)}`),
                  e('button', { onClick: () => { setRenameFrom(b); setRenameTo(b); }, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2, display: 'inline-flex', alignItems: 'center' }, title: 'Rename' }, e(IconPencil, { size: 16 })),
                  e('button', { onClick: () => remove(b), style: { background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16, padding: 0, lineHeight: 1 } }, '×')
                );
          })
        )
      )
    );
  }

  // ── Image Library ─────────────────────────────────────────────────────────
  function ImageLibrary({ data, setData }) {
    const images = data.images || [];
    const [url, setUrl] = useState('');
    const [alt, setAlt] = useState('');
    const [copied, setCopied] = useState(null);
    const [urlUploading, setUrlUploading] = useState(false);
    const [urlErr, setUrlErr] = useState('');
    const [urlPresetErr, setUrlPresetErr] = useState(false);

    const addUrl = async () => {
      const raw = url.trim();
      if (!raw) return;
      setUrlErr(''); setUrlPresetErr(false);
      setUrlUploading(true);
      try {
        const img = await uploadToCloudinaryByUrl(raw);
        setData({ ...data, images: [...images, { id: Date.now(), url: img.url, alt: alt.trim() || img.alt, source: 'cloudinary' }] });
        setUrl(''); setAlt('');
      } catch (err) {
        if (err.message === 'NOCFG') {
          const guessAlt = alt.trim() || raw.split('?')[0].split('/').pop().replace(/\.[^.]+$/, '') || 'image';
          setData({ ...data, images: [...images, { id: Date.now(), url: raw, alt: guessAlt, source: 'url' }] });
          setUrl(''); setAlt('');
        } else if (err.message === 'PRESET_NOT_UNSIGNED') {
          setUrlPresetErr(true);
        } else {
          setUrlErr('上傳失敗：' + err.message);
        }
      } finally {
        setUrlUploading(false);
      }
    };

    const copy = (img) => {
      navigator.clipboard.writeText(img.url).then(() => { setCopied(img.id); setTimeout(() => setCopied(null), 1800); });
    };

    const del = (id) => { if (confirm('Delete image?')) setData({ ...data, images: images.filter(x => x.id !== id) }); };

    const cldConfig = loadCldConfig();
    const isConfigured = !!(cldConfig.cloudName && cldConfig.uploadPreset);

    return e('div', null,
      e('h1', { style: S.heading }, 'Image Library'),
      e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 } },
        // Cloudinary upload
        e('div', { style: S.card },
          e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 } },
            e('h3', { style: { margin: 0, fontSize: 15, fontWeight: 700 } }, '☁️ Cloudinary 上傳'),
            isConfigured
              ? e('span', { style: { fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 10 } }, '✓ 已設定')
              : e('span', { style: { fontSize: 11, fontWeight: 700, background: '#fef9c3', color: '#92400e', padding: '2px 8px', borderRadius: 10 } }, '未設定')
          ),
          e('p', { style: { margin: '0 0 16px', fontSize: 13, color: '#64748b' } }, '圖片上傳至 Cloudinary CDN，只儲存 URL，無容量限制。'),
          e(CloudinaryUploadButton, {
            multiple: true,
            onComplete: (newImgs) => setData({ ...data, images: [...images, ...newImgs.map(img => ({ ...img, id: Date.now() + Math.random(), source: 'cloudinary' }))] }),
            style: { ...S.btnPrimary, width: '100%', padding: '12px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
          },
            e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
              e('polyline', { points: '16 16 12 12 8 16' }),
              e('line', { x1: 12, y1: 12, x2: 12, y2: 21 }),
              e('path', { d: 'M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3' })
            ),
            '選擇並上傳圖片'
          ),
          !isConfigured && e('p', { style: { margin: '10px 0 0', fontSize: 12, color: '#94a3b8' } }, '首次點擊時會引導你完成 Cloudinary 設定（免費）')
        ),
        // URL input
        e('div', { style: S.card },
          e('h3', { style: { margin: '0 0 6px', fontSize: 15, fontWeight: 700 } }, '🔗 貼上 URL，自動轉存至 Cloudinary'),
          e('p', { style: { margin: '0 0 14px', fontSize: 12, color: '#64748b' } }, '支援任意圖片網址，包含無副檔名的 URL，Cloudinary 會自動識別格式。'),
          e(Field, { label: '圖片 URL' }, e(Input, { value: url, onChange: ev => { setUrl(ev.target.value); setUrlErr(''); }, placeholder: 'https://example.com/image（任意 URL 均可）', disabled: urlUploading })),
          e(Field, { label: 'Alt 文字（選填）' }, e(Input, { value: alt, onChange: ev => setAlt(ev.target.value), placeholder: '圖片描述（留空自動帶入）', disabled: urlUploading })),
          (urlErr || urlPresetErr) && e('p', { style: { margin: '0 0 10px', fontSize: 12, color: '#dc2626' } }, urlPresetErr ? e(PresetErrorMsg) : urlErr),
          e('button', {
            onClick: addUrl,
            disabled: urlUploading || !url.trim(),
            style: { ...S.btnPrimary, opacity: urlUploading ? 0.7 : 1, marginTop: 14 }
          }, urlUploading ? '上傳至 Cloudinary 中…' : '☁️ 上傳並新增')
        )
      ),
      e('div', { style: { ...S.card } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
          e('span', { style: { fontWeight: 700, fontSize: 15 } }, `Gallery  ·  ${images.length} images`),
        ),
        images.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } }, 'No images yet. Upload or add by URL above.')
          : e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 } },
              images.map(img => e('div', { key: img.id, style: { background: '#f8fafc', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' } },
                e('div', { style: { height: 110, overflow: 'hidden', background: '#e2e8f0' } },
                  e('img', { src: img.url, alt: img.alt, style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
                ),
                e('div', { style: { padding: '8px 10px' } },
                  e('div', { style: { fontSize: 11, color: '#374151', fontWeight: 500, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, img.alt),
                  e('div', { style: { display: 'flex', gap: 5 } },
                    e('button', { onClick: () => copy(img), style: { ...S.btnSm, fontSize: 11, flex: 1, background: copied === img.id ? '#dcfce7' : undefined, color: copied === img.id ? '#16a34a' : undefined } }, copied === img.id ? '✓ Copied' : '📋 URL'),
                    e('button', { onClick: () => del(img.id), style: { ...S.btnDanger, fontSize: 11 } }, '🗑')
                  )
                )
              ))
            )
      )
    );
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  function UsersManager() {
    const [users, setU] = useState(loadUsers);
    const [showAdd, setShowAdd] = useState(false);
    const [af, setAf] = useState({ username: '', password: '', name: '', role: 'editor' });
    const [editId, setEditId] = useState(null);
    const [ef, setEf] = useState({});

    const save = (u) => { saveUsers(u); setU(u); };

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('h1', { style: S.heading }, 'User Management'),
        e('button', { onClick: () => setShowAdd(v => !v), style: S.btnPrimary }, '+ Add User')
      ),
      showAdd && e('div', { style: S.card },
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: 'Username' }, e(Input, { value: af.username, onChange: ev => setAf({ ...af, username: ev.target.value }) })),
          e(Field, { label: 'Full Name' }, e(Input, { value: af.name, onChange: ev => setAf({ ...af, name: ev.target.value }) })),
          e(Field, { label: 'Password' }, e(Input, { type: 'password', value: af.password, onChange: ev => setAf({ ...af, password: ev.target.value }) })),
          e(Field, { label: 'Role' }, e(Select, { value: af.role, onChange: ev => setAf({ ...af, role: ev.target.value }) }, e('option', { value: 'editor' }, 'Editor'), e('option', { value: 'admin' }, 'Admin'))),
        ),
        e('div', { style: { display: 'flex', gap: 10 } },
          e('button', { onClick: () => { if (!af.username || !af.password) return; save([...users, { id: Date.now(), ...af }]); setAf({ username: '', password: '', name: '', role: 'editor' }); setShowAdd(false); }, style: S.btnPrimary }, 'Add User'),
          e('button', { onClick: () => setShowAdd(false), style: S.btnGhost }, 'Cancel')
        )
      ),
      e('div', { style: S.card },
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['Username', 'Full Name', 'Role', 'Actions'].map(h => e('th', { key: h, style: S.th }, h)))),
          e('tbody', null,
            users.map((u, i) => editId === u.id
              ? e('tr', { key: u.id },
                  e('td', { style: S.td }, e(Input, { value: ef.username, onChange: ev => setEf({ ...ef, username: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Input, { value: ef.name, onChange: ev => setEf({ ...ef, name: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Select, { value: ef.role, onChange: ev => setEf({ ...ef, role: ev.target.value }), style: { ...S.input, padding: '6px 10px' } }, e('option', { value: 'editor' }, 'Editor'), e('option', { value: 'admin' }, 'Admin'))),
                  e('td', { style: S.td },
                    e('button', { onClick: () => { save(users.map(x => x.id === u.id ? { ...x, ...ef } : x)); setEditId(null); }, style: { ...S.btnSm, background: '#dcfce7', color: '#16a34a' } }, '✓ Save'), ' ',
                    e('button', { onClick: () => setEditId(null), style: S.btnSm }, '✕')
                  )
                )
              : e('tr', { key: u.id, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
                  e('td', { style: S.td }, e('code', { style: { fontWeight: 700, fontSize: 13 } }, u.username)),
                  e('td', { style: S.td }, u.name),
                  e('td', { style: S.td }, e('span', { style: { background: u.role === 'admin' ? '#eff6ff' : '#f0fdf4', color: u.role === 'admin' ? BRAND : '#16a34a', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' } }, u.role)),
                  e('td', { style: S.td },
                    e('button', { onClick: () => { setEditId(u.id); setEf({ username: u.username, name: u.name, role: u.role }); }, style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), 'Edit'), ' ',
                    e('button', { onClick: () => { if (confirm('Delete user?')) save(users.filter(x => x.id !== u.id)); }, style: S.btnDanger }, '🗑')
                  )
                )
            )
          )
        )
      )
    );
  }

  // ── User Avatar ───────────────────────────────────────────────────────────
  function UserAvatar({ user, size = 32, fontSize = 13 }) {
    const initials = (user.name || user.username || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const bg = user.role === 'admin' ? BRAND : '#16a34a';
    return e('div', { style: { width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: 800, color: '#fff', flexShrink: 0, userSelect: 'none' } }, initials);
  }

  // ── User Profile Panel ────────────────────────────────────────────────────
  function UserProfilePanel({ user, onLogout, onClose, onUpdateUser }) {
    const [tab, setTab] = useState('profile');
    const [editName, setEditName] = useState(false);
    const [nameInput, setNameInput] = useState(user.name || '');
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState(null); // { type:'ok'|'err', text }

    const saveName = () => {
      if (!nameInput.trim()) return;
      const updated = { ...user, name: nameInput.trim() };
      const users = loadUsers().map(u => u.id === user.id ? { ...u, name: nameInput.trim() } : u);
      saveUsers(users);
      saveAuth(updated);
      onUpdateUser(updated);
      setEditName(false);
    };

    const changePw = () => {
      const users = loadUsers();
      const u = users.find(x => x.id === user.id);
      if (!u || u.password !== pwForm.current) { setPwMsg({ type: 'err', text: 'Current password is incorrect' }); return; }
      if (pwForm.next.length < 6) { setPwMsg({ type: 'err', text: 'New password must be at least 6 characters' }); return; }
      if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: 'err', text: 'Passwords do not match' }); return; }
      saveUsers(users.map(x => x.id === user.id ? { ...x, password: pwForm.next } : x));
      setPwMsg({ type: 'ok', text: 'Password updated successfully' });
      setPwForm({ current: '', next: '', confirm: '' });
    };

    const avatarBg = user.role === 'admin' ? BRAND : '#16a34a';
    const initials = (user.name || user.username || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const InfoRow = ({ label, value, pill }) =>
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f1f5f9' } },
        e('span', { style: { fontSize: 13, color: '#64748b' } }, label),
        pill
          ? e('span', { style: { background: avatarBg + '18', color: avatarBg, fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' } }, value)
          : e('span', { style: { fontSize: 13, fontWeight: 600, color: '#16181d' } }, value)
      );

    return e('div', { style: { position: 'fixed', inset: 0, zIndex: 300 }, onClick: onClose },
      e('div', {
        style: { position: 'absolute', top: 62, right: 20, width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,.18)', border: '1px solid #e2e8f0', overflow: 'hidden' },
        onClick: ev => ev.stopPropagation()
      },
        // ── Header ──
        e('div', { style: { background: `linear-gradient(135deg,${avatarBg} 0%,${avatarBg}bb 100%)`, padding: '22px 22px 18px' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('div', { style: { width: 58, height: 58, borderRadius: '50%', background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff', border: '2px solid rgba(255,255,255,.4)', flexShrink: 0 } }, initials),
            e('div', { style: { flex: 1, minWidth: 0 } },
              editName
                ? e('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
                    e('input', { value: nameInput, onChange: ev => setNameInput(ev.target.value), autoFocus: true, onKeyDown: ev => { if (ev.key === 'Enter') saveName(); if (ev.key === 'Escape') setEditName(false); }, style: { flex: 1, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.5)', color: '#fff', padding: '5px 9px', borderRadius: 7, fontSize: 14, fontWeight: 700, outline: 'none', minWidth: 0 } }),
                    e('button', { onClick: saveName, style: { background: 'rgba(255,255,255,.25)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 6, padding: '5px 9px', fontWeight: 800, fontSize: 14 } }, '✓'),
                    e('button', { onClick: () => setEditName(false), style: { background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '2px 4px' } }, '×')
                  )
                : e('div', { style: { display: 'flex', alignItems: 'center', gap: 7 } },
                    e('div', { style: { fontSize: 17, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, user.name || user.username),
                    e('button', { onClick: () => { setNameInput(user.name || ''); setEditName(true); }, title: 'Edit name', style: { background: 'none', border: 'none', color: 'rgba(255,255,255,.65)', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center', flexShrink: 0 } }, e(IconPencil, { size: 14 }))
                  ),
              e('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 3 } }, `@${user.username}`),
              e('span', { style: { display: 'inline-block', marginTop: 7, background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.07em' } }, user.role)
            )
          )
        ),
        // ── Tabs ──
        e('div', { style: { display: 'flex', borderBottom: '1px solid #f1f5f9' } },
          [{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }].map(t =>
            e('button', { key: t.id, onClick: () => { setTab(t.id); setPwMsg(null); }, style: { flex: 1, padding: '11px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? avatarBg : 'transparent'}`, cursor: 'pointer', fontWeight: tab === t.id ? 700 : 500, fontSize: 13, color: tab === t.id ? avatarBg : '#64748b', transition: 'all .12s' } }, t.label)
          )
        ),
        // ── Content ──
        e('div', { style: { padding: '18px 22px 22px' } },
          tab === 'profile'
            ? e('div', null,
                e(InfoRow, { label: 'Username', value: `@${user.username}` }),
                e(InfoRow, { label: 'Full Name', value: user.name || '—' }),
                e(InfoRow, { label: 'Role', value: user.role === 'admin' ? 'Administrator' : 'Editor', pill: true }),
                e(InfoRow, { label: 'Session', value: 'Active' }),
                e('button', {
                  onClick: () => { onLogout(); onClose(); },
                  style: { width: '100%', marginTop: 18, padding: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }
                },
                  e('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
                    e('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
                    e('polyline', { points: '16 17 21 12 16 7' }),
                    e('line', { x1: 21, y1: 12, x2: 9, y2: 12 })
                  ),
                  'Sign Out'
                )
              )
            : e('div', null,
                e('p', { style: { fontSize: 13, color: '#64748b', margin: '0 0 16px' } }, 'Update your account password below.'),
                [{ label: 'Current Password', key: 'current' }, { label: 'New Password', key: 'next' }, { label: 'Confirm Password', key: 'confirm' }].map(f =>
                  e('div', { key: f.key, style: { marginBottom: 11 } },
                    e('label', { style: S.label }, f.label),
                    e('input', { type: 'password', value: pwForm[f.key], onChange: ev => { setPwForm({ ...pwForm, [f.key]: ev.target.value }); setPwMsg(null); }, style: S.input })
                  )
                ),
                pwMsg && e('div', { style: { padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 12, background: pwMsg.type === 'err' ? '#fef2f2' : '#f0fdf4', color: pwMsg.type === 'err' ? '#dc2626' : '#16a34a' } }, pwMsg.text),
                e('button', { onClick: changePw, style: { ...S.btnPrimary, width: '100%', padding: '10px', fontSize: 13 } }, 'Update Password')
              )
        )
      )
    );
  }

  // ── Settings ─────────────────────────────────────────────────────────────
  function SettingsManager({ data }) {
    const [cfg, setCfg] = useState(loadCldConfig);
    const [cldSaved, setCldSaved] = useState(false);
    const [github, setGithub] = useState(loadGithubConfig);
    const [githubSaved, setGithubSaved] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [impBlob, setImpBlob] = useState('');
    const [syncMsg, setSyncMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const copyExport = () => { try { navigator.clipboard.writeText(exportConfigBlob()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (_) {} };
    const runImport = () => {
      try { const r = importConfigBlob(impBlob); setSyncMsg('✓ 已匯入 ' + r.users + ' 個帳號與設定，3 秒後重新載入…'); setTimeout(() => location.reload(), 2500); }
      catch (_) { setSyncMsg('✕ 匯入失敗：設定格式錯誤'); }
    };

    const saveCld = () => { saveCldConfig(cfg); setCldSaved(true); setTimeout(() => setCldSaved(false), 2500); };
    const saveGithub = () => { saveGithubConfig(github); setGithubSaved(true); setTimeout(() => setGithubSaved(false), 2500); };

    const downloadJS = () => {
      const js = generateStoreJS(data);
      const blob = new Blob([js], { type: 'text/javascript' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'store-data.js'; a.click();
    };

    const isOk = !!(cfg.cloudName && cfg.uploadPreset);
    const hasToken = !!(github.token && github.repo);

    return e('div', null,
      e('h1', { style: S.heading }, 'Settings'),

      // ── Cross-origin config sync (Export / Import) ──
      e('div', { style: S.card },
        e('h2', { style: { margin: '0 0 6px', fontSize: 18, fontWeight: 800 } }, '🔄 設定同步（匯出／匯入）'),
        e('p', { style: { margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.6 } },
          'localhost、192.168.x、pages.dev 是不同來源，瀏覽器設定不會自動互通。在這裡「匯出」後，到另一台裝置／網址的後台登入頁或此處「匯入」，即可同步使用者帳號、GitHub Token 與 Cloudinary 設定。'),
        e('div', { style: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400e', marginBottom: 16 } },
          '⚠ 此設定內含 GitHub Token 與登入密碼，請僅在你信任的裝置間複製，勿外流。'),
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
          e('div', null,
            e('label', { style: S.label }, '匯出設定（複製到其他裝置）'),
            e('textarea', { readOnly: true, value: exportConfigBlob(), onFocus: ev => ev.target.select(), style: { ...S.input, width: '100%', height: 120, fontFamily: 'monospace', fontSize: 11 } }),
            e('button', { onClick: copyExport, style: { ...S.btnPrimary, marginTop: 8 } }, copied ? '✓ 已複製' : '📋 複製設定')
          ),
          e('div', null,
            e('label', { style: S.label }, '匯入設定（覆蓋本機設定）'),
            e('textarea', { value: impBlob, onChange: ev => setImpBlob(ev.target.value), placeholder: '貼上從其他裝置匯出的設定 JSON…', style: { ...S.input, width: '100%', height: 120, fontFamily: 'monospace', fontSize: 11 } }),
            e('button', { onClick: runImport, disabled: !impBlob.trim(), style: { ...S.btnPrimary, marginTop: 8, opacity: impBlob.trim() ? 1 : 0.5 } }, '⬇ 匯入並覆蓋'),
            syncMsg ? e('p', { style: { margin: '8px 0 0', fontSize: 12, color: syncMsg.startsWith('✓') ? '#16a34a' : '#dc2626' } }, syncMsg) : null
          )
        )
      ),

      // ── GitHub + Cloudflare Pages auto-publish ──
      e('div', { style: S.card },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
          e('h2', { style: { margin: 0, fontSize: 18, fontWeight: 800 } }, '🚀 GitHub + Cloudflare Pages 自動發布'),
          hasToken
            ? e('span', { style: { fontSize: 12, fontWeight: 700, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '3px 12px', borderRadius: 20 } }, '✓ 已設定完成')
            : e('span', { style: { fontSize: 12, fontWeight: 700, background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a', padding: '3px 12px', borderRadius: 20 } }, '⚠ 尚未設定')
        ),
        e('p', { style: { margin: '0 0 18px', fontSize: 13, color: '#64748b' } }, '完全免費，無 credit 限制。設定後點擊「📦 發布」，CMS 資料會自動 commit 到 GitHub，Cloudflare Pages 立即自動部署。'),
        e(Field, { label: 'GitHub Personal Access Token' },
          e('div', { style: { display: 'flex', gap: 8 } },
            e('input', {
              type: showToken ? 'text' : 'password',
              value: github.token || '',
              onChange: ev => setGithub({ ...github, token: ev.target.value }),
              placeholder: 'ghp_xxxxxxxxxxxxxxxx',
              style: { ...S.input, flex: 1, fontFamily: 'monospace', fontSize: 13 }
            }),
            e('button', { onClick: () => setShowToken(v => !v), style: { ...S.btnGhost, padding: '0 12px', flexShrink: 0, fontSize: 13 } }, showToken ? '隱藏' : '顯示')
          )
        ),
        e(Field, { label: 'GitHub Repository（格式：owner/repo）' },
          e(Input, { value: github.repo || '', onChange: ev => setGithub({ ...github, repo: ev.target.value }), placeholder: 'e.g. armor-mfg-tw/armor-bike-website' })
        ),
        e(Field, { label: 'Branch（預設 main）' },
          e(Input, { value: github.branch || '', onChange: ev => setGithub({ ...github, branch: ev.target.value }), placeholder: 'main' })
        ),
        e(Field, { label: 'Cloudflare Pages 網址（選填，用於發布後跳轉）' },
          e(Input, { value: github.siteUrl || '', onChange: ev => setGithub({ ...github, siteUrl: ev.target.value }), placeholder: 'https://armor-bike.pages.dev' })
        ),
        e('div', { style: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 } },
          e('button', { onClick: saveGithub, style: S.btnPrimary }, '儲存設定'),
          githubSaved && e('span', { style: { fontSize: 13, color: '#16a34a', fontWeight: 700 } }, 'Saved ✓')
        )
      ),
      e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 14px', fontSize: 15, fontWeight: 700 } }, '📖 設定步驟說明'),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, 'Step 1 — 建立 GitHub Repository'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, '登入 ', e('a', { href: 'https://github.com', target: '_blank', style: { color: BRAND } }, 'github.com'), ' → 右上角 + → New repository'),
            e('li', null, '設為 ', e('strong', null, 'Public'),'，名稱例如 ', e('code', { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 } }, 'armor-bike-website')),
            e('li', null, '把本機 project/ 資料夾的所有檔案上傳到此 repo')
          )
        ),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, 'Step 2 — 取得 GitHub Token'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, 'GitHub 右上角頭像 → Settings → Developer settings → Personal access tokens → Tokens (classic)'),
            e('li', null, '點擊 ', e('strong', null, 'Generate new token (classic)'), ' → 輸入名稱'),
            e('li', null, '勾選 ', e('strong', null, 'repo'), ' scope → 點擊 Generate token → 複製並貼入上方')
          )
        ),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, 'Step 3 — 建立 Cloudflare Pages'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, '登入 ', e('a', { href: 'https://dash.cloudflare.com', target: '_blank', style: { color: BRAND } }, 'dash.cloudflare.com'), ' → Workers & Pages → Create application → Pages'),
            e('li', null, '選 ', e('strong', null, 'Connect to Git'), ' → 授權 GitHub → 選擇你的 repo'),
            e('li', null, 'Framework preset 選 ', e('strong', null, 'None'), '，Build command 留空，Build output 填 ', e('code', { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 } }, '/')),
            e('li', null, '點擊 Deploy → 完成後複製 .pages.dev 網址填入上方「Cloudflare Pages 網址」欄位')
          )
        ),
        e('div', { style: { borderTop: '1px solid #e2e8f0', paddingTop: 16 } },
          e('p', { style: { margin: '0 0 10px', fontSize: 13, color: '#64748b', fontWeight: 600 } }, '備用：若需要手動下載 store-data.js'),
          e('button', { onClick: downloadJS, style: S.btnGhost }, '⬇ 下載 store-data.js')
        )
      ),

      // ── Cloudinary image CDN ──
      e('div', { style: S.card },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
          e('h2', { style: { margin: 0, fontSize: 18, fontWeight: 800 } }, '☁️ Cloudinary 圖片 CDN'),
          isOk
            ? e('span', { style: { fontSize: 12, fontWeight: 700, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '3px 12px', borderRadius: 20 } }, '✓ 已設定完成')
            : e('span', { style: { fontSize: 12, fontWeight: 700, background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a', padding: '3px 12px', borderRadius: 20 } }, '⚠ 尚未設定')
        ),
        e('p', { style: { margin: '0 0 22px', fontSize: 13, color: '#64748b' } }, '圖片上傳至 Cloudinary CDN，CMS 只儲存 URL 字串。無 localStorage 容量問題，支援 50 萬+ 筆產品。'),
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 } },
          e(Field, { label: 'Cloud Name' },
            e(Input, { value: cfg.cloudName || '', onChange: ev => setCfg({ ...cfg, cloudName: ev.target.value }), placeholder: 'e.g. my-store-abc123' })
          ),
          e(Field, { label: 'Upload Preset（必須為 Unsigned）' },
            e(Input, { value: cfg.uploadPreset || '', onChange: ev => setCfg({ ...cfg, uploadPreset: ev.target.value }), placeholder: 'e.g. armor_unsigned' })
          )
        ),
        isOk && e('div', { style: { background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#16a34a', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 } },
          '✓ Cloudinary Cloud: ', e('code', { style: { background: '#dcfce7', padding: '1px 6px', borderRadius: 4 } }, cfg.cloudName)
        ),
        e('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
          e('button', { onClick: saveCld, style: S.btnPrimary }, '儲存設定'),
          cldSaved && e('span', { style: { fontSize: 13, color: '#16a34a', fontWeight: 700 } }, 'Saved ✓')
        )
      ),
      e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 16px', fontSize: 16, fontWeight: 700 } }, '📖 Cloudinary 設定教學'),
        e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.4, fontSize: 14 } },
          e('li', null, '前往 ', e('a', { href: 'https://cloudinary.com/users/register/free', target: '_blank', style: { color: BRAND, fontWeight: 700 } }, 'cloudinary.com'), ' 建立免費帳號（', e('strong', null, '25 GB 儲存、25 GB 頻寬/月'), '，完全免費）'),
          e('li', null, '登入後在儀表板左上角複製你的 ', e('strong', null, 'Cloud Name')),
          e('li', null, '前往 ', e('strong', null, 'Settings → Upload → Upload presets'), ' → 點擊 Add upload preset'),
          e('li', null, '將 ', e('strong', null, 'Signing Mode'), ' 設為 ', e('code', { style: { background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontWeight: 700, fontSize: 13 } }, 'Unsigned'), ' 然後儲存'),
          e('li', null, '將 Cloud Name 與 Preset Name 填入上方欄位後點擊「儲存設定」'),
          e('li', null, '完成！Products 和 Image Library 頁面的上傳按鈕將直接把圖片傳至 Cloudinary')
        )
      )
    );
  }

  // ── Hero Carousel Manager ─────────────────────────────────────────────────
  function HeroManager({ data, setData }) {
    const [showPicker, setShowPicker] = useState(false);
    const hero = data.hero || [];
    const library = data.images || [];

    const updateHero = (h) => setData({ ...data, hero: h });
    const addSlide = (img) => {
      if (hero.some(h => h.url === img.url)) return;
      updateHero([...hero, { id: Date.now() + Math.random(), url: img.url, alt: img.alt }]);
    };
    const remove = (id) => updateHero(hero.filter(h => h.id !== id));
    const move = (i, dir) => { const a = [...hero]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; updateHero(a); };
    const updateAlt = (id, alt) => updateHero(hero.map(h => h.id === id ? { ...h, alt } : h));

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('h1', { style: S.heading }, 'Hero Carousel'),
        e('button', { onClick: () => setShowPicker(true), style: S.btnPrimary }, '+ 新增圖片')
      ),

      e('div', { style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 16px', marginBottom: 22, fontSize: 13, color: '#0369a1', lineHeight: 1.7 } },
        '圖片依序 1 → 2 → 3 → 4 自動輪播（每 5 秒切換）。請先至「Image Library」上傳圖片，再點「+ 新增圖片」選入輪播。'
      ),

      e('div', { style: S.card },
        hero.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '64px 0', color: '#94a3b8' } },
              e('div', { style: { fontSize: 52, marginBottom: 14 } }, '▶'),
              e('div', { style: { fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 } }, '尚未設定 Hero 輪播圖片'),
              e('div', { style: { fontSize: 13, marginBottom: 22 } }, '點擊下方按鈕，從 Image Library 選取圖片加入輪播'),
              e('button', { onClick: () => setShowPicker(true), style: S.btnPrimary }, '+ 從 Library 選取圖片')
            )
          : e('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' } },
              hero.map((slide, i) =>
                e('div', { key: slide.id, style: { width: 220, borderRadius: 10, overflow: 'hidden', border: '2px solid #e2e8f0', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.05)' } },
                  e('div', { style: { height: 110, background: '#f1f5f9', position: 'relative', overflow: 'hidden' } },
                    e('img', { src: slide.url, alt: slide.alt || '', style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } }),
                    e('div', { style: { position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: '50%', background: BRAND, color: '#fff', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.3)' } }, i + 1)
                  ),
                  e('div', { style: { padding: '10px 12px 12px' } },
                    e('input', { value: slide.alt || '', onChange: ev => updateAlt(slide.id, ev.target.value), style: { ...S.input, padding: '5px 9px', fontSize: 12, marginBottom: 8 }, placeholder: 'Alt 說明文字' }),
                    e('div', { style: { display: 'flex', gap: 5 } },
                      e('button', { onClick: () => move(i, -1), disabled: i === 0, style: { ...S.btnSm, flex: 1 } }, '← 前移'),
                      e('button', { onClick: () => move(i, 1), disabled: i === hero.length - 1, style: { ...S.btnSm, flex: 1 } }, '後移 →'),
                      e('button', { onClick: () => { if (confirm('移除這張圖片？')) remove(slide.id); }, style: S.btnDanger }, '🗑')
                    )
                  )
                )
              ),
              e('button', { onClick: () => setShowPicker(true), style: { width: 220, minHeight: 186, border: '2px dashed #cbd5e1', borderRadius: 10, background: '#f8fafc', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 } },
                e('span', { style: { fontSize: 32, lineHeight: 1 } }, '+'),
                '從 Library 新增'
              )
            )
      ),

      showPicker && e(Modal, { title: '選擇 Hero 圖片', onClose: () => setShowPicker(false), width: 720 },
        library.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } },
              '圖片庫為空。請先至「Image Library」上傳圖片後再返回此處。'
            )
          : e(React.Fragment, null,
              e('p', { style: { margin: '0 0 14px', fontSize: 13, color: '#64748b' } }, '點擊圖片即可加入輪播。已加入的圖片標示綠色，點擊不重複加入。'),
              e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 } },
                library.map(img => {
                  const already = hero.some(h => h.url === img.url);
                  return e('div', {
                    key: img.id,
                    onClick: () => { if (!already) { addSlide(img); } },
                    style: { cursor: already ? 'default' : 'pointer', borderRadius: 8, overflow: 'hidden', border: `2px solid ${already ? '#86efac' : '#e2e8f0'}`, opacity: already ? 0.65 : 1, transition: 'border-color .12s', background: '#f8fafc', position: 'relative' }
                  },
                    e('div', { style: { height: 90, overflow: 'hidden', background: '#e2e8f0' } },
                      e('img', { src: img.url, alt: img.alt || '', style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
                    ),
                    e('div', { style: { padding: '6px 8px', fontSize: 11, color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, img.alt || '(no alt)'),
                    already && e('div', { style: { position: 'absolute', top: 6, right: 6, background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 10 } }, '✓ 已加入')
                  );
                })
              ),
              e('div', { style: { borderTop: '1px solid #f1f5f9', paddingTop: 14 } },
                e('div', { style: { fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 } }, '或直接上傳新圖片（同時加入 Library 與 Hero）：'),
                e(CloudinaryUploadButton, {
                  multiple: true,
                  onComplete: (imgs) => {
                    const newLib = imgs.map(img => ({ id: Date.now() + Math.random(), url: img.url, alt: img.alt, source: 'cloudinary' }));
                    const newSlides = imgs.map(img => ({ id: Date.now() + Math.random(), url: img.url, alt: img.alt }));
                    setData({ ...data, images: [...library, ...newLib], hero: [...hero, ...newSlides] });
                    setShowPicker(false);
                  },
                  style: { ...S.btnGhost, fontSize: 13, padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: 7 }
                }, '📁 上傳新圖片')
              )
            )
      )
    );
  }

  // ── Filters & Facets Manager ──────────────────────────────────────────────
  function FiltersManager({ data, setData }) {
    const [catId, setCatId] = useState(data.categories[0]?.id || '');
    const [modal, setModal] = useState(null); // {mode:'add'|'edit', fi, form:{title,kind,optText,min,max}}

    const cat = data.categories.find(c => c.id === catId) || data.categories[0];
    if (!cat) return null;

    const updateCat = (c) => setData({ ...data, categories: data.categories.map(x => x.id === catId ? c : x) });

    const facetToText = (f) => {
      if (f.kind === 'range') return '';
      if (f.kind === 'color') return (f.options || []).map(o => `${o.color}: ${o.count}`).join('\n');
      return (f.options || []).map(o => `${o.sale ? 'SALE ' : ''}${o.label}: ${o.count}`).join('\n');
    };
    const parseOptions = (kind, text, min, max) => {
      if (kind === 'range') return { min: Number(min) || 0, max: Number(max) || 5000 };
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (kind === 'color') return { options: lines.map(l => { const [color, cnt] = l.split(':').map(s => s.trim()); return { color, count: parseInt(cnt) || 0 }; }) };
      return { options: lines.map(l => { const sale = l.startsWith('SALE '); const rest = sale ? l.slice(5) : l; const [label, cnt] = rest.split(':').map(s => s.trim()); return sale ? { label, count: parseInt(cnt) || 0, sale: true } : { label, count: parseInt(cnt) || 0 }; }) };
    };

    const openAdd = () => setModal({ mode: 'add', form: { title: '', kind: 'list', optText: '', min: '0', max: '5000' } });
    const openEdit = (fi) => { const f = cat.facets[fi]; setModal({ mode: 'edit', fi, form: { title: f.title || '', kind: f.kind, optText: facetToText(f), min: String(f.min || 0), max: String(f.max || 5000) } }); };
    const del = (fi) => { if (confirm('Remove this filter?')) updateCat({ ...cat, facets: cat.facets.filter((_, i) => i !== fi) }); };
    const move = (fi, dir) => { const arr = [...cat.facets]; [arr[fi], arr[fi + dir]] = [arr[fi + dir], arr[fi]]; updateCat({ ...cat, facets: arr }); };

    const saveModal = () => {
      const { form, mode, fi } = modal;
      const parsed = parseOptions(form.kind, form.optText, form.min, form.max);
      const facet = { title: form.title || form.kind, kind: form.kind, ...parsed };
      const facets = mode === 'add' ? [...(cat.facets || []), facet] : (cat.facets || []).map((f, i) => i === fi ? facet : f);
      updateCat({ ...cat, facets });
      setModal(null);
    };

    const setF = (key, val) => setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));
    const KIND_LABELS = { list: 'List (checkboxes)', toggles: 'Toggles (tag pills)', range: 'Price Range (slider)', color: 'Color swatches' };

    return e('div', null,
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 } },
        e('h1', { style: { ...S.heading, margin: 0 } }, 'Filters & Facets'),
        e('select', { value: catId, onChange: ev => setCatId(ev.target.value), style: { ...S.input, width: 200 } },
          data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
        ),
        e('button', { onClick: openAdd, style: S.btnPrimary }, '+ Add Filter')
      ),

      modal && e(Modal, { title: modal.mode === 'add' ? 'Add Filter' : 'Edit Filter', onClose: () => setModal(null) },
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: 'Filter Title' }, e(Input, { value: modal.form.title, onChange: ev => setF('title', ev.target.value), placeholder: 'e.g. Frame Size', autoFocus: true })),
          e(Field, { label: 'Type' },
            e(Select, { value: modal.form.kind, onChange: ev => setF('kind', ev.target.value) },
              Object.entries(KIND_LABELS).map(([v, l]) => e('option', { key: v, value: v }, l))
            )
          )
        ),
        modal.form.kind === 'range'
          ? e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
              e(Field, { label: 'Min (€)' }, e(Input, { type: 'number', value: modal.form.min, onChange: ev => setF('min', ev.target.value) })),
              e(Field, { label: 'Max (€)' }, e(Input, { type: 'number', value: modal.form.max, onChange: ev => setF('max', ev.target.value) }))
            )
          : e(Field, { label: modal.form.kind === 'color' ? 'Options — one per line:  #hex: count' : 'Options — one per line:  Label: count  (prefix SALE for red highlight)' },
              e('textarea', { value: modal.form.optText, onChange: ev => setF('optText', ev.target.value), rows: 10, style: { ...S.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }, placeholder: modal.form.kind === 'color' ? '#e63946: 12\n#2a9d8f: 8\n#264653: 5' : 'XS: 8\nS: 15\nM: 24\nL: 18\nXL: 10\nSALE Clearance: 3' })
            ),
        e('div', { style: { display: 'flex', gap: 10, marginTop: 20 } },
          e('button', { onClick: saveModal, style: S.btnPrimary }, modal.mode === 'add' ? 'Add Filter' : 'Save Changes'),
          e('button', { onClick: () => setModal(null), style: S.btnGhost }, 'Cancel')
        )
      ),

      e('div', { style: S.card },
        (cat.facets || []).length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } },
              'No filters yet for ', e('strong', null, cat.label), '. Click "+ Add Filter" above to create the left-side sidebar filters.'
            )
          : e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
              e('thead', null, e('tr', null, ['Order', 'Title', 'Type', 'Options preview', 'Actions'].map(h => e('th', { key: h, style: S.th }, h)))),
              e('tbody', null,
                (cat.facets || []).map((f, i) =>
                  e('tr', { key: i, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
                    e('td', { style: S.td }, e('div', { style: { display: 'flex', gap: 4 } },
                      e('button', { onClick: () => move(i, -1), disabled: i === 0, style: S.btnSm }, '↑'),
                      e('button', { onClick: () => move(i, 1), disabled: i === (cat.facets || []).length - 1, style: S.btnSm }, '↓')
                    )),
                    e('td', { style: { ...S.td, fontWeight: 700 } }, f.title || '—'),
                    e('td', { style: S.td }, e('span', { style: { background: '#f1f5f9', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#475569' } }, f.kind)),
                    e('td', { style: { ...S.td, color: '#64748b', fontSize: 13 } },
                      f.kind === 'range' ? `€${f.min} — €${f.max}` : (f.options || []).slice(0, 5).map(o => o.label || o.color).join(', ') + ((f.options || []).length > 5 ? ' …' : '')
                    ),
                    e('td', { style: S.td },
                      e('button', { onClick: () => openEdit(i), style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), 'Edit'), ' ',
                      e('button', { onClick: () => del(i), style: S.btnDanger }, '🗑')
                    )
                  )
                )
              )
            )
      )
    );
  }

  // ── Publish modal (auto-deploy via GitHub API → Cloudflare Pages) ──────────────
  function PublishModal({ data, onClose, goToSettings }) {
    const cfg = loadGithubConfig();
    const hasToken = !!(cfg.token && cfg.repo);
    const [phase, setPhase] = useState(hasToken ? 'idle' : 'notoken');
    const [phaseLabel, setPhaseLabel] = useState('');
    const [deployUrl, setDeployUrl] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const downloadJS = () => {
      const js = generateStoreJS(data);
      const blob = new Blob([js], { type: 'text/javascript' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'store-data.js'; a.click();
    };

    const step = (label) => setPhaseLabel(label);

    const toBase64 = (str) => {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    };

    const publish = async () => {
      setPhase('busy');
      setErrMsg('');
      const { token, repo, branch = 'main', siteUrl } = cfg;
      const h = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' };
      const base = `https://api.github.com/repos/${repo}/contents`;

      const getSha = async (path) => {
        const res = await fetch(`${base}/${path}?ref=${branch}`, { headers: h });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`無法讀取 GitHub 檔案 ${path} (${res.status})`);
        const d = await res.json();
        return d.sha;
      };

      const commitFile = async (path, content, msg) => {
        const sha = await getSha(path);
        const body = { message: msg, content: toBase64(content), branch };
        if (sha) body.sha = sha;
        const res = await fetch(`${base}/${path}`, { method: 'PUT', headers: h, body: JSON.stringify(body) });
        if (!res.ok) { const t = await res.text(); throw new Error(`提交 ${path} 失敗 (${res.status}): ${t}`); }
      };

      try {
        // 1. Verify token & repo
        step('正在驗證 GitHub Token…');
        const testRes = await fetch(`https://api.github.com/repos/${repo}`, { headers: h });
        if (testRes.status === 401) throw new Error('GitHub Token 無效，請至 Settings 重新設定。');
        if (testRes.status === 404) throw new Error(`找不到 Repository：${repo}，請確認名稱格式為 owner/repo。`);
        if (!testRes.ok) throw new Error(`無法連接 GitHub (${testRes.status})`);

        // 2. Commit store-data.js — use generated only if admin has real CMS data
        step('正在提交 store-data.js…');
        if (data.categories && data.categories.length > 0) {
          await commitFile('store-data.js', generateStoreJS(data), 'Deploy: update store data');
        } else {
          try {
            const r = await fetch('./store-data.js?' + Date.now());
            if (r.ok) { await commitFile('store-data.js', await r.text(), 'Deploy: update store data'); }
          } catch (_) {}
        }

        // 3. Commit _ds_bundle.js (design system)
        try {
          step('正在提交 _ds_bundle.js…');
          const r = await fetch('./_ds_bundle.js?' + Date.now());
          if (r.ok) { await commitFile('_ds_bundle.js', await r.text(), 'Deploy: update design system bundle'); }
        } catch (_) {}

        // 4. Commit styles.css
        try {
          step('正在提交 styles.css…');
          const r = await fetch('./styles.css?' + Date.now());
          if (r.ok) { await commitFile('styles.css', await r.text(), 'Deploy: update styles'); }
        } catch (_) {}

        // 5. Commit index.html (storefront entry)
        try {
          step('正在提交 index.html…');
          const r = await fetch('./index.html?' + Date.now());
          if (r.ok) { await commitFile('index.html', await r.text(), 'Deploy: update storefront index'); }
        } catch (_) {}

        // 6. Commit admin.html (admin entry)
        try {
          step('正在提交 admin.html…');
          const r = await fetch('./admin.html?' + Date.now());
          if (r.ok) { await commitFile('admin.html', await r.text(), 'Deploy: update admin entry'); }
        } catch (_) {}

        // 7. Commit store-app.jsx
        try {
          step('正在提交 store-app.jsx…');
          const r = await fetch('./store-app.jsx?' + Date.now());
          if (r.ok) { await commitFile('store-app.jsx', await r.text(), 'Deploy: update store app'); }
        } catch (_) {}

        // 8. Commit admin-app.jsx
        try {
          step('正在提交 admin-app.jsx…');
          const r = await fetch('./admin-app.jsx?' + Date.now());
          if (r.ok) { await commitFile('admin-app.jsx', await r.text(), 'Deploy: update admin app'); }
        } catch (_) {}

        const normalizedUrl = siteUrl ? (siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`) : `https://github.com/${repo}`;
        setDeployUrl(normalizedUrl.replace(/\/$/, ''));
        setPhase('done');
      } catch (err) {
        setErrMsg(err.message);
        setPhase('error');
      }
    };

    const spinStyle = { width: 20, height: 20, border: '3px solid #e2e8f0', borderTop: `3px solid ${BRAND}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 };

    if (phase === 'notoken') return e(Modal, { title: '📦 發布至 Cloudflare Pages', onClose, width: 500 },
      e('div', { style: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '16px 18px', marginBottom: 20 } },
        e('p', { style: { margin: 0, fontWeight: 700, color: '#92400e', fontSize: 14 } }, '⚠ 尚未設定 GitHub Token 與 Repository'),
        e('p', { style: { margin: '8px 0 0', fontSize: 13, color: '#78350f' } }, '請前往 Settings 頁面完成 GitHub + Cloudflare Pages 設定，即可一鍵自動發布。')
      ),
      e('div', { style: { display: 'flex', gap: 10 } },
        e('button', { onClick: goToSettings, style: S.btnPrimary }, '前往 Settings 設定'),
        e('button', { onClick: downloadJS, style: S.btnGhost }, '⬇ 手動下載 JS'),
        e('button', { onClick: onClose, style: S.btnGhost }, '取消')
      )
    );

    return e(Modal, { title: '📦 發布至 Cloudflare Pages', onClose: phase === 'busy' ? undefined : onClose, width: 500 },
      phase === 'idle' && e('div', null,
        e('p', { style: { margin: '0 0 16px', fontSize: 14, color: '#374151' } }, '確認要將目前的 CMS 資料發布到線上網站嗎？'),
        e('div', { style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#0369a1', marginBottom: 20 } },
          '會將 store-data.js、store-app.jsx、admin-app.jsx commit 到 GitHub，Cloudflare Pages 約 30 秒後自動部署完成。'
        ),
        e('div', { style: { display: 'flex', gap: 10 } },
          e('button', { onClick: publish, style: S.btnPrimary }, '🚀 確認發布'),
          e('button', { onClick: onClose, style: S.btnGhost }, '取消')
        )
      ),
      phase === 'busy' && e('div', { style: { padding: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 12 } },
        e('div', { style: spinStyle }),
        e('span', { style: { fontSize: 14, fontWeight: 600, color: '#374151' } }, phaseLabel)
      ),
      phase === 'done' && e('div', null,
        e('div', { style: { textAlign: 'center', padding: '16px 0 8px' } },
          e('div', { style: { fontSize: 48, marginBottom: 10 } }, '🎉'),
          e('p', { style: { fontSize: 18, fontWeight: 800, color: '#166534', margin: '0 0 4px' } }, '已提交到 GitHub！'),
          e('p', { style: { fontSize: 13, color: '#64748b', margin: 0 } }, 'Cloudflare Pages 正在自動部署，約 30 秒後上線。')
        ),
        e('div', { style: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' } },
          e('a', { href: deployUrl, target: '_blank', style: { ...S.btnPrimary, textDecoration: 'none' } }, '🌐 前台網站'),
          e('a', { href: deployUrl ? deployUrl.replace(/\/?$/, '/admin.html') : '#', target: '_blank', style: { ...S.btnGhost, textDecoration: 'none' } }, '⚙ 後台管理'),
          e('button', { onClick: onClose, style: S.btnGhost }, '關閉')
        )
      ),
      phase === 'error' && e('div', null,
        e('div', { style: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px 18px', marginBottom: 20 } },
          e('p', { style: { margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 14 } }, '✕ 發布失敗'),
          e('p', { style: { margin: '8px 0 0', fontSize: 12, color: '#7f1d1d', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, errMsg)
        ),
        e('div', { style: { display: 'flex', gap: 10 } },
          e('button', { onClick: publish, style: S.btnPrimary }, '重試'),
          e('button', { onClick: downloadJS, style: S.btnGhost }, '⬇ 手動下載 JS'),
          e('button', { onClick: onClose, style: S.btnGhost }, '關閉')
        )
      )
    );
  }

  // ── App root ──────────────────────────────────────────────────────────────
  function App() {
    const [user, setUser] = useState(loadAuth);
    const [section, setSection] = useState('dashboard');
    const [data, setDataRaw] = useState(getInitialData);
    const [saved, setSaved] = useState('');
    const [showPublish, setShowPublish] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const setData = (d) => { setDataRaw(d); saveCMS(d); setSaved('Saved ✓'); setTimeout(() => setSaved(''), 2000); };
    const onLogout = () => { saveAuth(null); setUser(null); setShowProfile(false); };
    const onUpdateUser = (u) => setUser(u);

    if (!user) return e(Login, { onLogin: setUser });

    const sections = {
      dashboard: e(Dashboard, { data }),
      hero: e(HeroManager, { data, setData }),
      categories: e(CategoriesManager, { data, setData, user }),
      megamenu: e(MegaMenuManager, { data, setData }),
      filters: e(FiltersManager, { data, setData }),
      products: e(ProductsManager, { data, setData }),
      badges: e(BadgesManager, { data, setData }),
      images: e(ImageLibrary, { data, setData }),
      users: user.role === 'admin' ? e(UsersManager) : e('div', null, e('p', null, 'Access denied')),
      settings: e(SettingsManager, { data }),
    };

    return e('div', { style: { display: 'flex', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' } },
      e(Sidebar, { section, setSection, user, onLogout }),
      e('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        // topbar
        e('div', { style: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px 0 28px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50 } },
          e('span', { style: { fontSize: 13, color: '#94a3b8' } }, 'ARMOR BIKE  ·  CMS Admin Panel'),
          e('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
            saved ? e('span', { style: { fontSize: 12, color: '#16a34a', fontWeight: 700 } }, saved) : null,
            e('button', { onClick: () => setShowPublish(true), style: { ...S.btnGhost, fontSize: 12, padding: '6px 14px' } }, '📦 發布'),
            e('a', { href: 'index.html', target: '_blank', style: { ...S.btnPrimary, fontSize: 12, padding: '6px 14px', textDecoration: 'none' } }, '👁 Preview Store'),
            // ── user avatar button ──
            e('button', {
              onClick: () => setShowProfile(v => !v),
              title: user.name || user.username,
              style: { display: 'flex', alignItems: 'center', gap: 8, background: showProfile ? '#f1f5f9' : 'none', border: '1px solid ' + (showProfile ? '#e2e8f0' : 'transparent'), borderRadius: 30, padding: '4px 10px 4px 4px', cursor: 'pointer', transition: 'all .12s' }
            },
              e(UserAvatar, { user, size: 30, fontSize: 12 }),
              e('span', { style: { fontSize: 13, fontWeight: 600, color: '#374151', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, user.name || user.username),
              e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: '#94a3b8', strokeWidth: 2.5, strokeLinecap: 'round', style: { transition: 'transform .15s', transform: showProfile ? 'rotate(180deg)' : 'none', flexShrink: 0 } },
                e('polyline', { points: '6 9 12 15 18 9' })
              )
            )
          )
        ),
        // content
        e('div', { style: { flex: 1, overflowY: 'auto', padding: '28px 32px' } }, sections[section] || sections.dashboard)
      ),
      showPublish && e(PublishModal, { data, onClose: () => setShowPublish(false), goToSettings: () => { setShowPublish(false); setSection('settings'); } }),
      showProfile && e(UserProfilePanel, { user, onLogout, onClose: () => setShowProfile(false), onUpdateUser })
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
