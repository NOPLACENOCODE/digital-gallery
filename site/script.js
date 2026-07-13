/* Cache-busting for artwork images. Bump this whenever a PNG/JPG/WebP under
   assets/works/ is edited in place — it forces browsers to refetch. */
const ARTWORK_ASSET_VERSION = 140;
const vAsset = (url) => url ? `${url}?v=${ARTWORK_ASSET_VERSION}` : url;

/* Topbar/hero behavior — only present on the home page */
const topbar = document.querySelector('.topbar');
const hero = document.querySelector('.hero');
const topbarBtn = document.querySelector('.topbar-logo');

if (topbar && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      topbar.classList.toggle('is-visible', !entry.isIntersecting);
      topbar.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
    },
    { threshold: 0, rootMargin: '-40% 0px 0px 0px' }
  );
  observer.observe(hero);
}

if (topbarBtn) {
  topbarBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Easter egg: tap the spinning coin → metallic "tink" + a fast-spin burst
// that decelerates back to the normal rate.
const coin = document.querySelector('.coin');
if (coin) {
  let boostActive = false;
  coin.style.cursor = 'pointer';
  coin.addEventListener('click', () => {
    if (window.audioTink) window.audioTink();
    if (boostActive) return;
    boostActive = true;

    // Pause the CSS-driven continuous spin while the boost is running.
    coin.style.animation = 'none';

    // 4 rotations in 2.4s with an aggressive ease-out: rapid spins at the
    // start, decelerating toward the end so it blends back into the steady
    // 5s/turn animation without a visible jump.
    const boost = coin.animate(
      [
        { transform: 'rotateY(0deg)' },
        { transform: 'rotateY(1440deg)' },
      ],
      {
        duration: 2400,
        easing: 'cubic-bezier(0.15, 0.85, 0.25, 1)',
        iterations: 1,
        fill: 'none',
      }
    );

    boost.onfinish = () => {
      coin.style.animation = '';
      boostActive = false;
    };
  });
}

/* ---------- Artwork grid + modal ----------
   Dimensions are real-world cm (width × height).

   Each image entry can be either:
     - a string                                   → fits inside the frame, centered
     - { src, fit, position }
         fit: 'contain' (default) | 'cover'       'cover' fills the whole frame (no grey)
         position: any CSS object-position value  e.g. 'center top', '50% 30%'
   Example:
     images: [
       'assets/works/somni.jpg',
       { src: 'assets/works/somni-3.jpg', fit: 'cover' },
       { src: 'assets/works/somni-4.jpg', fit: 'contain', position: '50% 30%' },
     ],
*/
const works = [
  {
    slug: 'crucifixion',
    title: 'Crucifixion',
    year: 2026,
    width: 218, height: 150,
    materials: 'Spray paint, acrylic, airbrush, oil. Framed in oak.',
    price: '€3000',
    images: [
      'assets/works/crucifixion.jpg',
      'assets/works/crucifixion-3.jpg',
      'assets/works/crucifixion-4-zoom.jpg',
      'assets/works/crucifixion-5.jpg',
    ],
  },
  {
    slug: 'somni',
    title: 'Somni',
    year: 2026,
    width: 218, height: 135,
    materials: 'Spray, acrylic, airbrush, oil. Framed in oak.',
    price: '€3000',
    images: [
      'assets/works/somni-1.png',
      'assets/works/somni-2.jpg',
      'assets/works/somni-5.jpg',
      'assets/works/somni-zoom.jpg',
      'assets/works/somni-zoom-2.jpg',
    ],
  },
  {
    slug: 'caballo-maniaco',
    title: 'Un caballo maniaco un sabado cualquiera',
    year: 2025,
    width: 180, height: 130,
    materials: 'Spray paint, acrylic, oil',
    price: '€2400',
    soldOut: true,
    images: [
      'assets/works/caballo-maniaco.jpg',
      'assets/works/caballo-maniaco-1.webp',
      'assets/works/caballo-maniaco-2-zoom.webp',
      'assets/works/caballo-maniaco-3.webp',
      'assets/works/caballo-maniaco-5-zoom.webp',
    ],
  },
  {
    slug: 'caballo-deprimido',
    title: 'Un caballo deprimido un martes cualquiera',
    year: 2025,
    width: 180, height: 130,
    materials: 'Spray paint, acrylic, sand, oil',
    price: '€2000',
    images: [
      'assets/works/caballo-deprimido.jpg',
      'assets/works/caballo-deprimido-1.webp',
      'assets/works/caballo-deprimido-2.webp',
      'assets/works/caballo-deprimido-zoom-4.webp',
      'assets/works/caballo-deprimido-zoom-5.webp',
    ],
  },
  {
    slug: 'after-lillies',
    title: 'After Lillies',
    year: 2025,
    width: 100, height: 100,
    materials: 'Spray paint, acrylic',
    price: '€1000',
    images: [
      'assets/works/after-lillies.jpg',
      'assets/works/after-lillies-1.webp',
      'assets/works/after-lillies-2.webp',
      'assets/works/after-lillies-zoom-1.webp',
      'assets/works/after-lillies-zoom-2.webp',
    ],
  },
  {
    slug: 'apariciones-nocturnas',
    title: 'Apariciones nocturnas',
    year: 2025,
    width: 78, height: 118,
    materials: 'Spray paint, acrylic',
    price: '€800',
    maxHeight: '86%',
    images: [
      'assets/works/apariciones-nocturnas.jpg',
      'assets/works/apariciones-nocturnas-1.webp',
      'assets/works/apariciones-nocturnas-2.webp',
      'assets/works/apariciones-nocturnas-zoom-1.webp',
      'assets/works/apariciones-nocturnas-zoom-2.webp',
    ],
  },
  {
    slug: 'red-portal',
    title: 'Red Portal',
    year: 2025,
    width: 30, height: 40,
    materials: 'Spray paint, acrylic, mixed media on wood board',
    price: '€500',
    soldOut: true,
    images: [
      'assets/works/red-portal.jpg',
      'assets/works/red-portal-2.webp',
      'assets/works/red-portal-3.webp',
    ],
  },
  {
    slug: 'fake-plastic-flowers',
    title: 'Fake Plastic Flowers',
    year: 2025,
    width: 60, height: 40,
    materials: 'Spray paint, acrylic, mixed media on wood board',
    price: '€500',
    images: [
      { src: 'assets/works/fake-plastic-flowers.jpg', fit: 'tight' },
      'assets/works/fake-plastic-flowers-2.webp',
      'assets/works/fake-plastic-flowers-3.webp',
      'assets/works/fake-plastic-flowers-4.webp',
      'assets/works/fake-plastic-flowers-zoom-1.webp',
    ],
  },
  {
    slug: 'portal-al-cielo',
    title: 'Portal al cielo',
    year: 2024,
    width: 130, height: 180,
    materials: 'Spray paint, acrylic, egg tempera, oil',
    price: '€2200',
    images: [
      'assets/works/portal-al-cielo.jpg',
      'assets/works/portal-al-cielo-1.webp',
      'assets/works/portal-al-cielo-2.webp',
      'assets/works/portal-al-cielo-zoom-2.webp',
      'assets/works/portal-al-cielo-zoom-3.webp',
    ],
  },
  {
    slug: 'god-inside-me',
    title: 'Told me I’d find god inside me, couldn’t find shit',
    year: 2024,
    width: 135, height: 220,
    materials: 'Spray paint, acrylic',
    price: '€2000',
    maxHeight: '88%',
    images: ['assets/works/god-inside-me.jpg'],
  },
];

const grid = document.querySelector('.work-grid');
const modal = document.querySelector('.work-modal');

if (grid && modal) {
const modalScroller = modal.querySelector('.work-modal-scroller');
const modalClose = modal.querySelector('.work-modal-close');
const modalTitle = modal.querySelector('.work-modal-title');
const modalMeta = modal.querySelector('.work-modal-meta');
const modalThumbs = modal.querySelector('.work-modal-thumbs');
const modalDots = modal.querySelector('.work-modal-dots');
const modalInquire = modal.querySelector('.work-modal-inquire');

// Built from parts so simple email scrapers don't grab it from page source.
const inquireEmail = ['mattia.vanzini', 'gmail.com'].join('@');

works.forEach((work) => {
  const tile = document.createElement('button');
  tile.className = 'work-tile';
  tile.setAttribute('role', 'listitem');
  tile.setAttribute('aria-label', `Open ${work.title}`);

  const frame = document.createElement('div');
  frame.className = 'work-tile-frame';
  if (work.images[0]) {
    // images[0] can be a string OR an object {src, fit, ...} — handle both.
    const cover = work.images[0];
    const coverSrc = typeof cover === 'string' ? cover : cover.src;
    const img = document.createElement('img');
    img.src = vAsset(coverSrc);
    img.alt = work.title;
    img.loading = 'lazy';
    frame.appendChild(img);
  }

  const title = document.createElement('div');
  title.className = 'work-tile-title';
  title.textContent = `“${work.title.toUpperCase()}”`;

  const price = document.createElement('div');
  price.className = 'work-tile-price';
  price.textContent = work.soldOut ? 'SOLD' : work.price;

  tile.append(frame, title, price);
  tile.addEventListener('click', () => openWork(work));
  grid.appendChild(tile);
});

let activeWork = null;

function setActiveThumb(idx) {
  Array.from(modalThumbs.children).forEach((el, i) => {
    el.classList.toggle('is-active', i === idx);
  });
  if (modalDots) {
    Array.from(modalDots.children).forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
    });
  }
}

function openWork(work) {
  activeWork = work;
  modalScroller.innerHTML = '';
  modalThumbs.innerHTML = '';
  if (modalDots) modalDots.innerHTML = '';
  const slides = (work.images.length ? work.images : [null]).slice();
  // TEMP: pad to at least 2 images so every modal shows the thumbnail strip.
  if (slides.length < 2) slides.push(null);

  const items = slides.map((entry, i) => {
    if (entry == null) return { src: null };
    const item = typeof entry === 'string' ? { src: entry } : { ...entry };
    // Auto-default: any filename containing "zoom" fills the whole frame.
    if (item.src && !item.fit && /zoom/i.test(item.src)) item.fit = 'cover';
    // Auto-default: alternate views (not the first/official shot) fill height
    // with no top/bottom grey — only side grey. The first image keeps the
    // framed presentation (large grey margins all around).
    if (item.src && !item.fit && i > 0) item.fit = 'tight';
    return item;
  });

  const orientation = work.height > work.width ? 'is-vertical' : 'is-horizontal';
  // Mirror the orientation on the scroller so CSS can size the slide area
  // differently for horizontal vs vertical works (e.g. shorter slides for
  // horizontal paintings so the thumbnail strip fits on mobile).
  modalScroller.classList.toggle('is-vertical-work', orientation === 'is-vertical');
  modalScroller.classList.toggle('is-horizontal-work', orientation === 'is-horizontal');

  items.forEach((item, i) => {
    const slide = document.createElement('div');
    const fit = item.fit || 'contain';
    slide.className = `work-slide fit-${fit} ${orientation}` + (item.src ? '' : ' placeholder');
    if (item.src) {
      const img = document.createElement('img');
      img.src = vAsset(item.src);
      img.alt = `${work.title} — ${i + 1}`;
      img.loading = i === 0 ? 'eager' : 'lazy';
      if (item.position) img.style.objectPosition = item.position;
      if (work.maxHeight && fit === 'contain') img.style.maxHeight = work.maxHeight;
      if (work.shiftY && fit === 'contain') img.style.transform = `translateY(${work.shiftY})`;
      slide.appendChild(img);
    }
    modalScroller.appendChild(slide);
  });

  if (items.length > 1 && modalDots) {
    items.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('is-active');
      modalDots.appendChild(dot);
    });
  }

  if (items.length > 1) {
    items.forEach((item, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'work-thumb' + (i === 0 ? ' is-active' : '');
      thumb.setAttribute('aria-label', `Show image ${i + 1}`);
      if (item.src) {
        const img = document.createElement('img');
        img.src = vAsset(item.src);
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      }
      thumb.addEventListener('click', () => {
        // Smooth scroll only between adjacent slides — for further jumps the
        // sliding-blur looks bad, so we snap instantly. The scroller has
        // CSS `scroll-behavior: smooth`, so we must temporarily override it
        // inline to get a truly instant jump.
        const target = modalScroller.clientWidth * i;
        const current = Math.round(modalScroller.scrollLeft / modalScroller.clientWidth);
        const adjacent = Math.abs(i - current) <= 1;
        if (adjacent) {
          modalScroller.scrollTo({ left: target, behavior: 'smooth' });
        } else {
          modalScroller.style.scrollBehavior = 'auto';
          modalScroller.scrollLeft = target;
          requestAnimationFrame(() => { modalScroller.style.scrollBehavior = ''; });
        }
      });
      modalThumbs.appendChild(thumb);
    });
  }

  modalTitle.textContent = work.title;
  modalMeta.textContent = [
    work.year,
    work.materials,
    `${work.width} × ${work.height} cm`,
    work.soldOut ? 'SOLD' : work.price,
  ].join('\n');

  // Wire the Inquire button — pre-fills subject + body for this painting.
  // Hidden when the work is sold (the meta already shows "SOLD").
  if (modalInquire) {
    modalInquire.hidden = !!work.soldOut;
    if (!work.soldOut) {
      modalInquire.textContent = 'Inquire';
      modalInquire.classList.remove('is-soldout');
      const subject = `Inquiry — ${work.title}`;
      const body =
        `Hi Mattia,\n\n` +
        `I'm interested in "${work.title}" (${work.price}).\n\n` +
        `– Where I'm writing from:\n` +
        `– How I'd like to receive it (shipping / pickup in your studio):\n` +
        `– Anything else you'd like to know:\n\n` +
        `Thanks!`;
      modalInquire.href =
        `mailto:${inquireEmail}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalScroller.scrollLeft = 0;
  modal.scrollTop = 0;

  // Push a history entry so the browser/OS back gesture closes the modal
  // instead of navigating away from the page.
  history.pushState({ modal: work.slug }, '');
}

// `silent` skips the history.back() call — used when popstate already moved us back.
function closeWork(silent) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  activeWork = null;
  // Drop focus from the originating tile so the :focus-visible outline
  // doesn't linger after closing via ESC (keyboard input upgrades the
  // tile's focus ring, even though the user opened the modal by click).
  const active = document.activeElement;
  if (active && active.classList && active.classList.contains('work-tile')) {
    active.blur();
  }
  if (!silent && history.state && history.state.modal) {
    history.back();
  }
}

window.addEventListener('popstate', () => {
  if (modal.classList.contains('is-open')) closeWork(true);
});

modalClose.addEventListener('click', () => closeWork());

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeWork();  // hits the !silent path, pops history
  if (e.key === 'ArrowRight') modalScroller.scrollBy({ left: modalScroller.clientWidth, behavior: 'smooth' });
  if (e.key === 'ArrowLeft') modalScroller.scrollBy({ left: -modalScroller.clientWidth, behavior: 'smooth' });
});

/* When the user pinch-zooms the page, panning the zoomed view shouldn't
   trigger the horizontal scroll-snap (which would skip to the next image).
   Toggle a class that disables snap and overflow while zoomed. */
if (window.visualViewport) {
  const vv = window.visualViewport;
  const updateZoom = () => {
    if (!modal.classList.contains('is-open')) return;
    modalScroller.classList.toggle('is-zoomed', vv.scale > 1.05);
  };
  vv.addEventListener('resize', updateZoom);
  vv.addEventListener('scroll', updateZoom);
}

let scrollRaf = 0;
modalScroller.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollRaf);
  scrollRaf = requestAnimationFrame(() => {
    if (!activeWork) return;
    const slides = modalScroller.children.length;
    if (!slides) return;
    const idx = Math.round(modalScroller.scrollLeft / modalScroller.clientWidth);
    setActiveThumb(idx);
  });
});

} // end: if (grid && modal)
