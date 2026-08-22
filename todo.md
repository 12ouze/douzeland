# douzeland — TODO

> Dernière mise à jour : 11 août 2026, fin de session

## ✅ Fait récemment

### Session du 11 août 2026
- Suppression des cartouches overlay du hero
- Refonte du chevron : blanc, ombré, agrandi, flottement vertical doux
- Ajout du compteur dynamique « N photographies » (calculé depuis la collection)
- Bande crème de révélation sous le hero (`calc(100dvh - 2.5rem)`)
- Masthead « DOUZE LAND » dans le hero (coin haut-gauche, typo du Header)
- Correction du scroll au clic sur le chevron, qui dépassait sa cible
  (destination dérivée du bas réel du hero, plus d'un viewport en dur)
- Réparation de la fiche orpheline `nzf_5870` qui bloquait tous les déploiements

### Session du 26 mai 2026 (16 commits)
- Page /archives créée (grille 4 cols desktop, 2 tablette, 1 mobile)
- Migration Header en layout horizontal (masthead gauche, nav droite)
- Système réordonnancement Decap avec boutons ⏫ ↑ ↓ ⏬
- Page /contact avec formulaire Web3Forms + popup de confirmation
- Cartouches noires en overlay sur le slider de la home
- Correction double masthead (masquage .masthead-overlay via :global())
- Séparateur "|" entre archives et contact dans la cartouche overlay
- Page /archives passe à 9 photos (retrait du filtre in_slider)
- Lien "home" ajouté dans le Header
- Lien "home" masqué sur la home (déjà sur /, redondant)
- Footer "DOUZE LAND © 2026" + nav (home, archives, contact)
- Ajustement padding-bottom symétrique 1.5rem (home, archives)
- Restore padding-bottom 3rem sur /contact (plus d'air autour du form)
- Header nav alignée sur "memoire vive" (align-items: flex-end)
- Header mobile : retrait du flex-direction column, reste en horizontal
- Header mobile : masquage du lien actif (.nav .lien.actuel display:none)
- Archives mobile : grille 3 colonnes type Instagram

## 🚧 Court terme

### Suites de la session du 11 août 2026

- [ ] **Textes alternatifs et titres des photos** — les 102 photos ont toutes
      le même `alt` (« Photographie Douze Land ») et pas de vrai titre. Zéro
      valeur pour le référencement **et** pour l'accessibilité.
      **Bloquant avant tout travail SEO sérieux.**
- [ ] **Chargement différé sur `/archives`** — la page sert 102 photos d'un
      coup. Devenu prioritaire à cette échelle, surtout sur mobile.
- [x] **Débordement horizontal en mobile** sur le `.masthead` — corrigé le
      22 août 2026 : sous 600px la nav passe sur sa propre ligne sous
      « memoire vive » (colonne, alignée à gauche, `flex-wrap`, `min-width: 0`).
      Vérifié à 390/360/320px : plus de scroll latéral, 4 liens visibles et
      cliquables. Desktop inchangé.
- [ ] **3 images orphelines** (`NZF_1117.jpg`, `NZF_1171.jpg`,
      `NZF_2842-Modifier.jpg`) — aucun impact sur le site, ~3 Mo de poids mort.
      À nettoyer un jour, **sur décision explicite** (cf. CLAUDE.md → règle des
      fichiers orphelins : ne jamais supprimer une image à la main).
- [ ] **URL trompeuse** — `NZF_1171.md` pointe désormais vers `nzf_1144.jpg`
      mais son URL reste `/photo/NZF_1171`. Purement cosmétique ; renommer
      changerait l'URL publique.

### Cleanup Netlify (~10 min)
- [ ] Supprimer `netlify/functions/auth.js`
- [ ] Supprimer `netlify/functions/callback.js`
- [ ] Supprimer `netlify.toml` s'il existe
- [ ] Mettre à jour `site_url` dans `public/admin/config.yml` (de netlify.app vers pages.dev)
- [ ] Décision : supprimer projet Netlify dans le dashboard ou laisser en pause
- [ ] Révoquer "Netlify Auth" dans GitHub Settings → Applications → Authorized OAuth Apps
- [ ] Supprimer bookmark Safari `candid-meerkat-b33c48.netlify.app`

### Mise à jour documentation
- [ ] Mettre à jour `CLAUDE.md` avec toutes les décisions de la session du 26 mai
- [ ] Mettre à jour la note "Footer.astro et Hero.astro n'existent plus" → maintenant Footer.astro existe et c'est OK
- [ ] Mettre à jour la décision architecturale #10 (retirer la mention "ne pas recréer Footer.astro")

### Page /about (~20 min)
- [ ] Créer src/pages/about.astro
- [ ] Contenu : bio courte (qui tu es, démarche photo, contact pro)
- [ ] Ajouter "about" dans le tableau `liens` du Header.astro (en dernière position)
- [ ] Ajouter "about" dans le Footer
- [ ] Cohérence visuelle avec /contact (même max-width 600px, même style typo)

## 💡 Idées moyen terme

### UX photos
- [ ] Lightbox sur les pages photo (cliquer pour zoom plein écran)
- [ ] Navigation clavier (← → entre photos) sur /photo/[slug]
- [ ] Améliorer le bouton de retour vers /archives depuis /photo/[slug]

### Performance
- [ ] Optimisation images : WebP avec fallback JPG
- [ ] Lazy loading explicite sur les vignettes /archives
- [ ] Vérifier scores Lighthouse, viser >90 partout

### Contenu
- [ ] Ajouter de nouvelles photos via Decap CMS pour étoffer le portfolio
- [ ] Rééquilibrer les "order" si ça devient le bordel (genre 30, 31, 40, 51 → 10, 20, 30, 40)

## 🌱 Wishlist (à valider plus tard)

- [ ] Mode sombre toggle (avec préférence persistée localStorage)
- [ ] Stats anonymes (Plausible ou Cloudflare Web Analytics, gratuit)
- [ ] Newsletter signup (Buttondown ou similaire, gratuit jusqu'à 100 subs)
- [ ] Page expos passées avec dates et lieux
- [ ] Page "process" sur la démarche photo
- [ ] RSS feed des nouvelles photos
- [ ] Partage social (open graph tags propres par photo)

## 🐛 Bugs connus / points à surveiller

- Le smooth scroll horizontal du slider est sensible : toute fonctionnalité qui modifie le timing doit être testée avec la téléportation post-clone.
- Decap modifie des .md en direct via GitHub API → fermer l'admin Decap dans Chrome avant de coller un brief dans Claude Code.
- Tester l'OAuth Decap toujours dans Chrome, jamais Safari (cookies tiers bloqués).

## 📋 Décisions architecturales actuelles

URL prod : `https://douzeland.com` (Cloudflare Pages)
Domaine technique : `https://douzeland.pages.dev` — toujours actif, porte l'OAuth Decap, ne pas débrancher
Repo : `https://github.com/12ouze/douzeland`
Local : `~/Code/douzeland`
Branche : `main` uniquement
Pas d'adapter Astro, sortie statique
OAuth via Cloudflare Pages Functions (`functions/api/auth.js` + `callback.js`)
Access key Web3Forms : `5caf0eb8-f520-43b4-960d-b32add66c7bb` (publique, OK en clair)
Email Web3Forms : t.fleurie@gmail.com

## 🎨 Conventions

- Couleurs : crème `#f7f5ef` (fond), noir `#111` (texte)
- Max-width contenus : 1000px (général), 600px (contact)
- CSS class naming en français
- Commit messages en français : "Composant : action faite"
- Liens nav : lowercase, opacity 0.6, hover 1, actif gras (pas underline à cause mix-blend-mode)