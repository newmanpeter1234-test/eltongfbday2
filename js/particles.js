/* ============================================================================
   particles.js — Ambient rose stardust field, light burst, and parametric
   beating heart glyph. Pure HTML5 Canvas 2D, zero dependencies.
   Deep Velvet Bordeaux & Rose Theme
   ========================================================================== */

const Particles = (function () {
  let cv, ctx, W = 0, H = 0, dpr = 1;
  let field = [], burst = [], raf = null, alive = false;
  let intensity = 1, density = 1, reduced = false;
  let scrollOff = 0, px = 0, py = 0, tx = 0, ty = 0;
  let sprites = {};
  let last = 0;

  const TINTS = {
    rose: [247, 194, 209],
    warm: [229, 140, 168],
    gold: [235, 208, 162],
    pale: [255, 245, 248]
  };

  function buildSprites() {
    Object.keys(TINTS).forEach(function (key) {
      const s = 48;
      const c = document.createElement('canvas');
      c.width = c.height = s;
      const g = c.getContext('2d');
      const rgb = TINTS[key].join(',');
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, 'rgba(' + rgb + ',1)');
      grad.addColorStop(0.35, 'rgba(' + rgb + ',0.48)');
      grad.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
      sprites[key] = c;
    });
  }

  function countFor(w, h) {
    const base = (w * h) / 6800;
    /* phones get a lower ceiling: the ambience reads the same but the
       per-frame drawImage count roughly halves */
    const ceiling = Math.min(w, h) < 700 ? 120 : 180;
    return Math.round(Math.min(ceiling, Math.max(48, base)) * density);
  }

  function makeParticle() {
    const ember = Math.random() < 0.38;
    const rVal = Math.random();
    const tint = rVal < 0.35 ? 'rose' : (rVal < 0.65 ? 'warm' : (rVal < 0.88 ? 'gold' : 'pale'));
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: ember ? 1.5 + Math.random() * 2.8 : 0.6 + Math.random() * 1.25,
      a: ember ? 0.2 + Math.random() * 0.28 : 0.32 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * (ember ? 0.12 : 0.04),
      vy: -(0.04 + Math.random() * (ember ? 0.16 : 0.06)),
      tw: 0.4 + Math.random() * 1.6,
      ph: Math.random() * Math.PI * 2,
      depth: ember ? 0.55 + Math.random() * 0.45 : 0.08 + Math.random() * 0.32,
      tint: tint
    };
  }

  function populate() {
    field = [];
    const n = countFor(W, H);
    for (let i = 0; i < n; i++) field.push(makeParticle());
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawSprite(p, alpha, x, y, r) {
    const img = sprites[p.tint] || sprites.rose;
    const d = r * 6.2;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.drawImage(img, x - d / 2, y - d / 2, d, d);
  }

  function render(t) {
    /* sampled here rather than from a scroll listener — one read per drawn
       frame is enough for a slow parallax and leaves the scroll path free */
    scrollOff = window.scrollY || 0;
    ctx.clearRect(0, 0, W, H);
    if (intensity <= 0.01) return;

    px += (tx - px) * 0.06;
    py += (ty - py) * 0.06;

    for (let i = 0; i < field.length; i++) {
      const p = field[i];
      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;
      }
      const flick = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * p.tw + p.ph);
      const ox = px * p.depth * 28;
      const oy = py * p.depth * 28 - scrollOff * p.depth * 0.06;
      let y = p.y + oy;
      if (y < -40) y += H + 80; else if (y > H + 40) y -= H + 80;
      drawSprite(p, p.a * flick * intensity, p.x + ox, y, p.r);
    }

    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      b.life -= 0.016;
      if (b.life <= 0) { burst.splice(i, 1); continue; }
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.982; b.vy = b.vy * 0.982 + 0.035;
      drawSprite(b, Math.max(0, b.life / b.max) * 0.95, b.x, b.y, b.r);
    }
    ctx.globalAlpha = 1;
  }

  /* While the page is moving the dust is frozen. It is a slow background
     drift, so freezing is invisible, but it takes a full-viewport canvas
     clear + 120 sprite blits per frame off the main thread exactly when the
     scroll needs it. It resumes ~140ms after the scroll settles. */
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    lastScroll = Date.now();
  }, { passive: true });

  function loop(t) {
    if (!alive) return;
    if (Date.now() - lastScroll < 140) { raf = requestAnimationFrame(loop); return; }
    /* ~40fps is indistinguishable for drifting dust and leaves the main
       thread room for scrolling */
    if (t - last > 24) { render(t); last = t; }
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (alive || reduced) return;
    alive = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  return {
    init: function (opts) {
      cv = document.getElementById('fx');
      if (!cv) return;
      ctx = cv.getContext('2d', { alpha: true });
      reduced = !!(opts && opts.reduced);
      density = (opts && typeof opts.density === 'number') ? opts.density : 1;
      if (reduced) density = Math.min(density, 0.55);
      buildSprites();
      resize();
      populate();

      let rt, lastW = W, lastH = H;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 140) return;
          lastW = window.innerWidth; lastH = window.innerHeight;
          resize(); populate();
          if (reduced) render(0);
        }, 220);
      }, { passive: true });

      if (!reduced) {
        window.addEventListener('pointermove', function (e) {
          tx = (e.clientX / W) * 2 - 1;
          ty = (e.clientY / H) * 2 - 1;
        }, { passive: true });
        document.addEventListener('visibilitychange', function () {
          document.hidden ? stop() : start();
        });
        start();
      } else {
        render(0);
      }
    },

    burstAt: function (x, y, count) {
      if (reduced) return;
      const n = count || 100;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 7.5;
        const life = 0.8 + Math.random() * 1.5;
        burst.push({
          x: x, y: y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.1,
          r: 1 + Math.random() * 2.5,
          life: life, max: life,
          tint: Math.random() < 0.6 ? 'rose' : (Math.random() < 0.85 ? 'warm' : 'gold')
        });
      }
      start();
    },

    setIntensity: function (v) { intensity = Math.max(0, Math.min(1, v)); },
    pause: stop,
    resume: start
  };
})();


/* ============================================================================
   Glyph — Beating Heart Stardust Constellation for Anziya
   Hundreds of radiant particles gather into an intricate beating heart shape.
   ========================================================================== */

const Glyph = (function () {
  let cv, ctx, W = 0, H = 0, dpr = 1;
  let pts = [], raf = null, alive = false, fade = 1, phase = 'idle', t0 = 0;
  let reduced = false, shape = 'heart';

  /* The heart beats exactly twice, then it lets go.
     Beat 1 lands just after the particles finish gathering; beat 2 follows one
     period later, so the pulse reads instead of becoming a long drum roll. */
  const BEAT_START = 0.95;   /* seconds of gathering before the first pulse */
  const BEAT_PERIOD = 1.9;   /* seconds between pulses */
  const MAX_BEATS = 2;

  function shapePoint(R) {
    const t = Math.random() * Math.PI * 2;
    let x, y;

    /* Cardioid Heart */
    x = (16 * Math.pow(Math.sin(t), 3)) / 17;
    y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;

    const a = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.65) * 0.06;
    return { x: (x + Math.cos(a) * r) * R, y: (y + Math.sin(a) * r) * R };
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    /* the overlay is display:grid over the viewport — measure the stage,
       with the window as the floor in case it is still hidden */
    W = Math.max(cv.clientWidth, cv.parentElement ? cv.parentElement.clientWidth : 0, window.innerWidth);
    H = Math.max(cv.clientHeight, cv.parentElement ? cv.parentElement.clientHeight : 0, window.innerHeight);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function build() {
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.385;
    const n = reduced ? 170 : (W < 520 ? 360 : 560);
    pts = [];
    for (let i = 0; i < n; i++) {
      const tgt = shapePoint(R);
      const sa = Math.random() * Math.PI * 2;
      const sr = Math.max(W, H) * (0.36 + Math.random() * 0.42);
      pts.push({
        x: cx + Math.cos(sa) * sr,
        y: cy + Math.sin(sa) * sr,
        tx: cx + tgt.x, ty: cy + tgt.y,
        ease: 0.038 + Math.random() * 0.05,
        r: 0.9 + Math.random() * 2.1,
        a: 0.5 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
        isRose: Math.random() < 0.65
      });
    }
  }

  function paint(p, alpha) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.isRose
      ? 'rgba(248,212,223,' + alpha + ')'
      : 'rgba(237,213,172,' + alpha + ')';
    ctx.fill();
    /* a halo on the brightest grains so the heart reads as light, not dots */
    if (alpha > .62) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
      ctx.fillStyle = p.isRose
        ? 'rgba(231,160,182,' + (alpha * .13) + ')'
        : 'rgba(230,203,160,' + (alpha * .13) + ')';
      ctx.fill();
    }
  }

  function frame(t) {
    if (!alive) return;
    if (!t0) t0 = t;
    const el = (t - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    /* Romantic heartbeat — a sharp squeeze on the beat, then rest.
       Nothing past MAX_BEATS: the heart should say it twice, not keep going. */
    const beatPhase = (el - BEAT_START) / BEAT_PERIOD;
    const beat = beatPhase > MAX_BEATS - 0.5 ? 0 : Math.sin(beatPhase * Math.PI * 2);
    const breathe = 1 + (beat > 0 ? Math.pow(beat, 4) * 0.055 : 0);
    const cx = W / 2, cy = H / 2;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const gx = cx + (p.tx - cx) * breathe;
      const gy = cy + (p.ty - cy) * breathe;
      p.x += (gx - p.x) * p.ease;
      p.y += (gy - p.y) * p.ease;
      const wob = Math.sin(el * 1.8 + p.ph) * 1.1;
      const alpha = p.a * fade * (0.75 + 0.25 * Math.sin(el * 2.5 + p.ph));
      const sx = p.x, sy = p.y;
      p.x += wob; p.y += wob * 0.6;
      paint(p, alpha);
      p.x = sx; p.y = sy;
    }

    if (phase === 'out') {
      fade -= 0.014;
      if (fade <= 0) { ctx.clearRect(0, 0, W, H); stop(); return; }
    }
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  return {
    init: function (opts) {
      cv = document.getElementById('glyph');
      if (!cv) return;
      ctx = cv.getContext('2d');
      reduced = !!(opts && opts.reduced);
      if (opts && opts.shape) shape = opts.shape;
    },
    start: function () {
      if (!cv) return;
      size(); build();
      fade = 1; phase = 'in'; t0 = 0; alive = true;
      if (reduced) {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(function (p) { p.x = p.tx; p.y = p.ty; paint(p, 0.85); });
        alive = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    },
    dissolve: function () {
      if (!cv) return;
      if (!alive) { ctx && ctx.clearRect(0, 0, W, H); return; }
      phase = 'out';
    },
    stop: stop
  };
})();
