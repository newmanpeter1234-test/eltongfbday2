/* ============================================================================
   YOUR SETTINGS — Anziya's Birthday Website
   Edit words here, never the layout files.
   ============================================================================ */

const birthdayConfig = {

  /* Her name. Used in the hero, the finale and the browser tab. */
  name: "Anziya",

  /* Browser tab title. */
  pageTitle: "For Anziya — Happy Birthday, My Love",

  /* ── CHROME ──────────────────────────────────────────────────────────── */
  meta: {
    monogram: "E ♡ A",
    forName: "For Anziya",
    byline: "A story by Elton",
    edition: "08 · XI",
    loaderLabel: "A birthday story for Anziya"
  },

  /* ── 01 · THE OPENING GIFT ───────────────────────────────────────────── */
  opening: {
    whisper: "A little something for you, Anziya",
    hint: "Tap to open your gift",
    skip: "Skip"
  },

  /* ── 02 · THE HERO ───────────────────────────────────────────────────── */
  hero: {
    eyebrow: "Happy Birthday",
    date: "November 8",
    line: "The day the world got a little brighter — the day the girl who made mine better was born.",
    scrollHint: "Scroll slowly",
    metaLeft: "A story by Elton",
    metaRight: "For Anziya · 08 · XI"
  },

  /* ── 03 · PHOTO MEMORIES ─────────────────────────────────────────────── */
  memoriesIntro: {
    label: "Chapter One · Memories",
    title: "Every chapter with you is my *favorite*",
    note: "Ten frames I keep coming back to. Travel sideways — every one of them is a reason.",
    count: "02 / 07"
  },

  /* "number", "roman", "none", or a custom word */
  memoryLabel: "number",

  /* w/h are the real photo dimensions — they reserve space so nothing jumps. */
  photos: [
    {
      image: "assets/photos/photo01.jpg", w: 693, h: 1070,
      label: "Where It Began",
      title: "Where All of This Started",
      caption: "A simple mirror selfie, a makeshift sling, and little did I know you'd become my favorite person.",
      alt: "Anziya's first mirror selfie with sling where the story began"
    },
    {
      image: "assets/photos/photo02.jpg", w: 848, h: 636,
      label: "Our Crazy Side",
      title: "From Strangers to Us",
      caption: "From strangers to friends, from friends to us. Still no idea what we were doing, but I loved every second.",
      alt: "Elton and Anziya playfully flexing against red backdrop"
    },
    {
      image: "assets/photos/photo03.jpg", w: 1080, h: 1920,
      label: "Unfiltered Us",
      title: "Good Vibes Only",
      caption: "Loud, unplanned, and the kind of laughter where you completely lose track of time.",
      alt: "Selfie together with fun vibes glasses"
    },
    {
      image: "assets/photos/photo04.jpg", w: 592, h: 782,
      label: "My Safe Place",
      title: "Just Another Ordinary Day",
      caption: "The ordinary ones turned out to be the best ones. Leaning on you is my favorite feeling.",
      alt: "Anziya leaning on Elton's shoulder in yellow dress"
    },
    {
      image: "assets/photos/photo05.jpg", w: 1078, h: 718,
      label: "Through It All",
      title: "Growing Together",
      caption: "Through every high and every low, we always found our way back to each other.",
      alt: "Artistic black and white portrait smiling closely"
    },
    {
      image: "assets/photos/photo06.jpg", w: 1080, h: 1920,
      label: "Quiet Comfort",
      title: "Endless Conversations",
      caption: "So many days have passed, but every moment with you still feels just as special.",
      alt: "Cozy selfie together"
    },
    {
      image: "assets/photos/photo07.jpg", w: 3024, h: 4032,
      label: "Favorite Moments",
      title: "No Explaining Needed",
      caption: "Some people just get it. With you, everything feels effortless and right.",
      alt: "Mirror selfie in striped red top"
    },
    {
      image: "assets/photos/photo08.jpg", w: 3024, h: 4032,
      label: "Side by Side",
      title: "Three Years Almost Gone",
      caption: "Three years almost gone, but my love for you only keeps growing with each passing day.",
      alt: "Outdoor portrait by the black railing"
    },
    {
      image: "assets/photos/photo09.jpg", w: 2921, h: 4032,
      label: "Standing Strong",
      title: "By Your Side",
      caption: "We started with a little moment and built something so beautiful.",
      alt: "Portrait together in front of green palm leaves"
    },
    {
      image: "assets/photos/photo10.jpg", w: 2592, h: 4608,
      label: "Our Journey",
      title: "Countless Memories",
      caption: "Almost three years, countless memories, and you are still my favorite person in the entire world.",
      alt: "4-photo montage of Elton and Anziya"
    }
  ],

  galleryEnd: {
    kicker: "To be continued",
    title: "…and every day after.",
    text: "The best part is that we are nowhere near the end of this roll of film."
  },

  /* ── 04 · MARQUEES ───────────────────────────────────────────────────── */
  marquee: {
    one: ["Happy Birthday, Anziya", "November 8", "Almost three years", "Still my favorite person"],
    two: ["Every memory with you", "My safe place", "E ♡ A", "I would choose you again"]
  },

  /* ── 05 · VIDEO MEMORIES ─────────────────────────────────────────────── */
  videosIntro: {
    label: "Chapter Two · Motion",
    title: "Moments too special for a *single frame*",
    note: "Some things a photograph can never hold. Press play and let it move.",
    count: "03 / 07"
  },

  videos: [
    {
      video: "assets/videos/video01.mp4",
      poster: "assets/videos/video01-poster.jpg",
      ratio: "1280 / 882",
      caption: "From our first memories to the memories we haven't made yet.",
      label: "Our film · silent"
    }
  ],

  /* ── 06 · OUR THREE-YEAR STORY ───────────────────────────────────────── */
  timelineIntro: {
    label: "Chapter Three · Our Story",
    title: "Our *Three-Year* Story",
    note: "From a makeshift sling to everything we are now — five moments that made us, us.",
    count: "04 / 07"
  },

  timeline: [
    {
      label: "The Beginning",
      text: "Two strangers, one simple mirror selfie, and the start of something I never wanted to end.",
      image: "assets/photos/photo01.jpg"
    },
    {
      label: "Friends to Us",
      text: "One meeting. One beginning. One beautiful story that changed my life forever.",
      image: "assets/photos/photo02.jpg"
    },
    {
      label: "Countless Memories",
      text: "Through every high and every low, we learned that home is whenever we're together.",
      image: "assets/photos/photo04.jpg"
    },
    {
      label: "November 8",
      text: "The day the world got a little brighter, and the girl who made my world better was born.",
      image: "assets/photos/photo09.jpg"
    },
    {
      label: "Today & Forever",
      text: "Almost three years gone, and if I could go back, I would choose you all over again.",
      image: "assets/photos/photo10.jpg"
    }
  ],

  /* ── 07 · THE LETTER ─────────────────────────────────────────────────── */
  letterIntro: {
    label: "Chapter Four · The Letter",
    title: "A note from *Elton's* heart",
    note: "Some things deserve to be written by hand, folded, and sealed. This is one of them.",
    count: "05 / 07"
  },

  letter: {
    sealText: "E ♡ A",
    sealHint: "Tap the wax seal to open Elton's letter",
    greeting: "My Dearest Anziya,",
    body: [
      "Almost three years ago, our story began.",
      "Since then, you've given me memories I'll never forget, moments I'll always treasure, and a love I never want to lose.",
      "Happy birthday, my love. If I had to choose again, I would still choose you — every single time."
    ],
    signature: "Forever Yours,\nElton"
  },

  /* ── 08 · THE WISH ───────────────────────────────────────────────────── */
  candle: {
    prompt: "Make a wish for your birthday…",
    hint: "Tap the flame to blow it out",
    blownMessage: "May all your wishes come true, my love."
  },

  pause: {
    lines: [
      "There's one last thing I saved for the end…",
      "Because you deserve the world, today and always."
    ],
    hint: "Tap for the final surprise",
    revealKicker: "One last thing"
  },

  /* ── 09 · THE FINALE ─────────────────────────────────────────────────── */
  final: {
    photo: "assets/photos/photo11.jpg",
    w: 3024, h: 4032,
    photoAlt: "Anziya looking stunning in her red gown with Elton",
    eyebrow: "A final note, in pictures",
    title: "Happy Birthday, Anziya",
    symbol: "♥",
    lines: [
      "Today isn't just your birthday;",
      "it's a celebration of the person I'm lucky enough to love.",
      "Happy birthday to the girl who made my world a better place.",
      "I would choose you all over again — every single time. ♥"
    ],
    replay: "Experience Our Journey Again",
    credits: "Made with love, for Anziya"
  },

  /* ── MUSIC ───────────────────────────────────────────────────────────── */
  music: {
    file: "assets/music/theme.m4a",
    volume: 0.42
  },

  settings: {
    particleDensity: 1.05
  }
};

window.birthdayConfig = birthdayConfig;
