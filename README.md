# 🌍 Mohak Gupta — Middle-earth Portfolio

> *"Not all those who wander are lost."* — J.R.R. Tolkien

An immersive, scroll-driven portfolio website built as a journey through Middle-earth. Six locations, a living 3D world, procedural audio, and a cinematic preloader — all in a single HTML/CSS/JS project with zero build tools.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Palantír Preloader** | Canvas-drawn nebula orb with mouse-reactive particle spirals and a rotating Tengwar inscription ring |
| **Oath Verse Typewriter** | The Ring verse types itself character-by-character before the Enter button appears |
| **Three.js 3D Scene** | Parallax mountains at 3 depths, moon arcing across the sky, The One Ring with bloom halos, shooting stars, fireflies |
| **Camera Fly-Through** | Camera drifts forward into the world as you scroll, with mouse-reactive parallax |
| **Procedural Audio Engine** | 5 fully synthesized soundscapes (no audio files) — The Shire crickets/birds, Rivendell brook/elvish harmonics, Fellowship drums/drone, Pelennor rain/lightning, Grey Havens ocean/seagulls |
| **2D Weather Canvas** | Per-section weather: clear → ash embers → rain with lightning → snow |
| **Ember Cursor Trail** | Speed-reactive golden ember particles follow your cursor |
| **Lenis Smooth Scroll** | Physics-eased scroll that makes the world feel like it moves, not you |
| **Typewriter Epigraphs** | Tolkien quotes write themselves into each section on enter |
| **Rune Footers** | Each section quietly types a Tolkien quote at the bottom |
| **Lore Tooltips** | Hover project names to reveal in-world lore about each quest |
| **Battle Stat Bars** | Hackathon cards have animated RPG-style stat bars |
| **Map Sidebar** | Hover the right edge to reveal a stylized Middle-earth SVG map that highlights your current location |
| **One Ring Easter Egg** | Click "Touch the Ring" hint — or type the Konami code ↑↑↓↓←→←→BA — to summon the Ring inscription overlay |
| **Photo Frame** | Circular gold-ringed photo frame with spinning orbital rings in the About section |
| **Resume Download** | Available in the About section and the Contact section |
| **Custom Cursor** | Gold dot with lagged ring and hover expansion effects |

---

## 🗂️ Project Structure

```
mohak-portfolio/
├── index.html          ← All HTML markup
├── css/
│   └── style.css       ← All styles (variables, layout, animations)
├── js/
│   └── main.js         ← All JavaScript (18 documented sections)
├── assets/
│   ├── mohak.jpg       ← ⚠️ ADD YOUR PHOTO HERE (square crop, min 400×400px)
│   └── resume.pdf      ← ⚠️ ADD YOUR RESUME HERE
└── README.md
```

> **No build tools. No npm. No bundler.** Open `index.html` in a browser and it works.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mohak-portfolio.git
cd mohak-portfolio
```

### 2. Add your assets

| File | Purpose | Notes |
|---|---|---|
| `assets/mohak.jpg` | Your photo in the About section | Square crop recommended, min 400×400px. JPEG or PNG. |
| `assets/resume.pdf` | Downloadable resume | Linked in About (download button) and Contact section |

If `mohak.jpg` is missing, the frame gracefully shows your initials **MG** instead.

### 3. Personalise

Open `index.html` and update:

- **Email address** — search for `mohak@example.com` and replace
- **GitHub URL** — search for `github.com/mohakgupta` and replace  
- **LinkedIn URL** — search for `linkedin.com/in/mohakgupta` and replace
- **HIKITY URL** — search for `hikity.com` and replace with the real URL
- **Projects** — edit the `.quest` blocks in the `#fellowship` section
- **Hackathons** — edit the `.battle-card` blocks in the `#pelennor` section

### 4. Run locally

Since the site uses Google Fonts and CDN scripts, you need a local server (not just `file://`):

```bash
# Python (built into macOS/Linux)
python3 -m http.server 8080

# Node.js (if installed)
npx serve .

# VS Code
Install the "Live Server" extension, right-click index.html → Open with Live Server
```

Then visit `http://localhost:8080`.

---

## 🌐 Deployment

This is a pure static site — deploy anywhere.

### GitHub Pages (recommended)

1. Push to GitHub
2. Go to **Settings → Pages**
3. Source: `Deploy from a branch` → `main` → `/ (root)`
4. Visit `https://YOUR_USERNAME.github.io/mohak-portfolio`

### Netlify

```bash
# Drag and drop the project folder at netlify.com/drop
# Or connect your GitHub repo for auto-deploy on push
```

### Vercel

```bash
npm i -g vercel
vercel
# Follow the prompts — zero config needed
```

---

## 🎨 Customisation Guide

### Changing section soundscapes

In `js/main.js`, the audio engine (Section 8) has four scene builders:

| Method | Section | Sounds |
|---|---|---|
| `buildShire()` | Hero + About | Wind, crickets, FM bird calls |
| `buildRivendell()` | Skills | Brook, leaves, elvish harmonic overtones |
| `buildMordor()` | Projects + Hackathons | Sawtooth drone, sub bass, war drums, harsh wind |
| `buildHavens()` | Contact | Ocean waves (AM noise), sea breeze, seagull cry |

The `WEATHER_MAP` object (top of `main.js`) controls which weather effect plays per section:

```js
const WEATHER_MAP = {
  hero:          'clear',
  shire:         'clear',
  rivendell:     'clear',
  fellowship:    'ash',    // falling ash embers
  pelennor:      'rain',   // rain + lightning
  'grey-havens': 'snow',   // soft snow
};
```

### Changing the sky colour palette

In `js/main.js`, find `SKY_PALETTE` (Section 7). Each hex colour corresponds to one section in order:

```js
const SKY_PALETTE = [
  new THREE.Color(0x03040c), // hero — deep midnight
  new THREE.Color(0x060f04), // shire — forest night
  new THREE.Color(0x05081a), // rivendell — elvish blue
  new THREE.Color(0x100706), // fellowship — ember dusk
  new THREE.Color(0x0c0303), // pelennor — battle crimson
  new THREE.Color(0x030710), // grey-havens — sea night
];
```

### Changing the Tolkien quotes

The `RUNES` object at the top of `main.js` controls the footer quotes per section.  
The `data-quote` attribute on each `.epigraph` element in `index.html` controls the typewriter quotes.

### Adding a new project

Copy one of the `.quest` blocks in `index.html` and update:
- `.quest-badge` — category line
- `.quest-name` — project name (optionally add `.lore-trigger` + `.lore-popup` for hover lore)
- `.quest-desc` — description paragraph
- `.quest-achievement` — award/result line (remove if not applicable)
- `.quest-tags` — tech tags

---

## 🔐 Easter Eggs

| Trigger | Effect |
|---|---|
| Click **"✦ Touch the Ring ✦"** on the hero | Summons the One Ring inscription overlay |
| Konami Code: `↑ ↑ ↓ ↓ ← → ← → B A` | Same as above + deep bass rumble via Web Audio |
| Hover right edge of screen | Reveals the Middle-earth map sidebar with your current location highlighted |
| Hover any project name (✦) | Shows in-world lore about that quest |

---

## 📦 Dependencies (all via CDN — no install needed)

| Library | Version | Purpose |
|---|---|---|
| [Three.js](https://threejs.org) | r128 | 3D scene, ring, mountains, stars, moon |
| [GSAP](https://gsap.com) | 3.12.5 | Scroll animations, timelines, easing |
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | 3.12.5 | Scroll-based animation triggers |
| [Lenis](https://lenis.darkroom.engineering) | 1.1.14 | Smooth scroll physics |
| [Google Fonts](https://fonts.google.com) | — | Cinzel Decorative, Cinzel, EB Garamond |

All audio synthesis uses the native **Web Audio API** — no audio files or libraries required.

---

## 🧠 Architecture Notes

### Why everything is synthesized

The audio engine generates every sound mathematically using `OscillatorNode`, `BiquadFilterNode`, and noise buffers. This means:
- Zero external audio file hosting
- Instant load (no large audio downloads)
- Each soundscape morphs continuously with no loops or seams

### The 3-layer rendering stack

```
Layer 0  — Three.js canvas (position: fixed, z-index: 0)   ← 3D world
Layer 1  — Weather canvas  (position: fixed, z-index: 1)   ← 2D rain/snow/ash
Layer 2  — Vignette div   (position: fixed, z-index: 2)   ← edge darkening
Layer 3  — Grain div      (position: fixed, z-index: 3)   ← film texture
Layer 4  — Lightning div  (position: fixed, z-index: 4)   ← flash overlay
Layer 5  — Ember canvas   (position: fixed, z-index: 5)   ← cursor trail
Layer 10 — Scroll content (position: relative, z-index: 10) ← HTML text
```

### Scroll state flow

```
Lenis (smooth scroll) → scrollP variable (0–1)
scrollP → Three.js loop (sky colour, camera z, ring scale, moon arc)
scrollP → ScrollTrigger (GSAP animations per section)
ScrollTrigger → setSection() → audio crossfade + weather mode + map highlight
```

---

## 📄 License

MIT — do whatever you want with this, but a star ⭐ would be appreciated!

---

## 🙏 Acknowledgements

- **J.R.R. Tolkien** — for the world that made this worth building
- **Three.js** — for making the impossible look easy
- **GSAP** — for making scroll feel like cinema
- **Lenis** — for making scroll feel like butter
- **Gemini** — for the portfolio content suggestions that shaped this

---

*Built by Mohak Gupta · BIT Bangalore · Class of 2029*
