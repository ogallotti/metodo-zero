/* Soft Aurora — Softer, more diffuse aurora using FBM with gentle gradient transitions */
(function () {
  'use strict';

  const canvas = document.getElementById('sa-canvas');
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
uniform vec3 uBg;

/* Smooth hash noise */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  /* Quintic smooth for softer transitions */
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

/* FBM with gentle rotation */
float fbm(vec2 p, float t) {
  float val = 0.0;
  float amp = 0.5;
  mat2 r = rot(0.4);
  for (int i = 0; i < 5; i++) {
    val += amp * noise(p + t * 0.15 * float(i + 1) * 0.15);
    p = r * p * 2.1;
    amp *= 0.45;
  }
  return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * vec2(3.0, 2.0);

  float t = uTime * 0.3;

  /* Multiple soft aurora bands at different heights */
  vec3 col = uBg;

  /* Band 1 — top area */
  float n1 = fbm(p * vec2(1.0, 0.5) + vec2(t * 0.1, 0.0), t);
  float band1Y = 0.7 + n1 * 0.15;
  float band1 = smoothstep(0.2, 0.0, abs(uv.y - band1Y)) * 0.4;
  band1 *= smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.6, uv.y);
  col += uColor1 * band1;

  /* Band 2 — middle */
  float n2 = fbm(p * vec2(1.2, 0.6) + vec2(0.0, t * 0.08), t * 0.8);
  float band2Y = 0.55 + n2 * 0.12;
  float band2 = smoothstep(0.18, 0.0, abs(uv.y - band2Y)) * 0.35;
  band2 *= smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.5, uv.y);
  col += uColor2 * band2;

  /* Band 3 — lower */
  float n3 = fbm(p * vec2(0.8, 0.4) + vec2(t * 0.12, t * 0.05), t * 0.6);
  float band3Y = 0.4 + n3 * 0.1;
  float band3 = smoothstep(0.15, 0.0, abs(uv.y - band3Y)) * 0.3;
  band3 *= smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.4, uv.y);
  col += uColor3 * band3;

  /* Diffuse vertical glow */
  float verticalGlow = smoothstep(0.0, 0.5, uv.y) * smoothstep(1.0, 0.5, uv.y);
  float horizontalVar = fbm(vec2(uv.x * 4.0, t * 0.1), t * 0.5);
  float diffuse = verticalGlow * horizontalVar * 0.12;
  col += mix(uColor1, uColor3, uv.x) * diffuse;

  /* Very subtle shimmer */
  float shimmer = noise(uv * uResolution * 0.02 + t * 2.0);
  shimmer = pow(shimmer, 3.0) * 0.06;
  col += vec3(shimmer) * verticalGlow;

  /* Grain */
  float grain = hash(gl_FragCoord.xy + fract(t * 77.0)) - 0.5;
  col += grain * 0.015;

  /* Soft vignette */
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.8;
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

    const speed = parseFloat(getCSS('--sa-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--sa-bg', '#0c0c20'));
    const c1 = GLUtils.hexToRGB(getCSS('--sa-color-1', '#a8d8ea'));
    const c2 = GLUtils.hexToRGB(getCSS('--sa-color-2', '#d4a5ff'));
    const c3 = GLUtils.hexToRGB(getCSS('--sa-color-3', '#ffb7c5'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);

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
