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
  * **Memory 01:** Her mirror selfie with the makeshift sling where their story began.
  * Followed by their adventures, playful gym flex, cozy selfies, and 3-year journey together.
  * Dynamic reveals (`curtain`, `bloom`, `slide`), parallax drift, and a live counter (`01 / 10`).
* **Scene 4 (Chapter 2 · Video Memories):** Seamlessly loops video moments silently on scroll; taps pause/play with a glowing rose-gold progress tracker.
* **Scene 5 (Chapter 3 · Our Three-Year Story):** Interactive glowing timeline with vertical rail tracking scroll progress.
* **Scene 5.5 (A Note For You):** An interactive **love letter with a wax seal (`E ♡ A`)** that cracks open when tapped to unfold Elton's personal message.
* **Scene 6 (The Quiet Pause & Make a Wish):** Darkening ambient glow, an interactive birthday candle with a flickering flame that Anziya taps to blow out with a smoke puff and sparkle burst, unveiling the final gift box.
* **Scene 7 (The Final Reveal):** Screen locks. Hundreds of stardust particles gather on canvas into a **glowing, beating Heart** that pulses before dissolving into the grand reveal of Anziya looking breathtaking in her red gown, accompanied by Elton's closing vows.

---

## 3. How to Customize
Everything text-related lives in **`js/config.js`**:
* **Name & Dates:** `name`, `reveal.date`
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
