const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  dots = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.4 + 0.4,
    hue: [270, 330, 180][Math.floor(Math.random() * 3)]
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x = (d.x + d.vx + W) % W;
    d.y = (d.y + d.vy + H) % H;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${d.hue},90%,72%,0.72)`;
    ctx.fill();
  });
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i], b = dots[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 95) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},80%,68%,${0.11 * (1 - dist / 95)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();
