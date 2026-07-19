// Cloudflare Pages Function
// File path (important): functions/sitemap.xml.js
// This generates a live sitemap.xml that always includes every current
// listing's URL, so Google can discover all /pg/{id} pages automatically.

export async function onRequestGet(context) {
  const projectId = 'pg-finder-abe93';
  const listUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/listings?pageSize=300`;

  let ids = [];
  try {
    const res = await fetch(listUrl);
    const data = await res.json();
    ids = (data.documents || []).map((d) => d.name.split('/').pop());
  } catch (e) {
    // if Firestore fetch fails, still return sitemap with static pages
  }

  const staticPages = ['', 'about.html', 'privacy.html', 'terms.html', 'contact.html'];
  const staticUrls = staticPages
    .map((p) => `  <url><loc>https://pgfinderlko.online/${p}</loc></url>`)
    .join('\n');
  const listingUrls = ids
    .map((id) => `  <url><loc>https://pgfinderlko.online/pg/${id}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${listingUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml;charset=UTF-8' }
  });
}

