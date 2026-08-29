// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// `site` = domaine public : indispensable pour générer les URLs ABSOLUES
// (canonical, Open Graph, sitemap). Ce n'est PAS un adaptateur — la sortie
// reste 100 % statique, l'OAuth Decap n'est pas concerné. La règle « aucun
// adaptateur » de CLAUDE.md tient toujours.
export default defineConfig({
  site: 'https://douzeland.com',
});
