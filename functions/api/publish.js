const DEFAULTS = {
  repo: 'armortw/armor-bike-website',
  branch: 'main',
  siteUrl: 'https://armor-bike-website.pages.dev/'
};

function text(data, status = 200) {
  return new Response(data, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function fromBase64(str) {
  const binary = atob(String(str || '').replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function findJsonVar(source, name) {
  const marker = `var ${name} =`;
  const idx = source.indexOf(marker);
  if (idx < 0) return null;
  let i = idx + marker.length;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  if (source[i] !== '[' && source[i] !== '{') return null;
  const start = i;
  const stack = [];
  let inString = false;
  let escaped = false;
  for (; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '[') stack.push(']');
    else if (ch === '{') stack.push('}');
    else if (stack.length && ch === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return { start, end: i + 1 };
    }
  }
  return null;
}

function parseJsonVar(source, name, fallback) {
  const bounds = findJsonVar(source, name);
  if (!bounds) return fallback;
  try {
    return JSON.parse(source.slice(bounds.start, bounds.end));
  } catch (_) {
    return fallback;
  }
}

function replaceJsonVar(source, name, value) {
  const bounds = findJsonVar(source, name);
  if (!bounds) return source;
  return source.slice(0, bounds.start) + JSON.stringify(value, null, 2) + source.slice(bounds.end);
}

function parseStoreData(source) {
  const js = String(source || '');
  return {
    categories: parseJsonVar(js, 'categories', []),
    images: parseJsonVar(js, 'images', []),
    hero: parseJsonVar(js, 'hero', [])
  };
}

function productFingerprint(product) {
  const p = product || {};
  const images = Array.isArray(p.images) ? p.images.map(img => typeof img === 'string' ? img : (img && img.url) || '').join('|') : '';
  return [p.manufacturer || '', p.name || '', p.spec || '', images, p.image || ''].join('::').toLowerCase();
}

function productMergeKey(product) {
  const p = product || {};
  return String(p.productId || p.sourceKey || productFingerprint(p));
}

function productBelongsToPublisher(product, publisher) {
  const p = product || {};
  const pub = publisher || {};
  if (pub.role === 'admin') return true;
  const pubId = String(pub.id || '');
  const pubUsername = String(pub.username || '');
  return (pubId && String(p.ownerId || '') === pubId) ||
    (pubUsername && String(p.ownerUsername || '') === pubUsername);
}

function incomingIsNotOlder(incoming, current) {
  if (!current) return true;
  const incomingTime = Date.parse(incoming.updatedAt || incoming.createdAt || '') || 0;
  const currentTime = Date.parse(current.updatedAt || current.createdAt || '') || 0;
  if (!incomingTime && currentTime) return false;
  return !incomingTime || !currentTime || incomingTime >= currentTime;
}

function deletionAllowed(deletion, currentProduct, publisher) {
  const pub = publisher || {};
  if (pub.role === 'admin') return true;
  const pubId = String(pub.id || '');
  const pubUsername = String(pub.username || '');
  return (pubUsername && deletion.deletedBy === pubUsername) &&
    (
      (pubId && String((currentProduct || {}).ownerId || deletion.ownerId || '') === pubId) ||
      (pubUsername && String((currentProduct || {}).ownerUsername || deletion.ownerUsername || '') === pubUsername)
    );
}

function mergeProducts(currentProducts, incomingProducts, publisher, deletions, categoryId) {
  const merged = new Map();
  for (const product of Array.isArray(currentProducts) ? currentProducts : []) {
    merged.set(productMergeKey(product), product);
  }

  for (const deletion of Array.isArray(deletions) ? deletions : []) {
    if (deletion.categoryId && deletion.categoryId !== categoryId) continue;
    const deleteKeys = [deletion.productId, deletion.sourceKey].filter(Boolean).map(String);
    for (const key of deleteKeys) {
      const current = merged.get(key);
      if (current && deletionAllowed(deletion, current, publisher)) merged.delete(key);
    }
  }

  for (const product of Array.isArray(incomingProducts) ? incomingProducts : []) {
    if (!productBelongsToPublisher(product, publisher)) continue;
    const key = productMergeKey(product);
    const current = merged.get(key);
    if (incomingIsNotOlder(product, current)) merged.set(key, product);
  }

  return Array.from(merged.values());
}

function mergeImages(currentImages, incomingImages) {
  const merged = new Map();
  const keyFor = (img) => String((img && (img.id || img.url)) || '');
  for (const img of Array.isArray(currentImages) ? currentImages : []) {
    const key = keyFor(img);
    if (key) merged.set(key, img);
  }
  for (const img of Array.isArray(incomingImages) ? incomingImages : []) {
    const key = keyFor(img);
    if (key) merged.set(key, img);
  }
  return Array.from(merged.values());
}

function mergeCategories(currentCategories, incomingCategories, publisher, deletions) {
  const currentById = new Map((Array.isArray(currentCategories) ? currentCategories : []).map(cat => [cat.id, cat]));
  const incomingById = new Map((Array.isArray(incomingCategories) ? incomingCategories : []).map(cat => [cat.id, cat]));
  const orderedIds = [
    ...(Array.isArray(incomingCategories) ? incomingCategories.map(cat => cat.id) : []),
    ...(Array.isArray(currentCategories) ? currentCategories.map(cat => cat.id).filter(id => !incomingById.has(id)) : [])
  ];

  return orderedIds.map((id) => {
    const current = currentById.get(id) || {};
    const incoming = incomingById.get(id) || {};
    return {
      ...current,
      ...incoming,
      products: mergeProducts(current.products, incoming.products, publisher, deletions, id)
    };
  });
}

function mergeStoreDataContent(currentContent, incomingContent, incomingData, publisher) {
  const current = parseStoreData(currentContent || incomingContent);
  const incoming = incomingData && Array.isArray(incomingData.categories)
    ? incomingData
    : parseStoreData(incomingContent);
  const deletions = Array.isArray(incoming.productDeletions) ? incoming.productDeletions : [];
  const categories = mergeCategories(current.categories, incoming.categories, publisher, deletions);
  const images = mergeImages(current.images, incoming.images);
  const hero = Array.isArray(incoming.hero) ? incoming.hero : current.hero;
  let next = incomingContent || currentContent || '';
  next = replaceJsonVar(next, 'categories', categories);
  next = replaceJsonVar(next, 'images', images);
  next = replaceJsonVar(next, 'hero', hero);
  return next;
}

export async function onRequestPost({ request, env }) {
  const token = env.GITHUB_TOKEN || env.GH_TOKEN || env.GITHUB_PAT;
  if (!token) return text('Missing Cloudflare env var: GITHUB_TOKEN', 500);

  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return text('Invalid JSON payload', 400);
  }

  const files = Array.isArray(payload.files) ? payload.files : [];
  if (!files.length) return text('No files to publish', 400);

  const repo = env.GITHUB_REPO || DEFAULTS.repo;
  const branch = env.GITHUB_BRANCH || DEFAULTS.branch;
  const base = `https://api.github.com/repos/${repo}/contents`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'armor-bike-cloud-publisher'
  };

  async function getFile(path) {
    const res = await fetch(`${base}/${path}?ref=${branch}`, { headers });
    if (res.status === 404) return { sha: null, content: '' };
    if (!res.ok) throw new Error(`Unable to read ${path} from GitHub (${res.status})`);
    const data = await res.json();
    return {
      sha: data.sha || null,
      content: data.content ? fromBase64(data.content) : ''
    };
  }

  async function commitFile(file) {
    if (!file || !file.path || typeof file.content !== 'string') {
      throw new Error('Invalid publish file payload');
    }
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const current = await getFile(file.path);
      const content = file.path === 'store-data.js' && file.mergeStrategy === 'owned-products'
        ? mergeStoreDataContent(current.content, file.content, file.data, file.publisher)
        : file.content;
      if (/^functions\/api\/.+\.js$/.test(file.path) && /^\s*<!doctype html/i.test(content)) {
        throw new Error(`Refusing to publish HTML into Cloudflare Function file: ${file.path}`);
      }
      const body = {
        message: file.message || `Deploy: update ${file.path}`,
        content: toBase64(content),
        branch
      };
      if (current.sha) body.sha = current.sha;
      const res = await fetch(`${base}/${file.path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });
      if (res.ok) return;
      const detail = await res.text();
      if (res.status === 409 && attempt < 2) continue;
      throw new Error(`Unable to publish ${file.path} (${res.status}): ${detail}`);
    }
  }

  try {
    for (const file of files) await commitFile(file);
    return json({
      ok: true,
      repo,
      branch,
      siteUrl: env.CLOUDFLARE_PAGES_URL || env.PUBLIC_SITE_URL || env.SITE_URL || DEFAULTS.siteUrl,
      files: files.map(f => f.path)
    });
  } catch (err) {
    return text(err.message || 'Publish failed', 500);
  }
}
