/* Dither — Ordered dithering with Bayer matrix over animated noise */
(function () {
  'use strict';

  const canvas = document.getElementById('dt-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBg;
uniform float uPatternSize;

/* 8x8 Bayer matrix (normalized to 0-1) */
float bayer8(vec2 pos) {
  /* 2x2 base */
  vec2 p = floor(mod(pos, 8.0));
  float v = 0.0;

  /* Build up the Bayer matrix value using bit interleaving */
  int x = int(p.x);
  int y = int(p.y);

  /* Manual 8x8 Bayer threshold lookup */
  /* Row 0 */ if (y == 0) { if (x == 0) v = 0.0; else if (x == 1) v = 32.0; else if (x == 2) v = 8.0; else if (x == 3) v = 40.0; else if (x == 4) v = 2.0; else if (x == 5) v = 34.0; else if (x == 6) v = 10.0; else v = 42.0; }
  /* Row 1 */ else if (y == 1) { if (x == 0) v = 48.0; else if (x == 1) v = 16.0; else if (x == 2) v = 56.0; else if (x == 3) v = 24.0; else if (x == 4) v = 50.0; else if (x == 5) v = 18.0; else if (x == 6) v = 58.0; else v = 26.0; }
  /* Row 2 */ else if (y == 2) { if (x == 0) v = 12.0; else if (x == 1) v = 44.0; else if (x == 2) v = 4.0; else if (x == 3) v = 36.0; else if (x == 4) v = 14.0; else if (x == 5) v = 46.0; else if (x == 6) v = 6.0; else v = 38.0; }
  /* Row 3 */ else if (y == 3) { if (x == 0) v = 60.0; else if (x == 1) v = 28.0; else if (x == 2) v = 52.0; else if (x == 3) v = 20.0; else if (x == 4) v = 62.0; else if (x == 5) v = 30.0; else if (x == 6) v = 54.0; else v = 22.0; }
  /* Row 4 */ else if (y == 4) { if (x == 0) v = 3.0; else if (x == 1) v = 35.0; else if (x == 2) v = 11.0; else if (x == 3) v = 43.0; else if (x == 4) v = 1.0; else if (x == 5) v = 33.0; else if (x == 6) v = 9.0; else v = 41.0; }
  /* Row 5 */ else if (y == 5) { if (x == 0) v = 51.0; else if (x == 1) v = 19.0; else if (x == 2) v = 59.0; else if (x == 3) v = 27.0; else if (x == 4) v = 49.0; else if (x == 5) v = 17.0; else if (x == 6) v = 57.0; else v = 25.0; }
  /* Row 6 */ else if (y == 6) { if (x == 0) v = 15.0; else if (x == 1) v = 47.0; else if (x == 2) v = 7.0; else if (x == 3) v = 39.0; else if (x == 4) v = 13.0; else if (x == 5) v = 45.0; else if (x == 6) v = 5.0; else v = 37.0; }
  /* Row 7 */ else { if (x == 0) v = 63.0; else if (x == 1) v = 31.0; else if (x == 2) v = 55.0; else if (x == 3) v = 23.0; else if (x == 4) v = 61.0; else if (x == 5) v = 29.0; else if (x == 6) v = 53.0; else v = 21.0; }

  return v / 64.0;
}

/* Hash noise */
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

/* Simple FBM */
float fbm(vec2 p, float t) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    val += amp * noise(p + t * 0.2 * float(i + 1) * 0.15);
    p *= 2.1;
    amp *= 0.5;
  }
  return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime;

  /* Source gradient/noise field */
  float n1 = fbm(p * 3.0 + vec2(t * 0.15, t * 0.1), t);
  float n2 = fbm(p * 2.0 + vec2(n1 * 0.5, t * 0.08), t * 0.7);

  /* Gradient overlay */
  float gradient = length(uv - 0.5) * 1.4;
  float field = mix(n1, n2, 0.5) - gradient * 0.3;
  field = clamp(field, 0.0, 1.0);

  /* Color based on field value */
  vec3 sourceColor = mix(uColor1, uColor2, field);
  float brightness = field;

  /* Apply Bayer dithering */
  vec2 ditherPos = gl_FragCoord.xy / uPatternSize;
  float threshold = bayer8(ditherPos);

  /* Dithered output — step function with Bayer threshold */
  float dithered = step(threshold, brightness);

  /* Multi-level dithering: 4 levels for richer look */
  float level = floor(brightness * 4.0) / 4.0;
  float remainder = fract(brightness * 4.0);
  float ditherBit = step(threshold, remainder);
  float finalBrightness = level + ditherBit * 0.25;

  vec3 col = mix(uBg, sourceColor, finalBrightness);

  /* Subtle scanlines for retro feel */
  float scanline = 0.95 + 0.05 * sin(gl_FragCoord.y * 0.8);
  col *= scanline;

  /* Vignette */
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.0;
  col *= max(vig, 0.0);

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

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    const speed = parseFloat(getCSS('--dt-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;
    const patternSize = parseFloat(getCSS('--dt-pattern-size', '4.0'));

    const bg = GLUtils.hexToRGB(getCSS('--dt-bg', '#0a0a12'));
    const c1 = GLUtils.hexToRGB(getCSS('--dt-color-1', '#4ecdc4'));
    const c2 = GLUtils.hexToRGB(getCSS('--dt-color-2', '#ff6b9d'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uPatternSize', '1f', patternSize);

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
