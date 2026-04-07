/* Evil Eye — Concentric pulsing iris with mouse-tracking pupil via WebGL */
(function () {
  'use strict';

  const container = document.querySelector('.eye-container');
  const canvas = document.querySelector('.eye-canvas');
  if (!container || !canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

  const fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uIrisColor;
    uniform vec3 uPupilColor;
    uniform float uRingCount;
    uniform float uPulseSpeed;
    uniform vec3 uGlowColor;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 center = vec2(0.5);
      vec2 p = (uv - center) * vec2(aspect, 1.0);

      float t = uTime * uPulseSpeed;

      // Pupil position tracks mouse with damping
      vec2 pupilOffset = (uMouse - center) * vec2(aspect, 1.0) * 0.12;
      vec2 pupilCenter = pupilOffset;

      float dist = length(p);
      float pupilDist = length(p - pupilCenter);
      float angle = atan(p.y, p.x);

      // Iris ring pattern
      float rings = sin(dist * uRingCount * 6.2832 - t * 2.0) * 0.5 + 0.5;

      // Add angular variation for organic feel
      float angularNoise = noise(vec2(angle * 3.0, dist * 5.0 + t * 0.5)) * 0.3;
      rings = rings * (0.7 + angularNoise);

      // Radial fibers in the iris
      float fibers = noise(vec2(angle * 20.0 + sin(t * 0.2) * 0.5, dist * 8.0));
      fibers = pow(fibers, 0.6) * 0.5;

      // Pupil — dark circle with soft edge
      float pupilSize = 0.08 + 0.02 * sin(t * 0.7);
      float pupil = 1.0 - smoothstep(pupilSize - 0.02, pupilSize + 0.02, pupilDist);

      // Iris boundary
      float irisOuter = 0.35 + 0.03 * sin(angle * 6.0 + t);
      float irisInner = pupilSize + 0.04;
      float irisMask = smoothstep(irisOuter + 0.02, irisOuter - 0.02, dist) *
                       smoothstep(irisInner - 0.02, irisInner + 0.02, dist);

      // Color composition
      vec3 irisCol = uIrisColor * (0.5 + rings * 0.5 + fibers);

      // Bright ring at iris edge
      float edgeRing = exp(-pow((dist - irisOuter) * 30.0, 2.0));
      irisCol += uGlowColor * edgeRing * 0.8;

      // Inner glow near pupil
      float innerGlow = exp(-pow((dist - irisInner) * 20.0, 2.0));
      irisCol += uGlowColor * innerGlow * 0.4;

      // Pulsing rings of light
      float pulse1 = exp(-pow(sin(dist * 12.0 - t * 1.5) * 2.0, 2.0));
      float pulse2 = exp(-pow(sin(dist * 8.0 + t * 1.2) * 2.0, 2.0));
      irisCol += uGlowColor * (pulse1 + pulse2) * 0.15 * irisMask;

      // Combine
      vec3 col = vec3(0.0);
      col = mix(col, irisCol, irisMask);
      col = mix(col, uPupilColor, pupil);

      // Outer glow
      float outerGlow = exp(-dist * 2.5) * 0.3;
      col += uGlowColor * outerGlow * (1.0 - irisMask);

      // Subtle ambient pulsation
      col += uGlowColor * 0.02 * sin(t * 0.5);

      // Background radial gradient
      vec3 bgCol = uPupilColor * 0.15 * (1.0 - dist * 0.8);
      col = mix(bgCol, col, smoothstep(0.8, 0.3, dist));

      // Vignette
      float vig = 1.0 - 0.5 * pow(length(uv - 0.5) * 1.4, 2.0);
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
  const smoothMouse = { x: 0.5, y: 0.5 };

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame() {
    if (!isVisible) return;

    // Smooth mouse follow
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

    GLUtils.resize(canvas, gl);
    const t = (performance.now() - startTime) / 1000;

    const irisCol = GLUtils.hexToRGB(getCSS('--eye-iris-color') || '#1e88e5');
    const pupilCol = GLUtils.hexToRGB(getCSS('--eye-pupil-color') || '#0d0d0d');
    const glowCol = GLUtils.hexToRGB(getCSS('--eye-glow-color') || '#2196f3');
    const ringCount = parseFloat(getCSS('--eye-ring-count') || '12');
    const pulseSpeed = parseFloat(getCSS('--eye-pulse-speed') || '0.8');

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', [smoothMouse.x, smoothMouse.y]);
    GLUtils.uniform(gl, prog, 'uIrisColor', '3f', irisCol);
    GLUtils.uniform(gl, prog, 'uPupilColor', '3f', pupilCol);
    GLUtils.uniform(gl, prog, 'uGlowColor', '3f', glowCol);
    GLUtils.uniform(gl, prog, 'uRingCount', '1f', ringCount);
    GLUtils.uniform(gl, prog, 'uPulseSpeed', '1f', pulseSpeed);

    GLUtils.draw(gl);
    animId = requestAnimationFrame(frame);
  }

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

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
    }
  });

  frame();
})();
