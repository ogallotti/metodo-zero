/* Grainient — Gradient with organic flowing noise grain via WebGL */
(function () {
  'use strict';

  var container = document.querySelector('.grn-container');
  var canvas = document.querySelector('.grn-canvas');
  if (!container || !canvas) return;

  var gl = GLUtils.create(canvas);
  if (!gl) return;

  var vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

  var fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uGrain;
    uniform float uSpeed;
    uniform float uWarp;

    // Permutation-based hash for smoother noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289((34.0 * x + 1.0) * x); }

    // 2D simplex noise
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289v2(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fractional Brownian motion
    float fbm(vec2 p, float t) {
      float val = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        val += amp * snoise(p * freq + t * 0.3 * float(i + 1) * 0.2);
        freq *= 2.1;
        amp *= 0.5;
      }
      return val;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
      float t = uTime * uSpeed;

      // Warped gradient coordinates
      float warp1 = fbm(p * 1.5 + t * 0.1, t);
      float warp2 = fbm(p * 1.5 + vec2(5.2, 1.3) + t * 0.08, t);
      vec2 warped = uv + vec2(warp1, warp2) * uWarp * 0.15;

      // Mouse influence on warp
      vec2 mp = uMouse;
      float mDist = length(uv - mp);
      warped += (uv - mp) * 0.05 * exp(-mDist * 4.0);

      // Multi-stop gradient using warped coordinates
      float gradPos = warped.x * 0.4 + warped.y * 0.6 + warp1 * 0.2;
      gradPos = fract(gradPos * 0.5 + 0.5);

      vec3 col;
      if (gradPos < 0.25) {
        col = mix(uColor1, uColor2, gradPos / 0.25);
      } else if (gradPos < 0.5) {
        col = mix(uColor2, uColor3, (gradPos - 0.25) / 0.25);
      } else if (gradPos < 0.75) {
        col = mix(uColor3, uColor4, (gradPos - 0.5) / 0.25);
      } else {
        col = mix(uColor4, uColor1, (gradPos - 0.75) / 0.25);
      }

      // Organic flowing grain — NOT flat noise
      // Layer multiple noise octaves at different scales with time animation
      float grain = 0.0;

      // Large flowing grain structures
      grain += snoise(p * 8.0 + t * 0.5) * 0.4;

      // Medium detail
      grain += snoise(p * 20.0 + t * 0.8 + warp1 * 2.0) * 0.3;

      // Fine grain
      grain += snoise(p * 50.0 + t * 1.2) * 0.2;

      // Extra fine for texture
      grain += snoise(p * 120.0 - t * 0.3) * 0.1;

      // Map grain to brightness modulation
      grain *= uGrain;

      col += grain * 0.15;

      // Add film grain overlay (high frequency, animated)
      float filmGrain = snoise(gl_FragCoord.xy * 0.5 + t * 50.0) * uGrain * 0.08;
      col += filmGrain;

      // Subtle vignette
      float vig = 1.0 - 0.3 * pow(length(uv - 0.5) * 1.3, 2.0);
      col *= vig;

      col = clamp(col, 0.0, 1.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  var prog = GLUtils.program(gl, vertSrc, fragSrc);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  var animId = null;
  var isVisible = true;
  var startTime = performance.now();
  var mouse = { x: 0.5, y: 0.5 };

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame() {
    if (!isVisible) return;

    GLUtils.resize(canvas, gl);
    var t = (performance.now() - startTime) / 1000;

    var c1 = GLUtils.hexToRGB(getCSS('--grn-color-1') || '#ff6b35');
    var c2 = GLUtils.hexToRGB(getCSS('--grn-color-2') || '#f7c59f');
    var c3 = GLUtils.hexToRGB(getCSS('--grn-color-3') || '#1a535c');
    var c4 = GLUtils.hexToRGB(getCSS('--grn-color-4') || '#4ecdc4');
    var grain = parseFloat(getCSS('--grn-grain') || '0.35');
    var speed = parseFloat(getCSS('--grn-speed') || '0.3');
    var warp = parseFloat(getCSS('--grn-warp') || '0.8');

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', [mouse.x, mouse.y]);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);
    GLUtils.uniform(gl, prog, 'uColor4', '3f', c4);
    GLUtils.uniform(gl, prog, 'uGrain', '1f', grain);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uWarp', '1f', warp);

    GLUtils.draw(gl);
    animId = requestAnimationFrame(frame);
  }

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  });
  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (touch.clientY - rect.top) / rect.height;
  }, { passive: true });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
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

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
    }
  });

  frame();
})();
