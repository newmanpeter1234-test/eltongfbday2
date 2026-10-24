/* ============================================================================
   YOUR SETTINGS  —  Anziya's Birthday Website Config
   Deep Velvet Bordeaux & Rose Theme
   ============================================================================ */

const birthdayConfig = {

  /* Her name. Used in the reveal, the final scene and the browser tab. */
  name: "Anziya",

  /* Text shown in the browser tab. */
  pageTitle: "For Anziya — Happy Birthday, My Love",

  /* ── 1. THE OPENING SCREEN ───────────────────────────────────────────── */
  opening: {
    whisper: "A little something for you, Anziya…",
    hint: "Tap to open your gift",
    skip: "Skip"
  },

  /* ── 2. THE BIRTHDAY REVEAL ──────────────────────────────────────────── */
  reveal: {
    greeting: "Happy Birthday",
    date: "November 8",
    lines: [
      "The day the world got a little brighter.",
      "Almost three years of memories, and still my favorite person."
    ],
    scrollHint: "Scroll down"
  },

  /* ── 3. PHOTO MEMORIES ───────────────────────────────────────────────── */
  memoriesIntro: {
    label: "Chapter One",
    title: "Every chapter with you is my favorite"
  },

  /* The small heading above each photo: "roman", "number", "none", or custom */
  memoryLabel: "number",

  photos: [
    {
      image: "assets/photos/photo01.jpg",
      label: "Where It Began",
      title: "Where All of This Started",
      caption: "A simple mirror selfie, a makeshift sling, and little did I know you'd become my favorite person.",
      alt: "Anziya's first mirror selfie with sling where the story began"
    },
    {
      image: "assets/photos/photo02.jpg",
      label: "Our Crazy Side",
      title: "From Strangers to Us",
      caption: "From strangers to friends, from friends to us. Still no idea what we were doing, but I loved every second.",
      alt: "Elton and Anziya playfully flexing against red backdrop"
    },
    {
      image: "assets/photos/photo03.jpg",
      label: "Unfiltered Us",
      title: "Good Vibes Only",
      caption: "Loud, unplanned, and the kind of laughter where you completely lose track of time.",
      alt: "Selfie together with fun vibes glasses"
    },
    {
      image: "assets/photos/photo04.jpg",
      label: "My Safe Place",
      title: "Just Another Ordinary Day",
      caption: "The ordinary ones turned out to be the best ones. Leaning on you is my favorite feeling.",
      alt: "Anziya leaning on Elton's shoulder in yellow dress"
    },
    {
      image: "assets/photos/photo05.jpg",
      label: "Through It All",
      title: "Growing Together",
      caption: "Through every high and every low, we always found our way back to each other.",
      alt: "Artistic black and white portrait smiling closely"
    },
    {
      image: "assets/photos/photo06.jpg",
      label: "Quiet Comfort",
      title: "Endless Conversations",
      caption: "So many days have passed, but every moment with you still feels just as special.",
      alt: "Cozy selfie together"
    },
    {
      image: "assets/photos/photo07.jpg",
      label: "Favorite Moments",
      title: "No Explaining Needed",
      caption: "Some people just get it. With you, everything feels effortless and right.",
      alt: "Mirror selfie in striped red top"
    },
    {
      image: "assets/photos/photo08.jpg",
      label: "Side by Side",
      title: "Three Years Almost Gone",
      caption: "Three years almost gone, but my love for you only keeps growing with each passing day.",
      alt: "Outdoor portrait by the black railing"
    },
    {
      image: "assets/photos/photo09.jpg",
      label: "Standing Strong",
      title: "By Your Side",
      caption: "We started with a little moment and built something so beautiful.",
      alt: "Portrait together in front of green palm leaves"
    },
    {
      image: "assets/photos/photo10.jpg",
      label: "Our Journey",
      title: "Countless Memories",
      caption: "Almost three years, countless memories, and you are still my favorite person in the entire world.",
      alt: "4-photo montage of Elton and Anziya"
    }
  ],

  /* ── 4. VIDEO MEMORIES ───────────────────────────────────────────────── */
  videosIntro: {
    label: "Chapter Two",
    title: "Moments too special for a single frame"
  },

  videos: [
    {
      video: "assets/videos/video01.mp4",
      poster: "assets/videos/video01-poster.jpg",
      ratio: "1280/882",
      caption: "From our first memories to the memories we haven't made yet."
    }
  ],

  /* ── 5. OUR THREE-YEAR TIMELINE ──────────────────────────────────────── */
  timelineIntro: {
    label: "Chapter Three",
    title: "Our Three-Year Story"
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

  /* ── INTERACTIVE LOVE LETTER ─────────────────────────────────────────── */
  letter: {
    sealText: "E ♡ A",
    sealHint: "Tap the wax seal to open Elton's letter",
    greeting: "My Dearest Anziya,",
    body: [
      "Almost three years ago, our story began.",
      "Since then, you’ve given me memories I’ll never forget, moments I’ll always treasure, and a love I never want to lose.",
      "Happy birthday, my love. If I had to choose again, I would still choose you — every single time."
    ],
    signature: "Forever Yours,\nElton"
  },

  /* ── 6. MAKE A WISH & THE QUIET PAUSE ────────────────────────────────── */
  candle: {
    prompt: "Make a wish for your birthday…",
    hint: "Tap the flame to blow it out",
    blownMessage: "May all your wishes come true, my love."
  },

  pause: {
    lines: [
      "There’s one last thing I saved for the end…",
      "Because you deserve the world, today and always."
    ],
    hint: "Tap for the final surprise"
  },

  /* ── 7. THE FINAL REVEAL ─────────────────────────────────────────────── */
  final: {
    photo: "assets/photos/photo11.jpg",
    photoAlt: "Anziya looking stunning in her red gown with Elton",
    title: "Happy Birthday, Anziya",
    shape: "heart",
    symbol: "♥",
    lines: [
      "Today isn't just your birthday;",
      "it's a celebration of the person I'm lucky enough to love.",
      "Happy birthday to the girl who made my world a better place.",
      "I would choose you all over again — every single time. ♥"
    ],
    replay: "Experience Our Journey Again"
  },

  /* ── MUSIC ───────────────────────────────────────────────────────────── */
  music: {
    file: "assets/music/theme.m4a",
    volume: 0.45
  },

  settings: {
    particleDensity: 1.1
  }
};

window.birthdayConfig = birthdayConfig;
