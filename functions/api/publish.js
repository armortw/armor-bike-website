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

  async function getSha(path) {
    const res = await fetch(`${base}/${path}?ref=${branch}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Unable to read ${path} from GitHub (${res.status})`);
    const data = await res.json();
    return data.sha;
  }

  async function commitFile(file) {
    if (!file || !file.path || typeof file.content !== 'string') {
      throw new Error('Invalid publish file payload');
    }
    const sha = await getSha(file.path);
    const body = {
      message: file.message || `Deploy: update ${file.path}`,
      content: toBase64(file.content),
      branch
    };
    if (sha) body.sha = sha;
    const res = await fetch(`${base}/${file.path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const detail = await res.text();
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
