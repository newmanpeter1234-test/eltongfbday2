/* ============================================================================
   scenes.js — Turns birthdayConfig into beautiful, semantic markup.
   A Velvet Editorial · For Anziya
   ========================================================================== */

const Scenes = (function () {

  /* ── tiny helpers ─────────────────────────────────────────────────────── */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setText(sel, text) {
    const n = document.querySelector(sel);
    if (n) n.textContent = text == null ? '' : text;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* A word that starts and ends with * becomes italic — e.g. "my *favorite*" */
  function wordHTML(word) {
    const m = word.match(/^\*(.+)\*$/);
    return m ? '<em>' + esc(m[1]) + '</em>' : esc(word);
  }

  /* Word-by-word masked type — the backbone of the kinetic reveals. */
  function splitWords(text) {
    return String(text || '')
      .split(/\s+/)
      .filter(Boolean)
      .map(function (word) {
        return '<span class="w"><span class="w__i">' + wordHTML(word) + '</span></span>';
      })
      .join(' ');
  }

  /* Character-by-character hero name, each letter taking a slice of one gradient. */
  function splitName(name) {
    const letters = String(name).replace(/\s+/g, '');
    const n = letters.length;
    let idx = 0;
    return String(name).split('').map(function (ch) {
      if (ch === ' ') return '<span class="char-mask"><span class="char">&nbsp;</span></span>';
      const pct = n > 1 ? (idx / (n - 1)) * 100 : 50;
      idx++;
      return '<span class="char-mask"><span class="char" style="background-size:' + (n * 100) +
        '% 100%;background-position:' + pct.toFixed(3) + '% 50%">' + esc(ch) + '</span></span>';
    }).join('');
  }

  /* Derive a responsive WebP set from assets/photos/photoNN.jpg */
  function photoSet(path) {
    const m = String(path).match(/^(.*\/)photo(\d+)\.(?:jpe?g|png)$/i);
    if (!m) return null;
    const dir = m[1], base = 'photo' + m[2];
    return {
      src: dir + 'opt/' + base + '-1000.webp',
      srcset: [
        dir + 'opt/' + base + '-520.webp 520w',
        dir + 'opt/' + base + '-1000.webp 1000w',
        dir + 'opt/' + base + '-1600.webp 1600w'
      ].join(', '),
      fallback: path
    };
  }

  function posterSet(path) {
    if (!/\.(jpe?g|png)$/i.test(path)) return null;
    const webp = path.replace(/\.(jpe?g|png)$/i, '.webp');
    if (webp === path) return null;
    return { src: webp, srcset: '', fallback: path };
  }

  function mkImg(opts) {
    const img = el('img');
    img.alt = opts.alt || '';
    img.decoding = 'async';
    img.loading = opts.loading || 'lazy';
    if (opts.w) img.width = opts.w;
    if (opts.h) img.height = opts.h;
    if (opts.sizes) img.sizes = opts.sizes;
    if (opts.fetchpriority) img.setAttribute('fetchpriority', opts.fetchpriority);
    if (opts.cursor) img.setAttribute('data-cursor', opts.cursor);
    if (opts.set && opts.set.srcset) {
      img.addEventListener('error', function () {
        if (img.dataset.fb) return;
        img.dataset.fb = '1';
        img.removeAttribute('srcset');
        img.src = opts.set.fallback || opts.set.src;
      }, { once: true });
      img.srcset = opts.set.srcset;
    }
    img.src = (opts.set && opts.set.src) || opts.src;
    return img;
  }

  /* ── the velvet gift (SVG) ────────────────────────────────────────────── */
  let giftSeq = 0;
  function gift() {
    const u = 'gift' + (++giftSeq) + '-';
    const g = el('div', 'gift');
    g.innerHTML =
      '<div class="gift__aura"></div>' +
      '<div class="gift__beam"></div>' +
      '<svg class="gift__svg" viewBox="0 0 200 200" role="img" aria-label="A wrapped velvet gift box">' +
        '<defs>' +
          '<linearGradient id="' + u + 'l" x1="0" y1="0" x2=".6" y2="1">' +
            '<stop offset="0" stop-color="#360c23"/><stop offset="1" stop-color="#12030b"/></linearGradient>' +
          '<linearGradient id="' + u + 'r" x1="1" y1="0" x2=".4" y2="1">' +
            '<stop offset="0" stop-color="#4a1232"/><stop offset="1" stop-color="#1a0511"/></linearGradient>' +
          '<linearGradient id="' + u + 't" x1=".2" y1="0" x2=".8" y2="1">' +
            '<stop offset="0" stop-color="#5a183d"/><stop offset=".6" stop-color="#3b0f27"/><stop offset="1" stop-color="#240717"/></linearGradient>' +
          '<linearGradient id="' + u + 'rib" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#faecd8"/><stop offset=".4" stop-color="#e7a0b6"/><stop offset="1" stop-color="#b4556f"/></linearGradient>' +
          '<radialGradient id="' + u + 'glow">' +
            '<stop offset="0" stop-color="#fff5f8" stop-opacity=".98"/>' +
            '<stop offset=".5" stop-color="#f8d4df" stop-opacity=".65"/>' +
            '<stop offset="1" stop-color="#e7a0b6" stop-opacity="0"/></radialGradient>' +
          '<clipPath id="' + u + 'mouth"><polygon points="100,47 174.5,90 100,133 25.5,90"/></clipPath>' +
        '</defs>' +

        '<g class="gift__box">' +
          '<polygon class="g-face" fill="url(#' + u + 'l)" points="25.5,90 100,133 100,191 25.5,148"/>' +
          '<polygon class="g-face" fill="url(#' + u + 'r)" points="174.5,90 100,133 100,191 174.5,148"/>' +
          '<polygon class="g-mouth" points="100,47 174.5,90 100,133 25.5,90"/>' +
          '<g clip-path="url(#' + u + 'mouth)">' +
            '<ellipse class="gift__glow" cx="100" cy="92" rx="60" ry="30" fill="url(#' + u + 'glow)"/>' +
          '</g>' +
          '<polygon class="g-rib" fill="url(#' + u + 'rib)" points="58.4,109 67.1,114 67.1,172 58.4,167"/>' +
          '<polygon class="g-rib" fill="url(#' + u + 'rib)" points="141.6,109 132.9,114 132.9,172 141.6,167"/>' +
        '</g>' +

        '<g class="gift__lid">' +
          '<polygon class="g-face" fill="url(#' + u + 'l)" points="16.9,72 100,120 100,138 16.9,90"/>' +
          '<polygon class="g-face" fill="url(#' + u + 'r)" points="183.1,72 100,120 100,138 183.1,90"/>' +
          '<polygon class="g-face" fill="url(#' + u + 't)" points="100,24 183.1,72 100,120 16.9,72"/>' +
          '<polygon class="g-rib" fill="url(#' + u + 'rib)" points="137.2,45.5 145.9,50.5 62.8,98.5 54.1,93.5"/>' +
          '<polygon class="g-rib" fill="url(#' + u + 'rib)" points="62.8,45.5 54.1,50.5 137.2,98.5 145.9,93.5"/>' +
          '<g class="gift__bow">' +
            '<path class="g-loop" d="M100 71 C86 59 66 61 70 71 C73 79 90 78 100 71 Z"/>' +
            '<path class="g-loop" d="M100 71 C114 59 134 61 130 71 C127 79 110 78 100 71 Z"/>' +
            '<path class="g-tail" d="M100 73 C97 81 90 87 83 91"/>' +
            '<path class="g-tail" d="M100 73 C103 81 110 87 117 91"/>' +
            '<ellipse class="gift__knot" cx="100" cy="71" rx="5.6" ry="4.2"/>' +
          '</g>' +
        '</g>' +
      '</svg>' +
      '<div class="gift__shadow"></div>';
    return g;
  }

  /* ── chrome ───────────────────────────────────────────────────────────── */
  function chrome(cfg) {
    const meta = cfg.meta || {};
    const mono = document.querySelector('.hud__mono');
    if (mono && meta.monogram) {
      mono.innerHTML = esc(meta.monogram).replace(/♡/g, '<i>♡</i>');
    }
    setText('.hud__for', meta.forName || ('For ' + cfg.name));
    setText('.intro__side--r', (meta.monogram || 'E ♡ A') + ' · ' + (meta.edition || '08 · XI'));
    setText('.loader__label', (meta.loaderLabel || 'A birthday story for ' + cfg.name));
    const loadMono = document.querySelector('.loader__mono');
    if (loadMono && meta.monogram) {
      loadMono.innerHTML = esc(meta.monogram).replace(/♡/g, '<i>♡</i>');
    }
  }

  /* ── 01 · intro ───────────────────────────────────────────────────────── */
  function opening(cfg) {
    setText('#introWhisper', cfg.opening.whisper);
    document.getElementById('introGift').append(gift());
    const hint = document.querySelector('#introHint .tap-hint__text');
    if (hint) hint.textContent = cfg.opening.hint;
    document.getElementById('openGift').setAttribute('aria-label', cfg.opening.hint);
    setText('#skipIntro', cfg.opening.skip);
  }

  /* ── 02 · hero ────────────────────────────────────────────────────────── */
  function hero(cfg) {
    const h = cfg.hero || {};
    const name = document.getElementById('heroName');
    if (name) {
      name.setAttribute('aria-label', cfg.name);
      name.innerHTML = '<span aria-hidden="true">' + splitName(cfg.name) + '</span>';
    }
    const eyebrow = document.getElementById('heroEyebrow');
    if (eyebrow) eyebrow.innerHTML = splitWords(h.eyebrow || 'Happy Birthday');

    setText('#heroDate', h.date || 'November 8');
    setText('#heroLine', h.line || '');
    setText('#heroScroll', h.scrollHint || 'Scroll slowly');
    setText('#heroByline', h.metaLeft || '');
    setText('#heroMetaRight', h.metaRight || '');
    setText('.intro__whisper', cfg.opening.whisper);
  }

  /* ── chapters ─────────────────────────────────────────────────────────── */
  function chapter(host, data, opts) {
    if (!host || !data) return;
    opts = opts || {};
    host.classList.add('chapter');
    if (opts.variant === 'split') host.classList.add('chapter--split');
    if (opts.variant === 'memories') host.classList.add('chapter--memories');

    const inner = el('div', 'chapter__inner');
    const ghost = el('span', 'chapter__ghost', opts.number || '');
    ghost.setAttribute('aria-hidden', 'true');

    const head = el('div', 'chapter__head');
    head.append(el('p', 'chapter__label', data.label || ''));
    const title = el('h2', 'chapter__title');
    title.innerHTML = splitWords(data.title || '');
    head.append(title);

    const aside = el('div', 'chapter__aside');
    if (data.note) aside.append(el('p', 'chapter__note', data.note));
    if (data.count) aside.append(el('span', 'chapter__count', data.count));

    inner.append(ghost, head, aside);
    host.append(inner);
  }

  /* ── 03 · gallery ─────────────────────────────────────────────────────── */
  function ratioClass(w, h) {
    const ar = (w && h) ? (w / h) : 1;
    if (ar < 0.68) return 'panel--tall';
    if (ar < 0.92) return 'panel--portrait';
    if (ar <= 1.2) return 'panel--square';
    if (ar < 1.55) return 'panel--landscape';
    return 'panel--wide';
  }

  function memories(cfg) {
    const track = document.getElementById('galleryTrack');
    if (!track || !cfg.photos) return;

    const total = cfg.photos.length;
    const totalOut = document.querySelector('#memProgress .mem-progress__num span');
    if (totalOut) totalOut.textContent = pad(total);

    cfg.photos.forEach(function (item, i) {
      const w = item.w || 1200;
      const h = item.h || 1600;
      const variant = ratioClass(w, h);
      const num = pad(i + 1);

      const panel = el('article', 'panel ' + variant);
      panel.dataset.index = i;
      panel.style.setProperty('--ar', w + ' / ' + h);

      const media = el('figure', 'panel__media');
      media.setAttribute('data-cursor', 'Memory ' + num);
      const zoom = el('span', 'panel__zoom');
      zoom.setAttribute('data-cursor', 'Memory ' + num);
      const set = photoSet(item.image);
      zoom.append(mkImg({
        set: set,
        src: item.image,
        alt: item.alt || item.title || ('Memory ' + num),
        sizes: '(min-width: 900px) 42vw, 92vw',
        w: w, h: h,
        loading: i < 3 ? 'eager' : 'lazy',
        fetchpriority: i === 0 ? 'high' : null
      }));
      media.append(zoom);

      const meta = el('div', 'panel__meta');
      meta.append(el('span', 'panel__num', num));

      const copy = el('div', 'panel__copy');
      if (item.label) copy.append(el('p', 'panel__label', item.label));
      if (item.title) copy.append(el('h3', 'panel__title', item.title));
      if (item.caption) copy.append(el('p', 'panel__caption', item.caption));
      meta.append(copy);

      panel.append(media, meta);
      track.append(panel);
    });

    if (cfg.galleryEnd) {
      const end = el('article', 'panel panel--end');
      end.append(el('p', 'panel__end-kicker', cfg.galleryEnd.kicker || ''));
      end.append(el('p', 'panel__end-title', cfg.galleryEnd.title || ''));
      end.append(el('p', '', cfg.galleryEnd.text || ''));
      track.append(end);
    }
  }

  /* ── 04 · marquees ────────────────────────────────────────────────────── */
  function marquee(cfg) {
    const hosts = Array.prototype.slice.call(document.querySelectorAll('[data-marquee]'));
    const groups = [cfg.marquee && cfg.marquee.one, cfg.marquee && cfg.marquee.two];
    hosts.forEach(function (host, hi) {
      const words = (groups[hi] || groups[0] || []);
      const groupCls = 'marquee__group';
      const buildGroup = function (hidden) {
        const group = el('span', groupCls);
        if (hidden) group.setAttribute('aria-hidden', 'true');
        for (let r = 0; r < 2; r++) {
          words.forEach(function (word) {
            const item = el('span', 'marquee__item');
            item.innerHTML = esc(word) + ' <span class="marquee__sep" aria-hidden="true">✳</span>';
            group.append(item);
          });
        }
        return group;
      };
      host.classList.add(hi === 1 ? 'marquee--outline' : 'marquee--display');
      const track = el('div', 'marquee__track');
      track.append(buildGroup(false), buildGroup(true));
      host.append(track);
    });
  }

  /* ── 05 · film ────────────────────────────────────────────────────────── */
  function videos(cfg) {
    const host = document.getElementById('videos');
    if (!host) return;
    (cfg.videos || []).forEach(function (item) {
      const ratio = item.ratio || '16 / 9';
      const card = el('article', 'vcard');
      const frame = el('div', 'vcard__frame');
      frame.style.setProperty('--ratio', ratio);

      if (item.poster) {
        const poster = mkImg({
          set: posterSet(item.poster), src: item.poster,
          alt: '', sizes: '100vw', loading: 'lazy'
        });
        poster.classList.add('vcard__poster');
        frame.append(poster);
      }

      const vid = el('video', 'vcard__video');
      vid.preload = 'none';
      vid.muted = true;
      vid.defaultMuted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.setAttribute('muted', '');
      vid.controls = false;
      vid.dataset.src = item.video;
      frame.append(vid);

      const toggle = el('button', 'vcard__toggle');
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Play video: ' + (item.caption || 'Our moments'));
      toggle.setAttribute('data-cursor', 'Play');
      toggle.innerHTML =
        '<span class="vcard__play" aria-hidden="true">' +
          '<svg viewBox="0 0 12 14"><path d="M0 0l12 7-12 7z"/></svg>' +
        '</span>' +
        '<span class="vcard__cta" aria-hidden="true">' + esc(item.label || 'Play our film') + '</span>';

      const bar = el('span', 'vcard__progress');
      bar.setAttribute('aria-hidden', 'true');
      bar.append(el('i'));

      frame.append(toggle, bar);
      card.append(frame);

      const meta = el('div', 'vcard__meta');
      if (item.caption) meta.append(el('p', 'vcard__caption', item.caption));
      meta.append(el('span', 'vcard__time', item.label || 'Our film'));
      card.append(meta);

      host.append(card);
    });
  }

  /* ── 06 · timeline ────────────────────────────────────────────────────── */
  function timeline(cfg) {
    const host = document.getElementById('timeline');
    if (!host) return;

    const headHost = el('div');
    chapter(headHost, cfg.timelineIntro, { variant: 'split', number: '04' });
    host.append(headHost);

    const track = el('div', 'tl__track');
    const rail = el('div', 'tl__rail');
    rail.setAttribute('aria-hidden', 'true');
    rail.append(el('i'));
    track.append(rail);

    (cfg.timeline || []).forEach(function (pt, i) {
      const item = el('article', 'tl__item');
      item.append(el('span', 'tl__num', pad(i + 1)));

      const body = el('div', 'tl__body');
      body.append(el('p', 'tl__label', pt.label || ''));
      if (pt.text) body.append(el('p', 'tl__text', pt.text));
      item.append(body);

      if (pt.image) {
        const media = el('figure', 'tl__media');
        const set = photoSet(pt.image);
        media.append(mkImg({
          set: set, src: pt.image,
          alt: pt.label || '', sizes: '(min-width: 900px) 22rem, 90vw',
          loading: 'lazy'
        }));
        item.append(media);
      }
      track.append(item);
    });

    host.append(track);
  }

  /* ── 07 · letter ──────────────────────────────────────────────────────── */
  function letter(cfg) {
    const headHost = document.getElementById('letterHead');
    if (headHost) chapter(headHost, cfg.letterIntro, { variant: 'split', number: '05' });

    const paper = document.getElementById('letterPaper');
    if (!paper) return;
    paper.querySelector('.letter__greeting').textContent = cfg.letter.greeting;
    const body = paper.querySelector('.letter__body');
    (cfg.letter.body || []).forEach(function (line) {
      body.append(el('p', '', line));
    });
    paper.querySelector('.letter__sig').textContent = cfg.letter.signature;

    const seal = document.querySelector('#waxSeal .wax-seal__text');
    if (seal) seal.textContent = cfg.letter.sealText || 'E ♡ A';
    setText('#letterHint .tap-hint__text', cfg.letter.sealHint || 'Tap to open');

    const stamp = document.querySelector('.envelope__stamp');
    if (stamp && cfg.meta && cfg.meta.edition) stamp.textContent = cfg.meta.edition;
  }

  /* ── 08 · wish ────────────────────────────────────────────────────────── */
  function candle(cfg) {
    const stg = document.getElementById('candleStage');
    if (!stg) return;
    setText('.candle__prompt', cfg.candle.prompt);
    setText('#candleHint', cfg.candle.hint);
    setText('.pause__reveal-kicker', (cfg.pause && cfg.pause.revealKicker) || 'One last thing');

    const lines = document.querySelector('.pause__lines');
    if (lines) {
      (cfg.pause && cfg.pause.lines || []).forEach(function (txt) {
        const p = el('p', 'pause__line');
        p.textContent = txt;
        lines.append(p);
      });
    }

    document.getElementById('finalGift').append(gift());
    setText('#finalHint .tap-hint__text', (cfg.pause && cfg.pause.hint) || 'Tap for the final surprise');
    document.getElementById('openFinal').setAttribute('aria-label', (cfg.pause && cfg.pause.hint) || 'Open the final gift');
  }

  /* ── 09 · finale ──────────────────────────────────────────────────────── */
  function finale(cfg) {
    const f = cfg.final || {};
    const img = document.getElementById('finalPhoto');
    if (img) {
      const set = photoSet(f.photo);
      img.alt = f.photoAlt || '';
      /* the finale frame is ~18rem wide on desktop and 68vw below 900px */
      img.sizes = '(min-width: 1600px) 324px, (min-width: 900px) 306px, 68vw';
      img.decoding = 'async';
      img.loading = 'lazy';
      if (set) {
        img.addEventListener('error', function () {
          if (img.dataset.fb) return;
          img.dataset.fb = '1';
          img.removeAttribute('srcset');
          img.src = set.fallback;
        }, { once: true });
        img.srcset = set.srcset;
        img.src = set.src;
      } else {
        img.src = f.photo;
      }
    }

    const name = document.getElementById('finaleName');
    if (name) {
      name.textContent = f.title || ('Happy Birthday, ' + cfg.name);
      if (f.symbol) {
        const heart = el('span', 'finale__symbol', f.symbol);
        heart.setAttribute('aria-hidden', 'true');
        name.append(heart);
      }
    }

    setText('.finale__eyebrow', f.eyebrow || '');

    const lines = document.getElementById('finaleLines');
    if (lines) {
      (f.lines || []).forEach(function (txt) {
        const p = el('p', 'finale__line');
        p.innerHTML = esc(txt).replace(/[\u2665\u2764\u2661]/g, '<span class="finale__heart" aria-hidden="true">♥</span>');
        lines.append(p);
      });
    }

    const btn = document.getElementById('replay');
    if (btn) {
      btn.querySelector('.btn__label').textContent = f.replay || 'Experience Our Journey Again';
      btn.setAttribute('aria-label', f.replay || 'Experience our journey again');
    }

    setText('#skipFinale', cfg.opening.skip);
  }

  /* ── build ────────────────────────────────────────────────────────────── */
  return {
    build: function (cfg) {
      document.title = cfg.pageTitle || ('For ' + cfg.name);
      chrome(cfg);
      opening(cfg);
      hero(cfg);
      chapter(document.getElementById('memoriesIntro'), cfg.memoriesIntro, { variant: 'memories', number: '02' });
      memories(cfg);
      marquee(cfg);
      chapter(document.getElementById('videosIntro'), cfg.videosIntro, { variant: 'split', number: '03' });
      videos(cfg);
      timeline(cfg);
      letter(cfg);
      candle(cfg);
      finale(cfg);
    }
  };
})();
