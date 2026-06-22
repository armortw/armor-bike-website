const DEFAULTS = {
  cloudinary: {
    cloudName: 'dvzdptb3i',
    uploadPreset: 'armor_unsigned'
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
  const github = {
    repo: env.GITHUB_REPO || DEFAULTS.github.repo,
    branch: env.GITHUB_BRANCH || DEFAULTS.github.branch,
    siteUrl: env.CF_PAGES_URL || env.CLOUDFLARE_PAGES_URL || DEFAULTS.github.siteUrl,
    publishConfigured: Boolean(env.GITHUB_TOKEN)
  };

  const cloudinary = {
    cloudName: env.CLOUDINARY_CLOUD_NAME || DEFAULTS.cloudinary.cloudName,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET || DEFAULTS.cloudinary.uploadPreset
  };

  return json({ github, cloudinary });
}
