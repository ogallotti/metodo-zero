/* Liquid Ether — Organic fluid patterns using FBM with rotation between octaves */
(function () {
  'use strict';

  const canvas = document.getElementById('le-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBg;

/* Hash noise */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* Value noise */
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

/* Rotation matrix for octave rotation */
mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

/* FBM with rotation between octaves */
float fbm(vec2 p, float t) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  mat2 r = rot(0.5);

  for (int i = 0; i < 5; i++) {
    val += amp * noise(p * freq + t * 0.3 * float(i + 1) * 0.2);
    p = r * p;
    freq *= 2.1;
    amp *= 0.5;
  }
  return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 3.0;

  float t = uTime * 0.4;

  /* Mouse warp */
  vec2 mp = vec2(uMouse.x * aspect, uMouse.y) * 3.0;
  vec2 diff = p - mp;
  float dist = length(diff);
  float warpStrength = exp(-dist * 1.2) * 0.8;
  p += diff * warpStrength * sin(t * 2.0);

  /* Layered FBM */
  float n1 = fbm(p + vec2(t * 0.2, t * 0.15), t);
  float n2 = fbm(p + vec2(n1 * 1.5, t * 0.1), t * 0.7);
  float n3 = fbm(p + vec2(n2 * 1.2, n1 * 0.8), t * 0.5);

  /* Color mapping — ethereal palette */
  vec3 col = uBg;

  float blend1 = smoothstep(0.2, 0.6, n1);
  float blend2 = smoothstep(0.3, 0.7, n2);
  float blend3 = smoothstep(0.25, 0.65, n3);

  col = mix(col, uColor1 * 0.7, blend1 * 0.6);
  col = mix(col, uColor2 * 0.8, blend2 * 0.5);
  col = mix(col, uColor3 * 0.6, blend3 * 0.4);

  /* Soft highlights */
  float highlight = smoothstep(0.55, 0.75, n3) * 0.3;
  col += vec3(highlight);

  /* Ethereal glow */
  float glow = exp(-length(uv - 0.5) * 2.0) * 0.15;
  col += mix(uColor1, uColor2, 0.5) * glow;

  /* Grain */
  float grain = hash(gl_FragCoord.xy + fract(uTime * 37.0)) - 0.5;
  col += grain * 0.025;

  /* Tone mapping */
  col = col / (1.0 + col * 0.3);

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

    const speed = parseFloat(getCSS('--le-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--le-bg', '#0a0a1a'));
    const c1 = GLUtils.hexToRGB(getCSS('--le-color-1', '#4ecdc4'));
    const c2 = GLUtils.hexToRGB(getCSS('--le-color-2', '#7b68ee'));
    const c3 = GLUtils.hexToRGB(getCSS('--le-color-3', '#ff6b9d'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
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
