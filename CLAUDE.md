# noplace_notime — Claude Agent

You are the dedicated assistant for **noplacenotime.com**, a static portfolio + store for the artist noplace_notime (Mattia Vanzini). Read this file once at the start of every session.

---

## Project structure

```
noplacenotime/              ← working directory (NOT a git repo itself)
├── CLAUDE.md               ← this file
├── CHANGELOG.md            ← log every change here (also in site/ git repo)
├── CONTEXT.md              ← detailed legacy handoff doc
├── site/                   ← THE GIT REPO and deployable website
│   ├── index.html          ← home (spinning video logo + menu)
│   ├── artworks.html       ← painting grid + modal
│   ├── objects.html        ← store with dressable dude
│   ├── info.html           ← placeholder
│   ├── style.css           ← all styles
│   ├── script.js           ← home + artwork modal logic + works data
│   ├── objects.js          ← store / cart logic
│   ├── audio.js            ← Web Audio API sounds
│   └── assets/
│       ├── logo.png
│       ├── logo-spin.mp4   ← homepage hero (spinning house)
│       ├── works/          ← painting images (kebab-case)
│       └── objects/        ← dude + item PNGs for store
├── artwork photos/         ← raw originals (not in git)
└── photos objects/         ← raw object photos (not in git)
```

**IMPORTANT PATH RULE:** Always use `$PWD/site/...` in Bash commands rather than the full hardcoded absolute path. The Dropbox path contains special characters that break when hardcoded. The `$PWD` variable resolves correctly.

---

## How to deploy

The site is 100% static, no build step. Cloudflare Pages auto-deploys on every push to `main`.

```sh
git -C "$PWD/site" add <files>
git -C "$PWD/site" commit -m "Short description"
git -C "$PWD/site" push
# → live at https://noplacenotime.com in ~30 seconds
```

**Repo:** https://github.com/NOPLACENOCODE/digital-gallery (branch `main`)
**Cloudflare build output dir:** `site` (no build command)

Local preview:
```sh
cd "$PWD/site" && python3 -m http.server 4000
```

Rollback: `git -C "$PWD/site" revert HEAD && git -C "$PWD/site" push`

---

## Cache busting — ALWAYS do this

Two independent version numbers must be bumped whenever content changes:

### 1. `ARTWORK_ASSET_VERSION` in `script.js` (line ~3)
Appended as `?v=N` to every image URL in the artwork gallery. Bump whenever any file in `assets/works/` is added, replaced, or renamed.

### 2. `?v=N` on script/CSS tags in HTML files
Each HTML file loads `script.js?v=N` and `style.css?v=N`. Bump the relevant one whenever JS or CSS changes.

Current versions:
- `ARTWORK_ASSET_VERSION`: 139
- `script.js` in artworks.html: v=167
- `script.js` in index.html: v=169
- `audio.js` in index.html: v=170
- `style.css` in artworks.html: v=181
- `style.css` in index.html: v=169

---

## Image rules

| Source | Output | Rule |
|--------|--------|------|
| HEIC (iPhone photo) | JPEG | Always for paintings/photos |
| PNG with transparency | PNG | NEVER convert to JPEG — flattens alpha to white |
| JPEG or PNG (opaque) | WebP | For gallery alternates |

**Always check for transparency before converting.** If a PNG has a transparent background (cutout artwork), keep it PNG.

### Conversion commands

```sh
# HEIC → JPEG (convert to /tmp first, then copy)
sips -s format jpeg -s formatOptions 86 -Z 1600 "source.HEIC" --out /tmp/output.jpg
cp /tmp/output.jpg "$PWD/site/assets/works/slug-name.jpg"

# JPEG/PNG → WebP (Pillow)
python3 -c "
from PIL import Image, ImageOps
img = ImageOps.exif_transpose(Image.open('source.jpg'))
img.convert('RGB').save('/tmp/output.webp', 'WEBP', quality=82, method=6)
"
```

Always convert to /tmp first. sips fails if the output path contains spaces or special characters (the Dropbox path does).

### Specs
- Max size: 1600px on longest edge
- JPEG quality: 86 (sips) or 90
- WebP quality: 82, method 6
- EXIF: sips bakes it automatically; Pillow requires `ImageOps.exif_transpose(img)`

### Naming convention
Kebab-case, lowercase, no spaces.
- `slug.jpg` — cover/official shot (first in images array)
- `slug-1.webp`, `-2.webp` — alternate views
- `slug-zoom-1.webp` — close-ups (auto-renders as fill/cover in the modal)

---

## Adding a new painting

1. Convert photos to /tmp via sips, then cp to `site/assets/works/`
2. Add entry to `works` array in `script.js`:
```js
{
  slug: 'my-painting',
  title: 'My Painting',
  year: 2026,
  width: 100, height: 80,      // cm, W × H
  materials: 'Spray paint, acrylic',
  price: '€1500',
  // soldOut: true,             // optional
  // maxHeight: '88%',          // optional — cap display height
  images: [
    'assets/works/my-painting.jpg',
    'assets/works/my-painting-1.webp',
    'assets/works/my-painting-zoom-1.webp',
  ],
},
```
3. Bump `ARTWORK_ASSET_VERSION` in `script.js`
4. Bump `script.js?v=N` in `artworks.html`
5. Update `site/CHANGELOG.md`
6. Commit and push

---

## Site style

**Palette:**
- Background: #ffffff
- Text: #1a1a18 (near-black)
- Muted: #6c6e69
- Artwork frame / hover: #ededed

**Fonts:** Inter (body), Amiri (artwork titles in modal)

**Feel:** Minimal, quiet, gallery-like. Hover on tiles = subtle darkening only (no scale). Artwork modal: side-by-side on desktop (painting left, info right), stacked on mobile.

**Homepage:** Spinning house video, click to spin fast. Pixelated cursor candle glow. Film grain.

---

## Email — never hardcode

```js
const email = ['mattia.vanzini', 'gmail.com'].join('@');
```

---

## Changelog

Update `site/CHANGELOG.md` at the end of every session. Format:
```
## YYYY-MM-DD — Short title
- What changed and why
```

---

## Common gotchas

- **sips path bug:** Always convert to /tmp first, then cp. Never write directly to Dropbox paths.
- **PNG transparency:** Never convert a transparent PNG to JPEG.
- **WebP encoder:** This Mac may not have a working WebP encoder (sips can't write WebP; Pillow/Anaconda may also lack it). Test before relying on it.
- **EXIF rotation:** sips bakes it. Pillow does NOT — use `ImageOps.exif_transpose(img)`.
- **Audio:** All sounds must fire inside click handlers (not setTimeout). iOS requires synchronous scheduling.
- **File writes:** Do NOT use Write tool for files in this project — it doesn't persist. Use Bash heredoc instead.
