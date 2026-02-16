// snow.js - 简易雪花效果（canvas），并导出 start/stop/toggle
(function() {
  let canvas, ctx, flakes = [], animationId = null;
  const MAX_FLAKES = 120;

  function createCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'snow-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 5;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initFlakes() {
    flakes = [];
    const count = Math.min(MAX_FLAKES, Math.floor(window.innerWidth / 8));
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 3) + 1,
        d: Math.random() * 1.5 + 0.5,
        swing: Math.random() * 1.5,
        swingStep: Math.random() * 0.02 + 0.01
      });
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    update();
    animationId = requestAnimationFrame(draw);
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.d;
      f.swing += f.swingStep;
      f.x += Math.sin(f.swing) * 1.2;
      if (f.y > canvas.height + 5 || f.x > canvas.width + 5 || f.x < -5) {
        flakes[i] = { x: Math.random() * canvas.width, y: -10, r: f.r, d: f.d, swing: Math.random() * 1.5, swingStep: f.swingStep };
      }
    }
  }

  function startSnow() {
    if (animationId) return;
    createCanvas();
    initFlakes();
    draw();
    localStorage.setItem('snow', '1');
  }

  function stopSnow() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (canvas) {
      window.removeEventListener('resize', resize);
      canvas.parentNode && canvas.parentNode.removeChild(canvas);
      canvas = null;
      ctx = null;
      flakes = [];
    }
    localStorage.setItem('snow', '0');
  }

  function toggleSnow(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (animationId) stopSnow(); else startSnow();
    updateSnowButton();
  }

  function updateSnowButton() {
    const btn = document.getElementById('snow-toggle');
    if (!btn) return;
    const icon = btn.querySelector('.material-icons');
    if (animationId) {
      btn.classList.add('active');
      if (icon) icon.textContent = 'ac_unit';
    } else {
      btn.classList.remove('active');
      if (icon) icon.textContent = 'ac_unit';
    }
  }

  function initSnow() {
    const saved = localStorage.getItem('snow');
    // 默认开启雪花效果：当 localStorage 未设置（null）或设置为 '1' 时启动
    if (saved === null || saved === '1') startSnow();
    updateSnowButton();
    const btn = document.getElementById('snow-toggle');
    if (btn) btn.addEventListener('click', toggleSnow);
  }

  // Expose control for debugging
  window.snow = { start: startSnow, stop: stopSnow, toggle: toggleSnow };
  document.addEventListener('DOMContentLoaded', initSnow);

})();
