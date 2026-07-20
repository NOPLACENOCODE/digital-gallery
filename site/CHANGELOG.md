## 2026-07-20 — Hide price on artwork grid, single-column mobile grid
- Removed price from artwork grid tiles (script.js) — price now only shown inside the artwork modal. Grid tile still shows "SOLD" for sold-out works.
- Mobile artwork grid (`.work-grid`) now shows 1 artwork per row instead of 2, so images take up more space. Desktop (>=720px) unchanged at 4 columns.
- Bumped style.css?v=182 and script.js?v=170 in artworks.html

## 2026-07-13 — Mark caballo-maniaco as sold
- Added `soldOut: true` to "Un caballo maniaco un sábado cualquiera" in script.js
- Bumped script.js?v=169 in artworks.html

## 2026-06-19 — Mobile hero: localize tap to the house
- Tap-to-spin now triggers only on/near the house (an enlarged invisible zone via .spin-stage padding) instead of anywhere in the hero
- Uses pointer events on the padded container (reliable on iOS, unlike click on a tiny <canvas>); negative margin keeps the layout from shifting

## 2026-06-19 — Mobile hero: canvas spin (autoplay in Low Power Mode + tap)
- Desktop unchanged: interactive 60fps MP4 video (click house to speed up)
- Mobile/touch now uses a <canvas> frame-sequence from a 120-frame sprite sheet (assets/logo-spin-sprite.webp, 270KB): autoplays even in iOS Low Power Mode (rAF, not <video>, so no play button) and tap anywhere in the hero speeds up the spin
- House rendered 0.8x smaller on mobile (<=600px); added touch-action:manipulation
- Animated WebP <img> kept as the no-JS / load-failure fallback

## 2026-06-19 — Hero: desktop video, mobile WebP
- Desktop (hover+fine pointer) gets the interactive MP4 spin (rAF currentTime scrub, click = speed bump + tink)
- Touch/mobile keeps the animated WebP <img> — loops even in iOS Low Power Mode, no play button; also the no-JS fallback
- Video is created in JS only on desktop, so phones never download the MP4

## 2026-06-19 — Hero: animated WebP instead of video
- iOS Low Power Mode blocked the <video> hero and showed a play button for many mobile visitors
- Replaced the spinning-house <video> + currentTime-scrubbing JS with an animated WebP <img> (assets/logo-spin.webp, 418KB, loops on every device incl. Low Power Mode)
- Tap still plays the metallic tink sound; the old tap-to-spin-faster visual is not possible on an animated image

## 2026-06-19 — Rename Crucifixion images (drop "black")
- Renamed crucifixion-black-{3,4-zoom,5}.jpg → crucifixion-{3,4-zoom,5}.jpg
- Updated script.js images array, bumped ARTWORK_ASSET_VERSION 139 → 140, script.js?v=167 → 168 in artworks.html

# noplace_notime — Changelog

Most recent change first. Add a new entry at the top after every session.

---

## 2026-06-19 — Add CLAUDE.md agent + CHANGELOG + HANDOVER

- Created `CLAUDE.md` at project root with agent skills (deploy, image rules, style, gotchas)
- Created `site/CHANGELOG.md` (this file, tracked in git)
- Created `HANDOVER.md` at project root for session handover

---

## 2026-06-19 — Add Crucifixion gallery images (black 3, 4 zoom, 5)

- Converted `black_3.HEIC`, `black_4_zoom.HEIC`, `black5.HEIC` → JPEG (sips, q86, 1600px)
- Added to `site/assets/works/`: crucifixion-black-3.jpg, crucifixion-black-4-zoom.jpg, crucifixion-black-5.jpg
- Updated crucifixion images array in `script.js` (1 image → 4)
- Bumped ARTWORK_ASSET_VERSION: 138 → 139
- Bumped artworks.html script version: v=166 → v=167

---

## 2026-06-19 — Use transparent PNG for Somni main image

- Replaced somni.jpg cover with somni-1.png (transparent cutout)
- PNG kept as PNG — floats on grey #ededed modal frame with no white box

---

## 2026-06-17 — Spinning-house video as homepage hero

- Replaced CSS 3D coin on index.html with logo-spin.mp4 video
- Added click-to-spin interaction (BUMP=30, MAX=80, DECAY=2x)
- Added pixelated cursor candle effect (warm radial glow + dark vignette)
- Added film grain overlay (SVG feTurbulence, opacity 0.07, multiply)
- Old coin moved to coin.html; video.html added as staging page
- Re-enabled Objects page link
- Bumped script.js → v=169, style.css → v=169, audio.js → v=170

---

## 2026-06-16 — Update Somni gallery images

- Replaced Somni gallery with new set: somni.jpg, somni-2.jpg, somni-5.jpg, somni-zoom.jpg, somni-zoom-2.jpg

---

## 2026-05-23 — Initial site launch

- First commit: all pages, styles, scripts, audio, objects
- Cloudflare Pages wired to NOPLACENOCODE/digital-gallery, branch main
- Custom domain noplacenotime.com → Cloudflare DNS
- Paintings: Crucifixion, Somni, Un caballo maniaco, Un caballo deprimido, After Lillies, Apariciones nocturnas, Red Portal (sold), Fake Plastic Flowers, Portal al cielo, God inside me
- Objects: Somni Wallet (sold out), Bronze Talisman
