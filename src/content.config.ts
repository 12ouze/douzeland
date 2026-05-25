import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Collection "photos" : métadonnées dans des .md (src/content/photos/),
// images locales dans src/assets/photos/ — optimisées par Astro au build.
// Référence : CLAUDE.md → "Décisions techniques" → "Stockage des photos".
const photos = defineCollection({
  // Charge tous les .md du dossier des métadonnées.
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  // Le helper image() valide le chemin et fait passer l'image par
  // le pipeline d'optimisation d'Astro.
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      date: z.date(),
      featured: z.boolean(),
      in_slider: z.boolean().optional().default(false),
      order: z.number(),
      image: image(),
      alt: z.string(),
    }),
});

export const collections = { photos };
