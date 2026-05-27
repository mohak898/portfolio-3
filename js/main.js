/**
 * Mohak Gupta — Middle-earth Portfolio
 * js/main.js
 *
 * Sections:
 *  1.  Config & Constants
 *  2.  Cursor
 *  3.  Ember Cursor Trail (2D canvas)
 *  4.  2D Weather Canvas (rain / ash / snow + lightning)
 *  5.  Palantír Canvas Animation
 *  6.  Oath Verse Typewriter (preloader)
 *  7.  Three.js Scene (stars, ring, mountains, moon, etc.)
 *  8.  Audio Engine (fully synthesized — no audio files needed)
 *  9.  Lenis Smooth Scroll
 * 10.  Rune Footer Typewriter
 * 11.  Flash Transitions
 * 12.  Typewriter Epigraphs
 * 13.  Photo Fallback
 * 14.  Ring Easter-Egg Overlay
 * 15.  Map Sidebar — Section Sync
 * 16.  Begin Button (preloader → world)
 * 17.  GSAP Scroll Animations
 * 18.  Section Detection (compass + audio + weather + map)
 */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ================================================
   1. CONFIG & CONSTANTS
   ================================================ */
const SECTIONS = ['hero', 'shire', 'rivendell', 'fellowship', 'pelennor', 'grey-havens'];

const WEATHER_MAP = {
  hero:           'clear',
  shire:          'clear',
  rivendell:      'clear',
  fellowship:     'ash',
  pelennor:       'rain',
  'grey-havens':  'snow',
};

const RUNES = {
  'rf-hero':       '✦ not all those who wander are lost ✦ the world is not in your books and maps ✦ it is out there ✦',
  'rf-shire':      '✦ in a hole in the ground there lived a hobbit ✦ not a nasty dirty wet hole ✦ it was a hobbit-hole ✦ and that means comfort ✦',
  'rf-rivendell':  '✦ even the smallest person can change the course of the future ✦ all we have to decide ✦ is what to do with the time that is given us ✦',
  'rf-fellowship': '✦ the fellowship of the ring ✦ nine companions ✦ one purpose ✦ to unmake what was made in secret fire ✦',
  'rf-pelennor':   "✦ i am no man ✦ ride now ✦ ride to ruin and the world's ending ✦ death ✦",
  'rf-grey':       '✦ the grey rain-curtain rolls back ✦ all turns to silver glass ✦ and then you see it ✦ white shores ✦ and beyond ✦ a far green country ✦',
};

const OATH_LINES = [
  'Three Rings for the Elven-kings under the sky…',
  'Seven for the Dwarf-lords in their halls of stone…',
  'Nine for Mortal Men doomed to die…',
  'One for the Dark Lord on his dark throne…',
  'In the Land of Mordor where the Shadows lie.',
];

/* ================================================
   2. CURSOR
   ================================================ */
const cursor  = document.getElementById('cursor');
const cRing   = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0, prevCx = 0, prevCy = 0;

document.addEventListener('mousemove', e => {
  prevCx = cx; prevCy = cy;
  cx = e.clientX; cy = e.clientY;
});

(function animCursor() {
  requestAnimationFrame(animCursor);
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  rx += (cx - rx) * 0.1;
  ry += (cy - ry) * 0.1;
  cRing.style.left = rx + 'px';
  cRing.style.top  = ry + 'px';
})();

// Expand cursor on hover of interactive elements
const hoverTargets = 'a, .pillar, .quest, .battle-card, .pre-cta, #audio-btn, '
  + '.member-card, .lore-trigger, .clink, .ring-close, .ring-click-hint, .cdot, .map-tab, .resume-badge';

document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '18px';
    cursor.style.height = '18px';
    cRing.style.width   = '46px';
    cRing.style.height  = '46px';
    cRing.style.borderColor = 'rgba(201,168,76,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
    cRing.style.width   = '32px';
    cRing.style.height  = '32px';
    cRing.style.borderColor = 'rgba(201,168,76,0.45)';
  });
});

/* ================================================
   3. EMBER CURSOR TRAIL (2D canvas)
   ================================================ */
(function initEmberTrail() {
  const ec  = document.getElementById('ember-canvas');
  const ctx = ec.getContext('2d');

  function resize() {
    ec.width  = window.innerWidth;
    ec.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const embers = [];

  document.addEventListener('mousemove', e => {
    const speed = Math.hypot(e.clientX - prevCx, e.clientY - prevCy);
    if (speed < 2) return;
    const n = Math.floor(speed * 0.35) + 1;
    for (let i = 0; i < n; i++) {
      embers.push({
        x:     e.clientX + (Math.random() - 0.5) * 6,
        y:     e.clientY + (Math.random() - 0.5) * 6,
        vx:    (Math.random() - 0.5) * 1.2,
        vy:    -Math.random() * 1.6 - 0.4,
        life:  1,
        decay: 0.018 + Math.random() * 0.024,
        r:     1 + Math.random() * 2.5,
        hue:   Math.random() < 0.6 ? 38 : (Math.random() < 0.5 ? 18 : 52),
      });
    }
  });

  (function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, ec.width, ec.height);
    for (let i = embers.length - 1; i >= 0; i--) {
      const em = embers[i];
      em.x   += em.vx;
      em.y   += em.vy;
      em.vy  += 0.04;
      em.vx  *= 0.97;
      em.life -= em.decay;
      if (em.life <= 0) { embers.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(em.x, em.y, em.r * em.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${em.hue},90%,65%,${em.life * 0.52})`;
      ctx.fill();
    }
  })();
})();

/* ================================================
   4. 2D WEATHER CANVAS
   ================================================ */
const WX = (function initWeather() {
  const wc  = document.getElementById('weather-canvas');
  const ctx = wc.getContext('2d');
  let W = wc.width  = window.innerWidth;
  let H = wc.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = wc.width  = window.innerWidth;
    H = wc.height = window.innerHeight;
  });

  let mode   = 'clear';
  let nextLT = 0; // next lightning time

  const rainDrops = Array.from({ length: 240 }, () => ({
    x:   Math.random() * 1500,
    y:   Math.random() * 900,
    spd: 8 + Math.random() * 6,
    len: 14 + Math.random() * 10,
  }));

  const flakes = Array.from({ length: 130 }, () => ({
    x:     Math.random() * 1500,
    y:     Math.random() * 900,
    r:     0.8 + Math.random() * 2.2,
    spd:   0.4 + Math.random() * 0.8,
    drift: Math.sin(Math.random() * Math.PI * 2),
    op:    0.15 + Math.random() * 0.25,
    t:     Math.random() * Math.PI * 2,
  }));

  function triggerLightning() {
    const l = document.getElementById('lightning');
    l.style.opacity = '0.6';
    setTimeout(() => { l.style.opacity = '0'; }, 65);
    setTimeout(() => {
      l.style.opacity = '0.28';
      setTimeout(() => { l.style.opacity = '0'; }, 55);
    }, 130);
  }

  (function loop(ts) {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);

    if (mode === 'rain') {
      ctx.strokeStyle = 'rgba(180,205,230,0.17)';
      ctx.lineWidth   = 0.75;
      rainDrops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();
        d.y += d.spd; d.x -= 1.2;
        if (d.y > H) { d.y = -20; d.x = Math.random() * W; }
      });
      if (ts - nextLT > 0) {
        nextLT = ts + 4000 + Math.random() * 8000;
        triggerLightning();
      }
    } else if (mode === 'snow') {
      flakes.forEach(f => {
        f.t += 0.02;
        f.x += Math.sin(f.t + f.drift) * 0.4;
        f.y += f.spd;
        if (f.y > H) { f.y = -5; f.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,240,${f.op})`;
        ctx.fill();
      });
    } else if (mode === 'ash') {
      flakes.forEach(f => {
        f.t += 0.015;
        f.x += Math.sin(f.t + f.drift) * 0.6 + 0.3;
        f.y += f.spd * 0.6;
        if (f.y > H) { f.y = -5; f.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(175,115,75,${f.op * 0.55})`;
        ctx.fill();
      });
    }
  })(0);

  return {
    set(m) { mode = m; },
  };
})();

/* ================================================
   5. PALANTÍR CANVAS ANIMATION
   ================================================ */
(function initPalantir() {
  const canvas = document.getElementById('palantir-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 480, H = 480, R = W / 2;
  let mx = 0, my = 0, t = 0;

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = Math.max(-1.5, Math.min(1.5, (e.clientX - rect.left  - R) / R));
    my = Math.max(-1.5, Math.min(1.5, (e.clientY - rect.top   - R) / R));
  });

  const particles = Array.from({ length: 220 }, () => ({
    a:        Math.random() * Math.PI * 2,
    r:        Math.random() * R * 0.78,
    spd:      0.002 + Math.random() * 0.009,
    sz:       0.7   + Math.random() * 2.8,
    life:     Math.random(),
    lifeSpd:  0.003 + Math.random() * 0.009,
    col:      Math.random() < 0.55 ? [100, 140, 255] : [180, 210, 255],
  }));

  function draw() {
    requestAnimationFrame(draw);
    t += 0.012;
    ctx.clearRect(0, 0, W, H);

    // Background glow (follows mouse)
    const bg = ctx.createRadialGradient(R + mx * 20, R + my * 20, 0, R, R, R);
    bg.addColorStop(0,    'rgba(70,110,255,0.18)');
    bg.addColorStop(0.4,  'rgba(35,65,175,0.10)');
    bg.addColorStop(0.75, 'rgba(18,36,110,0.06)');
    bg.addColorStop(1,    'rgba(0,0,18,0)');
    ctx.beginPath(); ctx.arc(R, R, R, 0, Math.PI * 2);
    ctx.fillStyle = bg; ctx.fill();

    // Inner glow (tighter follow)
    const ig = ctx.createRadialGradient(R + mx * 28, R + my * 28, 0, R, R, R * 0.52);
    ig.addColorStop(0, `rgba(110,155,255,${0.1 + Math.sin(t * 0.8) * 0.05})`);
    ig.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(R, R, R * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = ig; ctx.fill();

    // Spiral arms
    for (let i = 0; i < 5; i++) {
      const a0 = t * 0.2 + i * Math.PI * 0.4;
      const r0 = R * 0.18 + i * 11;
      ctx.beginPath();
      for (let j = 0; j < 180; j++) {
        const ang = a0 + j * 0.058 + Math.sin(j * 0.09 + t * 0.35 + i) * 0.55;
        const rad = r0 + j * 0.38  + Math.sin(j * 0.045 + t * 0.22) * 9;
        if (rad > R * 0.9) break;
        const px = R + Math.cos(ang) * rad + mx * rad * 0.1;
        const py = R + Math.sin(ang) * rad + my * rad * 0.1;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(90,145,255,${0.035 + i * 0.01})`;
      ctx.lineWidth = 0.7; ctx.stroke();
    }

    // Orbiting particles
    particles.forEach(p => {
      p.a    += p.spd;
      p.life += p.lifeSpd;
      if (p.life > 1) { p.life = 0; p.r = Math.random() * R * 0.78; p.a = Math.random() * Math.PI * 2; }
      const fade = Math.sin(p.life * Math.PI);
      const px   = R + Math.cos(p.a + t * 0.05) * p.r + mx * p.r * 0.08;
      const py   = R + Math.sin(p.a + t * 0.05) * p.r + my * p.r * 0.08;
      if (Math.hypot(px - R, py - R) > R * 0.9) return;
      ctx.beginPath(); ctx.arc(px, py, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col.join(',')},${fade * 0.55})`; ctx.fill();
    });

    // Rim highlight
    const rim = ctx.createRadialGradient(R * 0.48, R * 0.32, R * 0.05, R, R, R);
    rim.addColorStop(0,    'rgba(210,225,255,0.13)');
    rim.addColorStop(0.65, 'rgba(90,130,255,0.03)');
    rim.addColorStop(1,    'rgba(140,170,255,0.16)');
    ctx.beginPath(); ctx.arc(R, R, R - 1, 0, Math.PI * 2);
    ctx.strokeStyle = rim; ctx.lineWidth = 2.5; ctx.stroke();

    // Circular clip
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath(); ctx.arc(R, R, R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,1)'; ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  draw();
})();

/* ================================================
   6. OATH VERSE TYPEWRITER (preloader)
   ================================================ */
(function runOath() {
  const oathVerse = document.getElementById('oath-verse');
  const preCta    = document.getElementById('pre-cta');
  if (!oathVerse) return;
  gsap.to(preCta, { opacity: 1, duration: 0.8, delay: 0.2 });

  let lineIndex = 0;

  function nextLine() {
    if (lineIndex >= OATH_LINES.length) {
  return;
}
    const txt = OATH_LINES[lineIndex++];
    let ci = 0;

    // Clear and add blinking cursor
    oathVerse.innerHTML = '';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'oath-cursor';
    oathVerse.appendChild(cursorSpan);

    const iv = setInterval(() => {
      const textNode = document.createTextNode(txt.slice(0, ci));
      oathVerse.innerHTML = '';
      oathVerse.appendChild(textNode);
      const cur = document.createElement('span');
      cur.className = 'oath-cursor';
      oathVerse.appendChild(cur);
      ci++;
      if (ci > txt.length) {
        clearInterval(iv);
        oathVerse.textContent = txt;
        setTimeout(() => {
          oathVerse.innerHTML = oathVerse.textContent + '<br>';
          setTimeout(nextLine, 500);
        }, 700);
      }
    }, 36);
  }

  // Start after fonts + Palantír animation settle
  setTimeout(() => {
    gsap.to(oathVerse, { opacity: 1, duration: 0.8, onComplete: nextLine });
  }, 1700);
})();

/* ================================================
   7. THREE.JS SCENE
   ================================================ */
const bgCanvas  = document.getElementById('bg');
const renderer  = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x03040c);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 6;

// Sky colour per section
const SKY_PALETTE = [
  new THREE.Color(0x03040c), // hero
  new THREE.Color(0x060f04), // shire
  new THREE.Color(0x05081a), // rivendell
  new THREE.Color(0x100706), // fellowship
  new THREE.Color(0x0c0303), // pelennor
  new THREE.Color(0x030710), // grey-havens
];
let skyTarget  = 0;
let skyCurrent = new THREE.Color(0x03040c);

// -- Stars --
const STAR_COUNT = 3200;
const starGeo    = new THREE.BufferGeometry();
const starPos    = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  starPos[i * 3]     = (Math.random() - 0.5) * 70;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.057, transparent: true, opacity: 0.7, sizeAttenuation: true });
scene.add(new THREE.Points(starGeo, starMat));

// -- Shooting star --
const shGeo  = new THREE.BufferGeometry();
shGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
const shMat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
const shStar = new THREE.Line(shGeo, shMat);
scene.add(shStar);
let shT    = 0;
let shOn   = false;
let nextSh = 7;

// -- Fireflies / particles --
const FLY_COUNT = 300;
const flyGeo    = new THREE.BufferGeometry();
const flyPos    = new Float32Array(FLY_COUNT * 3);
const flySpd    = new Float32Array(FLY_COUNT);
const flyPh     = new Float32Array(FLY_COUNT);
for (let i = 0; i < FLY_COUNT; i++) {
  flyPos[i * 3]     = (Math.random() - 0.5) * 18;
  flyPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
  flyPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  flySpd[i]         = 0.15 + Math.random() * 0.4;
  flyPh[i]          = Math.random() * Math.PI * 2;
}
flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPos, 3));
const flyMat = new THREE.PointsMaterial({ color: 0x88ff88, size: 0.085, transparent: true, opacity: 0.65, sizeAttenuation: true });
scene.add(new THREE.Points(flyGeo, flyMat));

// -- One Ring --
const ringGeo = new THREE.TorusGeometry(2.15, 0.04, 12, 120);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.5 });
const ring    = new THREE.Mesh(ringGeo, ringMat);
ring.position.z = -2;
scene.add(ring);

const ring2Geo = new THREE.TorusGeometry(2.0, 0.015, 8, 120);
const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.22 });
const ring2    = new THREE.Mesh(ring2Geo, ring2Mat);
ring2.position.z = -2;
scene.add(ring2);

// Ring bloom glow plane
const glowCvs = document.createElement('canvas');
glowCvs.width = 256; glowCvs.height = 256;
const glowCtx = glowCvs.getContext('2d');
const glowGrd = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
glowGrd.addColorStop(0,    'rgba(201,168,76,0.35)');
glowGrd.addColorStop(0.35, 'rgba(201,168,76,0.12)');
glowGrd.addColorStop(0.65, 'rgba(201,168,76,0.04)');
glowGrd.addColorStop(1,    'rgba(0,0,0,0)');
glowCtx.fillStyle = glowGrd; glowCtx.fillRect(0, 0, 256, 256);
const glowTex   = new THREE.CanvasTexture(glowCvs);
const glowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(9, 9),
  new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
);
glowPlane.position.z = -2.5;
scene.add(glowPlane);

// Additive halo tori
[2.3, 2.55, 2.85].forEach((r, i) => {
  const h = new THREE.Mesh(
    new THREE.TorusGeometry(r, 0.018 - i * 0.004, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.07 - i * 0.015, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  h.position.z       = -2;
  h.userData.isHalo  = true;
  scene.add(h);
});

// -- Moon --
const moon    = new THREE.Mesh(
  new THREE.SphereGeometry(0.55, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xe8e0c8, transparent: true, opacity: 0.9 })
);
scene.add(moon);
[[0.85, 0.04], [1.3, 0.025]].forEach(([r, o]) => {
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(r, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xc8b890, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false })
  ));
});

// -- Mountains helper --
function makeMountains(peaks, color, z, opacity) {
  const shape = new THREE.Shape([
    new THREE.Vector2(-18, -6),
    ...peaks.map(p => new THREE.Vector2(p[0], p[1])),
    new THREE.Vector2(18, -6),
  ]);
  const mesh = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide })
  );
  mesh.position.z = z;
  return mesh;
}
const mFar  = makeMountains([[-15,.5],[-12,2],[-9,1],[-7,3.5],[-5,2],[-3,4.5],[0,3],[2,5],[4,2.5],[6,4],[8,2],[10,3],[13,1.5],[16,.8]], 0x0c180a, -8, 0.9);
const mMid  = makeMountains([[-16,0],[-14,1.5],[-11,.8],[-8,2.5],[-5,1.5],[-2,3.5],[1,2],[4,4],[6,2.5],[9,3.5],[12,1],[15,.5]], 0x091208, -5, 0.85);
const mNear = makeMountains([[-16,-.5],[-12,.5],[-8,1.5],[-4,.8],[0,2.5],[4,1],[8,1.8],[12,.8],[16,-.3]], 0x070e06, -3, 0.95);
scene.add(mFar, mMid, mNear);

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 4),
  new THREE.MeshBasicMaterial({ color: 0x040c03 })
);
groundMesh.position.set(0, -4.5, -1);
scene.add(groundMesh);

function makeMist(y, z, o) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 1.5),
    new THREE.MeshBasicMaterial({ color: 0xc8d8e8, transparent: true, opacity: o, side: THREE.DoubleSide })
  );
  m.position.set(0, y, z);
  return m;
}
const mi1 = makeMist(-2.5, -1.5, 0.022);
const mi2 = makeMist(-3,   -4,   0.013);
const mi3 = makeMist(-1.8, -6,   0.018);
scene.add(mi1, mi2, mi3);

let scrollP = 0, mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();

(function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Sky lerp
  skyCurrent.lerp(SKY_PALETTE[skyTarget], 0.015);
  renderer.setClearColor(skyCurrent);

  // Shooting star
  nextSh -= 0.016;
  if (!shOn && nextSh < 0) {
    shOn = true; shT = 0; nextSh = Math.random() * 12 + 6;
    const sx = (Math.random() - 0.5) * 20, sy = (Math.random() * 0.3 + 0.5) * 8;
    shGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([sx, sy, -3, sx - 3, sy + 1.5, -3]), 3));
  }
  if (shOn) {
    shT += 0.04;
    shMat.opacity = Math.sin(Math.PI * Math.min(shT, 1)) * 0.65;
    const a = shGeo.attributes.position.array;
    a[0] -= 0.5; a[1] -= 0.35; a[3] -= 0.5; a[4] -= 0.35;
    shGeo.attributes.position.needsUpdate = true;
    if (shT > 1) shOn = false;
  }

  // Ring rotation & scale
  ring.rotation.y  = t * 0.11;
  ring.rotation.x  = 0.28 + Math.sin(t * 0.07) * 0.14 + scrollP * 0.75;
  ring2.rotation.copy(ring.rotation);
  const rs = 0.55 + Math.sin(scrollP * Math.PI) * 0.95;
  ring.scale.x  += (rs - ring.scale.x) * 0.03;
  ring.scale.y   = ring.scale.z = ring.scale.x;
  ring2.scale.copy(ring.scale);
  const ro = 0.2 + Math.sin(scrollP * Math.PI) * 0.5;
  ringMat.opacity  = ro;
  ring2Mat.opacity = ro * 0.38;
  ring.position.y  = Math.sin(t * 0.28) * 0.13 - scrollP * 0.45;
  ring2.position.y = ring.position.y;

  // Halo sync
  scene.children.forEach(c => {
    if (!c.userData.isHalo) return;
    c.rotation.copy(ring.rotation);
    c.scale.copy(ring.scale);
    c.position.y          = ring.position.y;
    c.material.opacity    = 0.04 + ro * 0.06;
  });
  glowPlane.position.y    = ring.position.y;
  glowPlane.rotation.copy(ring.rotation);
  glowPlane.material.opacity = 0.4 + ro * 0.6;

  // Stars shimmer
  starMat.opacity = 0.5 + Math.sin(t * 0.38) * 0.18;

  // Fireflies
  const fp = flyGeo.attributes.position.array;
  for (let i = 0; i < FLY_COUNT; i++) {
    fp[i * 3 + 1] += 0.002 * flySpd[i];
    fp[i * 3]     += Math.sin(t * 0.3 + flyPh[i]) * 0.001;
    if (fp[i * 3 + 1] > 7) fp[i * 3 + 1] = -7;
  }
  flyGeo.attributes.position.needsUpdate = true;
  const p = scrollP;
  flyMat.color.setHex(p < 0.25 ? 0x88ff88 : p < 0.45 ? 0xaaccff : p < 0.65 ? 0xff9955 : p < 0.82 ? 0xff5533 : 0x88aaff);
  flyMat.opacity = 0.45 + Math.sin(t * 0.5) * 0.18;

  // Moon arc across sky
  const moonAngle  = scrollP * Math.PI;
  moon.position.x  = Math.cos(moonAngle + Math.PI) * 8;
  moon.position.y  = Math.sin(moonAngle) * 5 - 0.5;
  moon.position.z  = -9;
  moon.material.opacity = 0.72 - scrollP * 0.12 + Math.sin(t * 0.2) * 0.04;
  scene.children.filter(c => c.isMesh && c.geometry.type === 'SphereGeometry' && c !== moon)
    .forEach(h => h.position.copy(moon.position));

  // Mountain parallax + colour shift
  mFar.position.x  = mouseX * -0.28 + scrollP * 0.45;
  mMid.position.x  = mouseX * -0.55 + scrollP * 0.9;
  mNear.position.x = mouseX * -0.85 + scrollP * 1.4;
  const mg = 0.11 - scrollP * 0.04;
  mFar.material.color.setRGB(0.05, mg,       0.04);
  mMid.material.color.setRGB(0.04, mg * 0.8, 0.03);

  // Mist drift
  mi1.position.x = Math.sin(t * 0.10) * 0.45;
  mi2.position.x = Math.sin(t * 0.08 + 1) * 0.75;
  mi3.position.x = Math.sin(t * 0.12 + 2) * 0.38;

  // Camera fly-through
  camera.position.x += (mouseX * 0.55          - camera.position.x) * 0.04;
  camera.position.y += (-mouseY * 0.28 + scrollP * 0.6 - camera.position.y) * 0.04;
  camera.position.z  = 6 - scrollP * 2.2;
  camera.rotation.z += (-mouseX * 0.02 - camera.rotation.z) * 0.03;
  camera.lookAt(0, scrollP * 0.3, 0);

  renderer.render(scene, camera);
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ================================================
   8. AUDIO ENGINE
   ================================================ */
const AE = {
  ctx:     null,
  master:  null,
  reverb:  null,
  rvbSend: null,
  scenes:  {},
  current: null,
  muted:   false,
  running: false,
  FADE:    3.5,

  noise(duration = 3) {
    const sr  = this.ctx.sampleRate;
    const len = sr * duration;
    const buf = this.ctx.createBuffer(1, len, sr);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true; return src;
  },

  async mkReverb(decay = 2.8) {
    const sr  = this.ctx.sampleRate;
    const len = Math.floor(sr * decay);
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
    const conv = this.ctx.createConvolver(); conv.buffer = buf; return conv;
  },

  buildShire() {
    const ctx = this.ctx, out = ctx.createGain(), s = [];
    // Wind
    const wind = this.noise(4), wF = ctx.createBiquadFilter(), wG = ctx.createGain(), wL = ctx.createOscillator(), wLG = ctx.createGain();
    wF.type = 'bandpass'; wF.frequency.value = 560; wF.Q.value = 0.38; wG.gain.value = 0.065; wL.frequency.value = 0.07; wLG.gain.value = 0.038;
    wL.connect(wLG); wLG.connect(wG.gain); wind.connect(wF); wF.connect(wG); wG.connect(out); s.push(wind, wL);
    // Crickets
    const cr = this.noise(2), cF = ctx.createBiquadFilter(), cG = ctx.createGain(), cL = ctx.createOscillator(), cLG = ctx.createGain();
    cF.type = 'bandpass'; cF.frequency.value = 4200; cF.Q.value = 10; cG.gain.value = 0.016; cL.frequency.value = 14; cLG.gain.value = 0.013;
    cL.connect(cLG); cLG.connect(cG.gain); cr.connect(cF); cF.connect(cG); cG.connect(out); s.push(cr, cL);
    // Birds (FM synthesis)
    const bA = ctx.createOscillator(), bAm = ctx.createOscillator(), bAmG = ctx.createGain(), bAG = ctx.createGain();
    bA.type = 'sine'; bA.frequency.value = 1400; bAm.frequency.value = 7; bAmG.gain.value = 88; bAG.gain.value = 0;
    bAm.connect(bAmG); bAmG.connect(bA.frequency); bA.connect(bAG); bAG.connect(out); bAG.connect(this.rvbSend); s.push(bA, bAm);
    const bB = ctx.createOscillator(), bBG = ctx.createGain();
    bB.type = 'sine'; bB.frequency.value = 2100; bBG.gain.value = 0;
    bB.connect(bBG); bBG.connect(out); bBG.connect(this.rvbSend); s.push(bB);
    const chirpA = () => {
      if (!this.running) return;
      const n = ctx.currentTime;
      bA.frequency.setValueAtTime(1100 + Math.random() * 500, n);
      [[0, .05, .15, .25], [.42, .05, .47, .57]].forEach(([t0, a, t1, t2]) => {
        bAG.gain.setValueAtTime(0, n + t0);
        bAG.gain.linearRampToValueAtTime(0.032, n + t0 + a);
        bAG.gain.linearRampToValueAtTime(0.028, n + t1);
        bAG.gain.linearRampToValueAtTime(0, n + t2);
      });
      setTimeout(chirpA, (2 + Math.random() * 4) * 1000);
    };
    setTimeout(chirpA, 1200);
    const chirpB = () => {
      if (!this.running) return;
      const n = ctx.currentTime;
      bB.frequency.setValueAtTime(1700 + Math.random() * 700, n);
      bBG.gain.setValueAtTime(0, n);
      bBG.gain.linearRampToValueAtTime(0.022, n + 0.07);
      bBG.gain.exponentialRampToValueAtTime(0.001, n + 0.42);
      setTimeout(chirpB, (3 + Math.random() * 5) * 1000);
    };
    setTimeout(chirpB, 3200);
    return { masterGain: out, srcs: s, start: () => s.forEach(x => x.start()) };
  },

  buildRivendell() {
    const ctx = this.ctx, out = ctx.createGain(), s = [];
    const w = this.noise(5), wF1 = ctx.createBiquadFilter(), wF2 = ctx.createBiquadFilter(), wG = ctx.createGain(), bL = ctx.createOscillator(), bLG = ctx.createGain();
    wF1.type = 'lowpass'; wF1.frequency.value = 880; wF2.type = 'highpass'; wF2.frequency.value = 190; wG.gain.value = 0.1; bL.frequency.value = 0.42; bLG.gain.value = 0.048;
    bL.connect(bLG); bLG.connect(wG.gain); w.connect(wF1); wF1.connect(wF2); wF2.connect(wG); wG.connect(out); s.push(w, bL);
    [220, 330, 440, 550, 660, 880].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), v = ctx.createOscillator(), vG = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.0055 / (i * 0.38 + 1);
      v.frequency.value = 0.17 + i * 0.038; vG.gain.value = 1.1 + i * 0.28;
      v.connect(vG); vG.connect(o.frequency); o.connect(g); g.connect(out); g.connect(this.rvbSend); s.push(o, v);
    });
    return { masterGain: out, srcs: s, start: () => s.forEach(x => x.start()) };
  },

  buildMordor() {
    const ctx = this.ctx, out = ctx.createGain(), s = [];
    const dr = ctx.createOscillator(), drF = ctx.createBiquadFilter(), drG = ctx.createGain(), dL = ctx.createOscillator(), dLG = ctx.createGain();
    dr.type = 'sawtooth'; dr.frequency.value = 55; drF.type = 'lowpass'; drF.frequency.value = 165; drF.Q.value = 2.4; drG.gain.value = 0.065; dL.frequency.value = 0.042; dLG.gain.value = 0.048;
    dL.connect(dLG); dLG.connect(drG.gain); dr.connect(drF); drF.connect(drG); drG.connect(out); drG.connect(this.rvbSend); s.push(dr, dL);
    const sub = ctx.createOscillator(), subG = ctx.createGain(); sub.type = 'sine'; sub.frequency.value = 28; subG.gain.value = 0.052; sub.connect(subG); subG.connect(out); s.push(sub);
    const dn = this.noise(2), dF = ctx.createBiquadFilter(), dG = ctx.createGain();
    dF.type = 'bandpass'; dF.frequency.value = 115; dF.Q.value = 3.2; dG.gain.value = 0;
    dn.connect(dF); dF.connect(dG); dG.connect(out); s.push(dn);
    const BEAT = 0.58, pat = [0.16, 0, 0.09, 0.06];
    const schedDrum = () => {
      if (!this.running) return;
      const n = ctx.currentTime;
      pat.forEach((v, i) => { if (!v) return; dG.gain.setValueAtTime(v, n + i * BEAT); dG.gain.exponentialRampToValueAtTime(0.001, n + i * BEAT + 0.2); });
      setTimeout(schedDrum, pat.length * BEAT * 1000);
    };
    setTimeout(schedDrum, 700);
    const wi = this.noise(3), wF = ctx.createBiquadFilter(), wG = ctx.createGain(), gL = ctx.createOscillator(), gLG = ctx.createGain();
    wF.type = 'highpass'; wF.frequency.value = 2100; wG.gain.value = 0.048; gL.frequency.value = 0.17; gLG.gain.value = 0.038;
    gL.connect(gLG); gLG.connect(wG.gain); wi.connect(wF); wF.connect(wG); wG.connect(out); s.push(wi, gL);
    return { masterGain: out, srcs: s, start: () => s.forEach(x => x.start()) };
  },

  buildHavens() {
    const ctx = this.ctx, out = ctx.createGain(), s = [];
    const oc = this.noise(6), oF = ctx.createBiquadFilter(), oG = ctx.createGain(), wL = ctx.createOscillator(), wLG = ctx.createGain();
    oF.type = 'lowpass'; oF.frequency.value = 640; oG.gain.value = 0.075; wL.frequency.value = 0.12; wLG.gain.value = 0.065;
    wL.connect(wLG); wLG.connect(oG.gain); oc.connect(oF); oF.connect(oG); oG.connect(out); s.push(oc, wL);
    const br = this.noise(3), bF = ctx.createBiquadFilter(), bG = ctx.createGain();
    bF.type = 'bandpass'; bF.frequency.value = 860; bF.Q.value = 0.58; bG.gain.value = 0.03;
    br.connect(bF); bF.connect(bG); bG.connect(out); s.push(br);
    const gl = ctx.createOscillator(), glF = ctx.createBiquadFilter(), glG = ctx.createGain();
    gl.type = 'sawtooth'; gl.frequency.value = 700; glF.type = 'bandpass'; glF.frequency.value = 700; glF.Q.value = 6; glG.gain.value = 0;
    gl.connect(glF); glF.connect(glG); glG.connect(out); glG.connect(this.rvbSend); s.push(gl);
    const schedGull = () => {
      if (!this.running) return;
      const n = ctx.currentTime;
      gl.frequency.setValueAtTime(560, n); gl.frequency.linearRampToValueAtTime(1080, n + 0.35); gl.frequency.linearRampToValueAtTime(790, n + 0.72);
      glG.gain.setValueAtTime(0, n); glG.gain.linearRampToValueAtTime(0.02, n + 0.1); glG.gain.linearRampToValueAtTime(0.014, n + 0.58); glG.gain.linearRampToValueAtTime(0, n + 0.82);
      setTimeout(schedGull, (4.5 + Math.random() * 8.5) * 1000);
    };
    setTimeout(schedGull, 2800);
    const tn = ctx.createOscillator(), tnG = ctx.createGain(); tn.type = 'sine'; tn.frequency.value = 110; tnG.gain.value = 0.025;
    tn.connect(tnG); tnG.connect(out); tnG.connect(this.rvbSend); s.push(tn);
    return { masterGain: out, srcs: s, start: () => s.forEach(x => x.start()) };
  },

  crossfadeTo(name) {
    if (!this.ctx || name === this.current) return;
    const now = this.ctx.currentTime;
    Object.entries(this.scenes).forEach(([k, sc]) => {
      sc.masterGain.gain.cancelScheduledValues(now);
      sc.masterGain.gain.setValueAtTime(sc.masterGain.gain.value, now);
      sc.masterGain.gain.linearRampToValueAtTime(k === name ? 1 : 0, now + this.FADE);
    });
    this.current = name;
    const LABELS = { hero: 'The Shire', shire: 'The Shire', rivendell: 'Rivendell', fellowship: 'The Fellowship', pelennor: 'The Fields of Pelennor', 'grey-havens': 'The Grey Havens' };
    document.getElementById('audio-label').textContent = LABELS[name] || name;
    const nowLoc = document.getElementById('now-loc');
    nowLoc.textContent = '♪ ' + (LABELS[name] || name);
    nowLoc.style.opacity = '1';
    setTimeout(() => { nowLoc.style.opacity = '0'; }, 2800);
  },

  toggleMute() {
    this.muted = !this.muted;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.muted ? 0 : 0.6, now + 0.8);
    document.getElementById('audio-btn').classList.toggle('muted', this.muted);
  },

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.master = this.ctx.createGain(); this.master.gain.value = 0; this.master.connect(this.ctx.destination);
    this.reverb  = await this.mkReverb(3);
    this.rvbSend = this.ctx.createGain(); this.rvbSend.gain.value = 0.22;
    this.rvbSend.connect(this.reverb); this.reverb.connect(this.master);
    this.scenes.hero          = this.buildShire();
    this.scenes.shire         = this.buildShire();
    this.scenes.rivendell     = this.buildRivendell();
    this.scenes.fellowship    = this.buildMordor();
    this.scenes.pelennor      = this.buildMordor();
    this.scenes['grey-havens']= this.buildHavens();
    Object.values(this.scenes).forEach(sc => { sc.masterGain.connect(this.master); sc.masterGain.gain.value = 0; sc.start(); });
    this.running = true;
    const now = this.ctx.currentTime;
    this.master.gain.linearRampToValueAtTime(0.6, now + 2.5);
    this.crossfadeTo('hero');
    const btn = document.getElementById('audio-btn');
    btn.style.opacity = '1'; btn.classList.remove('muted');
  },
};

document.getElementById('audio-btn').addEventListener('click', () => AE.toggleMute());

/* ================================================
   9. LENIS SMOOTH SCROLL
   ================================================ */
let lenis, lenisReady = false;

function initLenis() {
  lenis = new Lenis({
    duration:    1.85,
    easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  });
  lenis.on('scroll', ({ progress }) => {
    scrollP    = progress;
    skyTarget  = Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1);
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenisReady = true;
}

/* ================================================
   10. RUNE FOOTER TYPEWRITER
   ================================================ */
const typedRFs = {};

function typeRuneFooter(id) {
  if (typedRFs[id]) return;
  typedRFs[id] = true;
  const el   = document.getElementById(id);
  if (!el)   return;
  const text = RUNES[id] || '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = text.slice(0, i);
    i++;
    if (i > text.length) clearInterval(iv);
  }, 52);
}

/* ================================================
   11. FLASH TRANSITIONS
   ================================================ */
const flashEl = document.getElementById('flash');
let lastFlash = 0;

function doFlash() {
  const now = Date.now();
  if (now - lastFlash < 900) return;
  lastFlash = now;
  gsap.timeline()
    .to(flashEl, { opacity: 0.8, duration: 0.07, ease: 'none' })
    .to(flashEl, { opacity: 0,   duration: 0.55, ease: 'power2.out' });
}

/* ================================================
   12. TYPEWRITER EPIGRAPHS
   ================================================ */
function typewrite(el, speed = 28) {
  const text = el.getAttribute('data-quote') || '';
  el.textContent = '';
  el.classList.add('typing', 'type-cur');
  let i = 0;
  const tick = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, speed + Math.random() * 16);
    } else {
      el.classList.remove('type-cur');
    }
  };
  tick();
}

/* ================================================
   13. PHOTO FALLBACK
      If assets/mohak.jpg fails to load, show initials
   ================================================ */
const photoImg      = document.getElementById('photo-img');
const photoFallback = document.getElementById('photo-fallback');
if (photoImg) {
  photoImg.addEventListener('error', () => {
    photoImg.style.display      = 'none';
    if (photoFallback) photoFallback.style.display = 'flex';
  });
}

/* ================================================
   14. RING EASTER-EGG OVERLAY
   ================================================ */
const ringOverlay = document.getElementById('ring-overlay');
let ringOpen = false;

function openRing() {
  if (ringOpen) return;
  ringOpen = true;
  ringOverlay.classList.add('visible');
}
function closeRing() {
  if (!ringOpen) return;
  ringOpen = false;
  ringOverlay.classList.remove('visible');
  cursor.style.background = 'var(--gold)';
}

document.getElementById('ring-click-hint').addEventListener('click', openRing);
document.getElementById('ring-close').addEventListener('click', closeRing);

// Konami code: ↑↑↓↓←→←→BA
const KONAMI   = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIdx  = 0;
document.addEventListener('keydown', e => {
  konamiIdx = (e.keyCode === KONAMI[konamiIdx]) ? konamiIdx + 1 : 0;
  if (konamiIdx === KONAMI.length) {
    konamiIdx = 0;
    openRing();
    cursor.style.background = 'rgba(201,168,76,0.9)';
    if (AE.ctx) {
      const osc = AE.ctx.createOscillator();
      const g   = AE.ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = 55; g.gain.value = 0;
      osc.connect(g); g.connect(AE.master); osc.start();
      g.gain.linearRampToValueAtTime(0.28, AE.ctx.currentTime + 1.5);
      g.gain.linearRampToValueAtTime(0,    AE.ctx.currentTime + 5);
      setTimeout(() => osc.stop(), 5200);
    }
  }
  if (e.key === 'Escape') closeRing();
});

/* ================================================
   15. MAP SIDEBAR — SECTION SYNC
   ================================================ */
function updateMap(sectionId) {
  SECTIONS.forEach(id => {
    document.getElementById('mr-' + id)?.classList.toggle('active', id === sectionId);
    document.getElementById('md-' + id)?.classList.toggle('active', id === sectionId);
    document.getElementById('ml-' + id)?.classList.toggle('active', id === sectionId);
  });
}

/* ================================================
   16. BEGIN BUTTON (preloader → world)
   ================================================ */
let worldStarted = false;

document.getElementById('pre-cta').addEventListener('click', async () => {
  if (worldStarted) return;
  worldStarted = true;

  const pre = document.getElementById('preloader');
  pre.classList.add('dissolve');
  setTimeout(() => { pre.style.display = 'none'; }, 1900);

  await AE.init();
  initLenis();

  gsap.to('#compass',    { opacity: 1, duration: 1,   delay: 0.5 });
  gsap.to('#map-sidebar',{ opacity: 1, duration: 0.8, delay: 1.2 });

  const tl = gsap.timeline({ delay: 0.8 });
  tl.to('.hero-eye',        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' })
    .to('.hero-name',       { opacity: 1, y: 0, duration: 1.6, ease: 'expo.out' }, '-=0.6')
    .to('.hero-hl',         { opacity: 1, y: 0, duration: 1,   ease: 'expo.out' }, '-=0.8')
    .to('.hero-sub',        { opacity: 1, y: 0, duration: 1,   ease: 'expo.out' }, '-=0.6')
    .to('.ring-click-hint', { opacity: 1,        duration: 0.8 }, '-=0.3')
    .to('.scroll-hint',     { opacity: 1,        duration: 0.8 }, '-=0.5');

  typeRuneFooter('rf-hero');
});

/* ================================================
   17. GSAP SCROLL ANIMATIONS
   ================================================ */

// Progress bar
gsap.to('#progress', {
  width: '100%', ease: 'none',
  scrollTrigger: { scrub: 0.4, start: 'top top', end: 'bottom bottom' },
});

// Helper: reveal a section with its badge + epigraph + extras
function sectionReveal(id, extrasFn) {
  const triggerCfg = { trigger: `#${id}`, start: 'top 63%', toggleActions: 'play none none reverse' };

  // Location badge
  gsap.to(`#${id} .loc-badge`, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { ...triggerCfg } });

  // Epigraph typewriter
  const epig = document.querySelector(`#${id} .epigraph`);
  if (epig) {
    ScrollTrigger.create({
      ...triggerCfg,
      onEnter:     () => typewrite(epig),
      onLeave:     () => { epig.textContent = ''; epig.style.opacity = '0'; epig.classList.remove('typing', 'type-cur'); },
      onEnterBack: () => typewrite(epig),
      onLeaveBack: () => { epig.textContent = ''; epig.style.opacity = '0'; epig.classList.remove('typing', 'type-cur'); },
    });
  }

  if (extrasFn) extrasFn(triggerCfg);
}

// The Shire
sectionReveal('shire', t => {
  const tl = gsap.timeline({ scrollTrigger: { ...t } });
  tl.to('#shire .about-body', { opacity: 1, y: 0, duration: 1,   ease: 'expo.out', delay: 0.3 })
    .to('#photo-frame',       { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.7');
  ScrollTrigger.create({ ...t, onEnter: () => typeRuneFooter('rf-shire'), onEnterBack: () => typeRuneFooter('rf-shire') });
});

// Rivendell
sectionReveal('rivendell', t => {
  const tl = gsap.timeline({ scrollTrigger: { ...t } });
  tl.to('#rivendell .skills-hed',  { opacity: 1, y: 0, duration: 1,    ease: 'expo.out', delay: 0.3 })
    .to('#rivendell .member-card', { opacity: 1, y: 0, duration: 0.75,  ease: 'expo.out', stagger: 0.1 }, '-=0.6')
    .to('#rivendell .pillar',      { opacity: 1, y: 0, duration: 0.85,  ease: 'expo.out', stagger: 0.12 }, '-=0.4');
  ScrollTrigger.create({ ...t, onEnter: () => typeRuneFooter('rf-rivendell'), onEnterBack: () => typeRuneFooter('rf-rivendell') });
});

// Fellowship
sectionReveal('fellowship', t => {
  const tl = gsap.timeline({ scrollTrigger: { ...t } });
  tl.to('#fellowship .sec-title', { opacity: 1, y: 0, duration: 1,   ease: 'expo.out', delay: 0.3 })
    .to('#fellowship .divider',   { opacity: 1,        duration: 0.6 }, '-=0.4')
    .to('#fellowship .quest',     { opacity: 1, x: 0, duration: 0.9,  ease: 'expo.out', stagger: 0.2 }, '-=0.3');
  ScrollTrigger.create({ ...t, onEnter: () => typeRuneFooter('rf-fellowship'), onEnterBack: () => typeRuneFooter('rf-fellowship') });
});

// Pelennor
sectionReveal('pelennor', t => {
  const tl = gsap.timeline({ scrollTrigger: { ...t } });
  tl.to('#pelennor .sec-title',    { opacity: 1, y: 0, duration: 1,    ease: 'expo.out', delay: 0.3 })
    .to('#pelennor .divider',      { opacity: 1,        duration: 0.6 }, '-=0.4')
    .to('#pelennor .battle-card',  { opacity: 1, y: 0, duration: 0.85,  ease: 'expo.out', stagger: 0.15 }, '-=0.3');
  ScrollTrigger.create({
    ...t,
    onEnter: () => {
      typeRuneFooter('rf-pelennor');
      // Animate stat bars after a short delay
      setTimeout(() => {
        document.querySelectorAll('.bstat-fill').forEach((fill, i) => {
          setTimeout(() => { fill.style.width = fill.dataset.w + '%'; }, i * 120 + 400);
        });
      }, 600);
    },
    onEnterBack: () => typeRuneFooter('rf-pelennor'),
  });
});

// Grey Havens
sectionReveal('grey-havens', t => {
  const tl = gsap.timeline({ scrollTrigger: { ...t } });
  tl.to('.havens-hed',    { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.3 })
    .to('.havens-sub',    { opacity: 1, y: 0, duration: 0.8,  ease: 'expo.out' }, '-=0.5')
    .to('.contact-links', { opacity: 1, y: 0, duration: 0.8,  ease: 'expo.out' }, '-=0.4')
    .to('.farewell',      { opacity: 1,        duration: 1.2 }, '-=0.4');
  ScrollTrigger.create({ ...t, onEnter: () => typeRuneFooter('rf-grey'), onEnterBack: () => typeRuneFooter('rf-grey') });
});

/* ================================================
   18. SECTION DETECTION
       compass dots + audio + weather + map + flash
   ================================================ */
const compassDots = document.querySelectorAll('.cdot');

function setSection(index, id) {
  compassDots.forEach((d, j) => d.classList.toggle('active', j === index));
  skyTarget = index;
  AE.crossfadeTo(id);
  WX.set(WEATHER_MAP[id] || 'clear');
  updateMap(id);
}

SECTIONS.forEach((id, i) => {
  ScrollTrigger.create({
    trigger:     `#${id}`,
    start:       'top 50%',
    end:         'bottom 50%',
    onEnter:     () => setSection(i, id),
    onEnterBack: () => setSection(i, id),
  });

  // Flash on crossing section boundary
  if (i > 0) {
    ScrollTrigger.create({ trigger: `#${id}`, start: 'top 35%',  onEnter:    doFlash });
    ScrollTrigger.create({ trigger: `#${id}`, start: 'top 65%',  onLeaveBack: doFlash });
  }
});

// Compass dot click → smooth scroll
compassDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (lenisReady) lenis.scrollTo('#' + SECTIONS[i], { duration: 2 });
    else document.getElementById(SECTIONS[i]).scrollIntoView({ behavior: 'smooth' });
  });
});
