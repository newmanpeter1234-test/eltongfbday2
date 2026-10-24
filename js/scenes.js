/* ============================================================================
   scenes.js — Turns birthdayConfig into page markup.
   Deep Velvet Bordeaux & Rose Theme
   ========================================================================== */

const Scenes = (function () {

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function roman(n) {
    const table = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
                   [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let out = '';
    table.forEach(function (pair) {
      while (n >= pair[0]) { out += pair[1]; n -= pair[0]; }
    });
    return out;
  }

  function memoryHeading(cfg, item, i) {
    if (item.label != null) return String(item.label);
    const style = cfg.memoryLabel == null ? 'number' : cfg.memoryLabel;
    if (style === 'none' || style === '') return '';
    if (style === 'roman') return roman(i + 1);
    if (style === 'number') return 'Memory ' + pad(i + 1);
    return style + ' ' + pad(i + 1);
  }

  /* Isometric Velvet Bordeaux & Rose Gold Gift Box */
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
            '<stop offset="0" stop-color="#faecd8"/><stop offset=".4" stop-color="#e58ca8"/><stop offset="1" stop-color="#b84b72"/></linearGradient>' +
          '<radialGradient id="' + u + 'glow">' +
            '<stop offset="0" stop-color="#fff5f8" stop-opacity=".98"/>' +
            '<stop offset=".5" stop-color="#f7c2d1" stop-opacity=".65"/>' +
            '<stop offset="1" stop-color="#e58ca8" stop-opacity="0"/></radialGradient>' +
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

  function chapter(host, data, variant) {
    host.classList.add('chapter', variant === 'side' ? 'chapter--side' : 'chapter--center');
    const label = el('p', 'chapter__label rv', data.label || '');
    const title = el('h2', 'chapter__title rv', data.title || '');
    host.append(label, title);
    if (variant !== 'side') host.append(el('div', 'chapter__rule rv'));
    return host;
  }

  function hint(hintId, tapId, text) {
    const h = document.querySelector('#' + hintId + ' .tap-hint__text');
    if (h) h.textContent = text;
    const t = document.getElementById(tapId);
    if (t) t.setAttribute('aria-label', text);
  }

  function opening(cfg) {
    document.getElementById('introWhisper').textContent = cfg.opening.whisper;
    document.getElementById('introGift').append(gift());
    hint('introHint', 'openGift', cfg.opening.hint);
    document.getElementById('skipIntro').textContent = cfg.opening.skip;
  }

  function reveal(cfg) {
    const root = document.getElementById('reveal');
    const masks = root.querySelectorAll('.mask__i');
    masks[0].textContent = cfg.reveal.greeting;
    masks[1].textContent = cfg.name;
    if (masks[2]) masks[2].textContent = cfg.reveal.date;

    const lines = root.querySelector('.reveal__lines');
    cfg.reveal.lines.forEach(function (txt, i) {
      const p = el('p', 'lead rv' + (i ? ' lead--muted' : ''), txt);
      p.setAttribute('data-rv', '');
      lines.append(p);
    });

    root.querySelector('.scroll-cue__text').textContent = cfg.reveal.scrollHint;
    root.querySelectorAll('[data-rv]').forEach(function (n) { n.classList.add('rv'); });
  }

  function memories(cfg) {
    const host = document.getElementById('memories');
    const styles = ['curtain', 'bloom', 'slide'];

    cfg.photos.forEach(function (item, i) {
      const art = el('article', 'memory');
      art.dataset.index = i;
      art.dataset.reveal = styles[i % styles.length];

      const stage = el('div', 'memory__stage');
      const heading = memoryHeading(cfg, item, i);
      const label = heading ? el('p', 'memory__label rv', heading) : null;

      const frame = el('figure', 'memory__frame rv');
      frame.style.margin = '0';
      const alt = item.alt || item.title || ('Memory ' + pad(i + 1));

      const img = el('img');
      img.alt = alt;
      img.decoding = 'async';
      if (i < 2) {
        img.loading = 'eager';
        img.src = item.image;
      } else {
        img.loading = 'lazy';
        img.dataset.src = item.image;
      }
      frame.append(img);

      const text = el('div', 'memory__text rv');
      if (item.title) text.append(el('h3', 'memory__title', item.title));
      if (item.caption) text.append(el('p', 'memory__caption', item.caption));

      if (label) stage.append(label);
      stage.append(frame, text);
      art.append(stage);
      host.append(art);
    });
  }

  function videos(cfg) {
    const host = document.getElementById('videos');
    const list = cfg.videos || [];

    list.forEach(function (item) {
      const ratio = item.ratio || '1280/882';
      const card = el('article', 'vcard rv');
      const frame = el('div', 'vcard__frame');
      frame.style.setProperty('--ratio', ratio);

      if (item.poster) {
        const poster = el('img', 'vcard__poster');
        poster.dataset.src = item.poster;
        poster.alt = '';
        poster.loading = 'lazy';
        poster.decoding = 'async';
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
      toggle.innerHTML =
        '<span class="vcard__play" aria-hidden="true">' +
          '<svg viewBox="0 0 12 14"><path d="M0 0l12 7-12 7z"/></svg>' +
        '</span>';

      const bar = el('span', 'vcard__progress');
      bar.setAttribute('aria-hidden', 'true');
      bar.append(el('i'));

      frame.append(toggle, bar);
      card.append(frame);
      if (item.caption) card.append(el('p', 'vcard__caption', item.caption));
      host.append(card);
    });
  }

  function timeline(cfg) {
    const host = document.getElementById('timeline');
    const head = chapter(el('header'), cfg.timelineIntro, 'center');

    const track = el('div', 'tl__track');
    const line = el('div', 'tl__line');
    line.append(el('span', 'tl__fill'));

    const list = el('ol', 'tl__items');
    cfg.timeline.forEach(function (pt) {
      const li = el('li', 'tl__item rv');
      li.append(el('span', 'tl__dot'));
      li.append(el('h3', 'tl__label', pt.label));
      if (pt.text) li.append(el('p', 'tl__text', pt.text));

      if (pt.image) {
        const media = el('div', 'tl__media');
        const img = el('img');
        img.dataset.src = pt.image;
        img.alt = pt.label || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        media.append(img);
        li.append(media);
      }
      list.append(li);
    });

    track.append(line, list);
    host.append(head, track);
  }

  function letter(cfg) {
    const p = document.getElementById('letterPaper');
    if (!p) return;
    p.querySelector('.letter__greeting').textContent = cfg.letter.greeting;
    const body = p.querySelector('.letter__body');
    cfg.letter.body.forEach(function (line) {
      const para = el('p', '', line);
      body.append(para);
    });
    p.querySelector('.letter__sig').textContent = cfg.letter.signature;
  }

  function candle(cfg) {
    const stg = document.getElementById('candleStage');
    if (!stg) return;
    stg.querySelector('.candle__prompt').textContent = cfg.candle.prompt;
    document.getElementById('candleHint').textContent = cfg.candle.hint;
  }

  function pause(cfg) {
    const host = document.getElementById('pause');
    const lines = host.querySelector('.pause__lines');
    cfg.pause.lines.forEach(function (txt) {
      lines.append(el('p', 'pause__line', txt));
    });
    document.getElementById('finalGift').append(gift());
    hint('finalHint', 'openFinal', cfg.pause.hint);
  }

  function finale(cfg) {
    const img = document.getElementById('finalPhoto');
    img.src = cfg.final.photo;
    img.alt = cfg.final.photoAlt || '';

    const name = document.getElementById('finaleName');
    name.textContent = cfg.final.title || ('Happy Birthday, ' + cfg.name);
    const glyph = cfg.final.symbol || '♥';
    if (glyph) {
      const h = el('span', 'finale__symbol', glyph);
      h.setAttribute('aria-hidden', 'true');
      name.append(h);
    }

    const lines = document.getElementById('finaleLines');
    cfg.final.lines.forEach(function (txt) {
      const p = el('p', 'finale__line');
      p.innerHTML = '<span class="finale__line-in">' + String(txt)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/[\u2665\u2764\u2661]/g, '<span class="finale__heart" aria-hidden="true">♥</span>')
        + '</span>';
      lines.append(p);
    });

    const btn = document.getElementById('replay');
    btn.querySelector('.btn__label').textContent = cfg.final.replay;
    btn.setAttribute('aria-label', cfg.final.replay);

    document.getElementById('skipFinale').textContent = cfg.opening.skip;
  }

  return {
    build: function (cfg) {
      document.title = cfg.pageTitle || ('For ' + cfg.name);
      opening(cfg);
      reveal(cfg);
      chapter(document.getElementById('memoriesIntro'), cfg.memoriesIntro, 'center');
      memories(cfg);
      chapter(document.getElementById('videosIntro'), cfg.videosIntro, 'side');
      videos(cfg);
      timeline(cfg);
      letter(cfg);
      candle(cfg);
      pause(cfg);
      finale(cfg);
    }
  };
})();
