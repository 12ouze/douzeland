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
4. **commit + push** → Cloudflare Pages déploie tout seul, en optimisant
   les images au passage (WebP, lazy load, multiples tailles).

### Remplacer une photo par une version modifiée

Ne jamais écraser ni supprimer l'image existante. La bonne procédure :

1. **Exporter la nouvelle image sous un nom légèrement différent**, ex.
   `nzf_5870-v2.jpg` (surtout pas le même nom que l'ancienne).
2. Dans Decap, ouvrir la **fiche existante** et charger la nouvelle image dans
   le champ *Image*.
3. **Publier.**
4. **Ne pas supprimer l'ancienne image.** Elle devient orpheline — donc sans
   aucune conséquence (cf. « Fichiers orphelins — règle critique »).

Pourquoi un nom différent : ça évite tout conflit de cache et toute
manipulation destructive sur un fichier encore référencé. Le coût est quelques
Mo de dépôt ; le bénéfice est de ne jamais bloquer un déploiement.

### Vérifier qu'un déploiement a réussi

**Dashboard Cloudflare → projet `douzeland` → onglet Deployments.**

C'est le **premier endroit à regarder** quand quelque chose de publié
n'apparaît pas sur le site. Un build rouge = la prod est figée sur la dernière
version verte, et tout ce qui a été poussé depuis attend. Inutile de chercher
ailleurs (cache navigateur, Decap…) tant que ce n'est pas vérifié.

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

### Hero de la home — décisions de design

État actuel de `src/pages/index.astro` (tout est implémenté là, via des
overrides `:global()` ; `Slider.astro` reste intouché).

**Hauteur du hero** — `calc(100vh - 2.5rem)` puis `calc(100dvh - 2.5rem)`
(fallback `vh` obligatoire, cf. « Pattern CSS : viewport sans scroll »). Le hero
est raccourci pour laisser dépasser une bande de crème du header : un contraste
franc sous une photo plein cadre, qui signale qu'il y a du contenu en dessous.

- La valeur est **fixe, pas en pourcentage**, et c'est délibéré : la crème
  disponible avant le titre est le `padding-top` du Header (5rem = 80px), une
  constante. Une bande en `vh` grandirait avec le viewport et finirait par
  rogner le masthead sur grand écran (8vh = 104px sur un 1440p).
- **Plancher : ~2rem.** En dessous, la bande se lit comme un défaut de mise en
  page plutôt que comme une intention.

**Compteur « N photographies »** — calculé dynamiquement depuis la collection
(`listPhotos.length`, la source même de la galerie), **jamais écrit en dur** :
le chiffre annoncé ne peut pas diverger de ce que le visiteur trouve en
scrollant.

**Animation** — le compteur et le chevron partagent l'animation
`chevron-flottement` (même amplitude, même phase) pour flotter ensemble sans
que l'écart entre eux varie. `prefers-reduced-motion` est géré sur les **deux**
éléments animés.

**Masthead « DOUZE LAND » du hero** — coin haut-gauche, marges égales de
`2.5rem`. Typographie recopiée à l'identique de `Header.astro → .titre` (800,
uppercase, `0.22em`, `clamp(1.6rem, 4vw, 2.6rem)`, `line-height: 1`) : c'est une
**duplication, pas un héritage** (styles Astro scopés) — si la typo du Header
change, la répercuter ici aussi.

> **Arbitrage assumé** : le masthead est aligné sur **la photo** (pleine
> largeur) et non sur la grille du site (conteneur `max-width: 1000px` centré).
> Conséquence : en scrollant vers le header, le titre se décale
> horizontalement au lieu de rester sur le même axe. **C'était un choix, pas un
> oubli** — ne pas le « corriger » sans en reparler.

À noter : `2.5rem` n'est pas non plus la marge des flèches du slider
(`left: 0.5rem` + `padding-left: 0.8rem` → le glyphe démarre vers 1.3rem).
Unifier les trois demanderait de toucher `Slider.astro`.

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

### `!important` accumulés dans index.astro

- `index.astro` surcharge `Slider.astro` via des sélecteurs `:global()`, avec
  plusieurs `!important` (chevron : `animation`, `opacity`, `transform`).
- Ça **fonctionne** et c'est délibéré — c'est le prix à payer pour ne pas
  toucher `Slider.astro` — mais c'est fragile : la spécificité et l'ordre des
  règles deviennent difficiles à suivre, et une modification dans `Slider.astro`
  peut casser un override sans prévenir.
- À assainir **si le fichier devient difficile à maintenir** (piste : déplacer
  ces styles dans `Slider.astro` avec des props, ou passer par des variables
  CSS globales). Pas urgent tant que ça tient.

### Titres des photos à enrichir

- 7 photos sur 8 ont `title: "2025-09-xxx"` (slug recyclé en titre faute
  de mieux à l'import).
- Visible dans l'onglet du navigateur **et** les résultats Google.
- À remplacer par de vrais titres quand on a le temps.
- Pas bloquant, mais à faire **avant tout travail SEO sérieux**.

## Architecture decisions (à ne pas casser)

Invariants d'infrastructure. Les casser met le site ou l'admin hors service.

### Fichiers orphelins — règle critique

Les deux sens d'« orphelin » n'ont **rien à voir** en termes de gravité :

| Cas | Effet | Gravité |
|---|---|---|
| Image **sans** `.md` | Astro ne la référence pas, elle n'entre pas dans le build | **Inoffensif** — juste du poids mort dans le dépôt |
| `.md` **sans** son image | `[ImageNotFound]` → le build échoue | **Critique** — plus rien ne se déploie |

Quand le build échoue, Cloudflare **continue de servir la dernière version
verte**. Le site reste donc en ligne et paraît normal, mais il est *figé* : plus
aucune modification ne part en prod, y compris celles qui n'ont aucun rapport
avec la photo fautive. Un seul `.md` orphelin bloque toute la file.

**Corollaire, à respecter sans exception : ne jamais supprimer une image à la
main.** En cas de doute, laisser traîner les fichiers en trop — quelques Mo
inutiles ne coûtent rien, un déploiement bloqué coûte la journée.

Vérification rapide avant de pousser :

```bash
npm run build   # échoue avec [ImageNotFound] si un .md pointe dans le vide
```

### URL de production
L'URL prod est **`https://douzeland.com`** (domaine principal, servi par
Cloudflare Pages). C'est l'adresse à donner, à tester et à mettre partout.

Deux autres domaines existent, à ne pas confondre :

| Domaine | Statut | Usage |
|---|---|---|
| `douzeland.com` | **actif** | URL publique du site |
| `douzeland.pages.dev` | **actif** | domaine technique Cloudflare Pages ; porte encore l'OAuth Decap (cf. plus bas) — ne pas le débrancher |
| `douzeland.netlify.app` | mort | ancien hébergeur, ne plus jamais l'utiliser |

`pages.dev` répond toujours en 200 : ce n'est pas un reliquat à nettoyer, c'est
lui qui fait tourner l'admin. Voir « Callback OAuth lié au domaine ».

### Pas d'adapter Astro
`astro.config.mjs` est **vide volontairement** (`defineConfig({})` → output
statique). Les OAuth functions sont des Cloudflare Pages Functions dans
`functions/api/auth.js` et `functions/api/callback.js`.
Tout adapter basculerait le build en mode SSR et casserait l'OAuth Decap.

### Callback OAuth lié au domaine
L'OAuth App GitHub a son `client_id` configuré avec le callback
`https://douzeland.pages.dev/api/callback` — **sur `pages.dev`, pas sur
`douzeland.com`**. C'est volontairement resté ainsi au passage sur le domaine
principal : `public/admin/config.yml` porte toujours
`base_url: https://douzeland.pages.dev`, et ça fonctionne.

⚠️ Ne pas « harmoniser » le `base_url` vers `douzeland.com` par souci de
cohérence : ça casserait l'authentification Decap instantanément, car le
`redirect_uri` envoyé ne correspondrait plus au callback déclaré chez GitHub.
Les deux doivent changer **ensemble ou pas du tout** :
1. l'*Authorization callback URL* sur github.com/settings/developers,
2. le `base_url` (donc le `redirect_uri`) côté Decap (`public/admin/config.yml`).

Le champ `site_url` du même fichier est cosmétique (lien « voir le site » dans
l'admin) : lui peut passer à `https://douzeland.com` sans risque.

## Incidents connus

### Désynchronisation Decap — 11 août 2026

**Ce qui se passe** : Decap peut **supprimer une image sans supprimer son
`.md`**, laissant une fiche orpheline qui pointe dans le vide. Le build casse,
et tous les déploiements suivants sont bloqués (cf. « Fichiers orphelins —
règle critique »).

**Symptôme trompeur** — c'est là que se perd le temps :

- la photo **reste visible sur le site**, parce que Cloudflare sert le dernier
  build vert ;
- elle **reste visible dans l'admin Decap** ;
- alors que le fichier n'est **plus dans le dépôt**.

Tout a l'air normal des deux côtés, et pourtant plus rien ne se déploie. Ne
pas se fier à ce qu'affichent le site ou l'admin.

**Vérification fiable** — une seule des deux suffit :

1. chercher le fichier **directement sur GitHub** (dans `src/assets/photos/`) ;
2. lancer **`npm run build` en local** → `[ImageNotFound]` nomme le `.md` fautif.

**Correction** : soit re-téléverser l'image manquante, soit supprimer le `.md`
orphelin — c'est une décision de contenu, elle revient à Douze, pas à l'IA.

**Cas réel** : `2026-07-nzf_5870.md` a bloqué le déploiement une demi-journée.
Trois photos publiées ce matin-là (dont NZF_5955, la plus récente) sont restées
invisibles en prod alors qu'elles étaient correctement commitées — le seul
symptôme visible était « ma nouvelle photo n'apparaît pas ».

## Contexte personnel

Je m'appelle Douze, je suis entrepreneur et
photographe amateur sérieux (Lightroom + RAW). Ce projet est
**pédagogique avant tout** : j'apprends le code et Claude Code en
construisant un vrai site qui me sert.