/* Plasma — 3D volumetric raymarching through a plasma field */
(function () {
  'use strict';

  const canvas = document.getElementById('pl-canvas');
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

/* SDF for a torus in xz-plane */
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

/* Domain warping with sin/cos */
vec3 warp(vec3 p, float t) {
  float s = sin(t * 0.3);
  float c = cos(t * 0.3);
  p.xz = mat2(c, -s, s, c) * p.xz;
  p.x += sin(p.y * 1.5 + t * 0.7) * 0.4;
  p.y += cos(p.x * 1.2 + t * 0.5) * 0.3;
  p.z += sin(p.x * 0.8 + p.y * 0.6 + t * 0.4) * 0.5;
  return p;
}

/* Plasma density function */
float plasma(vec3 p, float t) {
  vec3 q = warp(p, t);

  float d1 = sdTorus(q, vec2(1.8, 0.6));
  float d2 = sdTorus(q.yzx * 1.1, vec2(1.5, 0.5));
  float d3 = sdTorus(q.zxy * 0.9, vec2(2.0, 0.4));

  float d = min(d1, min(d2, d3));

  /* Add organic warping */
  d += sin(q.x * 3.0 + t) * cos(q.y * 2.5 + t * 0.7) * 0.15;
  d += sin(q.z * 4.0 + t * 1.3) * 0.1;

  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  /* Ray setup */
  vec3 ro = vec3(0.0, 0.0, -4.5);
  vec3 rd = normalize(vec3(uv, 1.2));

  /* Rotate camera slowly */
  float ca = uTime * 0.15;
  float sa = sin(ca), co = cos(ca);
  ro.xz = mat2(co, -sa, sa, co) * ro.xz;
  rd.xz = mat2(co, -sa, sa, co) * rd.xz;

  /* Raymarching — accumulate color */
  vec3 col = uBg;
  float totalDensity = 0.0;

  float stepSize = 0.12;
  vec3 p = ro;

  for (int i = 0; i < 60; i++) {
    p += rd * stepSize;

    float d = plasma(p, uTime);

    /* Accumulate color in the plasma volume */
    if (d < 0.8) {
      float density = (0.8 - d) * 0.08;
      density = clamp(density, 0.0, 1.0);

      /* Color based on position and density */
      float colorParam = length(p.xz) * 0.3 + p.y * 0.2 + uTime * 0.1;
      float mix1 = sin(colorParam) * 0.5 + 0.5;
      vec3 plasmaCol = mix(uColor1, uColor2, mix1);

      /* Emissive glow — brighter at core */
      float glow = exp(-d * 2.0) * 1.5;
      plasmaCol *= (1.0 + glow);

      col += plasmaCol * density * (1.0 - totalDensity);
      totalDensity += density;

      if (totalDensity > 0.95) break;
    }
  }

  /* Tone mapping */
  col = col / (1.0 + col * 0.4);

  /* Vignette */
  vec2 vuv = gl_FragCoord.xy / uResolution;
  float vig = 1.0 - dot(vuv - 0.5, vuv - 0.5) * 1.5;
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

    const speed = parseFloat(getCSS('--pl-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--pl-bg', '#050510'));
    const c1 = GLUtils.hexToRGB(getCSS('--pl-color-1', '#ff3366'));
    const c2 = GLUtils.hexToRGB(getCSS('--pl-color-2', '#6633ff'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);

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
