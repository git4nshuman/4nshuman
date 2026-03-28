// ---- 3D WIREFRAME SPHERE (pure canvas, no library) ----
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// build sphere points
const PTS = [];
const N = 18;
for (let i = 0; i <= N; i++) {
  const phi = (i / N) * Math.PI;
  for (let j = 0; j < N * 2; j++) {
    const theta = (j / (N * 2)) * Math.PI * 2;
    const r = 0.38;
    PTS.push([
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    ]);
  }
}

let rot = 0, rotY = 0, mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth - 0.5) * 0.8;
  my = (e.clientY / window.innerHeight - 0.5) * 0.4;
});
document.addEventListener('touchmove', e => {
  mx = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.8;
  my = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.4;
}, { passive: true });

function project(x, y, z) {
  const fov = 1.8;
  const cosR = Math.cos(rot + mx), sinR = Math.sin(rot + mx);
  const cosY = Math.cos(rotY + my), sinY = Math.sin(rotY + my);
  const rx = x * cosR - z * sinR;
  const rz = x * sinR + z * cosR;
  const ry = y * cosY - rz * sinY;
  const rz2 = y * sinY + rz * cosY;
  const scale = fov / (fov + rz2 + 0.5);
  const R = Math.min(W, H);
  return { sx: rx * scale * R + W / 2, sy: ry * scale * R + H / 2, scale, z: rz2 };
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  const proj = PTS.map(([x, y, z]) => project(x, y, z));
  const R = Math.min(W, H) * 0.38;

  for (let i = 0; i < proj.length; i++) {
    for (let j = i + 1; j < proj.length; j++) {
      const dx = PTS[i][0] - PTS[j][0];
      const dy = PTS[i][1] - PTS[j][1];
      const dz = PTS[i][2] - PTS[j][2];
      const d3 = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (d3 < 0.22) {
        const a = proj[i], b = proj[j];
        const alpha = ((a.scale + b.scale) / 2) * 0.2;
        const hue = 260 + (a.sx / W) * 70;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = `hsla(${hue},80%,65%,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
    const p = proj[i];
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, p.scale * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${270 + p.sx/W*60},85%,70%,${p.scale * 0.45})`;
    ctx.fill();
  }

  rot += 0.003;
  rotY += 0.001;
  requestAnimationFrame(draw);
}
draw();

// ---- TYPEWRITER ----
const lines = [
  'BUILDER · CODER · CREATOR',
  'DELHI · INDIA',
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
  setTimeout(type, deleting ? 28 : 65);
}
type();
