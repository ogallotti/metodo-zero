/* Color Bends — Flowing color bands that bend and weave like ribbons */
(function () {
  'use strict';

  const canvas = document.getElementById('cb-canvas');
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
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform vec3 uBg;

#define NUM_BANDS 6

/* Parametric spline-like curve for band center Y at given X */
float bandCurve(float x, float t, float idx) {
  float phase = idx * 1.7 + 0.3;
  float freq1 = 1.5 + idx * 0.3;
  float freq2 = 2.8 + idx * 0.2;

  float y = 0.5; /* center */
  y += sin(x * freq1 + t * 0.5 + phase) * 0.15;
  y += cos(x * freq2 + t * 0.3 + phase * 1.5) * 0.1;
  y += sin(x * 0.8 + t * 0.7 + idx * 2.3) * 0.08;

  /* Spread bands vertically */
  y += (idx - 2.5) * 0.1;

  return y;
}

/* Smooth distance field for band width */
float bandField(vec2 uv, float t, float idx) {
  float curveY = bandCurve(uv.x, t, idx);
  float dist = abs(uv.y - curveY);

  /* Band width varies along the curve */
  float width = 0.03 + 0.015 * sin(uv.x * 3.0 + t + idx * 1.1);

  return smoothstep(width, 0.0, dist);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime;
  vec3 col = uBg;

  /* Band colors */
  vec3 colors[6];
  colors[0] = uColor1;
  colors[1] = uColor2;
  colors[2] = uColor3;
  colors[3] = uColor4;
  colors[4] = uColor5;
  colors[5] = mix(uColor1, uColor3, 0.5);

  /* Draw 6 layered bands */
  for (int i = 0; i < NUM_BANDS; i++) {
    float fi = float(i);
    float band = bandField(vec2(p.x, uv.y), t, fi);

    /* Fade at horizontal edges */
    float fadeX = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    band *= fadeX;

    /* Soft glow around band */
    float curveY = bandCurve(p.x, t, fi);
    float glowDist = abs(uv.y - curveY);
    float glow = exp(-glowDist * 15.0) * 0.15;

    vec3 bandColor = colors[i];

    /* Gradient along band length */
    float lengthGrad = sin(p.x * 2.0 + t * 0.3 + fi) * 0.5 + 0.5;
    bandColor = mix(bandColor * 0.7, bandColor, lengthGrad);

    col += bandColor * band * 0.5;
    col += bandColor * glow * fadeX;
  }

  /* Intersection highlights — where bands cross, brighten */
  float totalField = 0.0;
  for (int i = 0; i < NUM_BANDS; i++) {
    totalField += bandField(vec2(p.x, uv.y), t, float(i));
  }
  float crossHighlight = smoothstep(1.2, 2.0, totalField) * 0.2;
  col += vec3(crossHighlight);

  /* Grain */
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += grain * 0.02;

  /* Tone mapping */
  col = col / (1.0 + col * 0.3);

  /* Vignette */
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.2;
  col *= vig;

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

    const speed = parseFloat(getCSS('--cb-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--cb-bg', '#0a0a1a'));
    const c1 = GLUtils.hexToRGB(getCSS('--cb-color-1', '#ff6b6b'));
    const c2 = GLUtils.hexToRGB(getCSS('--cb-color-2', '#4ecdc4'));
    const c3 = GLUtils.hexToRGB(getCSS('--cb-color-3', '#ffe66d'));
    const c4 = GLUtils.hexToRGB(getCSS('--cb-color-4', '#7b68ee'));
    const c5 = GLUtils.hexToRGB(getCSS('--cb-color-5', '#ff9a9e'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);
    GLUtils.uniform(gl, prog, 'uColor4', '3f', c4);
    GLUtils.uniform(gl, prog, 'uColor5', '3f', c5);

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
