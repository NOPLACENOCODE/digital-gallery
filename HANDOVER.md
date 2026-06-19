# Handover — noplace_notime website

Date: 2026-06-19
Status: Site is live and deployed. No pending issues.

---

## What just happened (this session)

1. Added three new Crucifixion gallery images from Downloads:
   - black_3.HEIC → crucifixion-black-3.jpg
   - black_4_zoom.HEIC → crucifixion-black-4-zoom.jpg
   - black5.HEIC → crucifixion-black-5.jpg
   - Updated script.js images array (1 → 4 images), bumped ARTWORK_ASSET_VERSION to 139

2. Created agent + maintenance files:
   - CLAUDE.md — agent instructions (at project root, auto-read by Claude Code)
   - site/CHANGELOG.md — change log (tracked in git)
   - HANDOVER.md — this file

3. Committed and pushed. Last commit: Add CHANGELOG and project agent files

---

## Current state of the site

Live URL: https://noplacenotime.com
Repo: https://github.com/NOPLACENOCODE/digital-gallery (branch main)

Paintings on artworks page (in order):
  Crucifixion (2026) — €3000 — 4 images
  Somni (2026) — €3000 — 5 images (PNG transparent cover)
  Un caballo maniaco un sabado cualquiera (2025) — €2400 — 5 images
  Un caballo deprimido un martes cualquiera (2025) — €2000 — 5 images
  After Lillies (2025) — €1000 — 5 images
  Apariciones nocturnas (2025) — €800 — 5 images
  Red Portal (2025) — €500 — SOLD — 3 images
  Fake Plastic Flowers (2025) — €500 — 5 images
  Portal al cielo (2024) — €2200 — 5 images
  God inside me (2024) — €2000 — 1 image

Objects store:
  Somni Wallet — €200 — SOLD OUT
  Bronze Talisman — live

---

## Key version numbers (bump when you change things)

  ARTWORK_ASSET_VERSION in script.js:   139
  script.js in artworks.html:           v=167
  script.js in index.html:              v=169
  audio.js in index.html:               v=170
  style.css in artworks.html:           v=181
  style.css in index.html:              v=169

---

## How to continue in a new chat

Open the project folder in Claude Code. CLAUDE.md will be read automatically.
Then just tell Claude what you need — e.g.:
  "Add a new painting called X"
  "Update the price of Somni"
  "Add more images to the Crucifixion gallery"

The agent knows all the rules, file structure, and how to deploy.

---

## Critical rules

1. PNG with transparency → stay PNG. Never convert to JPEG.
2. Always convert images to /tmp first, then cp to destination (sips breaks on space-paths).
3. Bump ARTWORK_ASSET_VERSION and HTML ?v=N versions after every change.
4. Always update site/CHANGELOG.md at end of session.
5. Use git -C "$PWD/site" for all git commands.
6. Use Bash heredoc to write files — the Write tool does not persist in this project.
