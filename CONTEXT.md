# noplace_notime — Project Context

This file is the handoff doc for a new Claude (or any new collaborator) picking
up this project on a fresh machine. Read it once and you're caught up.

---

## What this is

**noplacenotime.com** — a custom static portfolio + store for the artist
*noplace_notime* (Mattia Vanzini). Three pages, all hand-coded, no framework.

1. **Home** (`index.html`) — hero with a rotating 3D "coin" logo and a menu
   linking to the three subpages.
2. **Artworks** (`artworks.html`) — grid of paintings; tap one for a modal with
   multi-image carousel + Inquire button (opens mailto).
3. **Objects** (`objects.html`) — a playful store. A hand-drawn pixel "dude"
   sits fixed on the right; items are on the left. Clicking ADD on an item
   makes it appear on the dude (PNG layers stack). Cart, totals, Check Out
   (mailto) are inline under the dude.
4. **Info** (`info.html`) — currently just "Coming soon".

The whole thing is **vanilla HTML/CSS/JS** served as static files. No build
step, no framework, no backend.

### Current state of the world (as of 2026-05-23)

- **Source of truth:** GitHub repo at https://github.com/NOPLACENOCODE/digital-gallery
  (branch `main`).
- **Hosting:** Cloudflare Pages, project name `noplacenotime`. Preview URL:
  https://noplacenotime.pages.dev. Deploys auto-trigger on every push to `main`
  and complete in ~30s.
- **Custom domain:** `noplacenotime.com`. Registered at GoDaddy. DNS was
  migrated from GoDaddy's default nameservers to Cloudflare (free DNS); the
  nameserver change was saved on 2026-05-23 and was propagating at handoff
  time. Once Cloudflare detects the change, it auto-issues SSL and the apex
  + `www` resolve to the Pages project. Old site (GitHub Pages from the
  same repo's previous content) keeps serving until propagation finishes.

---

## How to run locally

From the project root:

```sh
cd site
python3 -m http.server 4000 --bind 0.0.0.0
```

Open <http://localhost:4000>. For mobile testing on the same Wi-Fi, find the
Mac's LAN IP (`ipconfig getifaddr en0` on macOS) and visit
`http://<that-ip>:4000` from the phone. The IP changes whenever you switch
networks — just rerun the command.

Image processing scripts (HEIC → JPEG/WebP, white-bg → transparent, rotations,
crop) use **Python 3 + Pillow** and **macOS sips**:

```sh
python3 -c "from PIL import Image; print('ok')"   # verify Pillow
sips --formats                                     # built into macOS
```

If Pillow isn't installed: `pip3 install Pillow`.

---

## File map

```
noplacenotime/
├── CONTEXT.md                  ← this file
├── artwork photos/             ← raw originals (HEIC/JPG from camera). Big.
├── photos dude/                ← raw dude + item drawings (PNG)
├── photos for site/            ← misc assets, old dude prototype
└── site/                       ← THE DEPLOYABLE WEBSITE
    ├── index.html              ← home page
    ├── artworks.html           ← artwork grid + modal
    ├── objects.html            ← store with the dressing-up dude
    ├── info.html               ← placeholder
    ├── style.css               ← all styles
    ├── script.js               ← home + artwork modal logic
    ├── objects.js              ← store / cart logic
    ├── audio.js                ← Web Audio API sound effects (shared)
    └── assets/
        ├── logo.png            ← coin / home / subpage logo
        ├── works/              ← painting images (kebab-case)
        └── objects/            ← dude + item PNGs for store
```

---

## Conventions

### Image filenames

- **Kebab-case**, lowercase, no spaces.
- For a painting with slug `portal-al-cielo`:
  - `assets/works/portal-al-cielo.jpg` — official/cover shot
  - `assets/works/portal-al-cielo-1.webp`, `-2.webp` — alternate views
  - `assets/works/portal-al-cielo-zoom-1.webp`, `-zoom-2.webp` — close-ups

The artwork modal script auto-detects "zoom" in a filename and renders that
image with `fit: 'cover'` (no grey margin, fills the slide). Alternate views
without "zoom" get `fit: 'tight'` (fill slide height, grey on sides). The
first image in the array uses default `fit: 'contain'` (full grey frame).

### Cache busting

Two layers because they solve different problems:

1. **HTML references CSS/JS as `style.css?v=N`** — bump `N` whenever you edit
   CSS or JS so the browser doesn't serve stale files.
2. **`ASSET_VERSION` constant in `objects.js`** — appended as `?v=N` to image
   URLs. Bump when you replace a PNG without changing its filename (e.g.,
   `dude.png` got redrawn). Browsers cache images aggressively by URL, so this
   is necessary.

When you edit anything, bump *both* if relevant.

### Email obfuscation

Email is built from parts in JS so basic scrapers don't grab it from page
source:

```js
const email = ['mattia.vanzini', 'gmail.com'].join('@');
```

Two places use it: the Inquire button (artwork modals) and Check Out (objects
cart). Both fire `mailto:` links with pre-filled subject + body.

---

## Key decisions / "why is it like this"

- **mailto for inquiries and checkout.** No backend; orders/inquiries land in
  the artist's inbox. Easy to swap for Stripe or a form provider later. The
  Check Out body is a structured order summary with `1× wallet — €200` lines.
- **Inline cart on the objects page** (it used to be a modal). The dude is on
  the right side fixed in place; items grid is on the left and scrolls
  normally. Under the dude: a bag icon, the cart items, total, and Check Out
  button — all inline, no modal.
- **`position: fixed` for the dude** (not `sticky`). Sticky drifted slightly
  on initial scroll and during overscroll bounce. Fixed is rock-solid.
- **`image-rendering: pixelated`** on the dude and item layers. The artist's
  drawings are low-res hand drawings, not pixel art per se, but pixelated
  rendering preserves the crispness of the line work when scaled up on Retina
  screens instead of getting blurry.
- **Items grid on the left, dude on the right.** Western reading flow: pick
  (left) → see result (right). Cart on the right also matches every
  e-commerce convention.
- **Painting modal layout**: on mobile the modal is page-scrollable (painting
  fills the viewport, info card peeks at the bottom, Inquire button below
  the fold — small scroll reveals it). On desktop, side-by-side: painting
  left, info right, info scrolls internally if needed.
- **Audio synthesized in JS** (not asset files). `audio.js` uses the Web Audio
  API: tiny chiptune blips on ADD/REMOVE, victory arpeggio on Check Out, a
  metallic tink when you click the spinning coin on the home page. Volumes
  intentionally low (~0.03–0.1) so they don't take over.
- **Hover on artwork tiles** = subtle matte darkening (`#ededed → #e0e0e0`),
  not scale. The user disliked the scale-up.
- **Inquire button** lives at the bottom of the painting modal's info card.
  On desktop the info card scrolls internally if needed; on mobile the page
  scrolls past the painting to reveal the button.

---

## Gotchas

### iPhone photo orientation

iPhone photos taken in portrait orientation are often *saved* as landscape
PNG/HEIC with an EXIF rotation hint. When converted with `sips`, the EXIF is
applied, so output is correctly oriented. With `PIL.Image.open()` + WebP
export, EXIF is NOT applied unless you call `ImageOps.exif_transpose(img)`.
This bit us during processing — if a converted image looks rotated, run a
manual 90° rotation:

```py
from PIL import Image
im = Image.open('foo.webp')
im.rotate(-90, expand=True).save('foo.webp', 'WEBP', quality=82, method=6)
```

Direction conventions: `-90` = clockwise (most iPhone landscape → portrait
fixes). `180` = upside-down flip. Iterate with the user — sometimes a single
rotation is wrong direction and we end up flipping 180° more.

### White-background PNGs

When the artist exports from Krita, PNGs sometimes have a solid white
background instead of transparent. Layers like `wallet-layer.png` MUST be
transparent — otherwise they cover the dude with a white square. Convert
white → transparent in Python:

```py
from PIL import Image
import numpy as np
img = Image.open(path).convert("RGBA")
arr = np.array(img)
mask = (arr[:,:,0] >= 240) & (arr[:,:,1] >= 240) & (arr[:,:,2] >= 240)
arr[mask, 3] = 0
Image.fromarray(arr).save(path)
```

Tell the artist: in Krita, draw on a transparent layer, not a white one. When
exporting, check **"Store alpha channel"** and uncheck **"Save as indexed
PNG"**.

### Aspect-ratio + flexbox stretching

The artwork thumbnails (`.work-thumb`) initially used `aspect-ratio: 1` with
`padding: 6%`. The default grid `align-items: stretch` was overriding the
aspect, causing asymmetric grey frames (no padding on the bottom). Fix: use
the `padding-top: 100%` trick (1:1 box regardless of grid behavior) with an
absolutely-positioned img inset by 4px. See `.work-thumb` in `style.css`.

### Pinch-zoom and scroll-snap

When the user pinch-zooms the artwork modal image, panning the zoomed view
would otherwise trigger the horizontal scroll-snap (skipping to next image).
`visualViewport.scale > 1.05` toggles an `.is-zoomed` class on the scroller
that disables `scroll-snap` and `overflow-x`. See `script.js`.

### Audio context unlocking

Browsers require a user gesture before audio plays. `audio.js` lazily creates
the `AudioContext` on first sound call, and calls `ctx.resume()` if
suspended. All sounds fire on click handlers, so this works fine. iOS Safari
in particular needs scheduling to happen synchronously inside the click —
don't wrap sound calls in `setTimeout`.

---

## Data model

### `script.js` → `works` array (paintings)

```js
{
  slug: 'somni',
  title: 'Somni',
  year: 2026,
  width: 218, height: 135,         // cm, W × H
  materials: '...',
  price: '€3000',                  // displayed verbatim; SOLD overrides if soldOut
  soldOut: true,                   // optional — see "Sold-out handling"
  maxHeight: '88%',                // optional: cap painting display height
  images: [
    'assets/works/somni.jpg',
    'assets/works/somni-zoom.jpg', // "zoom" auto → fit: cover
    { src: '...', fit: 'tight' },  // can also use object with fit override
  ],
}
```

### `objects.js` → `objects` array (store items)

Currently only two items: the **Somni Wallet** (sold out) and the **Bronze
Talisman** (live). Placeholder items have been removed.

```js
{
  id: 'wallet',
  category: 'wallet',              // categories are exclusive on the dude
  name: 'Somni Wallet',
  price: 200,                      // displayed as `€${price}` everywhere
  soldOut: true,                   // see "Sold-out handling" below
  image: 'assets/objects/wallet-1.webp',    // grid tile cover
  imageFit: 'cover',               // 'cover' fills tile edge-to-edge (no grey frame)
  layer: 'assets/objects/wallet-layer.png', // full-figure overlay (transparent)
  images: [                        // modal gallery, in order
    { src: 'assets/objects/wallet-1.webp', fit: 'cover' },
    { src: 'assets/objects/wallet-0.webp', fit: 'cover' },
    'assets/objects/wallet-2.webp',         // plain string = default contain + grey frame
    // entries can also include `position: 'center 70%'` to anchor a cover crop
  ],
  description: '...',
}
```

**Per-image `fit` / `position` in objects** (mirrors the artwork modal):
- Plain string → `object-fit: contain` with grey `#ededed` frame.
- `{ src, fit: 'cover' }` → fills the slide edge-to-edge, transparent bg.
- `{ src, fit: 'cover', position: 'center 70%' }` → CSS `object-position`
  override for the cover crop (anchor the subject vertically or horizontally).
- Same `imageFit` flag on the top-level object → applies the same to the
  grid tile cover.

The dressing-up figure (left) stacks `<img>`s: `dude.png` base + one
layer per category currently in the cart. Same item added twice = same one
layer (last-added per category wins).

### Sold-out handling

Set `soldOut: true` on an object or a work to mark it unavailable.

**Objects (`objects.js` items):**
- Grid tile: shows a small white `SOLD OUT` chip (top-left of the tile image).
  No ADD button is rendered on sold tiles.
- Modal: the ADD-TO-CART button is replaced with a disabled **SOLD OUT**
  pill — light grey background (`#ededed`) + red text (`#b91c1c`). Achieved
  via the `.is-soldout` class on `.object-detail-toggle`.
- The id is still filtered out of the cart on load if it sneaks in.

**Works (`script.js` paintings):**
- Intentionally **no badge or chip** — the price line just renders the
  word `SOLD` in the same style as `€${price}` (in both grid tile and modal
  meta). More classy.
- The modal **Inquire** button is hidden for sold works.

CSS lives in `style.css` under the `.sold-badge` and
`.object-detail-toggle.is-soldout` / `.work-modal-inquire.is-soldout`
selectors. The chip is intentionally tighter on tile (`5px 8px 3px` padding,
no border, `line-height: 1`) than on the artwork modal (`5px 10px`, with
border) — kept that way deliberately.

### Cart state

Stored in `localStorage` under `noplacenotime-cart` as an array of item IDs.
Duplicates allowed (quantity). On every change: `render()` updates the
toggle buttons, cart badge, items list, total, checkout button, and figure
layers.

---

## Open TODOs

- **DNS propagation** — confirm `https://noplacenotime.com` resolves to
  Cloudflare Pages (cert visible, lock icon in browser). Cloudflare will
  email when it detects the GoDaddy nameserver change. If it doesn't
  resolve after 24h, check Cloudflare dashboard "Overview" — the domain
  should say **Active**.
- **Info page** — still "Coming soon".
- **Red Portal dimensions + price** — currently `width: 30, height: 40` and
  `price: '€500'` in `script.js`. Width/height were guessed when adding
  the entry — Mattia should confirm and correct.
- **Mobile cart** — on mobile the cart shows in the same column as the
  figure (vertical stack: dude → cart bag → items → total → checkout). Works
  but could be a modal again if it gets cluttered.
- The `TEMP` padding in `script.js` `openWork` (`if (slides.length < 2)
  slides.push(null)`) pads single-image works with a placeholder slide so
  the thumbnail strip always appears — can be removed once all works have
  ≥2 images.

---

## Useful one-liners

```sh
# HEIC → JPEG batch (in zsh, set null_glob first)
setopt null_glob
for f in *.heic *.HEIC; do
  sips -s format jpeg -s formatOptions 90 "$f" --out "${f%.*}.jpg" >/dev/null
done

# JPEG → WebP batch
python3 -c "
from PIL import Image
import glob, os
for f in sorted(glob.glob('*.jpg')):
    Image.open(f).convert('RGB').save(f.rsplit('.',1)[0] + '.webp',
                                       'WEBP', quality=82, method=6)
    print('✓', f)
"

# rotate a single image 90° clockwise
python3 -c "
from PIL import Image
im = Image.open('foo.webp')
im.rotate(-90, expand=True).save('foo.webp', 'WEBP', quality=82, method=6)
"
```

---

## Workflow when adding a new painting

1. Create folder under `artwork photos/` named e.g. `painting_slug_fotos_extra/`
2. Drop in originals (HEIC/JPG/PNG). Skip files without standard naming
   (`IMG_xxxx.heic`, `FullSizeRender.jpg`).
3. Convert HEICs to JPEG with `sips`.
4. Batch-convert everything to WebP with Pillow into a parallel
   `painting_slug_fotos_extra_webp/` folder.
5. Copy WebPs to `site/assets/works/` renamed to kebab-case: `slug-1.webp`,
   `slug-2.webp`, `slug-zoom-1.webp`, etc.
6. Check rotations — landscape iPhone shots often need a `-90°` rotation.
7. Update the `images` array in `script.js` for that painting.
8. Bump the `?v=N` versions in `index.html` and `artworks.html`.

---

## Deployment (already wired)

The site is **static** (no backend, no database, no build step) and is
deployed on **Cloudflare Pages**, project `noplacenotime`, building from
the `main` branch of https://github.com/NOPLACENOCODE/digital-gallery.

Build settings in Cloudflare (already configured — only included here for
reference / disaster recovery):
- Framework preset: **None**
- Build command: *(empty)*
- Build output directory: **`site`**

### Adding images / updating the site

Local flow + one `git push`:

1. Drop new originals into `artwork photos/<work>/` or
   `photos objects/<thing>/`.
2. Convert + resize to WebP (sips for HEIC → JPEG, Pillow for JPEG/PNG →
   WebP capped at 1600px). Apply `ImageOps.exif_transpose` to honour
   iPhone EXIF rotation. See conversion snippets in
   `## Useful one-liners`.
3. Update the `images` array in `script.js` (works) or `objects.js` (store
   items).
4. Bump cache versions: `?v=N` on the script/css tags in the relevant HTML,
   and `ASSET_VERSION` in `objects.js` if an image filename was reused.
5. `git add . && git commit -m "..." && git push` → Cloudflare Pages
   auto-deploys in ~30s. Refresh — live.

Sandbox testing: keep using
`cd site && python3 -m http.server 4000 --bind 0.0.0.0` locally, exactly
as before. Deploy only when you're happy.

### How to roll back a bad deploy

Two options:
1. **Easiest:** `git revert HEAD && git push` — Cloudflare rebuilds the
   previous state. Clean history, no force-push.
2. **Cloudflare UI:** Pages → deployment history → click any past deploy
   → "Rollback to this deployment". Instant.

---

## Working on a new machine

The project is just a folder of plain text + images. Repo is already at
GitHub, so a fresh machine is just a clone.

### Setup on a new (macOS) machine

```sh
# 1. Prereqs. Python 3 + sips are built into macOS; only Pillow needs install.
pip3 install Pillow

# 2. Clone the repo wherever you want to keep it
mkdir -p ~/Documents/projects
cd ~/Documents/projects
git clone https://github.com/NOPLACENOCODE/digital-gallery.git noplacenotime
cd noplacenotime

# 3. Verify it runs locally
cd site
python3 -m http.server 4000
# open http://localhost:4000 in a browser — should match the live site.
```

### First push from the new machine

On first push, git will ask:
- **Username:** `NOPLACENOCODE`
- **Password:** a Personal Access Token (NOT your account password — GitHub
  removed password auth in 2021). Generate one at
  https://github.com/settings/tokens → *Generate new token (classic)* →
  scope **`repo`** → copy. macOS Keychain saves it after first use.

If multiple GitHub accounts are configured on the machine (e.g. a work
account already cached), set the remote URL with the username embedded so
git asks for the right credential:

```sh
git remote set-url origin https://NOPLACENOCODE@github.com/NOPLACENOCODE/digital-gallery.git
```

### Source originals (huge folders, not in git)

`artwork photos/`, `photos objects/`, `photos dude/`, `photos for site/`,
`random/` are listed in `.gitignore`. They're multi-GB of HEIC originals
and don't belong in the repo. The site renders without them; you only need
them on a new machine if you want to re-crop existing photos or process
new ones.

To move them between machines: zip + iCloud Drive / Dropbox / Google Drive
/ AirDrop. Drop the folders into the cloned `noplacenotime/` root —
they'll be ignored by git automatically.

### What's tied to a specific machine

Nothing in the site itself. The only paths in scripts are **relative**
(`./assets/...`). Conversion one-liners in this CONTEXT use **absolute**
paths inside `~/Desktop/...` purely for convenience — adjust to wherever
the project lives on the new machine.

Settings worth bringing over (optional):
- `git config --global user.name` / `user.email` for commits.
- Your editor of choice + keybindings.

---

## Contact

`mattia.vanzini@gmail.com` (assembled in code from parts to deter scrapers).
