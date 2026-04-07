/* Liquid Chrome — Metallic liquid distortion using Canvas 2D shader simulation */
(function () {
  'use strict';

  const container = document.querySelector('.lc-container');
  const canvas = document.querySelector('.lc-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, rW, rH;
  let animId = null;
  let isVisible = true;
  let time = 0;
  let imageData, pixels;

  const config = {
    scale: 3, // render at 1/scale resolution for performance
    speed: 0.008,
    complexity: 4,
    metallic: 0.85,
    chromeShift: 0.15,
    baseHue: 220,
    saturation: 0.15,
  };

  const mouse = { x: 0.5, y: 0.5, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = container.clientWidth;
    H = container.clientHeight;
    // Render at reduced resolution for performance
    rW = Math.ceil(W / config.scale);
    rH = Math.ceil(H / config.scale);
    canvas.width = rW;
    canvas.height = rH;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.style.imageRendering = 'auto';
    imageData = ctx.createImageData(rW, rH);
    pixels = imageData.data;
  }

  // Simplex-like noise using sine combinations (no library needed)
  function fbm(x, y, t) {
    let val = 0;
    let amp = 1;
    let freq = 1;
    let maxVal = 0;
    for (let i = 0; i < config.complexity; i++) {
      val += amp * (
        Math.sin(x * freq * 1.7 + t * 1.3 + Math.cos(y * freq * 0.9 + t * 0.7)) *
        Math.cos(y * freq * 2.1 + t * 0.9 + Math.sin(x * freq * 1.1 + t * 1.1)) +
        Math.sin((x + y) * freq * 0.8 + t * 1.5)
      ) / 3;
      maxVal += amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    return val / maxVal;
  }

  // Chrome-like color mapping
  function chromeColor(n, dx, dy) {
    // n is in [-1, 1], map to chrome look
    const metallic = config.metallic;

    // Base reflectance
    const refl = (n + 1) * 0.5; // 0..1

    // Fresnel-like edge highlights from derivatives
    const edge = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 3);

    // Metallic look: high contrast, desaturated
    const base = Math.pow(refl, 1.5) * metallic + refl * (1 - metallic);
    const highlight = Math.pow(Math.max(0, refl), 8) * 0.7;

    // Subtle color shift based on angle
    const hueShift = (n * config.chromeShift + edge * 0.1) * 360;
    const hue = config.baseHue + hueShift;
    const sat = config.saturation * (1 - edge * 0.5);
    const lum = base * 0.7 + highlight + edge * 0.15;

    return hslToRgb(hue / 360, sat, Math.min(1, lum));
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
  }

  function render() {
    const invW = 1 / rW;
    const invH = 1 / rH;
    const t = time;
    const ep = 0.01;

    // Mouse influence
    const mx = mouse.x;
    const my = mouse.y;
    const mouseActive = mouse.active;

    for (let y = 0; y < rH; y++) {
      for (let x = 0; x < rW; x++) {
        let nx = x * invW * 3;
        let ny = y * invH * 3;

        // Mouse distortion
        if (mouseActive) {
          const dmx = x * invW - mx;
          const dmy = y * invH - my;
          const mdist = Math.sqrt(dmx * dmx + dmy * dmy);
          if (mdist < 0.3) {
            const mforce = (1 - mdist / 0.3) * 0.5;
            nx += Math.sin(t * 2 + dmy * 10) * mforce;
            ny += Math.cos(t * 2 + dmx * 10) * mforce;
          }
        }

        const val = fbm(nx, ny, t);
        // Compute derivatives for edge detection
        const dx = fbm(nx + ep, ny, t) - val;
        const dy = fbm(nx, ny + ep, t) - val;

        const [r, g, b] = chromeColor(val, dx / ep, dy / ep);

        const idx = (y * rW + x) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function loop() {
    if (!isVisible) return;
    time += config.speed;
    render();
    animId = requestAnimationFrame(loop);
  }

  // Mouse
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
    mouse.active = true;
  });
  container.addEventListener('mouseleave', () => { mouse.active = false; });
  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = (touch.clientY - rect.top) / rect.height;
    mouse.active = true;
  }, { passive: true });
  container.addEventListener('touchend', () => { mouse.active = false; });

  // Visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) loop();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
      }
    }
  });

  resize();
  loop();
})();
