/* ============================================================================
   script.js — Director of the experience.
   Lenis smooth scroll · GSAP ScrollTrigger · kinetic type · pinned gallery
   Interactive wax seal · candle · finale · custom cursor & HUD
   ========================================================================== */

(function () {
  'use strict';

  const cfg = window.birthdayConfig || {};
  const root = document.documentElement;
  const body = document.body;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  const STATIC = REDUCED || !HAS_GSAP;

  const $  = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  const D  = function (n) { return REDUCED ? 0.001 : n; };
  const noop = function () {};

  if (STATIC) root.classList.add('no-motion');
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  /* minimal stand-in so a missing CDN can never break the page */
  if (!HAS_GSAP) {
    const dummy = {
      to: function () { return dummy; }, from: function () { return dummy; },
      fromTo: function () { return dummy; }, set: function () { return dummy; },
      call: function (fn) { if (typeof fn === 'function') fn(); return dummy; },
      add: function () { return dummy; }, kill: noop, play: noop, pause: noop,
      timeScale: function () { return dummy; }, scrollTrigger: null
    };
    window.gsap = {
      registerPlugin: noop, to: function () { return dummy; }, from: function () { return dummy; },
      fromTo: function () { return dummy; }, set: function () { return dummy; },
      timeline: function () { return dummy; }, ticker: { add: noop, lagSmoothing: noop },
      utils: {}
    };
    window.ScrollTrigger = {
      create: function () { return { kill: noop }; }, refresh: noop, update: noop, getAll: function () { return []; }
    };
  }

  /* ── DOM ──────────────────────────────────────────────────────────────── */
  const loader      = $('#loader');
  const intro       = $('#intro');
  const journey     = $('#journey');
  const finale      = $('#finale');
  const flash       = $('#flash');
  const hud         = $('#hud');
  const rail        = $('#rail');
  const hudNum      = $('#hudNum');
  const hudLabel    = $('#hudLabel');
  const hudBar      = $('#hudBar');
  const memProgress = $('#memProgress');
  const announcer   = $('#announce');
  const musicBtn    = $('#musicToggle');
  const audio       = $('#bgm');

  let state = 'intro';
  let lenis = null;
  let finaleTL = null;
  let scrollBuilt = false;
  let railBuilt = false;
  let candleBlown = false;
  let currentChapter = -1;

  /* chapters — order matters for the rail + HUD */
  const CHAPTERS = [
    { id: 'reveal',        num: '01', label: 'Prologue' },
    { id: 'memories',      num: '02', label: 'Memories' },
    { id: 'videosIntro',   num: '03', label: 'Film' },
    { id: 'timeline',      num: '04', label: 'Our Story' },
    { id: 'letterSection', num: '05', label: 'The Letter' },
    { id: 'pause',         num: '06', label: 'The Wish' },
    { id: 'finale',        num: '07', label: 'Finale' }
  ];

  function announce(msg) { if (announcer) announcer.textContent = msg; }

  /* the tab title breathes while the site is in the background */
  const PAGE_TITLE = document.title;
  let titleTimer = null;
  function startTitleLoop() {
    if (titleTimer) return;
    const frames = ['For Anziya ♡', 'Happy Birthday, Anziya ♡', PAGE_TITLE];
    let i = 0;
    titleTimer = setInterval(function () {
      document.title = frames[i % frames.length];
      i++;
    }, 3200);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) startTitleLoop();
    else { clearInterval(titleTimer); titleTimer = null; document.title = PAGE_TITLE; }
  });
  function burst(x, y, n) {
    if (typeof Particles !== 'undefined' && Particles.burstAt) Particles.burstAt(x, y, n);
  }
  function intensity(v) {
    if (typeof Particles !== 'undefined' && Particles.setIntensity) Particles.setIntensity(v);
  }

  function setInert(node, on) {
    if (!node) return;
    try { node.inert = on; } catch (e) {}
    if (on) node.setAttribute('aria-hidden', 'true');
    else node.removeAttribute('aria-hidden');
  }

  function press(node, fn) {
    if (!node) return;
    node.addEventListener('click', fn);
    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); fn();
      }
    });
  }

  let refreshTimer;
  function refreshSoon(delay) {
    if (!HAS_GSAP) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, delay || 150);
  }

  /* ══ SMOOTH SCROLL ═══════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    if (STATIC || typeof Lenis === 'undefined') return;
    try {
      lenis = new Lenis({
        lerp: 0.095,
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.6,
        syncTouch: false
      });
    } catch (e) { lenis = null; return; }

    lenis.on('scroll', function (e) {
      if (HAS_GSAP) ScrollTrigger.update();
      updateProgress(e && typeof e.scroll === 'number' ? e.scroll : window.scrollY);
    });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  function lockScroll() {
    root.classList.add('is-locked');
    body.classList.add('is-locked');
    if (lenis) lenis.stop();
  }
  function unlockScroll() {
    root.classList.remove('is-locked');
    body.classList.remove('is-locked');
    if (lenis) lenis.start();
  }
  function toTop() {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }
  function scrollToEl(target, offset) {
    const node = typeof target === 'string' ? $(target) : target;
    if (!node) return;
    if (lenis) lenis.scrollTo(node, { offset: offset == null ? -8 : offset, duration: 1.25 });
    else node.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }

  /* ══ HUD · RAIL · PROGRESS ═══════════════════════════════════════════════ */
  let progressRaf = false;
  function updateProgress(y) {
    if (progressRaf || (hudBar && body.classList.contains('is-finale'))) return;
    progressRaf = true;
    requestAnimationFrame(function () {
      progressRaf = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      hudBar.style.transform = 'scaleX(' + p + ')';
    });
  }
  window.addEventListener('scroll', function () { updateProgress(window.scrollY); }, { passive: true });

  function buildRail() {
    if (railBuilt || !rail) return;
    railBuilt = true;
    rail.innerHTML = '';
    CHAPTERS.forEach(function (c, i) {
      if (c.id === 'finale') return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__item';
      b.setAttribute('aria-label', 'Chapter ' + c.num + ' — ' + c.label);
      b.innerHTML = '<span class="rail__num">' + c.num + '</span><span class="rail__dot" aria-hidden="true"></span>';
      b.addEventListener('click', function () { scrollToEl('#' + c.id); });
      rail.append(b);
    });
    rail.removeAttribute('aria-hidden');
    rail.setAttribute('aria-hidden', 'false');
  }

  function setChapter(index) {
    if (index === currentChapter) return;
    currentChapter = index;
    const def = CHAPTERS[index];
    if (!def) return;
    if (hudNum) hudNum.textContent = def.num;
    if (hudLabel) hudLabel.textContent = def.label;
    $$('.rail__item').forEach(function (item, i) {
      const on = i === index;
      item.classList.toggle('is-active', on);
      if (on) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    });
  }

  function computeChapter() {
    const marker = window.innerHeight * 0.55;
    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].id === 'finale') continue;
      const node = document.getElementById(CHAPTERS[i].id);
      if (!node) continue;
      const r = node.getBoundingClientRect();
      /* A pinned section keeps its trigger pinned at top:0 while ScrollTrigger
         extends it with a spacer, so its rect no longer marks where we are.
         The spacer does — it sits above the next chapter in document order. */
      const spacer = node.parentElement && node.parentElement.classList.contains('pin-spacer')
        ? node.parentElement
        : null;
      const top = spacer ? spacer.getBoundingClientRect().top : r.top;
      /* a mid-refresh measurement can momentarily report 0 for every section,
         so require the section to genuinely hold the marker band */
      const holds = top <= marker && (r.bottom > marker * .2 || top < -1);
      if (holds) idx = i;
      else if (top > marker) break;
    }
    setChapter(idx);
  }

  let chapterRaf = false;
  function scheduleChapter() {
    if (chapterRaf) return;
    chapterRaf = true;
    requestAnimationFrame(function () {
      chapterRaf = false;
      if (state === 'journey') computeChapter();
    });
  }

  function trackChapters() {
    window.addEventListener('scroll', scheduleChapter, { passive: true });
    window.addEventListener('resize', scheduleChapter);
    scheduleChapter();
  }

  /* ══ LOADER ══════════════════════════════════════════════════════════════ */
  function initLoader() {
    const numEl = $('#loadNum');
    const barEl = $('#loadBar');
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      if (numEl) numEl.textContent = '100';
      if (barEl) barEl.style.transform = 'scaleX(1)';
      if (loader) loader.classList.add('is-done');
      root.classList.add('is-loaded');
      revealIntro();
      setTimeout(function () {
        if (loader) { loader.hidden = true; loader.style.display = 'none'; }
      }, 1500);
    }

    if (!loader) { revealIntro(); return; }

    if (STATIC) {
      if (numEl) numEl.textContent = '100';
      if (barEl) barEl.style.transform = 'scaleX(1)';
      setTimeout(finish, 260);
      return;
    }

    const val = { p: 0 };
    gsap.to(val, {
      p: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: function () {
        const v = Math.round(val.p);
        if (numEl) numEl.textContent = v < 10 ? '0' + v : String(v);
        if (barEl) barEl.style.transform = 'scaleX(' + (val.p / 100) + ')';
      },
      onComplete: function () {
        const ready = function () { finish(); };
        const guard = setTimeout(ready, 1600); /* never hold her hostage */
        const fontGate = (document.fonts && document.fonts.ready)
          ? document.fonts.ready
          : Promise.resolve();
        fontGate.then(function () {
          clearTimeout(guard);
          setTimeout(ready, 260);
        });
      }
    });
    setTimeout(finish, 4200);
  }

  let introShown = false;
  function revealIntro() {
    if (introShown) return;
    introShown = true;
    if (STATIC || !intro) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('.intro__whisper', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.1 }, .2)
      .fromTo('.intro__side', { opacity: 0 }, { opacity: 1, duration: 1.4 }, .5)
      .fromTo('.intro__stage', { opacity: 0, y: 26, scale: .97 },
                          { opacity: 1, y: 0, scale: 1, duration: 1.5 }, .45)
      .fromTo('.intro__ghost', { opacity: 0, letterSpacing: '.02em' },
                           { opacity: .85, letterSpacing: '-.045em', duration: 2 }, .7)
      .fromTo('.intro__hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.1 }, 1.4)
      .fromTo('#skipIntro', { opacity: 0 }, { opacity: .9, duration: 1 }, 2);
  }

  /* ══ GIFT BOX OPENING ════════════════════════════════════════════════════ */
  function openGiftBox(giftEl, onPeak, onDone) {
    if (!giftEl || STATIC) {
      if (onPeak) onPeak();
      if (onDone) onDone();
      return null;
    }
    giftEl.classList.add('is-opening');
    const r = giftEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.42;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to($('.gift__glow', giftEl), { opacity: 1, duration: D(.55) })
      .to($('.gift__lid', giftEl), {
        y: -62, x: 6, rotation: -8, transformOrigin: '50% 50%',
        duration: D(1.15), ease: 'power3.inOut'
      }, '-=.3')
      .to($('.gift__beam', giftEl), { opacity: 1, scaleY: 1, duration: D(.9) }, '<')
      .to($('.gift__aura', giftEl), { scale: 2.9, opacity: 1, duration: D(1.2) }, '<')
      .call(function () { burst(cx, cy, window.innerWidth < 600 ? 95 : 165); })
      .to($('.gift__svg', giftEl), { opacity: .08, duration: D(.9) }, '-=.65')
      .to(flash, { opacity: 1, duration: D(.55) }, '-=.45')
      .call(function () { if (onPeak) onPeak(); })
      .to(flash, { opacity: 0, duration: D(1.5) })
      .call(function () { if (onDone) onDone(); });
    return tl;
  }

  /* ══ SCENE 01 → THE JOURNEY ══════════════════════════════════════════════ */
  function openIntroGift() {
    if (state !== 'intro') return;
    state = 'opening';
    startMusic(true);
    const safety = setTimeout(enterJourney, 6000);
    openGiftBox($('#introGift .gift'), function () {
      clearTimeout(safety);
      enterJourney();
    });
  }

  function enterJourney() {
    if (state === 'journey' || state === 'finale' || state === 'opening-final') return;
    state = 'journey';

    intro.classList.remove('is-active');
    setInert(intro, true);
    setInert(journey, false);
    unlockScroll();
    toTop();
    journey.classList.remove('is-veiled');
    body.classList.add('is-live');
    if (hud) hud.removeAttribute('aria-hidden');
    if (musicBtn && !musicBroken) musicBtn.classList.remove('is-pre');

    buildRail();
    setChapter(0);
    announce('Happy Birthday, ' + cfg.name + '. Scroll slowly — the story is yours.');

    requestAnimationFrame(function () {
      if (!STATIC) {
        buildScrollAnimations();
        playHero();
      }
      refreshSoon(80);
    });
  }

  function prepHero() {
    if (STATIC) return;
    gsap.set('.hero__name .char', { yPercent: 126, opacity: 0 });
    gsap.set('.hero__eyebrow .w__i', { yPercent: 120, opacity: 0 });
    gsap.set('.hero__date, .hero__line, .hero__meta, .hero__side--r, .scroll-cue', { opacity: 0 });
    gsap.set('.hero__dash', { scaleX: 0 });
    gsap.set('.hero__ghost', { opacity: 0 });
  }

  function playHero() {
    if (STATIC) return;
    const chars = $$('.hero__name .char');
    const words = $$('.hero__eyebrow .w__i');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo(words, { yPercent: 120, opacity: 0 },
                      { yPercent: 0, opacity: 1, duration: 1.1, stagger: .055 }, 0)
      .fromTo(chars, { yPercent: 126, opacity: 0 },
                      { yPercent: 0, opacity: 1, duration: 1.5, stagger: .065 }, .25)
      .fromTo('.hero__date', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, .95)
      .fromTo('.hero__dash', { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, 1.05)
      .fromTo('.hero__line', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 1.15)
      .fromTo('.hero__meta, .hero__side, .scroll-cue', { opacity: 0, y: 10 },
                      { opacity: 1, y: 0, duration: .9, stagger: .07 }, .95)
      .fromTo('.hero__ghost', { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: 2.2 }, .2);

    gsap.to('.hero__center', {
      yPercent: -13, opacity: .3, ease: 'none',
      scrollTrigger: { trigger: '#reveal', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.to('.hero__ghost', {
      yPercent: -16, ease: 'none',
      scrollTrigger: { trigger: '#reveal', start: 'top top', end: 'bottom top', scrub: .6 }
    });
  }

  /* ══ SCROLL ANIMATIONS ═══════════════════════════════════════════════════ */
  function buildScrollAnimations() {
    if (scrollBuilt || STATIC) return;
    scrollBuilt = true;
    chaptersReveal();
    buildGallery();
    videosReveal();
    timelineReveal();
    letterReveal();
    pauseScene();
    trackChapters();
    refreshSoon(120);
  }

  function chaptersReveal() {
    $$('.chapter').forEach(function (ch) {
      const label = $('.chapter__label', ch);
      const words = $$('.chapter__title .w__i', ch);
      const aside = $('.chapter__aside', ch);
      const ghost = $('.chapter__ghost', ch);

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: ch, start: 'top 80%', once: true }
      });
      if (label) tl.fromTo(label, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .9 }, 0);
      if (words.length) {
        tl.fromTo(words, { yPercent: 116, opacity: 0 },
                         { yPercent: 0, opacity: 1, duration: 1.15, stagger: .045 }, .08);
      }
      if (aside) tl.fromTo(aside, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, .45);

      if (ghost) {
        gsap.fromTo(ghost, { yPercent: 20 }, {
          yPercent: -10, ease: 'none',
          scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: .7 }
        });
      }
    });
  }

  /* ── the pinned horizontal gallery ────────────────────────────────────── */
  function setMemory(index) {
    if (!memProgress) return;
    const total = (cfg.photos && cfg.photos.length) || 10;
    const i = Math.max(1, Math.min(total, index));
    const numEl = $('.mem-progress__num i', memProgress);
    const totEl = $('.mem-progress__num span', memProgress);
    const bar = $('.mem-progress__bar i', memProgress);
    if (numEl) numEl.textContent = (i < 10 ? '0' : '') + i;
    if (totEl) totEl.textContent = (total < 10 ? '0' : '') + total;
    if (bar) bar.style.transform = 'scaleX(' + (i / total) + ')';
  }

  function buildGallery() {
    const section = $('#memories');
    const track = $('#galleryTrack');
    if (!section || !track) return;

    const panels = $$('.panel', track);
    const photos = panels.filter(function (p) { return !p.classList.contains('panel--end'); });
    const bar = $('.gallery__line i', section);
    setMemory(1);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', function () {
      const distance = function () {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };
      if (distance() < 40) return;

      /* hold the photographs back until the section is actually in place */
      gsap.fromTo(panels, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: .06, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 92%', once: true }
      });

      const tween = gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + distance(); },
          pin: true,
          scrub: .8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (bar) bar.style.transform = 'scaleX(' + self.progress + ')';
          },
          onToggle: function (self) {
            if (memProgress) memProgress.classList.toggle('is-visible', self.isActive);
          },
          onRefresh: function (self) {
            if (memProgress) memProgress.classList.toggle('is-visible', self.isActive);
          }
        }
      });

      panels.forEach(function (panel) {
        const zoom = $('.panel__zoom', panel);
        if (!zoom) return;
        gsap.fromTo(zoom, { xPercent: -5 }, {
          xPercent: 5, ease: 'none',
          scrollTrigger: {
            trigger: panel, containerAnimation: tween,
            start: 'left right', end: 'right left', scrub: true
          }
        });
      });

      photos.forEach(function (panel, i) {
        ScrollTrigger.create({
          trigger: panel, containerAnimation: tween,
          start: 'left center', end: 'right center',
          onToggle: function (self) { if (self.isActive) setMemory(i + 1); }
        });
      });

      return function () {
        gsap.set(track, { clearProps: 'transform' });
        if (memProgress) memProgress.classList.remove('is-visible');
      };
    });

    mm.add('(max-width: 899px)', function () {
      photos.forEach(function (panel) {
        gsap.fromTo(panel, { opacity: 0, y: 46 }, {
          opacity: 1, y: 0, duration: 1.15, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 86%', once: true }
        });
      });
      const end = $('.panel--end', track);
      if (end) {
        gsap.fromTo(end, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: end, start: 'top 86%', once: true }
        });
      }
    });

    /* images change the track width — remeasure when they land */
    $$('img', track).forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', function () { refreshSoon(120); }, { once: true });
    });
  }

  function videosReveal() {
    $$('.vcard').forEach(function (card) {
      const frame = $('.vcard__frame', card);
      const meta = $('.vcard__meta', card);
      gsap.fromTo(frame,
        { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.04, opacity: 1 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true }
        });
      if (meta) {
        gsap.fromTo(meta, { opacity: 0, y: 18 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 78%', once: true }
        });
      }
    });
  }

  function timelineReveal() {
    const fill = $('.tl__rail i');
    if (fill) {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.tl__track', start: 'top 72%', end: 'bottom 78%', scrub: .6 }
      });
    }
    $$('.tl__item').forEach(function (item) {
      gsap.fromTo(item, { opacity: 0, y: 42 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 84%', once: true }
      });
      const media = $('.tl__media', item);
      if (media) {
        gsap.fromTo(media, { y: 24 }, {
          y: -24, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: .7 }
        });
      }
      ScrollTrigger.create({
        trigger: item, start: 'top 62%', end: 'bottom 38%',
        onToggle: function (self) { item.classList.toggle('is-active', self.isActive); }
      });
    });
  }

  function letterReveal() {
    const wrap = $('#envelopeWrap');
    if (wrap) {
      gsap.fromTo(wrap, { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '#letterSection', start: 'top 72%', once: true }
      });
    }
  }

  function pauseScene() {
    const sec = $('#pause');
    if (!sec) return;
    const lines = $$('.pause__line', sec);
    const lineHost = $('.pause__lines', sec);
    const candleS = $('#candleStage');
    const bg = $('.bg');
    let candleShown = false;

    /* Ten timeline units spread across the pinned section.
       0.0–3.1  first line in, breath, out
       3.3–5.3  second line in, breath, out
       5.4–10   the candle takes the stage                                  */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .6 }
    });
    if (lines[0]) {
      tl.fromTo(lines[0], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out' }, 0)
        .to(lines[0], { autoAlpha: 0, y: -32, duration: .7, ease: 'power2.in' }, 2.4);
    }
    if (lines[1]) {
      tl.fromTo(lines[1], { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out' }, 3.3)
        .to(lines[1], { autoAlpha: 0, y: -32, duration: .7, ease: 'power2.in' }, 4.6);
    }
    tl.to({}, { duration: 4.7 }, 5.3);

    function showCandle(on) {
      if (!candleS || candleBlown) return;
      if (on === candleShown) return;
      candleShown = on;
      candleS.classList.toggle('is-active', on);
      if (lineHost) {
        lineHost.classList.toggle('is-faded', on);
        lineHost.style.display = on ? 'none' : '';
      }
    }

    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) {
        showCandle(self.progress > .62);
        intensity(1 - self.progress * .55);
        if (bg) bg.style.opacity = String(1 - self.progress * .45);
      },
      onLeaveBack: function () {
        showCandle(false);
        intensity(1);
        if (bg) bg.style.opacity = '1';
      }
    });
  }

  /* Wait for the unfolded letter to stop growing, then frame it under the HUD.
     ScrollTrigger's refresh and the browser's scroll anchoring can each nudge
     the page after we move it, so we converge instead of measuring once. */
  function settlePaper(paper) {
    if (!paper) return;
    /* measure the real HUD, not the custom property ("4.6rem" would parse as 4.6) */
    const hudEl = document.getElementById('hud');
    const hudClear = (hudEl ? hudEl.getBoundingClientRect().height : 74) + 30;
    let pass = 0;

    function snap() {
      const drift = paper.getBoundingClientRect().top - hudClear;
      if (Math.abs(drift) < 1) return;
      if (lenis) lenis.scrollTo(window.scrollY + drift, { immediate: true });
      else window.scrollTo(0, window.scrollY + drift);
    }

    function converge() {
      pass++;
      if (!paper.isConnected) return;
      const top = paper.getBoundingClientRect().top;
      const off = Math.abs(top - hudClear);

      if (off > 8 && pass <= 5) snap();

      if (pass >= 5) {
        if (off > 8) snap();
        scheduleChapter();
        return;
      }
      setTimeout(function () {
        refreshSoon(0);
        /* let refresh settle, then re-measure and correct again */
        setTimeout(converge, 340);
      }, off > 8 ? 900 : 340);
    }

    const waitForHeight = function (lastH, stable) {
      const h = paper.getBoundingClientRect().height;
      const nextStable = Math.abs(h - lastH) < 1 ? stable + 1 : 0;
      if (nextStable >= 3 && h > 40) { converge(); return; }
      if (Date.now() - t0 > 2600) { converge(); return; }
      setTimeout(function () { waitForHeight(h, nextStable); }, 110);
    };
    const t0 = Date.now();
    setTimeout(function () { waitForHeight(-1, 0); }, 120);
  }

  /* ══ THE WAX SEAL ════════════════════════════════════════════════════════ */
  function loveLetter() {
    const wrap = $('#envelopeWrap');
    const env = $('#envelope');
    const seal = $('#waxSeal');
    const paper = $('#letterPaper');
    const hint = $('#letterHint');
    if (!wrap || !env) return;

    press(env, function () {
      if (wrap.classList.contains('is-open')) return;
      wrap.classList.add('is-open');
      env.setAttribute('aria-expanded', 'true');
      if (paper) paper.setAttribute('aria-hidden', 'false');
      if (hint) hint.style.opacity = '0';

      if (seal) {
        const r = seal.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 70);
      }
      announce("Elton's letter is open. Almost three years ago, our story began…");

      if (!STATIC) {
        const bits = $$('.letter-paper__inner > *');
        gsap.fromTo(bits, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 1, stagger: .12, delay: .55, ease: 'power3.out'
        });
      }

      /* The paper grows for ~1.3s and the browser re-anchors the page while it
         does, so aim only once the height is stable — then verify and snap. */
      settlePaper(paper);
    });
  }

  /* ══ THE CANDLE ══════════════════════════════════════════════════════════ */
  function candleScene() {
    const candleS = $('#candleStage');
    const candle = $('#birthdayCandle');
    const hint = $('#candleHint');
    const reveal = $('.pause__reveal');
    if (!candle || !reveal) return;

    press(candle, function () {
      if (candleBlown) return;
      if (candleS && !candleS.classList.contains('is-active') && !STATIC) return;
      candleBlown = true;
      candle.classList.add('is-blown');

      const r = candle.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + 12, 80);
      if (hint) hint.textContent = (cfg.candle && cfg.candle.blownMessage) || 'May all your wishes come true, my love.';
      announce('Wish made. A final gift for ' + cfg.name + '.');

      const showReveal = function () {
        reveal.classList.add('is-ready');
        if (STATIC) {
          if (candleS) candleS.style.display = 'none';
          reveal.style.opacity = '1';
          reveal.style.transform = 'none';
          return;
        }
        gsap.fromTo(reveal, { opacity: 0, y: 26 }, {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out'
        });
      };

      setTimeout(function () {
        if (candleS) {
          if (STATIC) { candleS.style.display = 'none'; }
          else {
            gsap.to(candleS, {
              opacity: 0, y: -22, duration: .9, ease: 'power2.in',
              onComplete: function () { candleS.classList.remove('is-active'); }
            });
          }
        }
        const lineHost = $('.pause__lines');
        if (lineHost) lineHost.style.display = 'none';
        setTimeout(showReveal, STATIC ? 0 : 260);
      }, 1700);
    });
  }

  /* ══ THE FINALE ══════════════════════════════════════════════════════════ */
  function openFinalGift() {
    if (state !== 'journey') return;
    state = 'opening-final';
    const safety = setTimeout(startFinale, 6000);
    openGiftBox($('#finalGift .gift'), function () {
      clearTimeout(safety);
      startFinale();
    });
  }

  function startFinale() {
    if (state === 'finale') return;
    state = 'finale';

    body.classList.add('is-finale');
    finale.classList.add('is-active');
    setInert(finale, false);
    setInert(journey, true);
    lockScroll();
    setChapter(6);
    intensity(.25);
    announce('A final message for ' + cfg.name + '.');

    const light  = $('#finaleLight');
    const eyebrow = $('.finale__eyebrow');
    const photo  = $('.finale__photo');
    const name   = $('#finaleName');
    const lines  = $$('.finale__line');
    const replay = $('#replay');
    const skip   = $('#skipFinale');
    if (skip) skip.hidden = false;

    if (STATIC) {
      if (skip) skip.hidden = true;
      if (replay) replay.classList.add('is-ready');
      return;
    }

    finaleTL = gsap.timeline({ defaults: { ease: 'power2.out' } });

    /* Act 1 — darkness, then the light gathers into a beating heart */
    finaleTL
      .to({}, { duration: D(.7) })
      .fromTo(light, { opacity: 0, scale: .18 }, { opacity: 1, scale: 1, duration: D(1.5) })
      .call(function () { if (typeof Glyph !== 'undefined' && Glyph.start) Glyph.start(); })
      .to(light, { opacity: .30, duration: D(1.4) }, '-=.4')
      .to({}, { duration: D(6.2) })   /* let the heart form, beat, and hold */
      /* Act 2 — the heart dissolves and she appears */
      .call(function () { if (typeof Glyph !== 'undefined' && Glyph.dissolve) Glyph.dissolve(); })
      .to(light, { opacity: 0, duration: D(1.1) }, '-=.2')
      .to('.finale__ghost', { opacity: 0, duration: D(1.4) }, '<');

    if (eyebrow) finaleTL.fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: D(1) }, '-=.6');

    finaleTL
      .fromTo(photo, { opacity: 0, scale: 1.06, clipPath: 'inset(0% 0% 100% 0%)' },
                     { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: D(1.8), ease: 'power3.out' }, '-=.2')
      .fromTo(name, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: D(1.2) }, '-=.7');

    lines.forEach(function (line, i) {
      finaleTL.fromTo(line, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: D(1.15) }, '+=.4');
      if (i < lines.length - 1) {
        finaleTL.to(line, { opacity: 0, y: -16, duration: D(1), ease: 'power2.in' }, '+=2.3');
      }
    });

    finaleTL
      .fromTo(replay, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: D(1.1) }, '+=.8')
      .call(function () {
        replay.classList.add('is-ready');
        if (skip) skip.hidden = true;
        intensity(.55);
      });
  }

  /* ══ MUSIC ═══════════════════════════════════════════════════════════════ */
  let musicOn = false;
  let musicBroken = false;
  let hiddenPaused = false;
  let musicChannel = null;
  try { musicChannel = new BroadcastChannel('anziya-bday-music'); } catch (e) { musicChannel = null; }

  function reflectMusic(on) {
    if (!musicBtn) return;
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
    const txt = $('.music__text', musicBtn);
    if (txt) txt.textContent = on ? 'Sound on' : 'Sound';
  }

  function initMusic() {
    if (!musicBtn) return;
    if (!cfg.music || !cfg.music.file) { musicBtn.hidden = true; return; }
    if (!audio) { musicBtn.hidden = true; return; }

    audio.volume = 0;
    musicBtn.hidden = false;
    musicBtn.classList.add('is-pre');
    reflectMusic(false);

    audio.addEventListener('error', function () {
      musicBroken = true;
      musicBtn.hidden = true;
    });

    musicBtn.addEventListener('click', function () {
      if (audio.paused) startMusic(false);
      else stopMusic();
    });

    if (musicChannel) {
      musicChannel.onmessage = function (e) {
        if (e.data === 'claim' && !audio.paused) {
          audio.pause();
          musicOn = false;
          reflectMusic(false);
        }
      };
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (!audio.paused) { audio.pause(); hiddenPaused = true; }
      } else if (hiddenPaused) {
        hiddenPaused = false;
        if (musicOn) { audio.play().catch(noop); claimPlayback(); }
      }
    });
  }

  function claimPlayback() {
    if (musicChannel) { try { musicChannel.postMessage('claim'); } catch (e) {} }
  }

  function startMusic(silentFail) {
    if (musicBroken || !audio) return;
    if (!audio.src) audio.src = cfg.music.file;
    const p = audio.play();
    if (p && p.then) {
      p.then(function () {
        musicOn = true;
        reflectMusic(true);
        if (musicBtn) musicBtn.classList.remove('is-pre');
        if (STATIC) audio.volume = cfg.music.volume || .42;
        else gsap.to(audio, { volume: cfg.music.volume || .42, duration: 2.6 });
        claimPlayback();
      }).catch(function () {
        if (!silentFail && musicBtn) musicBtn.classList.add('is-blocked');
      });
    }
  }

  function stopMusic() {
    if (!audio) return;
    audio.pause();
    musicOn = false;
    audio.volume = 0;
    reflectMusic(false);
  }

  /* ══ VIDEO ═══════════════════════════════════════════════════════════════ */
  function initVideos() {
    const cards = $$('.vcard');
    if (!cards.length) return;

    cards.forEach(function (card) {
      const vid    = $('.vcard__video', card);
      const toggle = $('.vcard__toggle', card);
      const bar    = $('.vcard__progress i', card);
      if (!vid || !toggle) return;
      const label  = (toggle.getAttribute('aria-label') || '').replace(/^(Play|Pause) video/, '');

      function prime() {
        if (vid.src) return;
        vid.preload = 'auto';
        vid.src = vid.dataset.src;
      }
      function start() {
        prime();
        const p = vid.play();
        if (p && p.catch) {
          p.catch(function () {
            vid.addEventListener('canplay', function () { vid.play().catch(noop); }, { once: true });
          });
        }
      }
      card._prime = prime;
      card._start = start;

      toggle.addEventListener('click', function () {
        if (vid.paused) { delete card.dataset.held; start(); }
        else { card.dataset.held = '1'; vid.pause(); }
      });

      vid.addEventListener('timeupdate', function () {
        if (vid.currentTime > 0.05) card.classList.add('has-started');
      });
      vid.addEventListener('playing', function () {
        setTimeout(function () { if (vid.currentTime > 0.05) card.classList.add('has-started'); }, 260);
      });
      vid.addEventListener('play', function () {
        card.classList.add('is-playing');
        toggle.setAttribute('aria-label', 'Pause video' + label);
      });
      vid.addEventListener('pause', function () {
        card.classList.remove('is-playing');
        toggle.setAttribute('aria-label', 'Play video' + label);
      });

      if (bar) {
        vid.addEventListener('timeupdate', function () {
          const d = vid.duration;
          if (d && isFinite(d)) bar.style.transform = 'scaleX(' + (vid.currentTime / d) + ')';
        });
      }
    });

    if (REDUCED || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        const card = e.target;
        const vid = $('.vcard__video', card);
        if (!vid || !card._start) return;
        if (e.intersectionRatio === 0) delete card.dataset.held;
        if (e.isIntersecting && e.intersectionRatio >= .45) {
          if (vid.paused && !card.dataset.held) card._start();
        } else if (!vid.paused) {
          vid.pause();
        }
      });
    }, { threshold: [0, .45, .8] });
    cards.forEach(function (c) { io.observe(c); });

    const primer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.target._prime) {
          e.target._prime();
          primer.unobserve(e.target);
        }
      });
    }, { rootMargin: '120% 0px' });
    cards.forEach(function (c) { primer.observe(c); });
  }

  /* ══ CUSTOM CURSOR ═══════════════════════════════════════════════════════ */
  function initCursor() {
    const wrap = $('#cursor');
    if (!wrap || STATIC) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    root.classList.add('has-cursor');
    wrap.style.opacity = '0';
    const ring = $('.cursor__ring', wrap);
    const dot = $('.cursor__dot', wrap);
    const label = $('.cursor__label', wrap);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let seen = false;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; wrap.style.opacity = '1'; }
      if (dot) dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });

    window.addEventListener('pointerleave', function () { wrap.style.opacity = '0'; });
    window.addEventListener('pointerenter', function () { if (seen) wrap.style.opacity = '1'; });

    window.addEventListener('pointerdown', function () { wrap.classList.add('is-down'); });
    window.addEventListener('pointerup', function () { wrap.classList.remove('is-down'); });

    const hoverSel = 'a, button, [role="button"], .gift-tap, .panel__media, .vcard__toggle, .rail__item, .envelope, .candle';
    document.addEventListener('pointerover', function (e) {
      const t = e.target.closest ? e.target.closest(hoverSel) : null;
      if (!t) return;
      if (label) label.textContent = t.getAttribute('data-cursor') || 'Click';
      wrap.classList.add('is-hover');
    });
    document.addEventListener('pointerout', function (e) {
      const t = e.target.closest ? e.target.closest(hoverSel) : null;
      if (!t) return;
      const to = e.relatedTarget;
      if (to && t.contains(to)) return;
      wrap.classList.remove('is-hover');
    });

    (function loop() {
      rx += (mx - rx) * .16;
      ry += (my - ry) * .16;
      if (ring) ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (label) label.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%, 0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ══ MAGNETIC BUTTONS ════════════════════════════════════════════════════ */
  function initMagnets() {
    if (STATIC) return;
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * .22,
          y: (e.clientY - r.top - r.height / 2) * .22,
          duration: .45, ease: 'power2.out'
        });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .45)' });
      });
    });
  }

  /* ══ BINDINGS ════════════════════════════════════════════════════════════ */
  function bind() {
    press($('#openGift'), openIntroGift);
    const skipIntro = $('#skipIntro');
    if (skipIntro) {
      skipIntro.addEventListener('click', function () {
        if (state === 'intro' || state === 'opening') {
          startMusic(true);
          enterJourney();
        }
      });
    }

    press($('#openFinal'), openFinalGift);
    const skipFinale = $('#skipFinale');
    if (skipFinale) {
      skipFinale.addEventListener('click', function () {
        if (finaleTL && finaleTL.timeScale) finaleTL.timeScale(14);
      });
    }
    const replay = $('#replay');
    if (replay) replay.addEventListener('click', function () { location.reload(); });

    const brand = $('#hudBrand');
    if (brand) brand.addEventListener('click', function () {
      if (state === 'journey') scrollToEl('#reveal');
    });

    loveLetter();
    candleScene();
  }

  /* ══ BOOT ════════════════════════════════════════════════════════════════ */
  function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    Scenes.build(cfg);
    if (typeof Particles !== 'undefined' && Particles.init) {
      Particles.init({
        reduced: REDUCED,
        density: (cfg.settings && cfg.settings.particleDensity) || 1
      });
    }
    if (typeof Glyph !== 'undefined' && Glyph.init) {
      Glyph.init({ reduced: REDUCED, shape: 'heart' });
    }

    setInert(journey, true);
    setInert(finale, true);
    if (hud) hud.setAttribute('aria-hidden', 'true');

    initSmoothScroll();
    lockScroll();
    toTop();

    prepHero();
    initMusic();
    initVideos();
    initCursor();
    initMagnets();
    bind();
    initLoader();

    window.addEventListener('load', function () {
      if (state === 'intro') toTop();
      refreshSoon(220);
    });

    window.addEventListener('resize', function () {
      refreshSoon(260);
      scheduleChapter();
    });
    window.addEventListener('orientationchange', function () { setTimeout(refreshSoon, 350); });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { refreshSoon(120); });
    }

    /* new media changes layout — measure again */
    document.addEventListener('load', function (e) {
      if (e.target && e.target.tagName === 'IMG') refreshSoon(240);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
