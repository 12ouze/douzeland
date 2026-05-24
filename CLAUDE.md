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
- **Node 22+** requis (cf. `netlify.toml`)
- **Aucun framework UI** (pas de React, Vue, Svelte) — Astro pur
- **CSS vanille** (pas de Tailwind, pas de Sass) — on apprend les
  bases, on garde le contrôle
- **Hébergement Netlify** branché en CI/CD sur GitHub
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
Une photo = un fichier image dans `src/photos/` + un fichier `.md`
optionnel à côté avec front-matter :

```yaml
---
title: Optionnel, légende courte
date: 2026-05-24
featured: true   # si true → apparaît dans le hero slider
---

Texte libre optionnel pour accompagner la photo.
```

Ajouter une photo = exporter depuis Lightroom dans `src/photos/`,
optionnellement créer le `.md`, commit + push. Netlify déploie tout
seul.

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
├── src/
│   ├── components/      # Composants réutilisables (.astro)
│   ├── layouts/         # Layouts de page (Layout.astro)
│   ├── pages/           # Routes du site
│   ├── photos/          # Photos + .md de métadonnées
│   └── styles/          # CSS global, variables, reset
├── astro.config.mjs
├── netlify.toml         # Config build Netlify (ne pas casser)
├── package.json
└── CLAUDE.md            # Ce fichier

## Choses à ne PAS faire

- ❌ Installer un framework UI (React/Vue/Svelte) — on reste sur Astro pur
- ❌ Installer Tailwind — CSS vanille pour apprendre
- ❌ Ajouter du JavaScript côté client sauf si vraiment nécessaire
  (Astro favorise le HTML statique, c'est voulu)
- ❌ Modifier `netlify.toml` sans comprendre l'impact (Node version,
  publish dir — on s'est déjà fait avoir)
- ❌ Commit dans `dist/` ou `node_modules/` (le `.gitignore` est là
  pour ça, ne pas le contourner)
- ❌ Ajouter des boutons sociaux, likes, partages — pas un réseau social

## Contexte personnel

Je m'appelle Douze, je suis entrepreneur et
photographe amateur sérieux (Lightroom + RAW). Ce projet est
**pédagogique avant tout** : j'apprends le code et Claude Code en
construisant un vrai site qui me sert.