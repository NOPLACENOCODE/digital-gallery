(function () {
  // ── COMING SOON GUARD ──────────────────────────────────────────────────────
  // To re-enable the objects page: delete the one-line inline script in
  // objects.html that sets window.OBJECTS_COMING_SOON = true. Nothing else.
  if (window.OBJECTS_COMING_SOON) {
    const main = document.querySelector("main");
    if (main) main.innerHTML = `
      <section class="section" style="
        display:flex;align-items:center;justify-content:center;
        min-height:60vh;padding-top:4rem">
        <p style="
          font-family:var(--font-serif);font-size:1.4rem;
          letter-spacing:.02em;color:#bbb">
          Coming soon
        </p>
      </section>`;
    return;
  }
  // ── END COMING SOON GUARD ──────────────────────────────────────────────────


/* ---------- Object catalog ----------
   Each object is something for sale. The figure wears one item per category
   at a time (last-added wins), so categorize each item carefully.

   To swap a placeholder for a real drawing, drop a PNG into
   `assets/objects/` and set `image` (grid thumbnail) and `layer`
   (full-figure-size transparent PNG). Until then, the emoji placeholder
   is used at the position given by `placeholderPos`.

   Bump ASSET_VERSION whenever a PNG is updated — it busts browser cache.
*/
const ASSET_VERSION = 187;
const v = (url) => url ? `${url}?v=${ASSET_VERSION}` : url;
const objects = [
  {
    id: 'wallet',
    category: 'wallet',
    name: 'Somni Wallet',
    price: 200,
    soldOut: true,
    image: 'assets/objects/wallet-1.webp',
    imageFit: 'cover',
    layer: 'assets/objects/wallet-layer.png',
    images: [
      { src: 'assets/objects/wallet-1.webp', fit: 'cover' },
      { src: 'assets/objects/wallet-0.webp', fit: 'cover' },
      'assets/objects/wallet-2.webp',
      { src: 'assets/objects/wallet-3.webp', fit: 'cover' },
      { src: 'assets/objects/wallet-4.webp', fit: 'cover' },
      'assets/objects/wallet-5.webp',
    ],
    description:
      'Hand made black leather wallet, sourced locally in Spain. Painted and ' +
      'tattooed by hand with leather paint, then sealed with protective coats. ' +
      '1/1.',
  },
  {
    id: 'necklace',
    category: 'necklace',
    name: 'Bronze Talisman',
    price: 400,
    image: 'assets/objects/necklace-1.webp',
    imageFit: 'cover',
    layer: 'assets/objects/necklace-layer.png',
    images: [
      { src: 'assets/objects/necklace-1.webp', fit: 'cover' },
      { src: 'assets/objects/necklace-2.webp', fit: 'cover' },
      { src: 'assets/objects/necklace-3.webp', fit: 'cover', position: 'center bottom' },
      { src: 'assets/objects/necklace-4.webp', fit: 'cover' },
      { src: 'assets/objects/necklace-5.webp', fit: 'cover', position: 'center 70%' },
      { src: 'assets/objects/necklace-6.webp', fit: 'cover' },
      { src: 'assets/objects/necklace-7.webp', fit: 'cover' },
    ],
    description:
      'Collaboration with Snailboy. Relic based on a sculpture of the ' +
      'Mexica goddess Tlaltecuhtli, devourer of skies and flesh. Hand made ' +
      'bronze encasing an oil painting. 1/1.',
  },
];

/* ---------- Cart state (persisted in localStorage) ---------- */

const STORAGE_KEY = 'noplacenotime-cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    // Filter out any IDs that no longer exist in the catalog.
    const validIds = new Set(objects.map((o) => o.id));
    return arr.filter((id) => validIds.has(id));
  } catch (e) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function addItem(id) {
  cart.push(id);
  saveCart();
  render();
  if (window.audioBlip) window.audioBlip();
}

function removeOne(id) {
  const idx = cart.lastIndexOf(id);
  if (idx >= 0) {
    cart.splice(idx, 1);
    saveCart();
    render();
    if (window.audioBlop) window.audioBlop();
  }
}

function toggleItem(id) {
  if (cart.includes(id)) removeOne(id);
  else addItem(id);
}

/* ---------- DOM lookups ---------- */

const grid = document.querySelector('.objects-grid');
const bgEl = document.querySelector('.objects-bg');
const cartContainer = document.querySelector('.objects-cart');
// Plurals — both the inline (desktop) and modal (mobile) versions exist in
// the DOM and stay in sync on every render.
const cartCountEls = document.querySelectorAll('.objects-cart-count, .cart-fab-count');
const cartItemsEls = document.querySelectorAll('.cart-items');
const cartTotalEls = document.querySelectorAll('.cart-total');
const cartCheckoutBtns = document.querySelectorAll('.cart-checkout');
const cartFab = document.querySelector('.cart-fab');
const cartModal = document.querySelector('.cart-modal');
const cartModalClose = document.querySelector('.cart-modal-close');

/* ---------- Render the product grid (once) ---------- */

function buildTile(obj) {
  const tile = document.createElement('div');
  tile.className = 'object-tile';

  const frame = document.createElement('div');
  frame.className = 'object-tile-frame';
  if (obj.imageFit === 'cover') frame.classList.add('is-cover');
  if (obj.image) {
    const img = document.createElement('img');
    img.src = v(obj.image);
    img.alt = obj.name;
    img.loading = 'lazy';
    frame.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.className = 'object-tile-placeholder';
    span.textContent = obj.placeholderEmoji || '◻︎';
    frame.appendChild(span);
  }
  if (obj.soldOut) {
    const badge = document.createElement('div');
    badge.className = 'sold-badge';
    badge.textContent = 'SOLD OUT';
    frame.appendChild(badge);
  }
  tile.appendChild(frame);

  const bottom = document.createElement('div');
  bottom.className = 'object-tile-bottom';

  const meta = document.createElement('div');
  meta.className = 'object-tile-meta';

  const name = document.createElement('div');
  name.className = 'object-tile-name';
  name.textContent = obj.name;
  meta.appendChild(name);

  const price = document.createElement('div');
  price.className = 'object-tile-price';
  price.textContent = `€${obj.price}`;
  meta.appendChild(price);

  bottom.appendChild(meta);

  if (!obj.soldOut) {
    const btn = document.createElement('button');
    btn.className = 'object-toggle';
    btn.type = 'button';
    btn.dataset.id = obj.id;
    btn.textContent = 'ADD';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleItem(obj.id);
    });
    bottom.appendChild(btn);
  }

  tile.appendChild(bottom);

  // Tapping anywhere on the tile (except the ADD button) opens the detail
  // view. Frame and name are the natural targets.
  frame.style.cursor = 'pointer';
  frame.addEventListener('click', () => openDetail(obj.id));
  name.style.cursor = 'pointer';
  name.addEventListener('click', () => openDetail(obj.id));

  return tile;
}

const moreScroller = document.querySelector('.cart-modal-more-scroller');
objects.forEach((obj) => {
  grid.appendChild(buildTile(obj));
  if (moreScroller) moreScroller.appendChild(buildTile(obj));
});

/* ---------- Render figure layers ---------- */

function buildFigureContent(figureEl) {
  figureEl.innerHTML = `
    <img class="objects-figure-base" src="${v('assets/objects/dude.png')}" alt="" />
  `;
}

function renderFigureLayers() {
  // Determine which item to show per category (last-added wins).
  const lastByCategory = new Map();
  cart.forEach((id) => {
    const obj = objects.find((o) => o.id === id);
    if (obj) lastByCategory.set(obj.category, obj);
  });

  document.querySelectorAll('[data-figure]').forEach((figureEl) => {
    buildFigureContent(figureEl);

    lastByCategory.forEach((obj) => {
      if (obj.layer) {
        const img = document.createElement('img');
        img.className = 'objects-figure-layer';
        img.src = v(obj.layer);
        img.alt = '';
        figureEl.appendChild(img);
      } else if (obj.placeholderEmoji) {
        const span = document.createElement('span');
        span.className = 'objects-figure-layer objects-figure-layer-emoji';
        span.style.left = (obj.placeholderPos?.x ?? 50) + '%';
        span.style.top = (obj.placeholderPos?.y ?? 50) + '%';
        span.textContent = obj.placeholderEmoji;
        figureEl.appendChild(span);
      }
    });
  });
}

/* ---------- Render the rest (buttons, cart count, summary) ---------- */

function render() {
  // Toggle button labels (skip sold-out buttons — they stay as SOLD)
  document.querySelectorAll('.object-toggle').forEach((btn) => {
    if (btn.disabled) return;
    const id = btn.dataset.id;
    if (cart.includes(id)) {
      btn.textContent = 'REMOVE';
      btn.classList.add('is-added');
    } else {
      btn.textContent = 'ADD';
      btn.classList.remove('is-added');
    }
  });

  // Cart count badges (inline icon + mobile fab)
  cartCountEls.forEach((el) => {
    if (cart.length > 0) {
      el.textContent = String(cart.length);
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  // Group cart by id, preserving order of first appearance.
  const order = [];
  const counts = new Map();
  cart.forEach((id) => {
    if (!counts.has(id)) order.push(id);
    counts.set(id, (counts.get(id) || 0) + 1);
  });

  // Compute total once
  let total = 0;
  order.forEach((id) => {
    const obj = objects.find((o) => o.id === id);
    if (obj) total += obj.price * counts.get(id);
  });

  // Populate every cart items list (inline + modal)
  cartItemsEls.forEach((listEl) => {
    listEl.innerHTML = '';
    order.forEach((id) => {
      const obj = objects.find((o) => o.id === id);
      if (!obj) return;
      const qty = counts.get(id);
      const lineTotal = obj.price * qty;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <span class="cart-item-qty">${qty}×</span>
        <span class="cart-item-name">${obj.name}</span>
        <span class="cart-item-sep">—</span>
        <span class="cart-item-price">€${lineTotal}</span>
        <button class="cart-item-remove" type="button" aria-label="Remove one ${obj.name}">−</button>
      `;
      li.querySelector('.cart-item-remove').addEventListener('click', () => removeOne(id));
      listEl.appendChild(li);
    });
  });

  // Populate every total + toggle every checkout disabled state
  cartTotalEls.forEach((el) => {
    el.textContent = total > 0 ? `Total — €${total}` : '';
  });
  cartCheckoutBtns.forEach((btn) => {
    btn.disabled = total === 0;
  });

  // Hide everything-but-bag when cart is empty
  if (cartContainer) {
    cartContainer.toggleAttribute('data-cart-empty', cart.length === 0);
  }

  // Refresh figure layers everywhere
  renderFigureLayers();

  updateBackground();

  // If the detail view is open for an item, keep its ADD/REMOVE button in
  // sync with the cart state (defined later in this file).
  if (typeof syncDetailToggle === 'function') syncDetailToggle();
}

/* ---------- Checkout via mailto ---------- */

// Both the inline Check Out and the mobile "GO TO CHECKOUT" fire the same
// mailto. Bind the handler to every .cart-checkout.
cartCheckoutBtns.forEach((btn) => btn.addEventListener('click', () => {
  if (cart.length === 0) return;
  if (window.audioKaching) window.audioKaching();

  const order = [];
  const counts = new Map();
  cart.forEach((id) => {
    if (!counts.has(id)) order.push(id);
    counts.set(id, (counts.get(id) || 0) + 1);
  });

  let total = 0;
  const lines = order
    .map((id) => {
      const obj = objects.find((o) => o.id === id);
      if (!obj) return null;
      const qty = counts.get(id);
      total += obj.price * qty;
      return `${qty}× ${obj.name} — €${obj.price * qty}`;
    })
    .filter(Boolean);

  const subject = 'Order — noplace_notime objects';
  const body =
    `Hi Mattia,\n\n` +
    `I'd like to order:\n` +
    lines.join('\n') +
    `\n\nTotal: €${total}\n\n` +
    `– Where I'm writing from:\n` +
    `– Shipping address:\n` +
    `– Anything else:\n\n` +
    `Thanks!`;

  // Email built from parts so it isn't trivially scraped.
  const email = ['mattia.vanzini', 'gmail.com'].join('@');
  window.location.href =
    `mailto:${email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}));

/* ---------- Mobile cart modal (open/close) ---------- */

function openCartModal() {
  if (!cartModal) return;
  cartModal.classList.add('is-open');
  cartModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  history.pushState({ cartmodal: true }, '');
}

function closeCartModal(silent) {
  if (!cartModal) return;
  cartModal.classList.remove('is-open');
  cartModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (!silent && history.state && history.state.cartmodal) history.back();
}

if (cartFab) cartFab.addEventListener('click', openCartModal);
if (cartModalClose) cartModalClose.addEventListener('click', () => closeCartModal());

window.addEventListener('popstate', () => {
  if (cartModal && cartModal.classList.contains('is-open')) closeCartModal(true);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartModal && cartModal.classList.contains('is-open')) closeCartModal();
});

/* ---------- Right-panel background ----------
   Priority: (1) the item being viewed in detail, if any. Otherwise (2) the
   most recently added cart item that declares a `background`. Otherwise no
   background (the panel fades back to white). */

function updateBackground() {
  if (!bgEl) return;
  let activeBg = null;
  if (typeof activeDetailId !== 'undefined' && activeDetailId) {
    const obj = objects.find((o) => o.id === activeDetailId);
    if (obj && obj.background) activeBg = obj.background;
  }
  if (!activeBg) {
    cart.forEach((id) => {
      const obj = objects.find((o) => o.id === id);
      if (obj && obj.background) activeBg = obj.background;
    });
  }
  if (activeBg) {
    bgEl.style.backgroundImage = `url("${v(activeBg)}")`;
    bgEl.classList.add('is-active');
  } else {
    bgEl.classList.remove('is-active');
  }
}

/* ---------- Item detail view ----------
   Swaps in for the items grid in the left column (the dude on the right
   stays fixed). Uses history.pushState so the browser back button closes it. */

const detailEl = document.querySelector('.object-detail');
const sectionTitle = document.querySelector('.objects-section > h2');
const detailMainImage = detailEl.querySelector('.object-detail-main-image');
const detailThumbs = detailEl.querySelector('.object-detail-thumbs');
const detailName = detailEl.querySelector('.object-detail-name');
const detailPrice = detailEl.querySelector('.object-detail-price');
const detailToggle = detailEl.querySelector('.object-detail-toggle');
const detailDescription = detailEl.querySelector('.object-detail-description');

let activeDetailId = null;

function openDetail(id) {
  const obj = objects.find((o) => o.id === id);
  if (!obj) return;
  activeDetailId = id;

  // Build the image gallery: one big main image, plus a row of thumbnails
  // beneath it (only shown when there's more than one image). Each entry can
  // be a plain string or `{src, fit}`. fit: 'cover' fills the slide edge to
  // edge (no grey margin) — same pattern as the artwork modal's zoom images.
  const rawImgs = Array.isArray(obj.images) && obj.images.length
    ? obj.images
    : [obj.image].filter(Boolean);
  const imgs = rawImgs.map((it) =>
    typeof it === 'string' ? { src: it, fit: 'contain' } : { fit: 'contain', ...it }
  );
  const applyMain = (entry) => {
    detailMainImage.src = v(entry.src);
    detailMainImage.classList.toggle('is-cover', entry.fit === 'cover');
    detailMainImage.style.objectPosition = entry.position || '';
  };
  if (imgs[0]) applyMain(imgs[0]);
  detailMainImage.alt = obj.name;
  detailThumbs.innerHTML = '';
  if (imgs.length > 1) {
    imgs.forEach((entry, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'object-detail-thumb' + (i === 0 ? ' is-active' : '');
      thumb.setAttribute('aria-label', `Show image ${i + 1}`);
      const tImg = document.createElement('img');
      tImg.src = v(entry.src);
      tImg.alt = '';
      thumb.appendChild(tImg);
      thumb.addEventListener('click', () => {
        applyMain(entry);
        detailThumbs.querySelectorAll('.object-detail-thumb').forEach((t, j) => {
          t.classList.toggle('is-active', i === j);
        });
      });
      detailThumbs.appendChild(thumb);
    });
  }

  detailName.textContent = obj.name;
  detailPrice.textContent = `€${obj.price}`;
  detailDescription.textContent = obj.description || '';
  detailDescription.hidden = !obj.description;

  syncDetailToggle();

  grid.hidden = true;
  detailEl.hidden = false;
  detailEl.setAttribute('aria-hidden', 'false');
  if (sectionTitle) sectionTitle.hidden = true;
  updateBackground();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  history.pushState({ detail: id }, '');
}

// `silent` skips history.back() — used when popstate already moved us back.
function closeDetail(silent) {
  activeDetailId = null;
  detailEl.hidden = true;
  detailEl.setAttribute('aria-hidden', 'true');
  grid.hidden = false;
  if (sectionTitle) sectionTitle.hidden = false;
  updateBackground();
  if (!silent && history.state && history.state.detail) history.back();
}

function syncDetailToggle() {
  if (!activeDetailId) return;
  const obj = objects.find((o) => o.id === activeDetailId);
  if (obj && obj.soldOut) {
    detailToggle.textContent = 'SOLD OUT';
    detailToggle.disabled = true;
    detailToggle.classList.add('is-soldout');
    detailToggle.classList.remove('is-added');
    return;
  }
  detailToggle.classList.remove('is-soldout');
  detailToggle.disabled = false;
  if (cart.includes(activeDetailId)) {
    detailToggle.textContent = 'REMOVE FROM CART';
    detailToggle.classList.add('is-added');
  } else {
    detailToggle.textContent = 'ADD TO CART';
    detailToggle.classList.remove('is-added');
  }
}

detailToggle.addEventListener('click', () => {
  if (activeDetailId) toggleItem(activeDetailId);
});

window.addEventListener('popstate', () => {
  if (!detailEl.hidden) closeDetail(true);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !detailEl.hidden) closeDetail();
});

/* ---------- Initial render ---------- */

render();
})();
