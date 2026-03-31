// ---- CANVAS PARTICLE NETWORK ----
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.3 + 0.4,
    hue: [265, 325, 175, 200][Math.floor(Math.random() * 4)]
  }));
}

function frame() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x = (p.x + p.vx + W) % W;
    p.y = (p.y + p.vy + H) % H;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},88%,70%,0.75)`;
    ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 95) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},80%,65%,${0.11 * (1 - d / 95)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resize);
resize();
frame();

// ---- TYPEWRITER ----
const lines = [
  'BUILDER · CODER · CREATOR',
  'DELHI, INDIA',
  'LINKS · SOCIALS · CONNECT'
];
let li = 0, ci = 0, deleting = false;
const tw = document.getElementById('tw');

function type() {
  const s = lines[li];
  if (!deleting) {
    tw.textContent = s.slice(0, ++ci);
    if (ci === s.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    tw.textContent = s.slice(0, --ci);
    if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
  }
  setTimeout(type, deleting ? 30 : 70);
}

type();
