# Review — For Anziya

An audit of the live site, measured rather than eyeballed, plus what current design
writing suggests is worth adding. Ordered by what I would actually do first.

Baseline measured today: 4.4 MB for a full walk-through, 859 ms to first paint,
zero console errors, every chapter/HUD mapping correct, all 10 memories intact.

---

## P0 — Things that are broken right now

### 1. The site's wayfinding dies for anyone with "reduce motion" turned on

If a visitor has *Reduce Motion* enabled at the OS level (a very common accessibility
setting — and the default for some older phones on battery saver), the HUD chapter
readout is frozen on **"Prologue" for the entire journey**.

Measured, scrolling from 0% to 90% of the page in reduced-motion mode:

| scroll position | HUD said |
|---|---|
| 0% | 01 Prologue |
| 30% | 01 Prologue |
| 60% | 01 Prologue |
| 90% | 01 Prologue |

**Cause:** `trackChapters()` is only ever called from `buildScrollAnimations()`,
which returns immediately when `STATIC` is true (reduced motion, or GSAP failing to
load from the CDN). The rail is built, so the dots light up — but the label never moves,
and the letter's "Keep scrolling" cue is the only progress signal left.

**Fix:** call `trackChapters()` from `boot()` regardless of `STATIC`. Two lines.
It also silently protects the site if the GSAP CDN is ever blocked on her phone.

### 2. The link preview is broken — and the preview *is* her first impression

This one matters more than it looks, because a surprise like this arrives as a
WhatsApp message, not as a typed URL.

`og:image` is currently `assets/photos/photo11.jpg` — **2.0 MB, 3024 × 4032, portrait.**

- WhatsApp silently refuses to render images over roughly **300–600 KB**. It doesn't
  fall back to a placeholder, it just shows no image.
- It's also 3:4 portrait, while link cards are 1.91:1 landscape, so even where it does
  load it gets cropped to a strip of her forehead.
- WhatsApp has no debugger and caches the failure for days.

**Fix:** a purpose-made 1200 × 630 JPEG under 300 KB — her photo, the date, and a line
of type. Roughly 20 minutes of work, and it's the difference between a message that
unfurls into a beautiful card and one that looks like a bare URL.

---

## P1 — One regression I introduced, and one token to fix

### 3. The film looks soft on a big screen (my fault)

When I cut the video from 6.8 MB to 1.5 MB I encoded it at 1024 px wide. But the film
plays **full-bleed** — on a 1440 px display that's a 1300 px element, and on a retina
laptop the browser wants ~2600 device pixels. It's upscaling 2.5×, and you can see it.

**Fix:** ship two encodes and pick by screen — the existing 1024 file for phones
(where it's already sharp and data is precious), plus a ~1600 px version for desktop
served through `<source media="(min-width: 900px)">`. Desktop gets sharpness, phones
keep the 1.5 MB. Cost: about 1 MB, downloaded only by desktop.

### 4. Six contrast failures, all from one token

An automated accessibility scan found 6 serious violations, and they reduce to a single
value: `--faint` is `rgba(250,246,242,.46)`, which lands at **4.33:1** where 4.5:1 is
the minimum. Affected: chapter counters (`02 / 07`), the marquee, the tap hints.

The outlined marquee variant is worse — gold stroke at .45 alpha = **3.19:1**.

Her parents or grandparents opening this will be squinting at exactly the bits that
tell them where they are. **Fix:** raise `--faint` to about `.62` and the outline stroke
to `.55`. Two values, one commit, fixes all six.

### 5. Three controls announce something different from what they show

Screen readers get "Back to the beginning" for a button whose visible text is "E ♡ A",
and "Pause background music" for a button that shows "SOUND ON". A screen-reader user
hearing one thing and seeing another is a known confusion (WCAG 2.5.3). Small fix: let
the accessible name contain the visible words, e.g. "E ♡ A — back to the beginning".

---

## P2 — What I'd actually add, based on what's current

I searched current design writing for 2026. Three things came up repeatedly that this
site doesn't do yet, and all three suit it.

### 6. Let her send something back

The story is entirely one-directional: everything is given, nothing is returned. After
the finale, one button — "Send Elton something" — that calls `navigator.share()` with
the site URL, opens her phone's native share sheet, and lets her reply in the same
channel she received it from. No backend, no form, no data. It closes the loop, and on
a phone it's a single native sheet.

Current writing keeps returning to *interactive storytelling* over passive consumption —
this is the cheapest real version of that.

### 7. Phones have no chapter map

The chapter rail is hidden below 1200 px — so on the device she'll actually use, there
is no sense of "how much is left". Wayfinding ("scroll-as-navigation": progress
indicators and markers that tell you where you are and why to keep going) shows up as a
top-2026 pattern precisely because it fixes the drop-off problem long scrolls have.

**Suggestion:** a slim segmented progress bar under the HUD on mobile — seven segments,
current one lit — replacing nothing, just adding the map.

### 8. Sound on the three moments that deserve it

The site has a music bed but no interaction sound. A wax seal that *cracks*, a
match-strike for the candle, a soft chime when the heart forms. Synthesised with WebAudio
means **zero extra download** — a few hundred bytes of code instead of audio files. This
is the single highest-delight-per-kilobyte item on this list, and sound design is
flagged as a defining trait of premium storytelling sites.

(Must respect the existing sound toggle, and never fire before her first tap — both are
already solved by the current architecture.)

### 9. Let her keep the letter

There's no print stylesheet. The letter is the emotional centrepiece; a `@media print`
block that outputs just the cream paper, the handwriting and "Forever Yours, Elton" on
one clean page turns the site into something she can keep in a drawer. Cheap to build,
and it outlives the URL.

### 10. Make the date aware of itself

The site is a birthday present for **November 8**. If it's opened on November 8, the
hero could quietly change its line to "Today is the day" — otherwise it reads as a
generic card. If she opens it a day early or late, don't show it. Ten lines of code,
and it's the kind of detail that makes a handmade thing feel handmade.

### 11. Add it to her home screen

No manifest, no apple-touch-icon. Add both and the site installs with a proper icon and
a name instead of a URL — and a tiny service worker makes it work on the train with no
signal. Worth doing *last*, because caching a site you're still editing is how you end
up debugging a ghost.

---

## P3 — Housekeeping

### 12. 21 MB of unused video in the repo

`assets/copy_764C4CB4….mp4` is 21 MB and referenced nowhere. Alongside it sit several
`IMG_*.JPG` originals (up to 3.2 MB each) that predate the optimised `opt/` set. They
don't reach visitors — Vercel only serves what's requested — but they bloat the repo and
every clone. Worth moving to an ignored `originals/` folder.

---

## If I could only do three

1. **The link preview** (§2) — it's how the gift is actually delivered.
2. **The reduced-motion HUD** (§1) — a two-line fix for a real accessibility failure.
3. **The film sharpness** (§3) — undoing my own regression before she sees it.

Then, for delight: **the share-back button** (§6) and **interaction sounds** (§8).
