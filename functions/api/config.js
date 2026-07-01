const DEFAULTS = {
  cloudinary: {
    cloudName: 'dvzdptb3i',
    uploadPreset: 'armor_unsigned',
    backgroundRemoval: true
  },
  github: {
    repo: 'armortw/armor-bike-website',
    branch: 'main',
    siteUrl: 'https://armor-bike-website.pages.dev/'
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestGet({ env }) {
  const token = env.GITHUB_TOKEN || env.GH_TOKEN || env.GITHUB_PAT;
  const github = {
    repo: env.GITHUB_REPO || DEFAULTS.github.repo,
    branch: env.GITHUB_BRANCH || DEFAULTS.github.branch,
    siteUrl: env.CLOUDFLARE_PAGES_URL || env.PUBLIC_SITE_URL || env.SITE_URL || DEFAULTS.github.siteUrl,
    publishConfigured: Boolean(token)
  };

  const cloudinary = {
    cloudName: env.CLOUDINARY_CLOUD_NAME || DEFAULTS.cloudinary.cloudName,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET || DEFAULTS.cloudinary.uploadPreset,
    backgroundRemoval: env.CLOUDINARY_BACKGROUND_REMOVAL === 'false' ? false : DEFAULTS.cloudinary.backgroundRemoval
  };

  return json({ github, cloudinary });
}
