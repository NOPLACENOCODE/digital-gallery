## 2026-08-23 — DREAM03: rename, chord loop editor, thunder, Solo Show proposal

- Renamed DREAM02 -> DREAM03 (page title + mood.js). The on-disk folder stays `DREAM02/`.
- Chord progression is now an editable step grid (rest + hold values, adjustable length),
  defaulting to the old 1-2-3-4-5 so nothing sounds different until touched. Free-form
  looper records your playing with exact timing; `?loop=grid` is the quantised alternative.
- Space no longer pauses (people were stopping the machine by accident).
- Thunder was inaudible because it was a 110-170Hz lowpass, i.e. pure sub. Rebuilt as
  crack + body + rumble, 1-3 return strokes, with a matching strobe flash in the room and
  an inverting weather panel. Same root cause as the earlier fire fix.
- Weather: one button per atmosphere (was per-element), ~11x slower drift, louder overall.
- Info panel behind a `?` button; bigger X/Y matrix; RUIN label moved beside its bar.
- Build tooling rescued out of temp into `DREAM02/tools/` with a README; CLAUDE.md now
  documents the deploy loop and the immutable-cache trap.

## 2026-08-22 — DREAM02 beta published at /dream (unlisted)

Deployed the DREAM02 generative instrument as an unlisted beta for tester feedback.

**Assets optimised for the web (520MB → 96MB):**
- 338 drawings PNG → WebP at q82 (78% smaller); alpha verified preserved via round-trip, so the transparent cutouts stay transparent
- 66 dream clips re-encoded (640px cap, 24fps, crf30, audio dropped — they play muted); the 4 whose re-encode came out larger than the source keep the original
- Excluded from the deploy: `video-sq/` (62MB) and `img/*.jpg` (~140MB), both entirely unreferenced by the code, plus `_deleted/`, `versions/`, `__pycache__/`, `photolab.html`
- `site/_headers`: 1-year immutable cache on /dream media, X-Robots-Tag noindex on /dream

**Production fixes (also improve local dev):**
- Added the missing `<meta name="viewport">`
- Small-screen notice under 900px — the fixed desktop rails overlap badly on phones, so it shows a message instead of a broken UI (and doesn't autoplay the intro behind it)
- Figma overlay no longer eager-loads `figma-overlay.png` (404'd on every single page load); now fetched on first `O` press
- Loop wall reads an explicit `WALL_LOOPS` list instead of probing loop1-8 × wav/m4a/mp3 — that blind probe fired 24 requests to find 4 files, logging ~20 404s per load
- `refreshImages` 60s poller is now localhost-only (it exists for Photo Lab authoring; on a static deploy it was 2 requests/min per visitor forever)

## 2026-07-20 — Crop Somni cover to remove baked-in transparent padding
- `assets/works/somni-1.png` (the grid/modal cover) had ~86-140px of transparent padding baked into its 1600×1200 canvas. On the new mobile grid (which sizes tiles to the image's own dimensions instead of a fixed square) that padding showed up as extra white space on Somni's sides compared to other works.
- Cropped the file tight to its non-transparent content (now 1483×931, matching the painting's real 218×135cm ratio) and bumped `ARTWORK_ASSET_VERSION` to 141 in script.js.
- Bumped script.js?v=172 in artworks.html (ARTWORK_ASSET_VERSION changed).

## 2026-07-20 — Mobile artwork grid overhaul: no price, no grey frame, no SOLD tag, better spacing
- Removed price from artwork grid tiles (script.js) — price now only shown inside the artwork modal.
- Mobile artwork grid (`.work-grid`) now shows 1 artwork per row instead of 2, so images take up more space. Desktop (>=720px) unchanged at 4 columns.
- Mobile: removed the grey `.work-tile-frame` background/padding and the forced square aspect-ratio — tiles now hug the painting's own shape on white instead of letterboxing inside a grey square. This also closed the big gap that appeared between horizontal paintings and their title.
- Mobile: increased `.work-grid` row gap to 48px for clearer separation between consecutive artworks, and reduced title margin-top to 10px so the title sits close to its painting.
- Removed the "SOLD" tag from the artwork grid entirely (script.js) — it still shows inside the artwork modal.
- Bumped style.css?v=183 and script.js?v=171 in artworks.html

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

## 2026-08-28 — DREAM03: heart animation responsiveness
- The pump was quantised to ~5 discrete sizes (cell size was floored to whole pixels).
  The heart is now drawn once into a 17×17 sprite and blitted scaled with smoothing off:
  continuous size, same hard pixel edges.
- The lub-dub was hardcoded in milliseconds, so past ~120bpm the second contraction landed
  60% into the beat and never resolved. The envelope is now measured in fractions of the
  current beat period (bpm × character multiplier), so it stays snappy at any tempo.
- Sized at 0.73h so the full contraction fits the canvas — it used to clip off the top of
  every beat, which flattened the pump visually.

## 2026-08-28 — DREAM03: lightning still
- When thunder strikes in a storm, the piece freezes for ~2.4s on a single drawing shown as
  a negative — white ink on black, no video, no glitch — then fades back over 0.9s.
- Implemented as an opaque overlay canvas inside #center rather than a branch in
  renderFrame, so the render pipeline is completely unchanged.

## 2026-08-28 — DREAM03: forest fire tints the room red
- In forest fire mode the video layer is multiplied by a warm red (#ff5a3c at .58), so the
  light coming through the window burns instead of glowing white. Multiply keeps the dark
  room dark and only pushes the lit areas; applied before the drawings composite, so the
  ink is untouched.

## 2026-08-28 — DREAM03: forest fire, made actually visible
- The video-only red multiply was nearly invisible on the finished frame (measured G-19/B-20)
  because the drawings cover most of the video and the fire vignette had already reddened it.
- Added a second pass: a warm overlay (#ff4a1e at .45) after the drawings and fx, so the
  firelight falls on the ink too. Fire mode now reads rgb(111,38,28) vs rgb(139,145,151) for
  the neighbouring modes.
- FIRE_TINT_AMT / FIRE_POST_AMT / FIRE_POST_OP are `let`, tunable live from the console.

## 2026-08-28 — DREAM03: forest fire lights the room, not the drawings
- Reverted the overlay pass that tinted the drawings. The fire is outside, so it should light
  the ROOM.
- New #firelight layer: a red gradient thrown from the window across the background video,
  at z-index 0 so it sits over #bgloop but under #app — it never touches the drawings. Uses
  the same window position (50% 30%) the lightning flash already used.
- multiply, not screen: screen can only lighten, so bright orange over the grey room came out
  pale pink. Multiplying warm-to-dark-red leaves the window bright and drives the corners deep
  red, which reads as a fire burning outside.
- Eases in/out over ~1.5s with the weather and carries a slow two-sine flicker.
- FIRE_GLOW_MAX / FIRE_FLICKER are `let`, tunable live.

## 2026-08-28 — DREAM03: dark night sinks the room
- 'dark night swallows me' now darkens the room video via a new #nightdark layer, in the same
  z-index:0 room band as #firelight — under #app, so the drawings circle is untouched.
- Darker toward the edges so the room closes in; eases with the weather like the firelight.
- NIGHT_DARK_MAX is `let`, tunable live.

## 2026-08-28 — DREAM03: heart is now two photographed frames
- Replaced the procedural pixel heart with Mattia's two frames: contracted on the beat,
  expanded for the rest of it. Contraction lasts 32% of the beat, so it stays proportional
  at any bpm.
- Frames were composited onto a common canvas at 1:1 and centred on their alpha centroid, so
  the real size difference between them survives (+49% lit area) and they don't drift.
- Alpha-faded toward the edges (smoothstep, opaque to r=268, gone by r=400) so the cut cables
  dissolve rather than ending mid-air.
- Assets live in dream/ui/ — deliberately outside dream/img, which is cached immutable.

## 2026-08-28 — DREAM03: bigger heart
- The heart now draws at 2.5x its old size and deliberately spills over the KICK panel.
- The canvas grew to 232px but negative margins keep its layout slot at exactly the original
  82px, so nothing in the right rail moved (verified: kick panel height identical old vs new).
- pointer-events:none on #ekg, since the enlarged canvas now overlaps the KICK knobs and would
  otherwise swallow their clicks.
- Frames re-exported at 720px (were 360) so they downscale rather than blur, and bumped to
  ?v=2 since the bytes changed.
- HEART_SCALE is `let` — 2 to 3.2 all fit the canvas without clipping.
