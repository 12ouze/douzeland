// Sitemap fait main : une route Astro qui lit la collection et renvoie du
// XML — pas de dépendance externe (règle du projet), régénéré à chaque
// build. Couvre les 3 pages fixes + une URL par photo. La 404 est exclue
// (c'est une page d'erreur, pas une page à indexer).
// `site` vient de astro.config.mjs (https://douzeland.com) ; les URLs
// portent le slash final, la forme servie par Cloudflare Pages.
import { getCollection } from 'astro:content';

export async function GET({ site }) {
  const photos = await getCollection('photos');
  const jourIso = (d) => d.toISOString().slice(0, 10);

  // lastmod de la home et des archives : la date de la photo la plus
  // récente — ces deux pages changent quand une photo est publiée.
  const dernierePublication = photos.length
    ? jourIso(new Date(Math.max(...photos.map((p) => p.data.date.getTime()))))
    : null;

  const urls = [
    { chemin: '/', lastmod: dernierePublication },
    { chemin: '/archives/', lastmod: dernierePublication },
    { chemin: '/contact/', lastmod: null },
    ...photos.map((p) => ({
      chemin: `/photo/${p.id}/`,
      lastmod: jourIso(p.data.date),
    })),
  ];

  const entrees = urls
    .map(({ chemin, lastmod }) => {
      const loc = new URL(chemin, site).href;
      return lastmod
        ? `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
        : `  <url><loc>${loc}</loc></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
