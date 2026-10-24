# For Anziya — Happy Birthday, My Love

A cinematic, scroll-driven birthday letter from **Elton** to **Anziya**.
Deep velvet bordeaux, rose-gold type, and a story told in nine movements.

Built with **HTML, CSS and vanilla JavaScript** — no build step, no framework.
GSAP + Lenis and all fonts are **self-hosted**, so the site runs fully offline.

---

## 1 · Run it

```bash
python3 -m http.server 8124
```

Open `http://localhost:8124`. A local server is recommended (the video needs HTTP).

---

## 2 · The journey

| # | Scene | What happens |
|---|-------|--------------|
| — | **Loader** | A veil parts as the story loads. |
| 01 | **The Velvet Gift** | A floating isometric gift box, a rose-gold ribbon, and a single tap that opens everything. |
| 02 | **The Hero** | "Anziya" set in Bodoni at 300 px, each letter rising into a moving gradient. |
| 03 | **Memories** | A **pinned horizontal gallery** — ten framed memories drift sideways as you scroll, with inertia, parallax and a live counter. |
| 04 | **Film** | One looped clip, framed edge to edge, with a frosted play control and progress hairline. |
| 05 | **Our Story** | An editorial three-year timeline with oversized numerals that light up as they pass. |
| 06 | **The Letter** | A wax-sealed envelope. Tap it: the seal cracks, the flap folds back, and the letter unfolds on real paper stock. |
| 07 | **The Wish** | Pinned and darkened. Two whispered lines, then a candle. Tap the flame to blow it out. |
| 08 | **The Finale** | Stardust gathers into a beating heart, dissolves, and reveals the photograph and the closing vows. |
| — | **Chrome** | Live chapter rail, progress bar, current-chapter readout, custom cursor, magnetic buttons, grain, and a sound toggle. |

Motion is choreographed with **GSAP ScrollTrigger**, scrolling is smoothed with **Lenis**,
and everything degrades gracefully: no reduced-motion, no GSAP, or no JS at all still leaves a
readable, beautiful page.

---

## 3 · What's new in this version

* **Type is the hero.** Bodoni Moda display, Cormorant Garamond for prose, Inter for UI, Alex Brush for handwriting — all self-hosted and subset to Latin.
* **A 17–18 px fluid base** on large screens, with an editorial scale (`clamp()` everywhere) so headlines read at 300 px and body copy never drops below 17 px.
* **Full-viewport layout** — hero, gallery and finale each own the screen; nothing feels like a web page stacked in a container.
* **Pinned horizontal gallery** (the "mixed scroll direction" trend from current award winners).
* **Kinetic typography** — masked word reveals, per-letter hero rise, gradient that travels across the name.
* **Performance** — original 3 MB photos re-encoded to responsive WebP (520 / 1000 / 1600 px) with `srcset`, `sizes`, intrinsic dimensions and lazy loading. Total photo payload dropped from ~12 MB to ~2.5 MB.
* **Craft layer** — film grain, bokeh particle canvas, 3px vignette, custom cursor with context labels, magnetic replay button, veil loader, chapter rail.
* **Accessibility** — keyboard operable (`Enter`/`Space` on every interactive scene), focus rings, `aria-expanded` on the letter, `aria-live` announcements, alt text on every image, and a full `prefers-reduced-motion` path.

---

## 4 · Customize

Everything written lives in **`js/config.js`**:

| Key | Controls |
|-----|----------|
| `name` | Her name (hero, finale, tab title) |
| `hero` | Eyebrow, date, closing line, meta labels |
| `photos[]` | Image, `w`/`h` (real pixel size), label, title, caption, alt |
| `galleryEnd` | The last card of the sideways gallery |
| `videos[]` | Clip, poster, ratio, caption |
| `timeline[]` | Chapter label, text, image |
| `letter` | Greeting, body paragraphs, signature |
| `candle` / `pause` | Wish prompt, hint, whispered lines |
| `final` | Portrait, title, closing lines, replay label |
| `music` | Audio file and volume |

Words wrapped in asterisks render in italic rose — e.g. `"my *favorite* chapter"`.

### Replacing a photo
Drop a new image at `assets/photos/photoNN.jpg`, then regenerate the WebP set:

```bash
for w in 520 1000 1600; do
  convert assets/photos/photoNN.jpg -auto-orient -resize ${w}x \
    -strip -quality 80 -define webp:method=6 "assets/photos/opt/photoNN-${w}.webp"
done
```

Update `w` and `h` in `config.js` to the real dimensions.

---

## 5 · Deploy

Drag the folder into [app.netlify.com/drop](https://app.netlify.com/drop),
or push it to GitHub and enable **Settings → Pages**.
No build, no environment variables.

---

## 6 · Files

```
index.html
css/
  fonts.css      @font-face declarations
  style.css      tokens, chrome, atmosphere, components
  scenes.css     every scene layout + responsive rules
js/
  config.js      all of the words and settings
  scenes.js      turns config into markup
  script.js      loader, scroll, gallery, letter, candle, finale, cursor
  particles.js   ambient stardust + the beating-heart canvas
  vendor/        gsap, ScrollTrigger, lenis
assets/
  photos/        originals + opt/ responsive WebP set
  videos/        the clip and its poster
  music/         theme.m4a
  fonts/         self-hosted woff2
```

Made with love, for Anziya. **E ♡ A**
