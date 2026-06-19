## 2026-06-19 — Hero: unified canvas spin (autoplay + tap on mobile too)
- Replaced the desktop-video / mobile-WebP split with a single <canvas> renderer driven by requestAnimationFrame, fed from a sprite sheet (assets/logo-spin-sprite.webp, 30 frames, 135KB)
- Autoplays on every device incl. iOS Low Power Mode (canvas/rAF isn't subject to the <video> autoplay block) and tap/click speeds up the spin + tink, with smooth decay back to 1x
- Animated WebP <img> kept as the no-JS / load-failure fallback; logo-spin.mp4 retained as the re-encode source
- Added touch-action:manipulation + tap-highlight removal to .spin-video

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
