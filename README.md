# For Anziya — Happy Birthday, My Love

A bespoke, cinematic birthday website created for **Anziya** from **Elton**.
Designed in a luxurious **Deep Velvet Bordeaux & Rose** aesthetic with interactive storytelling, smooth animations, sound design, and romantic surprises.

Built with pure **HTML, Vanilla CSS, and Vanilla JavaScript** — zero build tools, zero dependencies.

---

## 1. Quick Start
Double-click `index.html` to open directly in any browser, or run a local server:
```bash
python3 -m http.server 8124
```
Then visit: `http://localhost:8124`

---

## 2. The Narrative & Chapters
* **Scene 1 (The Velvet Gift):** Floating isometric velvet gift box with rose-gold metallic ribbon. Tapping triggers a glowing lid lift, radiant particle burst, and fades in the romantic music.
* **Scene 2 (The Reveal):** Grand headline reveal: *"Happy Birthday, Anziya — November 8 — The day the world got a little brighter."*
* **Scene 3 (Chapter 1 · Photo Memories):** 
  * **Memory 01:** The broken hand and the teasing that started everything.
  * Followed by their adventures, playful gym flex, cozy selfies, and 3-year journey together.
  * Dynamic reveals (`curtain`, `bloom`, `slide`), parallax drift, and a live counter (`01 / 10`).
* **Scene 4 (Chapter 2 · Video Memories):** Seamlessly loops video moments silently on scroll; taps pause/play with a glowing rose-gold progress tracker.
* **Scene 5 (Chapter 3 · Our Three-Year Story):** Interactive glowing timeline with vertical rail tracking scroll progress.
* **Scene 5.5 (A Note For You):** An interactive **love letter with a wax seal (`E ♡ A`)** that cracks open when tapped to unfold Elton's personal message.
* **Scene 6 (The Quiet Pause & Make a Wish):** Darkening ambient glow, an interactive birthday candle with a flickering flame that Anziya taps to blow out with a smoke puff and sparkle burst, unveiling the final gift box.
* **Scene 7 (The Final Reveal):** Screen locks. Hundreds of stardust particles gather on canvas into a **glowing, beating Heart** that pulses before dissolving into the grand reveal of Anziya looking breathtaking in her red gown, accompanied by Elton's closing vows.

---

## 3. How to Customize

### The name font (the "Y" in Anziya)
In the original typeface the `y` has a straight, very light tail, so at headline
size it can read like a **V**. Pick a different face with **`nameFont`** in
`js/config.js`:

| Value | Look |
|---|---|
| `"playfair"` *(default)* | Heavier, clear curled y-tail |
| `"prata"` | High-contrast didone, strongly hooked y |
| `"bodoni"` | Dramatic thick/thin, unmistakable y |
| `"marcellus"` | Calm classical, round bowls |
| `"cinzel"` | Roman capitals, very legible |
| `"garamond"` | Soft, warm book face |
| `"cormorant"` | The original |

To compare them all without editing anything, add `?font=` to the URL —
e.g. `index.html?font=prata`. No rebuild needed; just reload.

### The loading screen
Opening the site shows a velvet curtain with the initials `E ♡ A`, the line
"A birthday story for Anziya", a live percentage and a hairline that fills.

The number is real, not decorative. It rises as fonts resolve and as the first
few photos arrive. It always finishes: a stalled request is abandoned after a
few seconds, and there is a hard cut-off plus a CSS-only failsafe, so a bad
connection can never leave anyone stuck on the curtain.

To change the words or the initials, edit the `#boot` block near the top of
`index.html`. Its look lives under `/* ── Loading screen ── */` in
`css/style.css`.

### How photos load (and why they never leave a blank gap)
Each entry in the `photos` array records the file's `width` and `height`:

```js
{
  image: "assets/photos/photo07.jpg",
  width: 1200,
  height: 1600,
  ...
}
```

`scenes.js` copies those onto the `<img>` element, so the browser reserves the
photo's real box before the file arrives. This matters on a slow connection:
previously the image was 0×0 until its bytes landed, which pushed every later
card out of position after ScrollTrigger had already measured the page — the
photo chapters then scrolled past as empty space. With the box reserved the
layout never moves, and each frame shimmers softly until its photo paints.

Each frame is also capped (`--photo-cap`, set per breakpoint in the CSS) so a
single portrait can never fill a whole phone screen — the card always keeps its
label above and its caption below. That is what keeps the chapter comfortable to
read on a small handset.

**If you swap in a new photo, update `width` / `height` to match it.** Otherwise
the reserved box has the wrong shape and the photo will be cropped or squeezed.
For a photo you have told the page to rotate, give the *displayed* dimensions.
Keep files around 1600 px on the long edge — that is sharp on a phone at 2×
and keeps each card a couple of hundred kilobytes.

### Fixing a sideways or mirrored photo
Each photo in the `photos` array accepts an optional `orientation` block. The
image stays untouched on disk; the page corrects it:

```js
{
  image: "assets/photos/photo06.jpg",
  orientation: { rotate: 90, flip: true },  // rotate: 0 | 90 | 180 | 270
  ...
}
```

Use `flip: true` for photos that came out mirrored (text in the picture reads
backwards). Use `rotate` for photos saved sideways.

Everything text-related lives in **`js/config.js`**:
* **Name & Dates:** `name`, `reveal.date`
* **Name typeface:** `nameFont` (see the table above)
* **Photos & Captions:** `photos` array in `js/config.js`
* **Video:** `videos` array in `js/config.js`
* **Love Letter Text:** `letter` object in `js/config.js`
* **Candle Messages:** `candle` object in `js/config.js`
* **Music:** Drop any `.mp3` or `.m4a` file into `assets/music/` and point `music.file` at it.

---

## 4. Deploying It Online
To share it with Anziya:
1. **Netlify Drop:** Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the entire `elton-gf` folder into your browser. You will get a live private link in seconds!
2. **GitHub Pages:** Push the folder to a GitHub repository and turn on GitHub Pages under repository Settings -> Pages.
