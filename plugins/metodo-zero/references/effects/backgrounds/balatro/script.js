/* Balatro — Psychedelic domain-warped pattern via WebGL */
(function () {
  'use strict';

  const container = document.querySelector('.bal-container');
  const canvas = document.querySelector('.bal-canvas');
  if (!container || !canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

  const fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uSpeed;
    uniform float uWarp;

    // Smooth value noise
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Domain warping: apply multiple layers of distortion
    vec2 warp(vec2 p, float t) {
      float n1 = noise(p * 2.0 + t * 0.3);
      float n2 = noise(p * 2.0 + vec2(5.2, 1.3) + t * 0.25);

      vec2 q = vec2(
        noise(p + vec2(n1 * uWarp, n2 * uWarp) + t * 0.15),
        noise(p + vec2(n2 * uWarp + 1.7, n1 * uWarp + 9.2) + t * 0.12)
      );

      vec2 r = vec2(
        noise(p + q * uWarp * 1.2 + vec2(1.7, 9.2) + t * 0.1),
        noise(p + q * uWarp * 1.2 + vec2(8.3, 2.8) + t * 0.08)
      );

      return r;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

      // Mouse influence: subtle distortion near cursor
      vec2 mp = (uMouse - 0.5) * vec2(aspect, 1.0);
      float mDist = length(p - mp);
      p += (p - mp) * 0.15 * exp(-mDist * 3.0);

      float t = uTime * uSpeed;

      // 4-layer domain warping
      vec2 w = warp(p * 1.5, t);

      // Additional warping pass for deeper psychedelia
      float n = noise(p * 3.0 + w * uWarp * 2.0 + t * 0.2);
      float n2 = noise(p * 1.5 + w * uWarp * 1.5 + vec2(3.7, 8.1) + t * 0.15);

      // Combine warped layers with sinusoidal modulation
      float pattern = sin(w.x * 6.28 + n * 3.14 + t) * 0.5 + 0.5;
      float pattern2 = sin(w.y * 6.28 + n2 * 3.14 - t * 0.7) * 0.5 + 0.5;
      float combined = mix(pattern, pattern2, 0.5 + 0.5 * sin(t * 0.3));

      // 4-color gradient mapping
      vec3 col;
      if (combined < 0.33) {
        col = mix(uColor1, uColor2, combined / 0.33);
      } else if (combined < 0.66) {
        col = mix(uColor2, uColor3, (combined - 0.33) / 0.33);
      } else {
        col = mix(uColor3, uColor4, (combined - 0.66) / 0.34);
      }

      // Add subtle brightness variation
      col += 0.08 * sin(n * 6.28 + t);

      // Vignette
      float vig = 1.0 - 0.4 * length(uv - 0.5);
      col *= vig;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const prog = GLUtils.program(gl, vertSrc, fragSrc);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  let animId = null;
  let isVisible = true;
  let startTime = performance.now();
  const mouse = { x: 0.5, y: 0.5 };

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame() {
    if (!isVisible) return;

    const [w, h] = GLUtils.resize(canvas, gl);
    const t = (performance.now() - startTime) / 1000;

    const c1 = GLUtils.hexToRGB(getCSS('--bal-color-1') || '#ff6b6b');
    const c2 = GLUtils.hexToRGB(getCSS('--bal-color-2') || '#4ecdc4');
    const c3 = GLUtils.hexToRGB(getCSS('--bal-color-3') || '#45b7d1');
    const c4 = GLUtils.hexToRGB(getCSS('--bal-color-4') || '#f7dc6f');
    const speed = parseFloat(getCSS('--bal-speed') || '0.5');
    const warp = parseFloat(getCSS('--bal-warp') || '2.5');

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', [mouse.x, mouse.y]);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);
    GLUtils.uniform(gl, prog, 'uColor4', '3f', c4);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uWarp', '1f', warp);

    GLUtils.draw(gl);
    animId = requestAnimationFrame(frame);
  }

  // Mouse / touch
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  });
  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (touch.clientY - rect.top) / rect.height;
  }, { passive: true });

  // Visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) frame();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
    }
  });

  frame();
})();
