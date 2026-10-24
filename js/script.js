/* ============================================================================
   script.js — Master Orchestrator for Anziya's Birthday Story
   Lenis smooth scrolling, GSAP ScrollTrigger, Audio sync, Video viewporting,
   Interactive Wax Seal Letter & Birthday Candle
   ========================================================================== */

(function () {
  'use strict';

  const cfg = window.birthdayConfig || birthdayConfig;
  const root = document.documentElement;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $  = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  const D  = function (n) { return REDUCED ? 0.001 : n; };
  const noop = function () {};

  /* GSAP offline fallback */
  const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  if (REDUCED) root.classList.add('no-motion');
  const STATIC = REDUCED || !HAS_GSAP;

  if (HAS_GSAP) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    root.classList.add('no-motion');
    window.gsap = makeGsapStandIn();
    window.ScrollTrigger = {
      create: function (v) { if (v && v.onEnter) v.onEnter({ progress: 1 }); return { kill: noop }; },
      refresh: noop, getAll: function () { return []; }, update: noop
    };
  }

  function makeGsapStandIn() {
    const SKIP = { duration:1, delay:1, ease:1, stagger:1, scrollTrigger:1, onComplete:1,
                   onStart:1, onUpdate:1, immediateRender:1, overwrite:1, repeat:1,
                   yoyo:1, defaults:1, paused:1, force3D:1, repeatDelay:1 };
    const T = { x:'px', y:'px', z:'px' };

    function list(t) {
      if (!t) return [];
      if (typeof t === 'string') return $$(t);
      if (t.nodeType) return [t];
      if (t.length != null) return Array.prototype.slice.call(t);
      return [t];
    }
    function apply(targets, vars) {
      list(targets).forEach(function (el) {
        if (!el || !el.style) {
          Object.keys(vars).forEach(function (k) { if (!SKIP[k]) { try { el[k] = vars[k]; } catch (e) {} } });
          return;
        }
        const tr = [];
        Object.keys(vars).forEach(function (k) {
          if (SKIP[k]) return;
          const v = vars[k];
          if (k === 'x' || k === 'y' || k === 'z') tr.push('translate' + k.toUpperCase() + '(' + v + (T[k] && typeof v === 'number' ? 'px' : '') + ')');
          else if (k === 'xPercent') tr.push('translateX(' + v + '%)');
          else if (k === 'yPercent') tr.push('translateY(' + v + '%)');
          else if (k === 'scale' || k === 'scaleX' || k === 'scaleY') tr.push(k + '(' + v + ')');
          else if (k === 'rotation' || k === 'rotate') tr.push('rotate(' + v + 'deg)');
          else if (k === 'autoAlpha') { el.style.opacity = v; el.style.visibility = v > 0 ? 'visible' : 'hidden'; }
          else el.style[k] = v;
        });
        if (tr.length) el.style.transform = tr.join(' ');
      });
    }
    const scrubbed = function (v) { return v && v.scrollTrigger && v.scrollTrigger.scrub; };

    const api = {
      registerPlugin: noop,
      set: apply,
      to: function (t, v) { if (!scrubbed(v)) { apply(t, v); if (v && v.onComplete) v.onComplete(); } return api; },
      from: function (t, v) { if (v && v.onComplete) v.onComplete(); return api; },
      fromTo: function (t, f, v) { if (!scrubbed(v)) { apply(t, v); if (v && v.onComplete) v.onComplete(); } return api; },
      timeline: function (vars) {
        const dead = scrubbed(vars);
        const tl = {
          to: function (t, v) { if (!dead) api.to(t, v); return tl; },
          from: function (t, v) { if (!dead) api.from(t, v); return tl; },
          fromTo: function (t, f, v) { if (!dead) api.fromTo(t, f, v); return tl; },
          set: function (t, v) { if (!dead) apply(t, v); return tl; },
          call: function (fn) { if (!dead && fn) fn(); return tl; },
          add: function () { return tl; },
          kill: noop, play: function () { return tl; }, pause: function () { return tl; }
        };
        if (!dead && vars && vars.scrollTrigger && vars.scrollTrigger.onEnter) {
          vars.scrollTrigger.onEnter({ progress: 1 });
        }
        if (!dead && vars && vars.onComplete) setTimeout(vars.onComplete, 0);
        return tl;
      }
    };
    return api;
  }

  /* ══ DOM Elements ════════════════════════════════════════════════════════ */
  const intro       = $('#intro');
  const journey     = $('#journey');
  const finale      = $('#finale');
  const flash       = $('#flash');
  const memProgress = $('#memProgress');
  const announcer   = $('#announce');
  const audio       = $('#bgm');
  const musicBtn    = $('#musicToggle');

  let state = 'intro';
  let finaleTL = null;
  let scrollBuilt = false;

  function announce(msg) { if (announcer) announcer.textContent = msg; }

  /* ══ Smooth Scrolling with Lenis ═════════════════════════════════════════ */
  let lenis = null;
  const IS_SAFARI = /^((?!chrome|chromium|crios|android|fxios|edg).)*safari/i.test(navigator.userAgent);

  function initSmoothScroll() {
    if (REDUCED || IS_SAFARI || typeof Lenis === 'undefined' || !HAS_GSAP) return;
    try {
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1.6
      });
    } catch (e) { lenis = null; return; }

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  function scrollTop() {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }

  function lockScroll() {
    root.classList.add('is-locked'); document.body.classList.add('is-locked');
    if (lenis) lenis.stop();
  }
  function unlockScroll() {
    root.classList.remove('is-locked'); document.body.classList.remove('is-locked');
    if (lenis) lenis.start();
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

  function setInert(node, on) {
    if (!node) return;
    try { node.inert = on; } catch (e) {}
    if (on) node.setAttribute('aria-hidden', 'true');
    else node.removeAttribute('aria-hidden');
  }

  /* ══ Gift Box Opening Animation ══════════════════════════════════════════ */
  function openGiftBox(giftEl, onPeak, onDone) {
    if (!giftEl) { onPeak && onPeak(); onDone && onDone(); return null; }

    giftEl.classList.add('is-opening');
    const r    = giftEl.getBoundingClientRect();
    const cx   = r.left + r.width / 2;
    const cy   = r.top + r.height * 0.42;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to($('.gift__glow', giftEl), { opacity: 1, duration: D(0.6) })
      .to($('.gift__lid', giftEl),  { y: -60, x: 6, rotation: -8, transformOrigin: '50% 50%',
                                      duration: D(1.15), ease: 'power3.inOut' }, '-=0.35')
      .to($('.gift__beam', giftEl), { opacity: 1, scaleY: 1, duration: D(0.9) }, '<')
      .to($('.gift__aura', giftEl), { scale: 2.8, opacity: 1, duration: D(1.2) }, '<')
      .call(function () { Particles.burstAt(cx, cy, window.innerWidth < 600 ? 95 : 150); })
      .to($('.gift__svg', giftEl),  { opacity: 0.1, duration: D(0.9) }, '-=0.7')
      .to(flash, { opacity: 1, duration: D(0.6) }, '-=0.45')
      .call(function () { onPeak && onPeak(); })
      .to(flash, { opacity: 0, duration: D(1.4) })
      .call(function () { onDone && onDone(); });
    return tl;
  }

  /* ══ Scene 1 → 2 ═════════════════════════════════════════════════════════ */
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
    if (state === 'journey' || state === 'finale') return;
    state = 'journey';

    intro.classList.remove('is-active');
    setInert(intro, true);
    setInert(journey, false);
    unlockScroll();
    scrollTop();
    journey.classList.remove('is-veiled');
    if (!musicBroken) musicBtn.classList.remove('is-pre');
    announce('Happy Birthday, ' + cfg.name + '. Scroll to begin our journey.');

    ScrollTrigger.refresh();
    playReveal();
  }

  function playReveal() {
    const r = $('#reveal');
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo($('.reveal__greeting .mask__i', r), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: D(1.1) }, 0.25)
      .fromTo($('.reveal__name .mask__i', r),     { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: D(1.5) }, 0.55)
      .fromTo($('.reveal__date .mask__i', r),     { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: D(1.1) }, 1.1)
      .fromTo($('.rule', r),                      { scaleX: 0, opacity: 0 },     { scaleX: 1, opacity: 1, duration: D(1.2) }, 1.45)
      .fromTo($$('.reveal__lines p', r),          { y: 26, opacity: 0 },         { y: 0, opacity: 1, duration: D(1.1), stagger: 0.45 }, 1.8)
      .fromTo($('.scroll-cue', r),                { y: 16, opacity: 0 },         { y: 0, opacity: 1, duration: D(1.1) }, 3.2);
  }

  /* ══ Scroll-Driven Animations ════════════════════════════════════════════ */
  function buildScrollAnimations() {
    if (scrollBuilt) return;
    scrollBuilt = true;

    chapters();
    memories();
    videoCards();
    timeline();
    loveLetter();
    quietPauseAndCandle();

    ScrollTrigger.refresh();
  }

  function chapters() {
    $$('.chapter').forEach(function (ch) {
      const bits = $$('.rv', ch).filter(function (n) { return !n.classList.contains('chapter__rule'); });
      gsap.fromTo(bits, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: D(1.3), stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: ch, start: 'top 74%', once: true }
      });
      const rule = $('.chapter__rule', ch);
      if (rule) {
        gsap.fromTo(rule, { scaleX: 0, opacity: 0 }, {
          scaleX: 1, opacity: 1, duration: D(1.6), ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: ch, start: 'top 74%', once: true }
        });
      }
    });
  }

  function memories() {
    const cards = $$('.memory');
    const total = cards.length;
    const num   = $('.mem-progress__num', memProgress);
    const bar   = $('.mem-progress__bar i', memProgress);

    cards.forEach(function (m, i) {
      const label = $('.memory__label', m);
      const frame = $('.memory__frame', m);
      const imgs  = $$('img', frame);
      const text  = $('.memory__text', m);
      const stage = $('.memory__stage', m);
      const style = m.dataset.reveal;

      let from, to;
      if (style === 'curtain') {
        from = { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.05 };
        to   = { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: D(1.5) };
      } else if (style === 'bloom') {
        from = { opacity: 0, scale: 1.10 };
        to   = { opacity: 1, scale: 1, duration: D(1.7) };
      } else {
        from = { clipPath: 'inset(0% 100% 0% 0%)', x: -26 };
        to   = { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: D(1.5) };
      }
      to.ease = 'power3.out';

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: m, start: 'top 68%', once: true,
          onEnter: function () { loadMediaIn(m); }
        }
      });
      if (label) tl.fromTo(label, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: D(0.9) });
      tl.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: D(1.4) }, label ? '-=0.65' : 0)
        .fromTo(imgs, from, to, '<')
        .fromTo(text,  { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: D(1.1) }, '-=0.85');

      if (!REDUCED) {
        gsap.fromTo(frame, { y: 26 }, {
          y: -26, ease: 'none',
          scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
        });
        gsap.to(stage, {
          opacity: 0, y: -34, scale: 0.975, ease: 'none',
          scrollTrigger: { trigger: m, start: 'bottom 58%', end: 'bottom 4%', scrub: 0.5 }
        });
      }

      ScrollTrigger.create({
        trigger: m, start: 'top 60%', end: 'bottom 40%',
        onEnter:     function () { setProgress(i); },
        onEnterBack: function () { setProgress(i); }
      });
    });

    function setProgress(i) {
      if (num) num.textContent = pad(i + 1) + ' / ' + pad(total);
      if (bar) bar.style.transform = 'scaleX(' + ((i + 1) / total) + ')';
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    if (cards.length) {
      setProgress(0);
      const sync = function (self) { memProgress.classList.toggle('is-visible', !!self.isActive); };
      ScrollTrigger.create({
        trigger: '#memories', start: 'top 55%', end: 'bottom 60%',
        onToggle: sync, onRefresh: sync
      });
    }
  }

  function videoCards() {
    const cards = $$('.vcard');
    cards.forEach(function (card) {
      const frame = $('.vcard__frame', card);
      const cap   = $('.vcard__caption', card);

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: card, start: 'top 82%', once: true,
          onEnter: function () { loadMediaIn(card); }
        }
      });
      tl.fromTo(frame,
        { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.06, opacity: 1 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: D(1.5) });
      if (cap) {
        tl.fromTo(cap, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: D(1) }, '-=0.8');
      }
      gsap.set(card, { opacity: 1 });

      if (!REDUCED) {
        gsap.fromTo(frame, { y: 18 }, {
          y: -18, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
        });
      }
    });
  }

  function timeline() {
    const fill = $('.tl__fill');
    if (fill) {
      if (REDUCED) gsap.set(fill, { scaleY: 1 });
      else gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.tl__track', start: 'top 72%', end: 'bottom 78%', scrub: 0.6 }
      });
    }

    $$('.tl__item').forEach(function (item) {
      gsap.fromTo(item, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: D(1.2), ease: 'power3.out',
        scrollTrigger: {
          trigger: item, start: 'top 82%', once: true,
          onEnter: function () { loadMediaIn(item); }
        }
      });
      ScrollTrigger.create({
        trigger: item, start: 'top 76%', once: true,
        onEnter: function () { const d = $('.tl__dot', item); if (d) d.classList.add('is-lit'); }
      });
    });
  }

  /* ══ Interactive Love Letter with Wax Seal ════════════════════════════════ */
  function loveLetter() {
    const env = $('#envelope');
    const seal = $('#waxSeal');
    if (!env) return;

    gsap.fromTo(env, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: D(1.2), ease: 'power3.out',
      scrollTrigger: { trigger: '#letterSection', start: 'top 75%', once: true }
    });

    press(env, function () {
      if (env.classList.contains('is-open')) return;
      env.classList.add('is-open');

      const r = (seal || env).getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      Particles.burstAt(cx, cy, 60);

      announce("Elton's letter unfolded: Almost three years ago, our story began...");
      ScrollTrigger.refresh();
    });
  }

  /* ══ Scene 6 · The Quiet Pause & Birthday Candle ══════════════════════════ */
  let candleBlown = false;

  function quietPauseAndCandle() {
    const sec     = $('#pause');
    const lines   = $$('.pause__line', sec);
    const candleS = $('#candleStage');
    const candle  = $('#birthdayCandle');
    const cHint   = $('#candleHint');
    const reveal  = $('.pause__reveal', sec);
    const bg      = $('.bg');
    if (!sec) return;

    function setGiftReady(on) {
      reveal.classList.toggle('is-ready', on);
    }

    /* Candle click interaction: blow out flame, smoke puff, particles */
    press(candle, function () {
      if (candleBlown) return;
      candleBlown = true;
      candle.classList.add('is-blown');

      const r = candle.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + 10;
      Particles.burstAt(cx, cy, 75);

      if (cHint) cHint.textContent = (cfg.candle && cfg.candle.blownMessage) || "May all your wishes come true, my love. ♥";

      setTimeout(function () {
        gsap.to(candleS, { opacity: 0, y: -20, duration: D(1.0), onComplete: function () {
          candleS.classList.remove('is-active');
          gsap.fromTo(reveal, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: D(1.2), ease: 'power2.out', onComplete: function () {
            setGiftReady(true);
            announce('A final gift for Anziya.');
          }});
        }});
      }, 1800);
    });

    if (!REDUCED) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec, start: 'top 25%', end: 'bottom bottom', scrub: 0.8
        }
      });
      lines.forEach(function (ln) {
        tl.fromTo(ln, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
          .to({}, { duration: 1.4 })
          .to(ln, { opacity: 0, y: -18, duration: 0.9, ease: 'power2.in' });
      });

      tl.call(function () {
        candleS.classList.add('is-active');
      });

      ScrollTrigger.create({
        trigger: sec, start: 'top bottom', end: 'bottom bottom',
        onUpdate: function (self) {
          Particles.setIntensity(1 - self.progress * 0.75);
          if (bg) bg.style.opacity = String(1 - self.progress * 0.5);
        },
        onLeaveBack: function () { Particles.setIntensity(1); if (bg) bg.style.opacity = '1'; }
      });
    } else {
      gsap.set(lines, { opacity: 1 });
      candleS.classList.add('is-active');
      setGiftReady(true);
    }
  }

  /* ══ Scene 6 → 7 · The Final Reveal ══════════════════════════════════════ */
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

    finale.classList.add('is-active');
    setInert(finale, false);
    setInert(journey, true);
    lockScroll();
    Particles.setIntensity(0.25);
    announce('A final message for ' + cfg.name + '.');

    const light  = $('#finaleLight');
    const photo  = $('.finale__photo');
    const name   = $('#finaleName');
    const lines  = $$('.finale__line');
    const replay = $('#replay');
    const skip   = $('#skipFinale');
    skip.hidden = false;

    finaleTL = gsap.timeline({ defaults: { ease: 'power2.out' } });

    finaleTL
      .to({}, { duration: D(0.9) })
      .fromTo(light, { opacity: 0, scale: 0.15 }, { opacity: 1, scale: 1, duration: D(1.5) })
      .call(function () { if (!STATIC) Glyph.start(); })
      .to(light, { opacity: 0.32, duration: D(1.6) })
      .to({}, { duration: D(2.2) })
      .call(function () { if (!STATIC) Glyph.dissolve(); })
      .to(light, { opacity: 0, duration: D(1.3) })
      .fromTo(photo, { opacity: 0, scale: 1.07, clipPath: 'inset(0% 0% 100% 0%)' },
                     { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: D(1.8), ease: 'power3.out' }, '-=0.5')
      .fromTo(name,  { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: D(1.3) }, '-=0.6');

    lines.forEach(function (ln, i) {
      finaleTL.fromTo(ln, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: D(1.2) }, '+=' + D(0.45));
      if (!STATIC && i < lines.length - 1) {
        finaleTL.to(ln, { opacity: 0, y: -18, duration: D(1.0), ease: 'power2.in' }, '+=' + D(2.4));
      }
    });

    finaleTL
      .fromTo(replay, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: D(1.1) }, '+=' + D(0.9))
      .call(function () {
        replay.classList.add('is-ready');
        skip.hidden = true;
        Particles.setIntensity(0.55);
      });
  }

  /* ══ Romantic Music Controller ═══════════════════════════════════════════ */
  let musicOn = false, musicBroken = false, hiddenPaused = false;
  let musicChannel = null;
  try { musicChannel = new BroadcastChannel('anziya-bday-music'); } catch (e) {}

  function reflectMusic(on) {
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
  }

  function initMusic() {
    if (!cfg.music || !cfg.music.file) { musicBtn.hidden = true; return; }
    audio.volume = 0;
    musicBtn.hidden = false;
    musicBtn.classList.add('is-pre');

    audio.addEventListener('error', function () {
      musicBroken = true;
      musicBtn.hidden = true;
    });

    musicBtn.addEventListener('click', function () {
      audio.paused ? startMusic(false) : stopMusic();
    });

    if (musicChannel) {
      musicChannel.onmessage = function (e) {
        if (e.data === 'claim' && !audio.paused) { audio.pause(); musicOn = false; reflectMusic(false); }
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
    if (musicBroken) return;
    if (!audio.src) audio.src = cfg.music.file;
    const p = audio.play();
    if (p && p.then) {
      p.then(function () {
        musicOn = true;
        reflectMusic(true);
        gsap.to(audio, { volume: cfg.music.volume || 0.45, duration: D(2.5) });
        claimPlayback();
      }).catch(function () {
        if (!silentFail) musicBtn.classList.add('is-blocked');
      });
    }
  }

  function stopMusic() {
    audio.pause();
    musicOn = false;
    audio.volume = 0;
    reflectMusic(false);
  }

  /* ══ Video Controller ════════════════════════════════════════════════════ */
  function initVideos() {
    const cards = $$('.vcard');
    if (!cards.length) return;

    cards.forEach(function (card) {
      const vid    = $('.vcard__video', card);
      const toggle = $('.vcard__toggle', card);
      const bar    = $('.vcard__progress i', card);
      const label  = toggle.getAttribute('aria-label').replace(/^(Play|Pause) video/, '');

      function prime() {
        if (vid.src) return;
        vid.preload = 'auto';
        vid.src = vid.dataset.src;
      }
      card._prime = prime;

      function start() {
        prime();
        const p = vid.play();
        if (p && p.catch) {
          p.catch(function () {
            vid.addEventListener('canplay', function () { vid.play().catch(noop); }, { once: true });
          });
        }
      }
      card._start = start;

      toggle.addEventListener('click', function () {
        if (vid.paused) { delete card.dataset.held; start(); }
        else { card.dataset.held = '1'; vid.pause(); }
      });

      vid.addEventListener('loadeddata', function () { card.classList.add('has-started'); });
      vid.addEventListener('playing',    function () { card.classList.add('has-started'); });
      vid.addEventListener('play', function () {
        card.classList.add('is-playing');
        toggle.setAttribute('aria-label', 'Pause video' + label);
      });
      function stopped() {
        card.classList.remove('is-playing');
        toggle.setAttribute('aria-label', 'Play video' + label);
      }
      vid.addEventListener('pause', stopped);

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
        const vid  = $('.vcard__video', card);
        if (!vid) return;
        if (e.intersectionRatio === 0) delete card.dataset.held;
        if (e.isIntersecting && e.intersectionRatio >= 0.45) {
          if (vid.paused && !card.dataset.held) card._start();
        } else if (!vid.paused) {
          vid.pause();
        }
      });
    }, { threshold: [0, 0.45, 0.8] });

    cards.forEach(function (c) { io.observe(c); });

    const primer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target._prime(); primer.unobserve(e.target); }
      });
    }, { rootMargin: '120% 0px' });
    cards.forEach(function (c) { primer.observe(c); });
  }

  /* ══ Media Lazy Loading ══════════════════════════════════════════════════ */
  function loadMediaIn(root) {
    $$('img[data-src]', root).forEach(function (img) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    });
  }

  function initLazyMedia() {
    const targets = $$('img[data-src]');
    function load(img) {
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    }
    if (!('IntersectionObserver' in window)) { targets.forEach(load); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '200% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ══ Boot Application ════════════════════════════════════════════════════ */
  function boot() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    Scenes.build(cfg);
    Particles.init({ reduced: REDUCED, density: (cfg.settings && cfg.settings.particleDensity) || 1.1 });
    Glyph.init({ reduced: REDUCED, shape: 'heart' });

    setInert(journey, true);
    setInert(finale, true);
    initSmoothScroll();
    buildScrollAnimations();
    lockScroll();
    scrollTop();

    window.addEventListener('load', function () {
      if (state === 'intro') scrollTop();
    });

    press($('#openGift'), openIntroGift);
    $('#skipIntro').addEventListener('click', function () {
      if (state === 'intro' || state === 'opening') { startMusic(true); enterJourney(); }
    });
    press($('#openFinal'), openFinalGift);
    $('#skipFinale').addEventListener('click', function () {
      if (finaleTL && finaleTL.timeScale) finaleTL.timeScale(14);
    });
    $('#replay').addEventListener('click', function () { location.reload(); });

    initMusic();
    initVideos();
    initLazyMedia();

    let rt, lastH = document.body.scrollHeight;
    document.addEventListener('load', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastH) > 4) { lastH = h; ScrollTrigger.refresh(); }
      }, 300);
    }, true);
    window.addEventListener('orientationchange', function () {
      setTimeout(function () { ScrollTrigger.refresh(); }, 400);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    if (!HAS_GSAP) {
      intro.classList.add('is-active');
    }

    const reveal = function () { root.classList.add('is-booted'); };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reveal);
    } else {
      reveal();
    }
    setTimeout(reveal, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
