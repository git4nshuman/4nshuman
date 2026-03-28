// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});

// TYPEWRITER
let li = 0, ci = 0, deleting = false;
const el = document.getElementById('typed');
function type() {
  const str = lines[li];
  if (!deleting) {
    el.textContent = str.slice(0, ++ci);
    if (ci === str.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    el.textContent = str.slice(0, --ci);
    if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
  }
  setTimeout(type, deleting ? 35 : 65);
}
type();

// STAT COUNTER
const counters = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = target > 1000 ? 2000 : 800;
    const step = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// 3D TILT ON CARDS
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// GLOBE (particle sphere)
const canvas = document.getElementById('globe-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], mouse = { x: 0, y: 0 };

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  buildParticles();
}

function buildParticles() {
  particles = [];
  const count = 280;
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    particles.push({ phi, theta, r: Math.min(W, H) * 0.34 });
  }
}

let rot = 0;
function drawGlobe() {
  ctx.clearRect(0, 0, W, H);
  rot += 0.003;
  const cx = W * 0.5, cy = H * 0.5;
  const mx = (mouse.x / window.innerWidth - 0.5) * 0.6;
  const my = (mouse.y / window.innerHeight - 0.5) * 0.4;

  particles.forEach(p => {
    const x3 = p.r * Math.sin(p.phi) * Math.cos(p.theta + rot + mx);
    const y3 = p.r * Math.sin(p.phi) * Math.sin(p.theta + rot + mx);
    const z3 = p.r * Math.cos(p.phi + my);
    const scale = (z3 + p.r) / (2 * p.r);
    const sx = cx + x3;
    const sy = cy + y3;
    const size = scale * 2.2 + 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(125, 249, 182, ${scale * 0.9})`;
    ctx.fill();
  });
  requestAnimationFrame(drawGlobe);
}

window.addEventListener('resize', resize);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();
drawGlobe();
