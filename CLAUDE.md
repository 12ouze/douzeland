# douzeland — Carnet photo

> "memoire vive"

## Qu'est-ce que c'est ?

Site personnel de photographie de Zedou (12ouze). Un carnet de bord
visuel où je publie mes meilleures photosde ma vie, dans un style proche d'un
magazine print / galerie d'art. Le site est public — il sert à la
fois d'archive personnelle ET de portfolio implicite pour des
prospects qui voudraient m'embaucher pour shooter.

Pas un réseau social, pas de likes, pas de commentaires.
La photo parle, le site sert juste à la mettre en valeur.

## Stack technique

- **Astro v6** (statique, `output: 'static'` par défaut)
- **Node 22+** requis
- **Aucun framework UI** (pas de React, Vue, Svelte) — Astro pur
- **CSS vanille** (pas de Tailwind, pas de Sass) — on apprend les
  bases, on garde le contrôle
- **Hébergement Cloudflare Pages** branché en CI/CD sur GitHub
- **Repo** : github.com/12ouze/douzeland

## Direction artistique

**Référence mentale** : tumblr douzeland (le mien)

### Principes
- Style **éditorial / magazine print**
- Le site doit s'effacer devant les photos
- Aération généreuse, lecture lente
- Pas d'ornement décoratif, pas de gradient à la mode
- **Pas de dark mode** — la photo est faite pour fond clair


### Palette
- Fond : blanc cassé / crème très léger (pas blanc pur)
- Texte principal : noir profond (pas gris)
- Accent : à définir, probablement aucun — la photo apporte la couleur

### Typographie
- Titre `DOUZE LAND` : sans-serif gras, capitales, letter-spacing ample
- Référence : Inter, Helvetica Neue, ou similaire
- Corps de texte : même famille ou sœur, taille modérée, line-height
  confortable

### Photos
- Pas d'ombre, pas de bordure, pas de coin arrondi
- Espacement entre photos : généreux (~80-100px vertical)
- Le layout doit s'adapter à l'orientation de chaque photo
  (verticale, horizontale, carrée — chacune mérite son traitement)

## Structure cible du site
Header :  douzeland          accueil   archives   à propos
Hero   :  slider plein écran (photos featured uniquement)
⌄ flèche scroll discrète
Body   :  photos en liste verticale, ordre chrono inversé (récent en haut)
Footer :  discret — mention copyright + lien contact

### Pages prévues

**MVP (à coder en premier)** :
- `/` — Hero + liste chronologique des photos
- `/a-propos` — Bio + contact (essentiel pour les prospects)
- `/photo/[slug]` — Page individuelle de chaque photo
  (route dynamique : un fichier Astro génère N pages selon les photos)

**Plus tard, quand on aura assez de photos (~30+)** :
- `/archives` — Toutes les photos, vue grille dense

## Workflow de publication des photos

On passe par les **Content Collections d'Astro** : chaque photo =
une image **+** son fichier `.md` (le `.md` est **obligatoire**,
pas d'image orpheline). Voir la section « Décisions techniques →
Stockage des photos » pour le détail et la justification.

Étapes pour ajouter une photo :

1. **Exporter l'image** depuis Lightroom dans `src/assets/photos/`,
   ex. `2026-05-le-pont.jpg`.
2. **Créer le `.md`** dans `src/content/photos/` (même nom de base
   → le slug vient du nom du fichier), avec le front-matter complet :

   ```yaml
   ---
   title: "Le pont au petit matin"                    # OPT
   date: 2026-05-24                                    # OBLIGATOIRE
   featured: true                                      # OBLIGATOIRE → hero slider
   image: "../../assets/photos/2026-05-le-pont.jpg"    # OBLIGATOIRE (chemin relatif au .md)
   alt: "Pont de pierre dans la brume"                # OBLIGATOIRE
   ---

   Texte libre optionnel pour accompagner la photo.
   ```

3. **`npm run build`** en local pour valider le front-matter (le
   schéma de `src/content.config.ts` lève une erreur claire si un
   champ obligatoire manque ou si le chemin `image` est faux).
4. **commit + push** → Netlify déploie tout seul, en optimisant
   les images au passage (WebP, lazy load, multiples tailles).

## Conventions de code

- **Langue** : tout en français (variables, commentaires, contenu)
  sauf mots techniques inévitables (`const`, `import`, etc.)
- **Indentation** : 2 espaces
- **Composants Astro** : un fichier = un composant, nommage PascalCase
  (`Header.astro`, `PhotoCard.astro`)
- **Styles** : préférer les styles scopés dans chaque composant Astro
  (`<style>` à la fin du fichier), CSS global uniquement pour les
  variables et le reset
- **Pas de dépendances inutiles** : avant d'installer une lib, on
  vérifie qu'on peut faire sans

## Structure de dossiers

douzeland/
├── public/              # Assets statiques (favicon, robots.txt)
├── functions/
│   └── api/             # Cloudflare Pages Functions (auth.js, callback.js — OAuth Decap)
├── src/
│   ├── components/      # Composants réutilisables (.astro)
│   ├── layouts/         # Layouts de page (Layout.astro)
│   ├── pages/           # Routes du site
│   ├── photos/          # Photos + .md de métadonnées
│   └── styles/          # CSS global, variables, reset
├── astro.config.mjs
├── package.json
└── CLAUDE.md            # Ce fichier

## Choses à ne PAS faire

- ❌ Installer un framework UI (React/Vue/Svelte) — on reste sur Astro pur
- ❌ Installer Tailwind — CSS vanille pour apprendre
- ❌ Ajouter du JavaScript côté client sauf si vraiment nécessaire
  (Astro favorise le HTML statique, c'est voulu)
- ❌ Installer un adapter Astro (`@astrojs/cloudflare`, `@astrojs/netlify`,
  etc.) — ça casserait l'OAuth Decap. `astro.config.mjs` reste vide
  volontairement.
- ❌ Commit dans `dist/` ou `node_modules/` (le `.gitignore` est là
  pour ça, ne pas le contourner)
- ❌ Ajouter des boutons sociaux, likes, partages — pas un réseau social

## Décisions techniques

Décisions prises et figées (à respecter par toute personne ou IA
intervenant sur le projet).

### Stockage des photos

On utilise les **Content Collections d'Astro v6** :

- Métadonnées : `src/content/photos/<slug>.md`
- Images : `src/assets/photos/<slug>.jpg`
- Le `.md` pointe vers son image via le champ `image` du frontmatter
- Chaque photo DOIT avoir son `.md` (pas d'image orpheline)

Bénéfice : Astro optimise automatiquement les images (WebP, lazy load,
multiples tailles) au build. Aucune lib externe nécessaire.

### Frontmatter du .md

Structure obligatoire (champs marqués OPT sont optionnels) :

```yaml
---
title: "Légende courte"                          # OPT
date: 2026-05-24                                  # OBLIGATOIRE
featured: false                                   # OBLIGATOIRE (true/false)
image: "../../assets/photos/2026-05-slug.jpg"     # OBLIGATOIRE
alt: "Description pour accessibilité et SEO"      # OBLIGATOIRE
---

Texte libre optionnel pour accompagner la photo.
```

### Tri et affichage

- Tri par défaut : `date` décroissante (récent en haut)
- Le hero affiche les photos `featured: true`
- Fallback : si 0 photo featured, le hero affiche la photo la plus récente
  (jamais de hero vide)

### Slider du hero

- Slider **manuel** uniquement (flèches gauche/droite + swipe mobile)
- Pas d'auto-play (trop marketing-ish pour le style éditorial)
- **JS vanilla pur** (~30 lignes) — pas de lib externe type Swiper.js
- Si une seule photo featured (ou fallback) → pas de flèches, juste l'image

### Affichage des photos (pages individuelles)

- `object-fit: contain` systématiquement — jamais `cover`, jamais de crop.
- La photo est toujours entièrement visible, ratio préservé.
- Des bandes crème (la couleur de fond) entourent l'image quand son ratio
  ≠ celui de l'écran : haut/bas pour un paysage, gauche/droite pour un
  portrait. Bandes **assumées**, pas un défaut.
- Conséquence acceptée : un portrait sur écran large affiche de grosses
  bandes latérales (photo réduite). C'est le compromis « tout visible,
  sans scroll ».
- Évolution future possible : layout adaptatif selon l'orientation (cf.
  Direction artistique → Photos), mais **hors scope actuel**.
- Implémenté dans `src/pages/photo/[slug].astro`.

### Pattern CSS : viewport sans scroll

Pour qu'une page tienne entièrement dans le viewport sans scroll :

```css
body {
  height: 100vh;   /* fallback OBLIGATOIRE (navigateurs avant 2022) */
  height: 100dvh;  /* hauteur réelle, gère les barres d'URL mobiles */
  overflow: hidden;
}
```

- Le fallback `100vh` est obligatoire : `dvh` n'est pas connu des vieux
  navigateurs.
- À réutiliser sur toute page « plein écran sans scroll ».

### Pattern CSS : z-index des éléments fixes

- Un élément `position: fixed` qui doit passer devant le contenu →
  `z-index: 10`.
- Convention par paliers de 10 : **10** = navigation / sticky, **100** =
  modal, **10000** = toast. Monter d'un palier si besoin.
- Évite les `z-index: 9999` posés au hasard.

### Ordre de codage MVP (priorité)

1. **`/photo/[slug]`** en premier — définit le modèle de données
2. **`/`** ensuite — réutilise le modèle, ajoute hero + liste
3. **`/a-propos`** en dernier — page quasi statique, simple

Justification : on part de la donnée (la photo individuelle) vers
l'agrégation (la home).

## Dette technique

Choses connues à corriger, **non bloquantes**, listées pour ne pas les
redécouvrir.

### Fond crème codé en dur

- La couleur `#f7f5ef` est actuellement en dur dans
  `src/pages/photo/[slug].astro`.
- À remonter en **variable CSS globale** dès le premier layout/CSS
  partagé (probablement à la création de la home `/`).
- Risque actuel : divergence de teinte si modifiée à un seul endroit.

### Titres des photos à enrichir

- 7 photos sur 8 ont `title: "2025-09-xxx"` (slug recyclé en titre faute
  de mieux à l'import).
- Visible dans l'onglet du navigateur **et** les résultats Google.
- À remplacer par de vrais titres quand on a le temps.
- Pas bloquant, mais à faire **avant tout travail SEO sérieux**.

## Architecture decisions (à ne pas casser)

Invariants d'infrastructure. Les casser met le site ou l'admin hors service.

### URL de production
L'URL prod est **`douzeland.pages.dev`** (Cloudflare Pages). L'ancien domaine `douzeland.netlify.app` est mort, ne plus l'utiliser.

### Pas d'adapter Astro
`astro.config.mjs` est **vide volontairement** (`defineConfig({})` → output
statique). Les OAuth functions sont des Cloudflare Pages Functions dans
`functions/api/auth.js` et `functions/api/callback.js`.
Tout adapter basculerait le build en mode SSR et casserait l'OAuth Decap.

### Callback OAuth lié au domaine
L'OAuth App GitHub a son `client_id` configuré avec le callback
`https://douzeland.pages.dev/api/callback`. Si on change de
domaine un jour, mettre à jour **les deux** :
1. l'*Authorization callback URL* sur github.com/settings/developers,
2. le `base_url` (donc le `redirect_uri`) côté Decap (`public/admin/config.yml`).

## Contexte personnel

Je m'appelle Douze, je suis entrepreneur et
photographe amateur sérieux (Lightroom + RAW). Ce projet est
**pédagogique avant tout** : j'apprends le code et Claude Code en
construisant un vrai site qui me sert.