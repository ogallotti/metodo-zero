/* Threads — Flowing lines with Perlin noise Y displacement */
(function () {
  'use strict';

  const canvas = document.getElementById('th-canvas');
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
uniform vec3 uBg;

/* Perlin-style noise */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec3 col = uBg;

  /* Mouse influence on convergence point */
  vec2 converge = vec2(0.65, 0.5) + (uMouse - 0.5) * 0.15;

  float totalAlpha = 0.0;

  /* Draw 35 flowing lines */
  for (int i = 0; i < 35; i++) {
    float fi = float(i);
    float lineY = fi / 35.0;

    /* Each line has unique phase and amplitude */
    float phase = fi * 0.7 + fi * fi * 0.03;
    float amp = 0.08 + 0.12 * sin(fi * 0.41 + 1.7);

    /* Noise displacement along the line */
    float nx = uv.x * 3.0 + uTime * 0.3 + phase;
    float displacement = snoise(vec2(nx, fi * 0.5 + uTime * 0.1)) * amp;

    /* Lines converge toward the convergence point */
    float spread = 1.0 - smoothstep(0.0, 1.0, uv.x);
    spread = spread * spread;
    float baseY = mix(converge.y, lineY, spread);
    float yPos = baseY + displacement;

    /* Line thickness varies */
    float thickness = 0.002 + 0.001 * sin(fi * 1.3);
    float dist = abs(uv.y - yPos);
    float line = smoothstep(thickness, 0.0, dist);

    /* Color gradient along each line */
    float colorMix = uv.x * 0.7 + fi / 35.0 * 0.3;
    vec3 lineColor = mix(uColor1, uColor2, colorMix);

    /* Fade at edges */
    float fadeX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);

    /* Blur increases with density */
    float blur = 1.0 - smoothstep(0.2, 0.8, abs(uv.y - converge.y));
    line *= fadeX * (0.5 + 0.5 * blur);

    col += lineColor * line * 0.35;
    totalAlpha += line;
  }

  /* Soft glow at convergence */
  float glowDist = length((uv - converge) * vec2(aspect, 1.0));
  float glow = exp(-glowDist * 4.0) * 0.15;
  col += mix(uColor1, uColor2, 0.5) * glow;

  /* Grain */
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += grain * 0.02;

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

    const speed = parseFloat(getCSS('--th-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--th-bg', '#0a0a1a'));
    const c1 = GLUtils.hexToRGB(getCSS('--th-color-1', '#00d4ff'));
    const c2 = GLUtils.hexToRGB(getCSS('--th-color-2', '#7b2ff7'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
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
