/* ARMOR BIKE — CMS Admin Panel */
(function () {
  const e = React.createElement;
  const { useState, useMemo, useRef, useEffect } = React;

  const BRAND = '#006ee0';
  const SALE_COLOR = '#e0004b';
  const LEGACY_CMS_KEY = 'ARMOR_BIKE_CMS';
  const AUTH_KEY = 'ARMOR_BIKE_AUTH';
  const USERS_KEY = 'ARMOR_BIKE_USERS';
  const USERS_DELETED_KEY = 'ARMOR_BIKE_USERS_DELETED';

  // ── storage ──────────────────────────────────────────────────────────────
  const clearLegacyCMS = () => { try { localStorage.removeItem(LEGACY_CMS_KEY); } catch {} };
  const loadAuth = () => { try { const r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
  const saveAuth = (u) => u ? localStorage.setItem(AUTH_KEY, JSON.stringify(u)) : localStorage.removeItem(AUTH_KEY);
  const userNameKey = (u) => String((typeof u === 'string' ? u : u?.username) || '').trim();
  const stripUserSource = (u) => {
    const { source, ...rest } = u || {};
    return rest;
  };
  const loadUsers = () => { try { const r = localStorage.getItem(USERS_KEY); const data = r ? JSON.parse(r) : []; return Array.isArray(data) ? data : []; } catch { return []; } };
  const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify((u || []).map(stripUserSource).filter(x => userNameKey(x))));
  const loadDeletedUsers = () => { try { const r = localStorage.getItem(USERS_DELETED_KEY); const data = r ? JSON.parse(r) : []; return Array.isArray(data) ? data.map(userNameKey).filter(Boolean) : []; } catch { return []; } };
  const saveDeletedUsers = (u) => localStorage.setItem(USERS_DELETED_KEY, JSON.stringify(Array.from(new Set((u || []).map(userNameKey).filter(Boolean)))));

  // ── shared accounts baked into the deployed site (cms-users.js → window.CMS_USERS) ──
  // Passwords are stored as SHA-256 hashes (not plaintext), so any browser can sign in
  // without importing config. Note: client-side auth — convenient, not high-security.
  const sha256Hex = async (s) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s)));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  };
  const bakedUsers = () => Array.isArray(window.CMS_USERS) ? window.CMS_USERS : [];
  // Every account known to this browser (local working copy + baked shared accounts).
  const allUsers = () => {
    const deleted = new Set(loadDeletedUsers());
    const local = loadUsers()
      .filter(u => userNameKey(u) && !deleted.has(userNameKey(u)))
      .map(u => ({ ...u, source: '本機' }));
    const names = new Set(local.map(userNameKey));
    const baked = bakedUsers()
      .filter(u => userNameKey(u) && !names.has(userNameKey(u)) && !deleted.has(userNameKey(u)))
      .map(u => ({ ...u, source: '雲端' }));
    return [...local, ...baked];
  };
  // Verify against localStorage plaintext (unpublished/local) OR baked hashed accounts.
  const verifyLogin = async (username, password) => {
    username = (username || '').trim();
    if (loadDeletedUsers().includes(username)) return null;
    const local = loadUsers().find(x => x.username === username && x.password === password);
    if (local) return local;
    const h = await sha256Hex(username + ':' + password);
    const b = bakedUsers().find(x => x.username === username && x.passwordHash === h);
    if (b) return { id: b.id || Date.now(), username: b.username, role: b.role || 'admin', name: b.name || b.username };
    return null;
  };
  // Build cms-users.js content from the current accounts (hashing plaintext passwords).
  const buildCmsUsersJS = async (users) => {
    const out = [];
    for (const raw of (users || [])) {
      const u = stripUserSource(raw);
      const username = userNameKey(u);
      if (!username) continue;
      const hash = u.passwordHash || (u.password ? await sha256Hex(username + ':' + u.password) : '');
      out.push({ id: u.id, username, passwordHash: hash, role: u.role || 'editor', name: u.name || username });
    }
    return '/* ARMOR BIKE — admin accounts (SHA-256 hashed passwords). Auto-generated on publish. */\nwindow.CMS_USERS = ' + JSON.stringify(out, null, 2) + ';\n';
  };

  const CLOUDINARY_KEY = 'ARMOR_BIKE_CDN';
  const CLOUDINARY_DEFAULTS = { cloudName: 'dvzdptb3i', uploadPreset: 'armor_unsigned' };

  const GITHUB_KEY = 'ARMOR_BIKE_GITHUB';
  const GITHUB_DEFAULTS = {
    repo: 'armortw/armor-bike-website',
    branch: 'main',
    siteUrl: 'https://armor-bike-website.pages.dev/'
  };
  const normalizeGithubConfig = (c) => {
    const next = { ...GITHUB_DEFAULTS, ...(c || {}) };
    if (!next.siteUrl || next.siteUrl === 'armor-bike.pages.dev' || next.siteUrl === 'https://armor-bike.pages.dev' || next.siteUrl === 'https://armor-bike-website.pages.dev') {
      next.siteUrl = GITHUB_DEFAULTS.siteUrl;
    }
    if (!next.branch) next.branch = GITHUB_DEFAULTS.branch;
    if (!next.repo) next.repo = GITHUB_DEFAULTS.repo;
    return next;
  };
  const mergeCloudConfig = (c) => ({
    cloudinary: {
      cloudName: c?.cloudinary?.cloudName || CLOUDINARY_DEFAULTS.cloudName,
      uploadPreset: c?.cloudinary?.uploadPreset || CLOUDINARY_DEFAULTS.uploadPreset
    },
    github: normalizeGithubConfig(c?.github || {}),
    source: c?.source || 'defaults'
  });
  let cloudConfigState = mergeCloudConfig({});
  let cloudConfigPromise = null;
  const loadCloudConfig = async () => {
    if (!cloudConfigPromise) {
      cloudConfigPromise = fetch('/api/config', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          cloudConfigState = mergeCloudConfig({ ...(d || {}), source: d ? 'cloud' : 'defaults' });
          return cloudConfigState;
        })
        .catch(() => cloudConfigState);
    }
    return cloudConfigPromise;
  };
  const loadCldConfig = () => ({ ...cloudConfigState.cloudinary });
  const saveCldConfig = (c) => {
    cloudConfigState = mergeCloudConfig({ ...cloudConfigState, cloudinary: c, source: cloudConfigState.source });
    return cloudConfigState.cloudinary;
  };
  const loadGithubConfig = () => ({ ...cloudConfigState.github });
  const saveGithubConfig = (c) => {
    cloudConfigState = mergeCloudConfig({ ...cloudConfigState, github: c, source: cloudConfigState.source });
    return cloudConfigState.github;
  };

  // ── cross-origin config sync (users + GitHub token + Cloudinary) ───────────
  // localStorage is per-origin (localhost / 192.168.x / pages.dev don't share it),
  // so settings move between devices via this one-blob export/import.
  const exportConfigBlob = () => JSON.stringify({ v: 1, exported: new Date().toISOString(), users: allUsers().map(stripUserSource), deletedUsers: loadDeletedUsers(), github: loadGithubConfig(), cloudinary: loadCldConfig() }, null, 2);
  const importConfigBlob = (txt) => {
    const d = JSON.parse(txt);
    let total = allUsers().length;
    if (Array.isArray(d.deletedUsers)) {
      saveDeletedUsers([...loadDeletedUsers(), ...d.deletedUsers]);
    }
    if (Array.isArray(d.users)) {
      // merge by username (incoming wins for duplicates) so no account on either side is lost
      const cur = loadUsers();
      const incoming = d.users.map(stripUserSource).filter(u => userNameKey(u));
      const inNames = new Set(incoming.map(userNameKey));
      const merged = [...cur.filter(u => !inNames.has(userNameKey(u))), ...incoming];
      saveUsers(merged);
      saveDeletedUsers(loadDeletedUsers().filter(name => !inNames.has(name)));
      total = allUsers().length;
    }
    if (d.github && typeof d.github === 'object') saveGithubConfig(d.github);
    if (d.cloudinary && typeof d.cloudinary === 'object') saveCldConfig(d.cloudinary);
    return { users: total };
  };

  function getInitialData() {
    return {
      categories: JSON.parse(JSON.stringify(window.STORE.categories)),
      images: JSON.parse(JSON.stringify(window.STORE.images || [])),
      badges: JSON.parse(JSON.stringify(window.STORE.badges || [])),
      hero: JSON.parse(JSON.stringify(window.STORE.hero || []))
    };
  }

  const withoutProducts = (cat) => {
    const copy = { ...(cat || {}) };
    delete copy.products;
    return copy;
  };
  const sameJSON = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
  const buildContentChanges = (data) => {
    const baseCategories = Array.isArray(window.STORE.categories) ? window.STORE.categories : [];
    const nextCategories = Array.isArray(data.categories) ? data.categories : [];
    const baseById = new Map(baseCategories.map(c => [c.id, c]));
    const nextById = new Map(nextCategories.map(c => [c.id, c]));
    const deleted = new Set((data.categoryDeletions || []).map(String));
    baseCategories.forEach((cat) => {
      if (cat?.id && !nextById.has(cat.id)) deleted.add(String(cat.id));
    });

    const changed = new Set();
    nextCategories.forEach((cat) => {
      if (!cat?.id) return;
      const base = baseById.get(cat.id);
      if (!base || !sameJSON(withoutProducts(base), withoutProducts(cat))) changed.add(String(cat.id));
    });

    const baseOrder = baseCategories.map(c => c.id).filter(id => !deleted.has(String(id)));
    const nextOrder = nextCategories.map(c => c.id);
    return {
      deletedCategoryIds: Array.from(deleted),
      changedCategoryIds: Array.from(changed),
      categoryOrderChanged: !sameJSON(baseOrder, nextOrder),
      heroChanged: !sameJSON(window.STORE.hero || [], data.hero || []),
      imagesChanged: !sameJSON(window.STORE.images || [], data.images || []),
      badgesChanged: !sameJSON(window.STORE.badges || [], data.badges || [])
    };
  };

  function makePublishId(prefix = 'pub') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function generateStoreJS(data, publishId = '') {
    const HEX = window.STORE.HEX;
    const hexLines = Object.entries(HEX).map(([k, v]) => `    ${k}: '${v}'`).join(',\n');
    const ts = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
    const safePublishId = String(publishId || makePublishId('manual')).replace(/[^a-zA-Z0-9_.:-]/g, '_');
    return [
      `/* ARMOR BIKE Storefront — published ${ts} */`,
      `/* ARMOR_BIKE_PUBLISH_ID:${safePublishId} */`,
      `(function () {`,
      `  var HEX = {\n${hexLines}\n  };`,
      `  var categories = ${JSON.stringify(data.categories, null, 2)};`,
      `  var images = ${JSON.stringify(data.images || [], null, 2)};`,
      `  var badges = ${JSON.stringify(data.badges || [], null, 2)};`,
      `  var hero = ${JSON.stringify(data.hero || [], null, 2)};`,
      `  var publishId = ${JSON.stringify(safePublishId)};`,
      `  var map = {};`,
      `  categories.forEach(function (c) { map[c.id] = c; });`,
      `  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, badges: badges, hero: hero, publishId: publishId };`,
      `})();`,
    ].join('\n');
  }


  const normalizeDeployUrlForCheck = (url) => (url || GITHUB_DEFAULTS.siteUrl).replace(/\/$/, '');

  async function waitForStoreDataPublish(siteUrl, publishId, timeoutMs = 90000) {
    const baseUrl = normalizeDeployUrlForCheck(siteUrl);
    const marker = `ARMOR_BIKE_PUBLISH_ID:${publishId}`;
    const deadline = Date.now() + timeoutMs;
    let lastError = '';
    while (Date.now() < deadline) {
      try {
        const target = `${baseUrl}/store-data.js?deploy=${encodeURIComponent(publishId)}&check=${Date.now()}`;
        const res = await fetch(target, { cache: 'no-store' });
        if (res.ok) {
          const online = await res.text();
          if (online.includes(marker) || online.includes(`var publishId = ${JSON.stringify(publishId)}`)) return true;
          lastError = '線上圖片庫仍是上一版';
        } else {
          lastError = `線上圖片庫讀取失敗 (${res.status})`;
        }
      } catch (err) {
        lastError = err.message || '線上圖片庫暫時無法讀取';
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    throw new Error(lastError || 'Cloudflare Pages 尚未完成圖片庫部署');
  }

  async function publishImageLibraryData(nextData, user) {
    const cloud = await loadCloudConfig();
    const github = cloud.github || {};
    if (!github.publishConfigured) {
      throw new Error('Cloudflare 尚未啟用雲端發布密鑰，請使用「發布」寫入雲端。');
    }
    const publishId = makePublishId('img');
    const scopedData = {
      categories: [],
      images: nextData.images || [],
      badges: [],
      hero: [],
      imageDeletions: nextData.imageDeletions || []
    };
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [{
          path: 'store-data.js',
          content: generateStoreJS(scopedData, publishId),
          message: 'Deploy: update image library',
          mergeStrategy: 'owned-products',
          data: scopedData,
          contentChanges: { imagesChanged: true },
          publisher: {
            id: ownerKey(user),
            username: user?.username || '',
            name: ownerName(user),
            role: user?.role || 'editor'
          }
        }]
      })
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `圖片庫雲端保存失敗 (${res.status})`);
    }
    const result = await res.json().catch(() => ({}));
    await waitForStoreDataPublish(result.siteUrl || github.siteUrl || GITHUB_DEFAULTS.siteUrl, publishId);
    return publishId;
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
  const Textarea = ({ style, ...props }) => e('textarea', { style: { ...S.input, minHeight: 132, resize: 'vertical', lineHeight: 1.65, whiteSpace: 'pre-wrap', ...style }, ...props });
  const roleLabel = (role) => role === 'admin' ? '管理員' : role === 'editor' ? '編輯者' : (role || '使用者');

  const IconPencil = ({ size = 18 }) =>
    e('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { display: 'block', flexShrink: 0 } },
      e('path', { d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' })
    );

  // ── Modal ─────────────────────────────────────────────────────────────────
  function Modal({ title, onClose, children, width = 520 }) {
    return e('div', { style: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,.58)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 10000, padding: '28px 16px', boxSizing: 'border-box', overflowY: 'auto' }, onClick: onClose },
      e('div', { style: { background: '#fff', borderRadius: 14, padding: 32, width, maxWidth: '96vw', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto', boxShadow: '0 34px 90px rgba(15,23,42,.32)', position: 'relative' }, onClick: ev => ev.stopPropagation() },
        e('div', { style: { position: 'sticky', top: -32, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-32px -32px 22px', padding: '22px 32px 16px', background: '#fff', borderBottom: '1px solid #e2e8f0', borderRadius: '14px 14px 0 0' } },
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
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, '顯示名稱'), e(Input, { value: displayName, onChange: ev => setDisplayName(ev.target.value), placeholder: '管理員', autoFocus: true })),
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
    const noUsers = allUsers().length === 0;
    if (mode === 'setup') return e(FirstTimeSetup, { onSetup: onLogin, onCancel: () => setMode('login') });
    const submit = async (ev) => {
      ev.preventDefault();
      const user = await verifyLogin(u, p);
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
          e('h2', { style: { margin: '14px 0 4px', fontSize: 22, fontWeight: 800, color: '#16181d' } }, '後台管理系統'),
          e('p', { style: { margin: 0, fontSize: 13, color: '#94a3b8' } }, '請登入以管理網站內容')
        ),
        noUsers ? e('div', { style: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: 12.5, color: '#92400e', lineHeight: 1.5 } },
          '此裝置尚無帳號。可在其他已設定的裝置（後台 → 設定 → 匯出設定）複製設定後，於此「匯入設定」，或建立新帳號。'
        ) : null,
        e('form', { onSubmit: submit },
          e('div', { style: { marginBottom: 14 } }, e('label', { style: S.label }, '帳號'), e(Input, { value: u, onChange: ev => setU(ev.target.value), placeholder: 'admin', autoFocus: true })),
          e('div', { style: { marginBottom: 20 } }, e('label', { style: S.label }, '密碼'), e(Input, { type: 'password', value: p, onChange: ev => setP(ev.target.value), placeholder: '••••••••' })),
          err ? e('div', { style: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 } }, err) : null,
          e('button', { type: 'submit', style: { ...S.btnPrimary, width: '100%', padding: 13, fontSize: 15 } }, '登入')
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
      { id: 'dashboard', icon: '◈', label: '總覽' },
      { id: 'hero', icon: '▶', label: '首頁輪播' },
      { id: 'categories', icon: '☰', label: '導覽選單' },
      { id: 'megamenu', icon: '▦', label: '大型選單' },
      { id: 'filters', icon: '▽', label: '左側篩選' },
      { id: 'products', icon: '◻', label: '產品管理' },
      { id: 'badges', icon: '◈', label: '標籤與徽章' },
      { id: 'images', icon: '▣', label: '圖片庫' },
      ...(user.role === 'admin' ? [{ id: 'users', icon: '◉', label: '使用者' }] : []),
      { id: 'settings', icon: '⚙', label: '設定' },
    ];
    return e('aside', { style: { width: 230, background: '#0f172a', height: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' } },
      e('div', { style: { padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' } },
        e('div', { style: { fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' } }, 'ARMOR BIKE'),
        e('div', { style: { fontSize: 11, color: '#475569', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' } }, '後台管理')
      ),
      e('nav', { style: { flex: 1, padding: '12px 10px' } },
        nav.map(item => e('button', {
          key: item.id, onClick: () => setSection(item.id),
          style: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 14px', background: section === item.id ? BRAND : 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: section === item.id ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: section === item.id ? 700 : 500, marginBottom: 2 }
        }, e('span', { style: { fontSize: 15 } }, item.icon), item.label))
      ),
      e('div', { style: { padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,.07)' } },
        e('div', { style: { fontSize: 13, fontWeight: 600, color: '#e2e8f0' } }, user.name),
        e('div', { style: { fontSize: 11, color: '#475569', marginTop: 1, letterSpacing: '0.05em' } }, roleLabel(user.role)),
        e('button', { onClick: onLogout, style: { marginTop: 10, padding: '5px 12px', background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 6, color: '#64748b', fontSize: 12, cursor: 'pointer', width: '100%' } }, '登出')
      )
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  function Dashboard({ data }) {
    const totalProducts = data.categories.reduce((a, c) => a + (c.products || []).length, 0);
    const stats = [
      { label: '分類數', value: data.categories.length, color: BRAND },
      { label: '產品數', value: totalProducts, color: '#16a34a' },
      { label: '圖片數', value: (data.images || []).length, color: '#f97316' },
      { label: '使用者', value: allUsers().length, color: '#7c3aed' },
    ];
    return e('div', null,
      e('h1', { style: S.heading }, '總覽'),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 } },
        stats.map(s => e('div', { key: s.label, style: { background: '#fff', borderRadius: 12, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,.06)', borderLeft: `4px solid ${s.color}` } },
          e('div', { style: { fontSize: 30, fontWeight: 900, color: '#16181d' } }, s.value),
          e('div', { style: { fontSize: 13, color: '#64748b', marginTop: 4 } }, s.label)
        ))
      ),
      e('div', { style: S.card },
        e('h2', { style: { margin: '0 0 16px', fontSize: 17, fontWeight: 700 } }, '分類總覽'),
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['分類', '產品數', '大型選單欄數', '篩選器'].map(h => e('th', { key: h, style: S.th }, h)))),
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

    const update = (cats, extra = {}) => setData({ ...data, ...extra, categories: cats });

    const startEdit = (c) => { setEditId(c.id); setEf({ label: c.label, accent: !!c.accent, leaf: c.leaf, crumb: (c.crumb || []).join(' > ') }); };
    const saveEdit = (id) => { update(cats.map(c => c.id === id ? { ...c, ...ef, crumb: ef.crumb.split('>').map(s => s.trim()).filter(Boolean) } : c)); setEditId(null); };
    const del = (id) => {
      if (confirm('確定刪除此分類與所有資料嗎？')) {
        update(cats.filter(c => c.id !== id), { categoryDeletions: [...(data.categoryDeletions || []), id] });
      }
    };
    const move = (i, dir) => { const a = [...cats]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; update(a); };

    const add = () => {
      if (!af.id || !af.label) return alert('請填寫 ID 與顯示名稱');
      const c = { id: af.id.toLowerCase().replace(/\s+/g, '-'), label: af.label, accent: af.accent, leaf: af.leaf || af.label, crumb: af.crumb ? af.crumb.split('>').map(s => s.trim()).filter(Boolean) : [af.label], mega: [], facets: [], products: [] };
      update([...cats, c]); setAf({ id: '', label: '', accent: false, leaf: '', crumb: '' }); setShowAdd(false);
    };

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('h1', { style: S.heading }, '導覽選單'),
        e('button', { onClick: () => setShowAdd(v => !v), style: S.btnPrimary }, '+ 新增分類')
      ),
      showAdd && e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 18px', fontSize: 16, fontWeight: 700 } }, '新增分類'),
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: 'ID（網址代稱）' }, e(Input, { value: af.id, onChange: ev => setAf({ ...af, id: ev.target.value }), placeholder: '例如：helmets' })),
          e(Field, { label: '顯示名稱' }, e(Input, { value: af.label, onChange: ev => setAf({ ...af, label: ev.target.value }), placeholder: '例如：Helmets' })),
          e(Field, { label: '頁面標題' }, e(Input, { value: af.leaf, onChange: ev => setAf({ ...af, leaf: ev.target.value }), placeholder: '例如：All Helmets' })),
          e(Field, { label: '麵包屑（A > B）' }, e(Input, { value: af.crumb, onChange: ev => setAf({ ...af, crumb: ev.target.value }), placeholder: '例如：Cycling > Helmets' })),
        ),
        e('label', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 18 } },
          e('input', { type: 'checkbox', checked: af.accent, onChange: ev => setAf({ ...af, accent: ev.target.checked }) }), 'SALE / 強調樣式（紅色標籤）'
        ),
        e('div', { style: { display: 'flex', gap: 10 } }, e('button', { onClick: add, style: S.btnPrimary }, '新增'), e('button', { onClick: () => setShowAdd(false), style: S.btnGhost }, '取消'))
      ),
      e('div', { style: S.card },
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['排序', 'ID', '顯示名稱', '頁面標題', '麵包屑', '樣式', '操作'].map(h => e('th', { key: h, style: S.th }, h)))),
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
                    e('button', { onClick: () => saveEdit(cat.id), style: { ...S.btnSm, background: '#dcfce7', color: '#16a34a' } }, '✓ 儲存'), ' ',
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
                    : e('span', { style: { background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 20, fontSize: 11 } }, '一般')
                  ),
                  e('td', { style: S.td },
                    e('button', { onClick: () => startEdit(cat), style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), '編輯'), ' ',
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
    const delCol = (ci) => { if (confirm('確定移除此欄嗎？')) updateCat({ ...cat, mega: cat.mega.filter((_, i) => i !== ci) }); };
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
        e('h1', { style: { ...S.heading, margin: 0 } }, '大型選單編輯'),
        e('select', { value: catId, onChange: ev => setCatId(ev.target.value), style: { ...S.input, width: 180 } },
          data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
        )
      ),
      modal && e(Modal, { title: modal.mode === 'add' ? '新增群組' : '編輯群組', onClose: () => setModal(null) },
        e(Field, { label: '群組標題' }, e(Input, { value: modal.form.title, onChange: ev => setModal({ ...modal, form: { ...modal.form, title: ev.target.value } }), style: { ...S.input, marginBottom: 14 }, autoFocus: true })),
        e(Field, { label: '連結項目 — 每行一個' },
          e('textarea', { value: modal.form.links, onChange: ev => setModal({ ...modal, form: { ...modal.form, links: ev.target.value } }), rows: 9, style: { ...S.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 } })
        ),
        e('div', { style: { display: 'flex', gap: 10, marginTop: 20 } },
          e('button', { onClick: saveModal, style: S.btnPrimary }, modal.mode === 'add' ? '新增群組' : '儲存變更'),
          e('button', { onClick: () => setModal(null), style: S.btnGhost }, '取消')
        )
      ),
      e('div', { style: { display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, alignItems: 'flex-start' } },
        (cat.mega || []).map((col, ci) =>
          e('div', { key: ci, style: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)', padding: 18, minWidth: 210, flexShrink: 0 } },
            e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
              e('span', { style: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' } }, `第 ${ci + 1} 欄`),
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
            e('button', { onClick: () => openAdd(ci), style: { width: '100%', padding: 8, background: '#f0f9ff', color: BRAND, border: `1px dashed ${BRAND}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, marginTop: 4 } }, '+ 新增群組')
          )
        ),
        e('button', { onClick: addCol, style: { background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 12, minWidth: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start', marginTop: 0 } }, '+ 新增欄位')
      )
    );
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const BADGE_OPTS = ['', 'New', 'Bestseller', 'Hot Deal', '-10%', '-13%', '-15%', '-18%', '-20%', '-24%', '-28%', '-30%', '-32%', '-36%'];
  const COLOR_PRESETS = ['#009ce0', '#111827', '#ffffff', '#c8d2df', '#18a34a', '#e60012', '#ffd105', '#f97316', '#7c3aed'];
  const CHAMELEON_VALUE = '__chameleon__';
  const CHAMELEON_COLORS = ['#65a30d', '#14b8a6', '#7c3aed'];
  const CHAMELEON_GRADIENT = 'linear-gradient(135deg, #65a30d 0%, #14b8a6 48%, #7c3aed 100%)';
  const CHAMELEON_PRESET = { label: '變色龍', value: CHAMELEON_VALUE, colors: CHAMELEON_COLORS, background: CHAMELEON_GRADIENT };
  const isChameleonColor = (value) => {
    const raw = String(value || '').trim();
    return raw === '變色龍' || raw.toLowerCase() === 'chameleon' || raw.toLowerCase() === CHAMELEON_VALUE;
  };
  const colorLabel = (value) => isChameleonColor(value) ? CHAMELEON_PRESET.label : String(value || '').toUpperCase();
  const colorBackground = (value) => isChameleonColor(value) ? CHAMELEON_PRESET.background : value;
  const emptyProduct = () => ({ manufacturer: '', name: '', spec: '', badge: '', note: '', leaf: '', colors: [], images: [] });
  const normalizeHexColor = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const mapped = window.STORE?.HEX?.[raw.toLowerCase()] || '';
    const compact = String(mapped || raw).replace(/\s+/g, '');
    const short = compact.match(/^#?([0-9a-f]{3})$/i);
    if (short) return '#' + short[1].split('').map(ch => ch + ch).join('').toLowerCase();
    const full = compact.match(/^#?([0-9a-f]{6})$/i);
    return full ? '#' + full[1].toLowerCase() : '';
  };
  const normalizeProductColors = (value) => {
    const source = Array.isArray(value)
      ? value
      : String(value || '').split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    const seen = new Set();
    let out = [];
    source.forEach(entry => {
      const raw = typeof entry === 'object' && entry ? (entry.hex || entry.color || entry.value || entry.label) : entry;
      const color = isChameleonColor(raw) ? CHAMELEON_VALUE : normalizeHexColor(raw);
      if (!color || seen.has(color)) return;
      seen.add(color);
      out.push(color);
    });
    const hasLegacyChameleon = CHAMELEON_COLORS.every(hex => seen.has(hex));
    if (seen.has(CHAMELEON_VALUE) || hasLegacyChameleon) {
      out = [CHAMELEON_VALUE, ...out.filter(color => color !== CHAMELEON_VALUE && !CHAMELEON_COLORS.includes(color))];
    }
    return out;
  };
  const makeProductId = () => 'prd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const ownerKey = (user) => String(user?.id || user?.username || '').trim();
  const ownerName = (user) => user?.name || user?.username || '未知使用者';
  const productOwnerLabel = (p) => p.ownerName || p.ownerUsername || (p.ownerId ? String(p.ownerId) : '');
  const productFingerprint = (p) => [
    p.manufacturer || '',
    p.name || '',
    p.spec || '',
    (p.images || []).map(imgUrl).join('|'),
    p.image || ''
  ].join('::').toLowerCase();
  const productMergeKey = (p) => p.productId || p.sourceKey || productFingerprint(p);
  const canManageProduct = (p, user) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const uid = ownerKey(user);
    return !!uid && (
      String(p.ownerId || '') === uid ||
      String(p.ownerUsername || '') === String(user.username || '')
    );
  };
  const stampProductForSave = (product, user, existing) => {
    const now = new Date().toISOString();
    const baseOwnerId = existing?.ownerId || product.ownerId || ownerKey(user);
    const baseOwnerUsername = existing?.ownerUsername || product.ownerUsername || user?.username || '';
    const baseOwnerName = existing?.ownerName || product.ownerName || ownerName(user);
    const normalizedColors = normalizeProductColors(product.colors || product.colorOptions || product.color);
    const normalizedBadge = String(product.badge || '').trim();
    return {
      ...product,
      badge: normalizedBadge,
      colors: normalizedColors,
      productId: existing?.productId || product.productId || makeProductId(),
      sourceKey: existing?.sourceKey || existing?.productId || product.sourceKey || (existing ? productFingerprint(existing) : ''),
      ownerId: baseOwnerId,
      ownerUsername: baseOwnerUsername,
      ownerName: baseOwnerName,
      createdAt: existing?.createdAt || product.createdAt || now,
      updatedAt: now,
      updatedBy: user?.username || ''
    };
  };

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
    if (!f.name || !f.name.trim()) miss.push('產品名稱');
    if (!f.leaf || !String(f.leaf).trim()) miss.push('大型選單子項目');
    if (normalizeProductColors(f.colors || f.colorOptions || f.color).length === 0) miss.push('顏色選項');
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
        '2. 儀表板左上角複製你的 ', e('strong', null, 'Cloud Name（雲端名稱）'), e('br'),
        '3. 前往 Settings → Upload → Upload presets → Add preset', e('br'),
        '4. 將 Signing Mode 設為 ', e('code', { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: 4, fontWeight: 700 } }, 'Unsigned'), ' 後儲存'
      ),
      e(Field, { label: 'Cloud Name（雲端名稱）' },
        e(Input, { value: cloudName, onChange: ev => setCloudName(ev.target.value), placeholder: 'e.g. my-store-abc123', autoFocus: true })
      ),
      e('div', { style: { marginTop: 12 } },
        e(Field, { label: 'Upload Preset（上傳預設，必須為 Unsigned）' },
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

  const CLOUDINARY_IMAGE_MAX_BYTES = 9000000;
  const CLOUDINARY_IMAGE_MAX_DIMENSION = 4096;
  const CLOUDINARY_IMAGE_MIN_DIMENSION = 1200;

  function imageBaseName(fileName) {
    return String(fileName || '').replace(/\.[^.]+$/, '').trim() || 'armor-image-' + Date.now();
  }

  async function decodeLocalImage(file) {
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          cleanup: () => bitmap.close && bitmap.close()
        };
      } catch (err) {
        console.warn('ImageBitmap 解碼失敗，改用瀏覽器圖片解碼。', err);
      }
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('圖片無法讀取，請確認檔案沒有損毀。'));
        img.src = objectUrl;
      });
      return {
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        cleanup: () => URL.revokeObjectURL(objectUrl)
      };
    } catch (err) {
      URL.revokeObjectURL(objectUrl);
      throw err;
    }
  }

  function canvasToWebp(canvas, quality) {
    return new Promise((resolve, reject) => {
      const handleBlob = (blob) => {
        if (!blob) {
          reject(new Error('瀏覽器無法完成 WebP 轉檔。'));
          return;
        }
        if (blob.type !== "image/webp") {
          reject(new Error('目前的瀏覽器不支援 WebP 轉檔。'));
          return;
        }
        resolve(blob);
      };
      canvas.toBlob(handleBlob, "image/webp", quality);
    });
  }

  async function convertImageToWebp(file) {
    if (!file || !String(file.type || '').startsWith('image/')) {
      throw new Error('請選擇圖片檔案。');
    }

    const decoded = await decodeLocalImage(file);
    try {
      if (!decoded.width || !decoded.height) throw new Error('無法取得圖片尺寸。');

      let scale = Math.min(1, CLOUDINARY_IMAGE_MAX_DIMENSION / Math.max(decoded.width, decoded.height));
      let quality = 0.9;

      const render = async () => {
        const width = Math.max(1, Math.round(decoded.width * scale));
        const height = Math.max(1, Math.round(decoded.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', { alpha: true });
        if (!context) throw new Error('瀏覽器無法建立圖片轉檔畫布。');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.clearRect(0, 0, width, height);
        context.drawImage(decoded.source, 0, 0, width, height);
        return { blob: await canvasToWebp(canvas, quality), width, height };
      };

      let converted = await render();
      let blob = converted.blob;
      while (blob.size > CLOUDINARY_IMAGE_MAX_BYTES && Math.max(converted.width, converted.height) > CLOUDINARY_IMAGE_MIN_DIMENSION) {
        scale *= 0.85;
        quality = Math.max(0.7, quality - 0.04);
        converted = await render();
        blob = converted.blob;
      }

      if (blob.size > CLOUDINARY_IMAGE_MAX_BYTES) {
        throw new Error('圖片轉成 WebP 後仍超過 9 MB，請先降低原圖尺寸後再試。');
      }

      const baseName = imageBaseName(file.name);
      return {
        blob,
        fileName: baseName + '.webp',
        alt: baseName,
        width: converted.width,
        height: converted.height,
        originalBytes: file.size
      };
    } finally {
      decoded.cleanup();
    }
  }

  async function uploadLocalImageToCloudinary(file, config) {
    let converted;
    if (file.type === 'image/gif') {
      if (file.size > CLOUDINARY_IMAGE_MAX_BYTES) {
        throw new Error('超過 9 MB 的 GIF 動畫無法自動轉成動態 WebP，請先壓縮後再上傳。');
      }
      converted = { blob: file, fileName: file.name, alt: imageBaseName(file.name), originalBytes: file.size };
    } else if (file.type === 'image/webp' && file.size <= CLOUDINARY_IMAGE_MAX_BYTES) {
      converted = { blob: file, fileName: file.name, alt: imageBaseName(file.name), originalBytes: file.size };
    } else {
      converted = await convertImageToWebp(file);
    }

    const fd = new FormData();
    fd.append("file", converted.blob, converted.fileName);
    fd.append('upload_preset', config.uploadPreset);
    const uploadUrl = 'https://api.cloudinary.com/v1_1/' + config.cloudName + '/image/upload';
    const res = await fetch(uploadUrl, { method: 'POST', body: fd });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || d.error) {
      const msg = (d.error && d.error.message) || 'Cloudinary 上傳失敗（HTTP ' + res.status + '）';
      if (msg.toLowerCase().includes('whitelisted') || msg.toLowerCase().includes('unsigned')) {
        throw new Error('PRESET_NOT_UNSIGNED');
      }
      throw new Error(msg);
    }
    return {
      url: d.secure_url,
      alt: converted.alt || d.original_filename || d.public_id,
      format: d.format || (file.type === 'image/gif' ? 'gif' : 'webp')
    };
  }
  function PresetErrorMsg() {
    return e('span', null,
      'Upload Preset 未設為 Unsigned。請至 ',
      e('a', { href: 'https://cloudinary.com', target: '_blank', style: { color: BRAND } }, 'Cloudinary'),
      ' → Settings（設定）→ Upload Presets（上傳預設），將 Signing Mode（簽署模式）改為 ',
      e('strong', null, 'Unsigned'),
      ' 後儲存。'
    );
  }

  // ── Cloudinary Upload Button ───────────────────────────────────────────────
  function CloudinaryUploadButton({ multiple = true, onComplete, children, style }) {
    const [showSetup, setShowSetup] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState('');
    const [progressValue, setProgressValue] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const inputRef = useRef(null);

    const resetUploadState = () => {
      setDragging(false);
      setProgress('');
      setProgressValue(0);
      setUploadError('');
    };

    const closeUploader = () => {
      if (uploading) return;
      setShowUploader(false);
      resetUploadState();
    };

    const openUploader = () => {
      const config = loadCldConfig();
      if (!config.cloudName || !config.uploadPreset) { setShowSetup(true); return; }
      resetUploadState();
      setShowUploader(true);
    };

    const chooseFiles = () => {
      if (!uploading && inputRef.current) inputRef.current.click();
    };

    const processFiles = async (fileList) => {
      let files = Array.from(fileList || []).filter(file => String(file.type || '').startsWith('image/'));
      if (!multiple) files = files.slice(0, 1);
      if (!files.length) {
        setUploadError('請拖放或選擇圖片檔案。');
        return;
      }

      const config = loadCldConfig();
      if (!config.cloudName || !config.uploadPreset) {
        setShowUploader(false);
        setShowSetup(true);
        return;
      }

      setUploading(true);
      setDragging(false);
      setUploadError('');
      setProgressValue(0);
      const uploaded = [];
      const failed = [];

      try {
        for (let index = 0; index < files.length; index += 1) {
          setProgress('正在轉換並上傳 ' + (index + 1) + '/' + files.length);
          setProgressValue(Math.round(index / files.length * 100));
          try {
            uploaded.push(await uploadLocalImageToCloudinary(files[index], config));
          } catch (err) {
            failed.push(err.message || '未知錯誤');
            if (err.message === 'PRESET_NOT_UNSIGNED') break;
          }
          setProgressValue(Math.round((index + 1) / files.length * 100));
        }

        if (uploaded.length) onComplete(uploaded);
        if (failed.length) {
          setUploadError(failed[0] === 'PRESET_NOT_UNSIGNED' ? 'PRESET_NOT_UNSIGNED' : failed.length + ' 張圖片上傳失敗：' + failed[0]);
        }
        setProgress(uploaded.length ? '已完成 ' + uploaded.length + ' 張圖片' : '');
      } finally {
        setUploading(false);
      }
    };

    const handleInputChange = (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = '';
      processFiles(files);
    };

    const handleDrop = (event) => {
      event.preventDefault();
      setDragging(false);
      if (!uploading) processFiles(event.dataTransfer.files);
    };

    return e(React.Fragment, null,
      e('input', {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        multiple,
        onChange: handleInputChange,
        style: { display: 'none' }
      }),
      e('button', {
        type: 'button',
        onClick: openUploader,
        disabled: uploading,
        title: 'JPG、PNG 等靜態圖片會先轉成 WebP；GIF 動畫保留原格式',
        'aria-busy': uploading,
        style: { ...(style || S.btnGhost), opacity: uploading ? 0.62 : 1, cursor: uploading ? 'wait' : 'pointer' }
      }, uploading ? progress : (children || '透過 Cloudinary 上傳')),
      showUploader && e(Modal, { title: '本機上傳圖片', onClose: closeUploader, width: 620 },
        e('div', {
          role: 'button',
          tabIndex: uploading ? -1 : 0,
          'aria-disabled': uploading,
          'aria-label': '拖放圖片到此處，或按一下選擇圖片',
          onClick: chooseFiles,
          onKeyDown: event => {
            if (!uploading && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              chooseFiles();
            }
          },
          onDragEnter: event => {
            event.preventDefault();
            if (!uploading) setDragging(true);
          },
          onDragOver: event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            if (!uploading) setDragging(true);
          },
          onDragLeave: event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
          },
          onDrop: handleDrop,
          style: {
            minHeight: 238,
            padding: '32px 22px',
            boxSizing: 'border-box',
            border: dragging ? '2px solid ' + BRAND : '2px dashed #7dd3fc',
            borderRadius: 8,
            background: dragging ? '#e0f2fe' : '#f8fbff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer'
          }
        },
          e('div', {
            'aria-hidden': true,
            style: {
              width: 58,
              height: 58,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: dragging ? '#fff' : '#e0f2fe',
              color: BRAND,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1,
              marginBottom: 16
            }
          }, uploading ? '···' : '↑'),
          e('div', { style: { color: '#0f172a', fontSize: 19, fontWeight: 800, marginBottom: 7 } },
            uploading ? progress : '拖放圖片到此處'
          ),
          e('div', { style: { color: '#64748b', fontSize: 13, lineHeight: 1.65, marginBottom: 18 } },
            uploading ? '圖片正在記憶體中轉成 WebP，請勿關閉視窗。' : '支援 JPG、PNG、WebP 與 GIF，也可以按一下選擇本機檔案。'
          ),
          !uploading && e('button', {
            type: 'button',
            onClick: event => {
              event.stopPropagation();
              chooseFiles();
            },
            style: { ...S.btnPrimary, minWidth: 138 }
          }, '選擇圖片')
        ),
        (uploading || progressValue > 0) && e('div', { style: { marginTop: 18 } },
          e('div', { style: { height: 8, borderRadius: 4, overflow: 'hidden', background: '#e2e8f0' } },
            e('div', {
              style: {
                width: Math.max(uploading ? 6 : 0, progressValue) + '%',
                height: '100%',
                borderRadius: 4,
                background: BRAND,
                transformOrigin: 'left center'
              }
            })
          ),
          e('div', { role: 'status', style: { marginTop: 8, color: uploading ? '#334155' : '#15803d', fontSize: 12, fontWeight: 700 } }, progress)
        ),
        uploadError && e('div', { role: 'alert', style: { marginTop: 14, padding: '10px 12px', borderRadius: 8, background: '#fef2f2', color: '#b91c1c', fontSize: 12, lineHeight: 1.55 } },
          uploadError === 'PRESET_NOT_UNSIGNED' ? e(PresetErrorMsg) : uploadError
        ),
        e('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 20 } },
          e('button', {
            type: 'button',
            onClick: closeUploader,
            disabled: uploading,
            style: { ...S.btnGhost, opacity: uploading ? 0.55 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }
          }, progress && !uploading ? '完成' : '關閉')
        )
      ),
      showSetup && e(CloudinarySetupModal, {
        onClose: () => setShowSetup(false),
        onSaved: () => {
          setShowSetup(false);
          resetUploadState();
          setShowUploader(true);
        }
      })
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

  function sampleColorsFromImage(url) {
    return new Promise((resolve, reject) => {
      if (!url) { reject(new Error('NO_IMAGE')); return; }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const maxSide = 96;
          const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round((img.naturalWidth || 1) * scale));
          canvas.height = Math.max(1, Math.round((img.naturalHeight || 1) * scale));
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          const buckets = new Map();
          const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
          for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
            if (a < 160) continue;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            if (max > 238 && min > 222) continue;
            const qr = Math.min(255, Math.round(r / 24) * 24);
            const qg = Math.min(255, Math.round(g / 24) * 24);
            const qb = Math.min(255, Math.round(b / 24) * 24);
            const hex = '#' + toHex(qr) + toHex(qg) + toHex(qb);
            const saturation = max - min;
            const score = 1 + saturation / 255 + (255 - Math.abs(128 - max)) / 512;
            buckets.set(hex, (buckets.get(hex) || 0) + score);
          }
          const colors = Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]).map(([hex]) => normalizeHexColor(hex)).filter(Boolean).slice(0, 5);
          colors.length ? resolve(colors) : reject(new Error('NO_COLORS'));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'));
      img.src = url;
    });
  }

  function ColorPaletteEditor({ colors, images, onChange }) {
    const current = normalizeProductColors(colors);
    const [draft, setDraft] = useState(current[0] || COLOR_PRESETS[0]);
    const [msg, setMsg] = useState('');
    const imageList = Array.isArray(images) ? images : [];
    const firstImageUrl = imageList.length ? imgUrl(imageList[0]) : '';
    const update = (next) => onChange(normalizeProductColors(next));
    const addColor = (raw) => {
      const hex = normalizeHexColor(raw);
      if (!hex) { setMsg('請輸入 #RRGGBB 色碼，或使用吸管從產品圖片取色。'); return; }
      update([...current, hex]);
      setDraft(hex);
      setMsg('已加入顏色 ' + hex.toUpperCase());
    };
    const addChameleonColor = () => {
      update([...current, CHAMELEON_PRESET.value]);
      setDraft(COLOR_PRESETS[0]);
      setMsg('已加入變色龍。');
    };
    const removeColor = (hex) => update(current.filter(c => c !== hex));
    const pickColor = async () => {
      if (!window.EyeDropper) { setMsg('此瀏覽器不支援吸管，請使用 Chrome / Edge 或直接輸入色碼。'); return; }
      try {
        const picked = await new window.EyeDropper().open();
        addColor(picked.sRGBHex);
      } catch (_) {
        setMsg('已取消吸管取色。');
      }
    };
    const extractFromImage = async () => {
      if (!firstImageUrl) { setMsg('請先上傳產品圖片，再從主圖擷取顏色。'); return; }
      setMsg('正在從主圖擷取顏色…');
      try {
        const sampled = await sampleColorsFromImage(firstImageUrl);
        update([...current, ...sampled]);
        setMsg('已從主圖擷取 ' + sampled.length + ' 個候選顏色。');
      } catch (_) {
        setMsg('圖片因跨網域限制無法自動擷取，請使用吸管直接點選圖片顏色。');
      }
    };

    return e('div', { style: { border: '1px solid #dbeafe', borderRadius: 12, background: '#f8fbff', padding: 14 } },
      e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, minHeight: 28 } },
        current.length
          ? current.map(color => e('button', { key: color, type: 'button', onClick: () => removeColor(color), title: '移除 ' + colorLabel(color), style: { display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #cbd5e1', borderRadius: 999, background: '#fff', padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: '#334155' } },
              e('span', { style: { width: 18, height: 18, borderRadius: '50%', background: colorBackground(color), border: '1px solid #fff', boxShadow: '0 0 0 1px #cbd5e1' } }),
              colorLabel(color),
              e('span', { style: { color: '#dc2626', fontWeight: 900 } }, '×')
            ))
          : e('span', { style: { color: '#b91c1c', fontSize: 12, fontWeight: 800 } }, '尚未設定顏色，請加入至少一個產品顏色。')
      ),
      e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 } },
        COLOR_PRESETS.map(hex => e('button', { key: hex, type: 'button', onClick: () => addColor(hex), title: hex.toUpperCase(), style: { width: 30, height: 30, borderRadius: '50%', background: hex, border: '2px solid #fff', boxShadow: '0 0 0 1px #cbd5e1', cursor: 'pointer' } })),
        e('button', { key: 'chameleon', type: 'button', onClick: addChameleonColor, title: CHAMELEON_PRESET.label + '色系', style: { minWidth: 64, height: 30, borderRadius: 999, background: CHAMELEON_PRESET.background, border: '2px solid #fff', boxShadow: '0 0 0 1px #cbd5e1', cursor: 'pointer', color: '#fff', fontSize: 11, fontWeight: 900, textShadow: '0 1px 4px rgba(0,0,0,.35)' } }, CHAMELEON_PRESET.label)
      ),
      e('div', { style: { display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) auto auto auto', gap: 8, alignItems: 'center' } },
        e('input', { type: 'color', value: normalizeHexColor(draft) || COLOR_PRESETS[0], onChange: ev => { setDraft(ev.target.value); addColor(ev.target.value); }, title: '選擇顏色', style: { width: 44, height: 38, padding: 2, border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', cursor: 'pointer' } }),
        e(Input, { value: draft, onChange: ev => { setDraft(ev.target.value); setMsg(''); }, placeholder: '#009ce0 或 blue', onKeyDown: ev => ev.key === 'Enter' && addColor(draft) }),
        e('button', { type: 'button', onClick: () => addColor(draft), style: { ...S.btnSm, padding: '9px 12px', whiteSpace: 'nowrap', background: '#e0f2fe', color: BRAND } }, '+ 加入'),
        e('button', { type: 'button', onClick: pickColor, style: { ...S.btnSm, padding: '9px 12px', whiteSpace: 'nowrap', background: '#fff', color: BRAND, border: '1px solid #bae6fd' } }, '吸管取色'),
        e('button', { type: 'button', onClick: extractFromImage, style: { ...S.btnSm, padding: '9px 12px', whiteSpace: 'nowrap' } }, '主圖擷取')
      ),
      e('p', { style: { margin: '8px 0 0', color: msg ? '#0369a1' : '#64748b', fontSize: 12, lineHeight: 1.6 } }, msg || '可輸入色碼、點選色票，或按「吸管取色」後直接點產品圖片顏色。')
    );
  }

  function ProductForm({ form, setForm, onSave, onCancel, saveLabel, cat, badges = [] }) {
    const imgs = form.images || [];
    const missing = missingProductFields(form);
    const req = (label) => e('span', null, label, ' ', e('span', { style: { color: SALE_COLOR } }, '*'));
    const leaves = megaLeaves(cat);
    const badgeOptions = useMemo(() => {
      const set = new Set([...BADGE_OPTS, ...(badges || []), form.badge || ''].map(x => String(x || '').trim()).filter(Boolean));
      return Array.from(set);
    }, [badges, form.badge]);
    const badgeListId = useMemo(() => 'product-badge-options-' + Math.random().toString(36).slice(2), []);
    return e('div', { style: { ...S.card, border: '2px solid ' + BRAND + '30' } },
      e('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 18 } },
        e(Field, { label: req('製造商') }, e(Input, { value: form.manufacturer, onChange: ev => setForm({ ...form, manufacturer: ev.target.value }), placeholder: '例如：ARMOR' })),
        e(Field, { label: req('產品名稱') }, e(Input, { value: form.name, onChange: ev => setForm({ ...form, name: ev.target.value }), placeholder: '例如：29 MEN SKD' })),
        e('div', { style: { gridColumn: '1 / -1' } },
          e(Field, { label: '規格 / 商品描述' },
            e(Textarea, {
              value: form.spec || '',
              onChange: ev => setForm({ ...form, spec: ev.target.value }),
              rows: 7,
              placeholder: '可輸入多行內容，例如：\nFrame：Carbon 29\nFork：RockShox 120mm\nWheelset：29 inch\n備註：每一行都會保留換行',
              style: { minHeight: 156 }
            })
          ),
          e('p', { style: { margin: '6px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.6 } }, '支援 Enter 分行；儲存與發布後會保留換行內容。')
        ),
        e(Field, { label: req('大型選單子項目') }, e(Select, { value: form.leaf || '', onChange: ev => setForm({ ...form, leaf: ev.target.value }) },
          e('option', { value: '' }, leaves.length ? '請選擇大型選單子項目' : '此分類尚無大型選單子項目，請先至大型選單新增'),
          leaves.map((m, i) => e('option', { key: i, value: m.link }, (m.group ? m.group + ' › ' : '') + m.link))
        )),
        e(Field, { label: '商品標籤' },
          e(React.Fragment, null,
            e(Input, { value: form.badge || '', list: badgeListId, onChange: ev => setForm({ ...form, badge: ev.target.value }), placeholder: '可直接輸入，例如：New / Hot Deal / 限量到貨' }),
            e('datalist', { id: badgeListId }, badgeOptions.map(b => e('option', { key: b, value: b })))
          )
        ),
        e('div', { style: { gridColumn: '1 / -1' } },
          e(Field, { label: req('顏色選項') },
            e(ColorPaletteEditor, { colors: form.colors || form.colorOptions || form.color || [], images: imgs, onChange: colors => setForm({ ...form, colors }) })
          )
        ),
        e('div', { style: { gridColumn: '1 / -1' } },
          e(Field, { label: '備註（選填）' }, e(Input, { value: form.note || '', onChange: ev => setForm({ ...form, note: ev.target.value }), placeholder: '例如：24 小時內出貨 / 僅剩 3 件' }))
        )
      ),
      missing.length > 0 && e('div', { style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 } },
        '尚有必填欄位未填寫：', missing.join('、')
      ),
      e('div', { style: { borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 18 } },
        e('label', { style: { ...S.label, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 } },
          '產品圖片',
          imgs.length > 0 && e('span', { style: { background: BRAND, color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 10 } }, imgs.length)
        ),
        e(ImagesEditor, { images: imgs, onChange: imgs => setForm({ ...form, images: imgs }) })
      ),
      e('div', { style: { display: 'flex', gap: 10 } },
        e('button', { onClick: onSave, style: S.btnPrimary }, saveLabel),
        e('button', { onClick: onCancel, style: S.btnGhost }, '取消')
      )
    );
  }

  // Product card with image carousel dots
  function ProductCardView({ p, onEdit, onDelete, canManage }) {
    const imgs = getImages(p);
    const [idx, setIdx] = useState(0);
    const safeIdx = Math.min(idx, imgs.length - 1);
    const mainImg = imgs.length > 0 ? imgUrl(imgs[safeIdx]) : null;
    const badgeColor = (b) => b.startsWith('-') ? SALE_COLOR : b === 'New' ? '#16a34a' : '#f97316';
    const swatches = normalizeProductColors(p.colors || p.colorOptions || p.color);

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
        e('div', { style: { fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.55, whiteSpace: 'pre-line', maxHeight: 78, overflow: 'hidden' } }, p.spec),
        swatches.length > 0 ? e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 } },
          swatches.slice(0, 6).map(color => e('span', { key: color, title: colorLabel(color), style: { width: 16, height: 16, borderRadius: '50%', background: colorBackground(color), border: '1px solid #fff', boxShadow: '0 0 0 1px #cbd5e1' } })),
          swatches.length > 6 ? e('span', { style: { fontSize: 11, color: '#64748b', fontWeight: 800 } }, '+' + (swatches.length - 6)) : null
        ) : null,
        productOwnerLabel(p) ? e('div', { style: { fontSize: 11, color: '#64748b', marginBottom: 10 } }, '建立者：', productOwnerLabel(p)) : null,
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          e('div', null,
            p.leaf ? e('span', { style: { fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 } }, p.leaf) : null
          ),
          canManage
            ? e('div', { style: { display: 'flex', gap: 6 } },
                e('button', { onClick: onEdit, style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), '編輯'),
                e('button', { onClick: onDelete, style: S.btnDanger }, '🗑')
              )
            : e('span', { style: { fontSize: 11, fontWeight: 700, color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '3px 9px' } }, '無權限')
        )
      )
    );
  }

  function ProductsSopGuide() {
    const steps = [
      { icon: '①', title: '選擇分類', text: '先在上方選擇商品所屬分類。' },
      { icon: '②', title: '新增或編輯', text: '點「新增產品」或卡片上的「編輯」。' },
      { icon: '③', title: '填寫資料', text: '輸入名稱、規格描述，並上傳產品圖片。' },
      { icon: '④', title: '發布同步', text: '儲存後點右上角「發布」，同步到前台網站。' }
    ];
    return e('section', { style: { ...S.card, marginTop: 24, padding: 22, border: '1px solid #dbeafe', background: 'linear-gradient(135deg,#ffffff 0%,#f0f9ff 100%)' } },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18 } },
        e('div', null,
          e('h2', { style: { margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#0f172a' } }, '產品上架 SOP'),
          e('p', { style: { margin: 0, color: '#64748b', fontSize: 13, lineHeight: 1.7 } }, '照著 4 個步驟操作，即可完成新增、編輯與前台同步。')
        ),
        e('span', { style: { background: '#dbeafe', color: BRAND, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap' } }, '簡易教學')
      ),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12 } },
        steps.map(step => e('div', { key: step.title, style: { border: '1px solid #bfdbfe', borderRadius: 12, background: 'rgba(255,255,255,.86)', padding: 16, minHeight: 126 } },
          e('div', { style: { width: 34, height: 34, borderRadius: 10, background: BRAND, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: 12, boxShadow: '0 8px 18px rgba(0,110,224,.18)' } }, step.icon),
          e('div', { style: { fontWeight: 850, color: '#0f172a', fontSize: 14, marginBottom: 5 } }, step.title),
          e('div', { style: { color: '#64748b', fontSize: 12, lineHeight: 1.65 } }, step.text)
        ))
      )
    );
  }

  function ProductsManager({ data, setData, user }) {
    const [catId, setCatId] = useState(data.categories[0]?.id || '');
    const [editIdx, setEditIdx] = useState(null);
    const [ef, setEf] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [af, setAf] = useState(emptyProduct());

    const cat = data.categories.find(c => c.id === catId) || data.categories[0];
    const products = cat?.products || [];
    const productBadges = useMemo(() => {
      const set = new Set(data.badges || []);
      (data.categories || []).forEach(c => (c.products || []).forEach(p => { if (p.badge) set.add(p.badge); }));
      return Array.from(set);
    }, [data.badges, data.categories]);

    const save = (prods, deletions = []) => setData({
      ...data,
      productDeletions: deletions.length ? [...(data.productDeletions || []), ...deletions] : (data.productDeletions || []),
      categories: data.categories.map(c => c.id === catId ? { ...c, products: prods } : c)
    });
    const deletionFor = (p) => ({
      categoryId: catId,
      productId: p.productId || '',
      sourceKey: productMergeKey(p),
      ownerId: p.ownerId || '',
      ownerUsername: p.ownerUsername || '',
      deletedBy: user?.username || '',
      deletedAt: new Date().toISOString()
    });
    const editingProduct = editIdx === null ? null : products[editIdx];

    const saveNewProduct = () => {
      const m = missingProductFields(af);
      if (m.length) { alert('無法儲存，請填寫必填欄位：\n• ' + m.join('\n• ')); return; }
      save([...products, stampProductForSave(af, user)]);
      setAf(emptyProduct());
      setShowAdd(false);
    };

    const saveEditedProduct = () => {
      const m = missingProductFields(ef);
      if (m.length) { alert('無法儲存，請填寫必填欄位：\n• ' + m.join('\n• ')); return; }
      if (!editingProduct || !canManageProduct(editingProduct, user)) { alert('只能編輯自己上傳的產品。'); setEditIdx(null); return; }
      save(products.map((x, j) => j === editIdx ? stampProductForSave(ef, user, editingProduct) : x));
      setEditIdx(null);
    };

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
          e('h1', { style: { ...S.heading, margin: 0 } }, '產品管理'),
          e('select', { value: catId, onChange: ev => { setCatId(ev.target.value); setEditIdx(null); setShowAdd(false); }, style: { ...S.input, width: 180 } },
            data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
          ),
          e('span', { style: { fontSize: 13, color: '#64748b' } }, `${products.length} 項產品`)
        ),
        e('button', { onClick: () => { setShowAdd(true); setEditIdx(null); }, style: S.btnPrimary }, '+ 新增產品')
      ),
      showAdd && e(Modal, { title: '新增產品', onClose: () => setShowAdd(false), width: 960 },
        e(ProductForm, { form: af, setForm: setAf, cat, badges: productBadges, onSave: saveNewProduct, onCancel: () => setShowAdd(false), saveLabel: '新增產品' })
      ),
      editingProduct && e(Modal, { title: '編輯產品', onClose: () => setEditIdx(null), width: 960 },
        e(ProductForm, { form: ef, setForm: setEf, cat, badges: productBadges, onSave: saveEditedProduct, onCancel: () => setEditIdx(null), saveLabel: '儲存變更' })
      ),
      e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 } },
        products.map((p, i) => e(ProductCardView, {
          key: p.productId || i, p,
          canManage: canManageProduct(p, user),
          onEdit: () => { if (!canManageProduct(p, user)) return; setEditIdx(i); setEf({ ...p, images: getImages(p), colors: normalizeProductColors(p.colors || p.colorOptions || p.color) }); setShowAdd(false); },
          onDelete: () => { if (!canManageProduct(p, user)) return; if (confirm('確定刪除這個產品嗎？')) save(products.filter((_, j) => j !== i), [deletionFor(p)]); }
        }))
      ),
      e(ProductsSopGuide)
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
      if (!confirm(`確定從所有產品移除標籤「${b}」嗎？`)) return;
      const categories = data.categories.map(c => ({ ...c, products: (c.products || []).map(p => p.badge === b ? { ...p, badge: '' } : p) }));
      setData({ ...data, categories, badges: (data.badges || []).filter(x => x !== b) });
    };

    const chipColor = (b) => b.startsWith('-') ? { bg: '#fef2f2', color: SALE_COLOR, border: '#fca5a5' } : b === 'New' ? { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' } : b === 'Bestseller' ? { bg: '#fff7ed', color: '#ea580c', border: '#fdba74' } : { bg: '#eff6ff', color: BRAND, border: '#93c5fd' };

    return e('div', null,
      e('h1', { style: S.heading }, '標籤與徽章'),
      e('div', { style: S.card },
        e('div', { style: { display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' } },
          e(Input, { value: newB, onChange: ev => setNewB(ev.target.value), style: { ...S.input, width: 220 }, placeholder: '新增標籤名稱…', onKeyDown: ev => ev.key === 'Enter' && addBadge() }),
          e('button', { onClick: addBadge, style: S.btnPrimary }, '+ 新增標籤')
        ),
        e('p', { style: { margin: '0 0 14px', fontSize: 13, color: '#64748b' } }, `${allBadges.length} 個標籤 · 點鉛筆可重新命名，點 × 可從所有產品移除`),
        e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
          allBadges.length === 0 && e('p', { style: { color: '#94a3b8', fontSize: 13 } }, '尚無標籤。可從上方新增，或在產品中指定標籤。'),
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
                  e('button', { onClick: () => { setRenameFrom(b); setRenameTo(b); }, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2, display: 'inline-flex', alignItems: 'center' }, title: '重新命名' }, e(IconPencil, { size: 16 })),
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

    const del = (id) => { if (confirm('確定刪除這張圖片嗎？')) setData({ ...data, images: images.filter(x => x.id !== id) }); };

    const cldConfig = loadCldConfig();
    const isConfigured = !!(cldConfig.cloudName && cldConfig.uploadPreset);

    return e('div', null,
      e('h1', { style: S.heading }, '圖片庫'),
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
          e('span', { style: { fontWeight: 700, fontSize: 15 } }, `圖片庫  ·  ${images.length} 張圖片`),
        ),
        images.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } }, '尚無圖片。請從上方上傳或貼上圖片 URL。')
          : e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 } },
              images.map(img => e('div', { key: img.id, style: { background: '#f8fafc', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' } },
                e('div', { style: { height: 110, overflow: 'hidden', background: '#e2e8f0' } },
                  e('img', { src: img.url, alt: img.alt, style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
                ),
                e('div', { style: { padding: '8px 10px' } },
                  e('div', { style: { fontSize: 11, color: '#374151', fontWeight: 500, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, img.alt),
                  e('div', { style: { display: 'flex', gap: 5 } },
                    e('button', { onClick: () => copy(img), style: { ...S.btnSm, fontSize: 11, flex: 1, background: copied === img.id ? '#dcfce7' : undefined, color: copied === img.id ? '#16a34a' : undefined } }, copied === img.id ? '✓ 已複製' : '📋 URL'),
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
    const [users, setU] = useState(allUsers);
    const [showAdd, setShowAdd] = useState(false);
    const [af, setAf] = useState({ username: '', password: '', name: '', role: 'editor' });
    const [editKey, setEditKey] = useState(null);
    const [ef, setEf] = useState({});

    const cleanUsers = (items) => (items || []).map(stripUserSource).filter(u => userNameKey(u));
    const save = (items) => {
      const clean = cleanUsers(items);
      const present = new Set(clean.map(userNameKey));
      saveDeletedUsers(loadDeletedUsers().filter(name => !present.has(name)));
      saveUsers(clean);
      setU(clean.map(u => ({ ...u, source: '本機' })));
    };
    const refresh = () => setU(allUsers());
    const sourceLabel = (u) => u.source || (u.passwordHash && !u.password ? '雲端' : '本機');
    const sourceStyle = (u) => {
      const cloud = sourceLabel(u) === '雲端';
      return { background: cloud ? '#eef6ff' : '#f8fafc', color: cloud ? BRAND : '#475569', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 };
    };
    const addUser = () => {
      const username = userNameKey(af);
      if (!username || !af.password) return;
      if (users.some(u => userNameKey(u) === username)) { alert('帳號已存在'); return; }
      save([...users, { id: Date.now(), ...af, username }]);
      setAf({ username: '', password: '', name: '', role: 'editor' });
      setShowAdd(false);
    };
    const deleteUser = (u) => {
      const username = userNameKey(u);
      if (!username || !confirm('確定刪除此使用者嗎？')) return;
      saveDeletedUsers([...loadDeletedUsers(), username]);
      const next = users.filter(x => userNameKey(x) !== username);
      saveUsers(cleanUsers(next));
      setU(next);
    };
    const saveEdit = (u) => {
      const original = userNameKey(u);
      const username = userNameKey(ef);
      if (!username) return;
      if (users.some(x => userNameKey(x) !== original && userNameKey(x) === username)) { alert('帳號已存在'); return; }
      save(users.map(x => userNameKey(x) === original ? { ...x, ...ef, username } : x));
      setEditKey(null);
    };

    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' } },
        e('h1', { style: S.heading }, '使用者管理'),
        e('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
          e('button', { onClick: refresh, style: S.btnGhost }, '重新讀取雲端帳號'),
          e('button', { onClick: () => setShowAdd(v => !v), style: S.btnPrimary }, '+ 新增使用者')
        )
      ),
      e('div', { style: { ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 16, background: '#f8fbff' } },
        e('div', null,
          e('strong', { style: { display: 'block', marginBottom: 4 } }, '同步帳號清單'),
          e('span', { style: { color: '#64748b', fontSize: 13 } }, '此處會合併顯示本機帳號與已發布到 cms-users.js 的雲端帳號。')
        ),
        e('span', { style: { background: '#eff6ff', color: BRAND, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900 } }, users.length + ' 個帳號')
      ),
      showAdd && e('div', { style: S.card },
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: '帳號' }, e(Input, { value: af.username, onChange: ev => setAf({ ...af, username: ev.target.value }) })),
          e(Field, { label: '姓名' }, e(Input, { value: af.name, onChange: ev => setAf({ ...af, name: ev.target.value }) })),
          e(Field, { label: '密碼' }, e(Input, { type: 'password', value: af.password, onChange: ev => setAf({ ...af, password: ev.target.value }) })),
          e(Field, { label: '角色' }, e(Select, { value: af.role, onChange: ev => setAf({ ...af, role: ev.target.value }) }, e('option', { value: 'editor' }, '編輯者'), e('option', { value: 'admin' }, '管理員'))),
        ),
        e('div', { style: { display: 'flex', gap: 10 } },
          e('button', { onClick: addUser, style: S.btnPrimary }, '新增使用者'),
          e('button', { onClick: () => setShowAdd(false), style: S.btnGhost }, '取消')
        )
      ),
      e('div', { style: S.card },
        e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          e('thead', null, e('tr', null, ['帳號', '姓名', '角色', '來源', '操作'].map(h => e('th', { key: h, style: S.th }, h)))),
          e('tbody', null,
            users.map((u, i) => editKey === userNameKey(u)
              ? e('tr', { key: userNameKey(u) || u.id || i },
                  e('td', { style: S.td }, e(Input, { value: ef.username, onChange: ev => setEf({ ...ef, username: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Input, { value: ef.name, onChange: ev => setEf({ ...ef, name: ev.target.value }), style: { ...S.input, padding: '6px 10px' } })),
                  e('td', { style: S.td }, e(Select, { value: ef.role, onChange: ev => setEf({ ...ef, role: ev.target.value }), style: { ...S.input, padding: '6px 10px' } }, e('option', { value: 'editor' }, '編輯者'), e('option', { value: 'admin' }, '管理員'))),
                  e('td', { style: S.td }, e('span', { style: sourceStyle(u) }, sourceLabel(u))),
                  e('td', { style: S.td },
                    e('button', { onClick: () => saveEdit(u), style: { ...S.btnSm, background: '#dcfce7', color: '#16a34a' } }, '儲存'), ' ',
                    e('button', { onClick: () => setEditKey(null), style: S.btnSm }, '取消')
                  )
                )
              : e('tr', { key: userNameKey(u) || u.id || i, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
                  e('td', { style: S.td }, e('code', { style: { fontWeight: 700, fontSize: 13 } }, u.username)),
                  e('td', { style: S.td }, u.name || u.username),
                  e('td', { style: S.td }, e('span', { style: { background: u.role === 'admin' ? '#eff6ff' : '#f0fdf4', color: u.role === 'admin' ? BRAND : '#16a34a', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 } }, roleLabel(u.role))),
                  e('td', { style: S.td }, e('span', { style: sourceStyle(u) }, sourceLabel(u))),
                  e('td', { style: S.td },
                    e('button', { onClick: () => { setEditKey(userNameKey(u)); setEf({ username: u.username, name: u.name || u.username, role: u.role || 'editor' }); }, style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), '編輯'), ' ',
                    e('button', { onClick: () => deleteUser(u), style: S.btnDanger }, '刪除')
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
      if (!u || u.password !== pwForm.current) { setPwMsg({ type: 'err', text: '目前密碼不正確' }); return; }
      if (pwForm.next.length < 6) { setPwMsg({ type: 'err', text: '新密碼至少需要 6 個字元' }); return; }
      if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: 'err', text: '兩次輸入的密碼不一致' }); return; }
      saveUsers(users.map(x => x.id === user.id ? { ...x, password: pwForm.next } : x));
      setPwMsg({ type: 'ok', text: '密碼已更新' });
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
                    e('button', { onClick: () => { setNameInput(user.name || ''); setEditName(true); }, title: '編輯名稱', style: { background: 'none', border: 'none', color: 'rgba(255,255,255,.65)', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center', flexShrink: 0 } }, e(IconPencil, { size: 14 }))
                  ),
              e('div', { style: { fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 3 } }, `@${user.username}`),
              e('span', { style: { display: 'inline-block', marginTop: 7, background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 10, letterSpacing: '0.07em' } }, roleLabel(user.role))
            )
          )
        ),
        // ── Tabs ──
        e('div', { style: { display: 'flex', borderBottom: '1px solid #f1f5f9' } },
          [{ id: 'profile', label: '個人資料' }, { id: 'security', label: '安全性' }].map(t =>
            e('button', { key: t.id, onClick: () => { setTab(t.id); setPwMsg(null); }, style: { flex: 1, padding: '11px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? avatarBg : 'transparent'}`, cursor: 'pointer', fontWeight: tab === t.id ? 700 : 500, fontSize: 13, color: tab === t.id ? avatarBg : '#64748b', transition: 'background-color .12s, border-color .12s, color .12s, transform .12s, opacity .12s' } }, t.label)
          )
        ),
        // ── Content ──
        e('div', { style: { padding: '18px 22px 22px' } },
          tab === 'profile'
            ? e('div', null,
                e(InfoRow, { label: '帳號', value: `@${user.username}` }),
                e(InfoRow, { label: '姓名', value: user.name || '—' }),
                e(InfoRow, { label: '角色', value: user.role === 'admin' ? '管理員' : '編輯者', pill: true }),
                e(InfoRow, { label: '登入狀態', value: '使用中' }),
                e('button', {
                  onClick: () => { onLogout(); onClose(); },
                  style: { width: '100%', marginTop: 18, padding: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }
                },
                  e('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
                    e('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
                    e('polyline', { points: '16 17 21 12 16 7' }),
                    e('line', { x1: 21, y1: 12, x2: 9, y2: 12 })
                  ),
                  '登出'
                )
              )
            : e('div', null,
                e('p', { style: { fontSize: 13, color: '#64748b', margin: '0 0 16px' } }, '可在下方更新你的帳號密碼。'),
                [{ label: '目前密碼', key: 'current' }, { label: '新密碼', key: 'next' }, { label: '確認密碼', key: 'confirm' }].map(f =>
                  e('div', { key: f.key, style: { marginBottom: 11 } },
                    e('label', { style: S.label }, f.label),
                    e('input', { type: 'password', value: pwForm[f.key], onChange: ev => { setPwForm({ ...pwForm, [f.key]: ev.target.value }); setPwMsg(null); }, style: S.input })
                  )
                ),
                pwMsg && e('div', { style: { padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 12, background: pwMsg.type === 'err' ? '#fef2f2' : '#f0fdf4', color: pwMsg.type === 'err' ? '#dc2626' : '#16a34a' } }, pwMsg.text),
                e('button', { onClick: changePw, style: { ...S.btnPrimary, width: '100%', padding: '10px', fontSize: 13 } }, '更新密碼')
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

    useEffect(() => {
      let mounted = true;
      loadCloudConfig().then(cloud => {
        if (!mounted) return;
        setCfg({ ...cloud.cloudinary });
        setGithub({ ...cloud.github });
      });
      return () => { mounted = false; };
    }, []);

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
    const hasToken = !!(github.repo && github.branch && github.siteUrl);

    return e('div', null,
      e('h1', { style: S.heading }, '設定'),

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
        e('p', { style: { margin: '0 0 18px', fontSize: 13, color: '#64748b' } }, '完全免費，無額度限制。設定後點擊「📦 發布」，CMS 資料會自動提交到 GitHub，Cloudflare Pages 立即自動部署。'),
        e(Field, { label: 'GitHub Personal Access Token' },
          e('div', { style: { display: 'flex', gap: 8 } },
            e('input', {
              type: 'text',
              value: 'Managed in Cloudflare: GITHUB_TOKEN',
              readOnly: true,
              placeholder: 'Managed in Cloudflare: GITHUB_TOKEN',
              style: { ...S.input, flex: 1, fontFamily: 'monospace', fontSize: 13 }
            }),
            e('button', { disabled: true, style: { ...S.btnGhost, padding: '0 12px', flexShrink: 0, fontSize: 13, opacity: 0.65, cursor: 'default' } }, '雲端')
          )
        ),
        e(Field, { label: 'GitHub Repository（儲存庫，格式：owner/repo）' },
          e(Input, { value: github.repo || '', readOnly: true, placeholder: GITHUB_DEFAULTS.repo })
        ),
        e(Field, { label: 'Branch（分支，預設 main）' },
          e(Input, { value: github.branch || '', readOnly: true, placeholder: GITHUB_DEFAULTS.branch })
        ),
        e(Field, { label: 'Cloudflare Pages 網址（發布後跳轉用）' },
          e(Input, { value: github.siteUrl || '', readOnly: true, placeholder: GITHUB_DEFAULTS.siteUrl })
        ),
        e('div', { style: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 } },
          e('button', { disabled: true, style: { ...S.btnGhost, opacity: 0.65, cursor: 'default' } }, '雲端自動載入'),
          githubSaved && e('span', { style: { fontSize: 13, color: '#16a34a', fontWeight: 700 } }, '已儲存 ✓')
        )
      ),
      e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 14px', fontSize: 15, fontWeight: 700 } }, '📖 設定步驟說明'),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, '步驟 1 — 建立 GitHub Repository'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, '登入 ', e('a', { href: 'https://github.com', target: '_blank', style: { color: BRAND } }, 'github.com'), ' → 右上角 + → New repository'),
            e('li', null, '設為 ', e('strong', null, 'Public'),'，名稱例如 ', e('code', { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 } }, 'armor-bike-website')),
            e('li', null, '把本機 project/ 資料夾的所有檔案上傳到此 repo')
          )
        ),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, '步驟 2 — 取得 GitHub Token'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, 'GitHub 右上角頭像 → Settings（設定）→ Developer settings（開發者設定）→ Personal access tokens（個人存取權杖）→ Tokens (classic)' ),
            e('li', null, '點擊 ', e('strong', null, 'Generate new token (classic)（產生新權杖）'), ' → 輸入名稱'),
            e('li', null, '勾選 ', e('strong', null, 'repo'), ' scope → 點擊 Generate token → 複製並貼入上方')
          )
        ),
        e('div', { style: { marginBottom: 18 } },
          e('p', { style: { margin: '0 0 8px', fontWeight: 700, fontSize: 14, color: '#374151' } }, '步驟 3 — 建立 Cloudflare Pages'),
          e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.2, fontSize: 13 } },
            e('li', null, '登入 ', e('a', { href: 'https://dash.cloudflare.com', target: '_blank', style: { color: BRAND } }, 'dash.cloudflare.com'), ' → Workers & Pages（Workers 與 Pages）→ Create application（建立應用程式）→ Pages'),
            e('li', null, '選 ', e('strong', null, 'Connect to Git（連接 Git）'), ' → 授權 GitHub → 選擇你的 repo'),
            e('li', null, 'Framework preset（框架預設）選 ', e('strong', null, 'None（無）'), '，Build command（建置命令）留空，Build output（輸出目錄）填 ', e('code', { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 } }, '/')),
            e('li', null, '點擊 Deploy（部署）→ 完成後複製 .pages.dev 網址填入上方「Cloudflare Pages 網址」欄位')
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
          e(Field, { label: 'Cloud Name（雲端名稱）' },
            e(Input, { value: cfg.cloudName || '', readOnly: true, placeholder: CLOUDINARY_DEFAULTS.cloudName })
          ),
          e(Field, { label: 'Upload Preset（上傳預設，必須為 Unsigned）' },
            e(Input, { value: cfg.uploadPreset || '', readOnly: true, placeholder: CLOUDINARY_DEFAULTS.uploadPreset })
          )
        ),
        isOk && e('div', { style: { background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#16a34a', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 } },
          '✓ Cloudinary 雲端：', e('code', { style: { background: '#dcfce7', padding: '1px 6px', borderRadius: 4 } }, cfg.cloudName)
        ),
        e('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
          e('button', { disabled: true, style: { ...S.btnGhost, opacity: 0.65, cursor: 'default' } }, '雲端自動載入'),
          cldSaved && e('span', { style: { fontSize: 13, color: '#16a34a', fontWeight: 700 } }, '已儲存 ✓')
        )
      ),
      e('div', { style: S.card },
        e('h3', { style: { margin: '0 0 16px', fontSize: 16, fontWeight: 700 } }, '📖 Cloudinary 設定教學'),
        e('ol', { style: { margin: 0, paddingLeft: 22, color: '#374151', lineHeight: 2.4, fontSize: 14 } },
          e('li', null, '前往 ', e('a', { href: 'https://cloudinary.com/users/register/free', target: '_blank', style: { color: BRAND, fontWeight: 700 } }, 'cloudinary.com'), ' 建立免費帳號（', e('strong', null, '25 GB 儲存、25 GB 頻寬/月'), '，完全免費）'),
          e('li', null, '登入後在儀表板左上角複製你的 ', e('strong', null, 'Cloud Name（雲端名稱）')),
          e('li', null, '前往 ', e('strong', null, 'Settings（設定）→ Upload（上傳）→ Upload presets（上傳預設）'), ' → 點擊 Add upload preset（新增上傳預設）'),
          e('li', null, '將 ', e('strong', null, 'Signing Mode（簽署模式）'), ' 設為 ', e('code', { style: { background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontWeight: 700, fontSize: 13 } }, 'Unsigned'), ' 然後儲存'),
          e('li', null, 'Cloud Name 與 Preset Name 會由雲端設定自動載入。'),
          e('li', null, '完成！產品管理與圖片庫頁面的上傳按鈕會直接把圖片傳至 Cloudinary。')
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
        e('h1', { style: S.heading }, '首頁輪播'),
        e('button', { onClick: () => setShowPicker(true), style: S.btnPrimary }, '+ 新增圖片')
      ),

      e('div', { style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 16px', marginBottom: 22, fontSize: 13, color: '#0369a1', lineHeight: 1.7 } },
        '圖片依序 1 → 2 → 3 → 4 自動輪播（每 5 秒切換）。請先至「圖片庫」上傳圖片，再點「+ 新增圖片」選入輪播。'
      ),

      e('div', { style: S.card },
        hero.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '64px 0', color: '#94a3b8' } },
              e('div', { style: { fontSize: 52, marginBottom: 14 } }, '▶'),
              e('div', { style: { fontWeight: 700, fontSize: 16, color: '#374151', marginBottom: 6 } }, '尚未設定 Hero 輪播圖片'),
              e('div', { style: { fontSize: 13, marginBottom: 22 } }, '點擊下方按鈕，從圖片庫選取圖片加入輪播'),
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
                '從圖片庫新增'
              )
            )
      ),

      showPicker && e(Modal, { title: '選擇首頁輪播圖片', onClose: () => setShowPicker(false), width: 720 },
        library.length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } },
              '圖片庫為空。請先至「圖片庫」上傳圖片後再返回此處。'
            )
          : e(React.Fragment, null,
              e('p', { style: { margin: '0 0 14px', fontSize: 13, color: '#64748b' } }, '點擊圖片即可加入輪播。已加入的圖片標示綠色，點擊不重複加入。'),
              e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 } },
                library.map(img => {
                  const already = hero.some(h => h.url === img.url);
                  return e('div', {
                    key: img.id,
                    onClick: () => { if (!already) { addSlide(img); } },
                    style: { cursor: already ? 'default' : 'pointer', borderRadius: 8, overflow: 'hidden', border: `2px solid ${already ? '#86efac' : '#e2e8f0'}`, opacity: already ? 0.65 : 1, transition: 'border-color .12s, opacity .12s', background: '#f8fafc', position: 'relative' }
                  },
                    e('div', { style: { height: 90, overflow: 'hidden', background: '#e2e8f0' } },
                      e('img', { src: img.url, alt: img.alt || '', style: { width: '100%', height: '100%', objectFit: 'cover' }, onError: ev => { ev.target.style.display = 'none'; } })
                    ),
                    e('div', { style: { padding: '6px 8px', fontSize: 11, color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, img.alt || '（無說明）'),
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
    const del = (fi) => { if (confirm('確定移除此篩選器嗎？')) updateCat({ ...cat, facets: cat.facets.filter((_, i) => i !== fi) }); };
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
    const KIND_LABELS = { list: '清單（核取方塊）', toggles: '切換標籤', range: '價格範圍（滑桿）', color: '色票' };

    return e('div', null,
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 } },
        e('h1', { style: { ...S.heading, margin: 0 } }, '左側篩選器'),
        e('select', { value: catId, onChange: ev => setCatId(ev.target.value), style: { ...S.input, width: 200 } },
          data.categories.map(c => e('option', { key: c.id, value: c.id }, c.label))
        ),
        e('button', { onClick: openAdd, style: S.btnPrimary }, '+ 新增篩選器')
      ),

      modal && e(Modal, { title: modal.mode === 'add' ? '新增篩選器' : '編輯篩選器', onClose: () => setModal(null) },
        e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 } },
          e(Field, { label: '篩選器標題' }, e(Input, { value: modal.form.title, onChange: ev => setF('title', ev.target.value), placeholder: '例如：車架尺寸', autoFocus: true })),
          e(Field, { label: '類型' },
            e(Select, { value: modal.form.kind, onChange: ev => setF('kind', ev.target.value) },
              Object.entries(KIND_LABELS).map(([v, l]) => e('option', { key: v, value: v }, l))
            )
          )
        ),
        modal.form.kind === 'range'
          ? e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
              e(Field, { label: '最低值（€）' }, e(Input, { type: 'number', value: modal.form.min, onChange: ev => setF('min', ev.target.value) })),
              e(Field, { label: '最高值（€）' }, e(Input, { type: 'number', value: modal.form.max, onChange: ev => setF('max', ev.target.value) }))
            )
          : e(Field, { label: modal.form.kind === 'color' ? '選項 — 每行一筆：#色碼: 數量' : '選項 — 每行一筆：標籤: 數量（前綴 SALE 會以紅色強調）' },
              e('textarea', { value: modal.form.optText, onChange: ev => setF('optText', ev.target.value), rows: 10, style: { ...S.input, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }, placeholder: modal.form.kind === 'color' ? '#e63946: 12\n#2a9d8f: 8\n#264653: 5' : 'XS: 8\nS: 15\nM: 24\nL: 18\nXL: 10\nSALE 出清: 3' })
            ),
        e('div', { style: { display: 'flex', gap: 10, marginTop: 20 } },
          e('button', { onClick: saveModal, style: S.btnPrimary }, modal.mode === 'add' ? '新增篩選器' : '儲存變更'),
          e('button', { onClick: () => setModal(null), style: S.btnGhost }, '取消')
        )
      ),

      e('div', { style: S.card },
        (cat.facets || []).length === 0
          ? e('div', { style: { textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 } },
              '此分類尚無篩選器：', e('strong', null, cat.label), '。請點擊上方「+ 新增篩選器」建立前台左側篩選項目。'
            )
          : e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
              e('thead', null, e('tr', null, ['排序', '標題', '類型', '選項預覽', '操作'].map(h => e('th', { key: h, style: S.th }, h)))),
              e('tbody', null,
                (cat.facets || []).map((f, i) =>
                  e('tr', { key: i, style: { background: i % 2 ? '#f8fafc' : '#fff' } },
                    e('td', { style: S.td }, e('div', { style: { display: 'flex', gap: 4 } },
                      e('button', { onClick: () => move(i, -1), disabled: i === 0, style: S.btnSm }, '↑'),
                      e('button', { onClick: () => move(i, 1), disabled: i === (cat.facets || []).length - 1, style: S.btnSm }, '↓')
                    )),
                    e('td', { style: { ...S.td, fontWeight: 700 } }, f.title || '—'),
                    e('td', { style: S.td }, e('span', { style: { background: '#f1f5f9', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#475569' } }, KIND_LABELS[f.kind] || f.kind)),
                    e('td', { style: { ...S.td, color: '#64748b', fontSize: 13 } },
                      f.kind === 'range' ? `€${f.min} — €${f.max}` : (f.options || []).slice(0, 5).map(o => o.label || o.color).join(', ') + ((f.options || []).length > 5 ? ' …' : '')
                    ),
                    e('td', { style: S.td },
                      e('button', { onClick: () => openEdit(i), style: { ...S.btnSm, display: 'inline-flex', alignItems: 'center', gap: 5 } }, e(IconPencil, { size: 15 }), '編輯'), ' ',
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
  function PublishModal({ data, user, onClose, goToSettings }) {
    const [cfg, setCfg] = useState(loadGithubConfig);
    const [phase, setPhase] = useState('checking');
    const [phaseLabel, setPhaseLabel] = useState('');
    const [deployUrl, setDeployUrl] = useState('');
    const [deployStamp, setDeployStamp] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [elapsedSec, setElapsedSec] = useState(0);
    const [progress, setProgress] = useState({
      current: 'prepare',
      detail: '',
      percent: 0,
      done: {},
      failed: '',
      attempt: 0,
      startedAt: 0
    });

    const progressSteps = [
      { id: 'prepare', title: '準備資料', hint: '整理 CMS 資料、版本碼與發布檔案' },
      { id: 'github', title: 'GitHub 提交', hint: '寫入 store-data.js、前台與後台檔案' },
      { id: 'cloudflare', title: 'Cloudflare 部署', hint: '等待 Pages 建置並切換到最新版本' },
      { id: 'verify', title: '前台驗證', hint: '確認線上資料就是本次發布版本' }
    ];

    useEffect(() => {
      let mounted = true;
      loadCloudConfig().then(cloud => {
        if (!mounted) return;
        const next = { ...cloud.github };
        setCfg(next);
        setPhase(next.publishConfigured && next.repo ? 'idle' : 'notoken');
      });
      return () => { mounted = false; };
    }, []);

    useEffect(() => {
      if (phase !== 'busy' || !progress.startedAt) return undefined;
      const tick = () => setElapsedSec(Math.max(0, Math.floor((Date.now() - progress.startedAt) / 1000)));
      tick();
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
    }, [phase, progress.startedAt]);

    const downloadJS = () => {
      const js = generateStoreJS(data, makePublishId('download'));
      const blob = new Blob([js], { type: 'text/javascript' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'store-data.js'; a.click();
    };

    const step = (label) => setPhaseLabel(label);
    const updateProgress = (current, detail, percent, extra = {}) => {
      step(detail);
      setProgress(prev => ({
        ...prev,
        ...extra,
        current,
        detail,
        percent: Math.max(prev.percent || 0, percent),
        failed: '',
        updatedAt: Date.now()
      }));
    };
    const completeProgress = (id, percent) => {
      setProgress(prev => ({
        ...prev,
        percent: Math.max(prev.percent || 0, percent),
        done: { ...(prev.done || {}), [id]: true },
        updatedAt: Date.now()
      }));
    };
    const failProgress = (message) => {
      setProgress(prev => ({
        ...prev,
        detail: message || prev.detail,
        failed: prev.current || 'github',
        updatedAt: Date.now()
      }));
    };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const normalizeSiteUrl = (url) => (url || GITHUB_DEFAULTS.siteUrl).replace(/\/$/, '');
    const finishPublish = (url, stamp) => {
      setDeployUrl(normalizeSiteUrl(url));
      setDeployStamp(stamp || Date.now().toString(36));
      setPhase('done');
    };
    const waitForFrontendDeploy = async (url, publishId) => {
      const baseUrl = normalizeSiteUrl(url);
      const marker = `ARMOR_BIKE_PUBLISH_ID:${publishId}`;
      const deadline = Date.now() + 120000;
      let attempt = 0;
      let lastError = '';
      while (Date.now() < deadline) {
        attempt += 1;
        updateProgress('cloudflare', `正在等待 Cloudflare Pages 完成部署…（第 ${attempt} 次確認）`, Math.min(92, 72 + attempt * 2), { attempt });
        try {
          const target = `${baseUrl}/store-data.js?deploy=${encodeURIComponent(publishId)}&check=${Date.now()}`;
          const res = await fetch(target, { cache: 'no-store' });
          if (res.ok) {
            const online = await res.text();
            if (online.includes(marker) || online.includes(`"publishId": ${JSON.stringify(publishId)}`) || online.includes(`var publishId = ${JSON.stringify(publishId)}`)) {
              completeProgress('cloudflare', 94);
              updateProgress('verify', '正在確認前台資料版本…', 97, { attempt });
              completeProgress('verify', 100);
              return true;
            }
            lastError = '線上資料仍是上一版';
          } else {
            lastError = `線上資料讀取失敗 (${res.status})`;
          }
          updateProgress('cloudflare', `${lastError}，繼續等待 Cloudflare Pages…（第 ${attempt} 次確認）`, Math.min(92, 72 + attempt * 2), { attempt });
        } catch (err) {
          lastError = err.message || '線上部署狀態暫時無法讀取';
          updateProgress('cloudflare', `${lastError}，稍後重試…（第 ${attempt} 次確認）`, Math.min(92, 72 + attempt * 2), { attempt });
        }
        await sleep(attempt < 3 ? 3000 : 5000);
      }
      throw new Error(`已提交到 GitHub，但 Cloudflare Pages 尚未完成部署：${lastError}。請稍後重新發布或到 Cloudflare Pages 查看部署狀態。`);
    };
    const deployLink = (path = '/') => {
      if (!deployUrl) return '#';
      try {
        const url = new URL(path, deployUrl.replace(/\/$/, '') + '/');
        url.searchParams.set('deploy', deployStamp || Date.now().toString(36));
        return url.href;
      } catch (_) {
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        const joiner = cleanPath.includes('?') ? '&' : '?';
        return deployUrl.replace(/\/$/, '') + cleanPath + joiner + 'deploy=' + (deployStamp || Date.now().toString(36));
      }
    };

    const toBase64 = (str) => {
      const bytes = new TextEncoder().encode(str);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    };

    const publish = async () => {
      setPhase('busy');
      setErrMsg('');
      const startedAt = Date.now();
      setElapsedSec(0);
      setProgress({ current: 'prepare', detail: '正在準備發布資料…', percent: 4, done: {}, failed: '', attempt: 0, startedAt });
      const publishId = makePublishId();
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

      const collectPublishFiles = async () => {
        const files = [{
          path: 'store-data.js',
          content: generateStoreJS(data, publishId),
          message: 'Deploy: update store data',
          mergeStrategy: 'owned-products',
          data,
          contentChanges: buildContentChanges(data),
          publisher: {
            id: ownerKey(user),
            username: user?.username || '',
            name: ownerName(user),
            role: user?.role || 'editor'
          }
        }];
        const merged = allUsers();
        if (merged.length > 0) {
          files.push({ path: 'cms-users.js', content: await buildCmsUsersJS(merged), message: 'Deploy: update admin accounts' });
        }
        for (const path of ['_ds_bundle.js', 'styles.css', 'index.html', 'design-reference.html', 'design-reference-app.jsx', 'product-page-app.jsx', 'Product/index.html', 'admin.html', 'store-app.jsx', 'admin-app.jsx']) {
          try {
            const r = await fetch('./' + path + '?' + Date.now());
            if (r.ok) files.push({ path, content: await r.text(), message: 'Deploy: update ' + path });
          } catch (_) {}
        }
        return files;
      };

      try {
        if (cfg.publishConfigured) {
          updateProgress('prepare', '正在整理要發布的檔案…', 10);
          const files = await collectPublishFiles();
          completeProgress('prepare', 20);
          updateProgress('github', `正在透過雲端發布服務提交 ${files.length} 個檔案到 GitHub…`, 32);
          const res = await fetch('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files })
          });
          if (!res.ok) {
            const t = await res.text();
            throw new Error(t || ('雲端發布失敗 (' + res.status + ')'));
          }
          completeProgress('github', 68);
          const result = await res.json().catch(() => ({}));
          const responseUrl = result.siteUrl || siteUrl || GITHUB_DEFAULTS.siteUrl;
          const normalizedUrl = responseUrl.startsWith('http') ? responseUrl : `https://${responseUrl}`;
          setDeployUrl(normalizeSiteUrl(normalizedUrl));
          setDeployStamp(publishId);
          updateProgress('cloudflare', 'GitHub 已提交，正在等待 Cloudflare Pages 建置…', 72);
          await waitForFrontendDeploy(normalizedUrl, publishId);
          finishPublish(normalizedUrl, publishId);
          return;
        }

        // 1. Verify token & repo
        updateProgress('prepare', '正在驗證 GitHub Token 與 Repository…', 12);
        const testRes = await fetch(`https://api.github.com/repos/${repo}`, { headers: h });
        if (testRes.status === 401) throw new Error('GitHub Token 無效，請至「設定」重新確認。');
        if (testRes.status === 404) throw new Error(`找不到 Repository：${repo}，請確認名稱格式為 owner/repo。`);
        if (!testRes.ok) throw new Error(`無法連接 GitHub (${testRes.status})`);
        completeProgress('prepare', 20);

        // 2. Commit store-data.js — use generated only if admin has real CMS data
        updateProgress('github', '正在提交 store-data.js 到 GitHub…', 28);
        if (data.categories && data.categories.length > 0) {
          await commitFile('store-data.js', generateStoreJS(data, publishId), 'Deploy: update store data');
        } else {
          try {
            const r = await fetch('./store-data.js?' + Date.now());
            if (r.ok) { await commitFile('store-data.js', await r.text(), 'Deploy: update store data'); }
          } catch (_) {}
        }

        // 2b. Commit cms-users.js — shared admin accounts (passwords hashed) so any browser can sign in
        try {
          updateProgress('github', '正在提交 cms-users.js 到 GitHub…', 36);
          const merged = allUsers();
          if (merged.length > 0) { await commitFile('cms-users.js', await buildCmsUsersJS(merged), 'Deploy: update admin accounts'); }
        } catch (_) {}

        // 3. Commit _ds_bundle.js (design system)
        try {
          updateProgress('github', '正在提交 _ds_bundle.js 到 GitHub…', 42);
          const r = await fetch('./_ds_bundle.js?' + Date.now());
          if (r.ok) { await commitFile('_ds_bundle.js', await r.text(), 'Deploy: update design system bundle'); }
        } catch (_) {}

        // 4. Commit styles.css
        try {
          updateProgress('github', '正在提交 styles.css 到 GitHub…', 48);
          const r = await fetch('./styles.css?' + Date.now());
          if (r.ok) { await commitFile('styles.css', await r.text(), 'Deploy: update styles'); }
        } catch (_) {}

        // 5. Commit index.html (storefront entry)
        try {
          updateProgress('github', '正在提交 index.html 到 GitHub…', 54);
          const r = await fetch('./index.html?' + Date.now());
          if (r.ok) { await commitFile('index.html', await r.text(), 'Deploy: update storefront index'); }
        } catch (_) {}

        // 6. Commit admin.html (admin entry)
        try {
          updateProgress('github', '正在提交 admin.html 到 GitHub…', 58);
          const r = await fetch('./admin.html?' + Date.now());
          if (r.ok) { await commitFile('admin.html', await r.text(), 'Deploy: update admin entry'); }
        } catch (_) {}

        // 7. Commit store-app.jsx
        try {
          updateProgress('github', '正在提交 store-app.jsx 到 GitHub…', 62);
          const r = await fetch('./store-app.jsx?' + Date.now());
          if (r.ok) { await commitFile('store-app.jsx', await r.text(), 'Deploy: update store app'); }
        } catch (_) {}

        // 8. Commit admin-app.jsx
        try {
          updateProgress('github', '正在提交 admin-app.jsx 到 GitHub…', 66);
          const r = await fetch('./admin-app.jsx?' + Date.now());
          if (r.ok) { await commitFile('admin-app.jsx', await r.text(), 'Deploy: update admin app'); }
        } catch (_) {}
        completeProgress('github', 68);

        const normalizedUrl = siteUrl ? (siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`) : `https://github.com/${repo}`;
        setDeployUrl(normalizeSiteUrl(normalizedUrl));
        setDeployStamp(publishId);
        updateProgress('cloudflare', 'GitHub 已提交，正在等待 Cloudflare Pages 建置…', 72);
        await waitForFrontendDeploy(normalizedUrl, publishId);
        finishPublish(normalizedUrl, publishId);
      } catch (err) {
        failProgress(err.message);
        setErrMsg(err.message);
        setPhase('error');
      }
    };

    const spinStyle = { width: 20, height: 20, border: '3px solid #e2e8f0', borderTop: `3px solid ${BRAND}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 };
    const formatElapsed = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return m ? `${m}分 ${String(s).padStart(2, '0')}秒` : `${s}秒`;
    };
    const progressStatus = (id) => {
      if (progress.failed === id) return 'error';
      if (progress.done && progress.done[id]) return 'done';
      if (progress.current === id) return 'active';
      return 'pending';
    };
    const progressStatusText = (status) => status === 'done' ? '完成' : status === 'active' ? '進行中' : status === 'error' ? '卡住' : '等待';
    const renderPublishProgress = () => e('div', { style: { marginTop: 2 } },
      e('div', { style: { marginBottom: 13 } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7, fontSize: 12, color: '#64748b', fontWeight: 800 } },
          e('span', null, phase === 'error' ? '發布中斷' : phase === 'done' ? '發布完成' : '發布進度'),
          e('span', null, `${Math.round(progress.percent || 0)}% · ${formatElapsed(elapsedSec)}`)
        ),
        e('div', { style: { height: 9, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(15,23,42,.08)' } },
          e('div', { style: { width: '100%', height: '100%', borderRadius: 999, background: progress.failed ? '#dc2626' : `linear-gradient(90deg, ${BRAND}, #38bdf8)`, transformOrigin: 'left center', transform: `scaleX(${Math.min(100, Math.max(0, progress.percent || 0)) / 100})`, transition: 'transform 220ms cubic-bezier(.2,.9,.2,1)' } })
        )
      ),
      e('div', { style: { display: 'grid', gap: 8 } },
        progressSteps.map(item => {
          const status = progressStatus(item.id);
          const isActive = status === 'active';
          const isDone = status === 'done';
          const isError = status === 'error';
          return e('div', { key: item.id, style: { display: 'grid', gridTemplateColumns: '30px minmax(0,1fr) auto', gap: 10, alignItems: 'center', padding: '10px 11px', borderRadius: 10, border: `1px solid ${isError ? '#fecaca' : isActive ? '#bae6fd' : isDone ? '#bbf7d0' : '#e2e8f0'}`, background: isError ? '#fef2f2' : isActive ? '#f0f9ff' : isDone ? '#f0fdf4' : '#f8fafc' } },
            e('span', { style: { width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', background: isError ? '#dc2626' : isDone ? '#16a34a' : isActive ? BRAND : '#cbd5e1', color: '#fff', fontSize: 13, fontWeight: 900 } }, isError ? '!' : isDone ? '✓' : isActive ? '…' : '•'),
            e('span', { style: { minWidth: 0 } },
              e('strong', { style: { display: 'block', fontSize: 13, color: '#0f172a' } }, item.title),
              e('span', { style: { display: 'block', marginTop: 2, fontSize: 12, color: isActive || isError ? '#334155' : '#64748b', lineHeight: 1.4 } }, isActive || isError ? (progress.detail || item.hint) : item.hint)
            ),
            e('span', { style: { fontSize: 11, fontWeight: 900, color: isError ? '#dc2626' : isDone ? '#15803d' : isActive ? '#0369a1' : '#94a3b8' } }, progressStatusText(status))
          );
        })
      )
    );

    if (phase === 'checking') return e(Modal, { title: '📦 發布至 Cloudflare Pages', onClose, width: 500 },
      e('div', { style: { padding: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 12 } },
        e('div', { style: spinStyle }),
        e('span', { style: { fontSize: 14, fontWeight: 600, color: '#374151' } }, '正在讀取雲端設定…')
      )
    );

    if (phase === 'notoken') return e(Modal, { title: '📦 發布至 Cloudflare Pages', onClose, width: 500 },
      e('div', { style: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '16px 18px', marginBottom: 20 } },
        e('p', { style: { margin: 0, fontWeight: 700, color: '#92400e', fontSize: 14 } }, '⚠ Cloudflare 尚未啟用發布密鑰'),
        e('p', { style: { margin: '8px 0 0', fontSize: 13, color: '#78350f' } }, '請在 Cloudflare Pages 環境變數設定 GITHUB_TOKEN（或 GH_TOKEN / GITHUB_PAT）。設定完成後，所有帳號都會自動使用雲端設定。')
      ),
      e('div', { style: { display: 'flex', gap: 10 } },
        e('button', { onClick: goToSettings, style: S.btnPrimary }, '查看設定'),
        e('button', { onClick: downloadJS, style: S.btnGhost }, '⬇ 手動下載 JS'),
        e('button', { onClick: onClose, style: S.btnGhost }, '取消')
      )
    );

    return e(Modal, { title: '📦 發布至 Cloudflare Pages', onClose: phase === 'busy' ? undefined : onClose, width: 560 },
      phase === 'idle' && e('div', null,
        e('p', { style: { margin: '0 0 16px', fontSize: 14, color: '#374151' } }, '確認要將目前的 CMS 資料發布到線上網站嗎？'),
        e('div', { style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#0369a1', marginBottom: 20 } },
          '會將 store-data.js、store-app.jsx、admin-app.jsx 提交到 GitHub，並等待 Cloudflare Pages 確認線上資料已更新後，才顯示前台網站按鈕。'
        ),
        e('div', { style: { display: 'flex', gap: 10 } },
          e('button', { onClick: publish, style: S.btnPrimary }, '🚀 確認發布'),
          e('button', { onClick: onClose, style: S.btnGhost }, '取消')
        )
      ),
      phase === 'busy' && e('div', { style: { padding: '8px 0 2px' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 } },
          e('div', { style: spinStyle }),
          e('span', { style: { fontSize: 14, fontWeight: 700, color: '#374151', lineHeight: 1.45 } }, phaseLabel || '正在發布…')
        ),
        renderPublishProgress()
      ),
      phase === 'done' && e('div', null,
        e('div', { style: { textAlign: 'center', padding: '16px 0 8px' } },
          e('div', { style: { fontSize: 48, marginBottom: 10 } }, '🎉'),
          e('p', { style: { fontSize: 18, fontWeight: 800, color: '#166534', margin: '0 0 4px' } }, '已發布到線上網站！'),
          e('p', { style: { fontSize: 13, color: '#64748b', margin: 0 } }, 'Cloudflare Pages 已確認讀到最新資料。按下前台網站會直接開啟本次發布版本。')
        ),
        renderPublishProgress(),
        e('div', { style: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' } },
          e('a', { href: deployLink('/'), target: '_blank', style: { ...S.btnPrimary, textDecoration: 'none' } }, '🌐 前台網站'),
          e('a', { href: deployLink('/admin.html'), target: '_blank', style: { ...S.btnGhost, textDecoration: 'none' } }, '⚙ 後台管理'),
          e('button', { onClick: onClose, style: S.btnGhost }, '關閉')
        )
      ),
      phase === 'error' && e('div', null,
        e('div', { style: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px 18px', marginBottom: 20 } },
          e('p', { style: { margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 14 } }, '✕ 發布失敗'),
          e('p', { style: { margin: '8px 0 0', fontSize: 12, color: '#7f1d1d', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, errMsg)
        ),
        renderPublishProgress(),
        e('div', { style: { display: 'flex', gap: 10, marginTop: 18 } },
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

    useEffect(() => { loadCloudConfig(); clearLegacyCMS(); }, []);

    const setData = (d) => { setDataRaw(d); setSaved('可發布 ✓'); setTimeout(() => setSaved(''), 2000); };
    const onLogout = () => { saveAuth(null); setUser(null); setShowProfile(false); };
    const onUpdateUser = (u) => setUser(u);

    if (!user) return e(Login, { onLogin: setUser });

    const sections = {
      dashboard: e(Dashboard, { data }),
      hero: e(HeroManager, { data, setData }),
      categories: e(CategoriesManager, { data, setData, user }),
      megamenu: e(MegaMenuManager, { data, setData }),
      filters: e(FiltersManager, { data, setData }),
      products: e(ProductsManager, { data, setData, user }),
      badges: e(BadgesManager, { data, setData }),
      images: e(ImageLibrary, { data, setData }),
      users: user.role === 'admin' ? e(UsersManager) : e('div', null, e('p', null, '沒有權限')),
      settings: e(SettingsManager, { data }),
    };

    return e('div', { style: { display: 'flex', height: '100vh', minHeight: '100vh', overflow: 'hidden', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' } },
      e(Sidebar, { section, setSection, user, onLogout }),
      e('div', { style: { flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        // topbar
        e('div', { style: { background: '#2b40b5', borderBottom: '1px solid rgba(255,255,255,.18)', padding: '0 20px 0 28px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 120 } },
          e('span', { style: { fontSize: 13, color: 'rgba(255,255,255,.82)', fontWeight: 700 } }, 'ARMOR BIKE  ·  後台管理系統'),
          e('div', { style: { display: 'flex', gap: 10, alignItems: 'center' } },
            saved ? e('span', { style: { fontSize: 12, color: '#16a34a', fontWeight: 700 } }, saved) : null,
            e('button', { onClick: () => setShowPublish(true), style: { ...S.btnGhost, fontSize: 12, padding: '6px 14px', background: '#fff', color: '#2b40b5', border: '1px solid rgba(255,255,255,.72)' } }, '📦 發布'),
            e('a', { href: 'index.html', target: '_blank', style: { ...S.btnPrimary, fontSize: 12, padding: '6px 14px', textDecoration: 'none', background: '#fff', color: '#2b40b5', border: '1px solid rgba(255,255,255,.72)' } }, '👁 預覽前台'),
            // ── user avatar button ──
            e('button', {
              onClick: () => setShowProfile(v => !v),
              title: user.name || user.username,
              style: { display: 'flex', alignItems: 'center', gap: 8, background: showProfile ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 30, padding: '4px 10px 4px 4px', cursor: 'pointer', transition: 'background-color .12s, border-color .12s, color .12s, transform .12s, opacity .12s' }
            },
              e(UserAvatar, { user, size: 30, fontSize: 12 }),
              e('span', { style: { fontSize: 13, fontWeight: 700, color: '#ffffff', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, user.name || user.username),
              e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'rgba(255,255,255,.76)', strokeWidth: 2.5, strokeLinecap: 'round', style: { transition: 'transform .15s', transform: showProfile ? 'rotate(180deg)' : 'none', flexShrink: 0 } },
                e('polyline', { points: '6 9 12 15 18 9' })
              )
            )
          )
        ),
        // content
        e('div', { style: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 32px' } }, sections[section] || sections.dashboard)
      ),
      showPublish && e(PublishModal, { data, user, onClose: () => setShowPublish(false), goToSettings: () => { setShowPublish(false); setSection('settings'); } }),
      showProfile && e(UserProfilePanel, { user, onLogout, onClose: () => setShowProfile(false), onUpdateUser })
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
