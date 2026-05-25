#!/bin/bash

# Script pour ajouter en masse les photos restantes
# Usage : bash add-photos.sh

PHOTOS=(
  "2025-09-balade"
  "2025-09-caserne"
  "2025-09-cuisinier"
  "2025-09-julien-12ans"
  "2025-09-julien-12ans-2"
  "2025-09-sarah-12ans"
  "2025-09-tomy-pilou-12ans"
)

for SLUG in "${PHOTOS[@]}"; do
  cp ~/Photos/Internet/douzeland/${SLUG}.jpg src/assets/photos/

  cat > src/content/photos/${SLUG}.md << EOF
---
title: "${SLUG}"
date: 2025-09-01
featured: false
image: "../../assets/photos/${SLUG}.jpg"
alt: "Photo ${SLUG}"
---
EOF

  echo "OK : ${SLUG}"
done

echo ""
echo "Verification src/assets/photos/ :"
ls src/assets/photos/
echo ""
echo "Verification src/content/photos/ :"
ls src/content/photos/