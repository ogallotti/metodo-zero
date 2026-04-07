/* Beams — WebGL light beams from focal point with bloom */
(function () {
  'use strict';

  const canvas = document.getElementById('bm-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uBg;
uniform float uCount;
uniform float uSpeed;
uniform vec2 uFocal;
uniform vec2 uMouse;

#define PI 3.14159265359
#define TAU 6.28318530718

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  /* center on focal point */
  vec2 p = uv - uFocal;
  p.x *= aspect;

  float angle = atan(p.y, p.x);
  float dist = length(p);

  float t = uTime * uSpeed;
  float n = uCount;

  /* layer 1: primary beams — wide, bright */
  float a1 = angle + t * 0.7;
  float seg1 = fract(a1 * n / TAU + 0.5);
  float beams1 = smoothstep(0.5, 0.47, abs(seg1 - 0.5));
  beams1 *= smoothstep(1.6, 0.0, dist);

  /* layer 2: thinner counter-rotating beams */
  float a2 = angle - t * 0.5;
  float seg2 = fract(a2 * n * 1.5 / TAU + 0.5);
  float beams2 = smoothstep(0.5, 0.485, abs(seg2 - 0.5));
  beams2 *= smoothstep(1.2, 0.1, dist) * 0.5;

  /* layer 3: wide slow accent beams */
  float a3 = angle + t * 0.25;
  float seg3 = fract(a3 * (n * 0.5) / TAU + 0.5);
  float beams3 = smoothstep(0.5, 0.40, abs(seg3 - 0.5));
  beams3 *= smoothstep(1.8, 0.0, dist) * 0.35;

  float intensity = beams1 + beams2 + beams3;

  /* bloom: square intensity for glow falloff */
  float bloom = intensity * intensity;

  /* center glow */
  float glow = 0.18 / (dist + 0.06);
  glow = min(glow, 3.0);

  /* pulsating core */
  float pulse = 0.5 + 0.5 * sin(t * 3.0);
  glow *= 0.8 + pulse * 0.2;

  /* mouse proximity brightens area */
  vec2 mp = uMouse - uFocal;
  mp.x *= aspect;
  float mouseDist = length(p - mp);
  float mouseBoost = smoothstep(0.5, 0.0, mouseDist) * 0.25;

  float final = bloom + glow * 0.35 + mouseBoost;

  vec3 col = uBg + uColor * final;

  /* vignette */
  float vig = 1.0 - smoothstep(0.4, 1.5, length(uv - 0.5));
  col *= mix(0.5, 1.0, vig);

  /* tone map */
  col = col / (1.0 + col * 0.2);

  gl_FragColor = vec4(col, 1.0);
}`;

  const prog = GLUtils.program(gl, vert, frag);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  function getCSS(prop, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    return v || fallback;
  }

  let running = true;
  let startTime = performance.now();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mouse = [0.5, 0.5];
  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse = [t.clientX / window.innerWidth, 1.0 - t.clientY / window.innerHeight];
  }
  canvas.addEventListener('mousemove', onPointer);
  canvas.addEventListener('touchmove', onPointer, { passive: true });

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0;
    const bg = GLUtils.hexToRGB(getCSS('--bm-bg', '#050510'));
    const color = GLUtils.hexToRGB(getCSS('--bm-color', '#4a9eff'));
    const count = parseFloat(getCSS('--bm-count', '12'));
    const speed = parseFloat(getCSS('--bm-speed', '0.4'));
    const focalX = parseFloat(getCSS('--bm-focal-x', '0.5'));
    const focalY = parseFloat(getCSS('--bm-focal-y', '0.5'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uCount', '1f', count);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uFocal', '2f', [focalX, focalY]);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);

    GLUtils.draw(gl);
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { running = entry.isIntersecting; });
    },
    { threshold: 0.1 }
  );
  observer.observe(canvas);

  requestAnimationFrame(frame);
})();
