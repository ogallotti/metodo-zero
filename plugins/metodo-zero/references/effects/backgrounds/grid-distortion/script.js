/* Grid Distortion — WebGL wireframe grid with noise displacement and mouse warp */
(function () {
  'use strict';

  const canvas = document.getElementById('gd-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uGridColor;
uniform vec3 uGlowColor;
uniform vec3 uBg;
uniform float uDensity;
uniform float uDistortion;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uMouseActive;

/* 2D noise for displacement */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* fbm for smoother displacement */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

/*
 * Displacement function: returns the offset for a grid position.
 * Combines FBM noise with time for ambient wave + mouse push.
 */
vec2 displace(vec2 gridPos, float t) {
  vec2 d = vec2(0.0);

  /* ambient noise wave */
  d.x = (fbm(gridPos * 0.3 + t * 0.15) - 0.5) * 2.0;
  d.y = (fbm(gridPos * 0.3 + t * 0.15 + 50.0) - 0.5) * 2.0;
  d *= uDistortion;

  /* mouse displacement bubble */
  if (uMouseActive > 0.5) {
    float aspect = uResolution.x / uResolution.y;
    vec2 gridUV = gridPos / uDensity;
    gridUV.x *= aspect;
    vec2 mouseAspect = uMouse;
    mouseAspect.x *= aspect;

    vec2 delta = gridUV - mouseAspect;
    float dist = length(delta);
    float mr = uMouseRadius;

    if (dist < mr) {
      float factor = pow(1.0 - dist / mr, 2.0);
      vec2 push = normalize(delta + 0.0001) * factor * uDistortion * 3.0;
      d += push;
    }
  }

  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  float t = uTime;

  /* grid coordinates */
  vec2 gridUV = uv * uDensity;
  gridUV.x *= aspect;

  /* displaced grid position */
  vec2 gridPos = gridUV;
  vec2 d = displace(gridPos, t);
  vec2 displaced = gridUV + d;

  /* grid lines: distance to nearest integer line */
  vec2 gridFrac = fract(displaced);
  float lineX = min(gridFrac.x, 1.0 - gridFrac.x);
  float lineY = min(gridFrac.y, 1.0 - gridFrac.y);

  /* line thickness (thinner = sharper grid) */
  float thickness = 0.03;
  float lineAlpha = 1.0 - smoothstep(0.0, thickness, min(lineX, lineY));
  lineAlpha *= 0.12;

  /* intersection glow: bright where both lines cross */
  float interX = smoothstep(thickness * 2.0, 0.0, lineX);
  float interY = smoothstep(thickness * 2.0, 0.0, lineY);
  float intersection = interX * interY;

  /* mouse proximity glow */
  float mouseGlow = 0.0;
  if (uMouseActive > 0.5) {
    vec2 mouseAspect = uMouse;
    mouseAspect.x *= aspect;
    vec2 uvAspect = uv;
    uvAspect.x *= aspect;
    float mouseDist = length(uvAspect - mouseAspect);
    mouseGlow = smoothstep(uMouseRadius, uMouseRadius * 0.1, mouseDist);
  }

  /* boost line brightness near mouse */
  lineAlpha += mouseGlow * 0.15;

  /* distortion magnitude for brightness variation */
  float distMag = length(d);
  float distBright = smoothstep(0.0, uDistortion * 2.0, distMag);

  /* color */
  vec3 col = uBg;

  /* grid lines */
  vec3 lineCol = mix(uGridColor * 0.5, uGridColor, distBright);
  col += lineCol * lineAlpha;

  /* intersection glow */
  col += uGlowColor * intersection * (0.15 + mouseGlow * 0.4);

  /* mouse area glow */
  col += uGlowColor * mouseGlow * 0.04;

  /* vignette */
  float vig = 1.0 - smoothstep(0.3, 1.3, length(uv - 0.5));
  col *= mix(0.3, 1.0, vig);

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
  let mouseActive = 0;

  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse = [t.clientX / window.innerWidth, 1.0 - t.clientY / window.innerHeight];
    mouseActive = 1;
  }

  canvas.addEventListener('mousemove', onPointer);
  canvas.addEventListener('touchmove', onPointer, { passive: true });
  canvas.addEventListener('mouseleave', () => { mouseActive = 0; });
  canvas.addEventListener('touchend', () => { mouseActive = 0; });

  /* smooth mouse for interpolation */
  let smoothMouse = [0.5, 0.5];

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    /* smooth tracking */
    smoothMouse[0] += (mouse[0] - smoothMouse[0]) * 0.08;
    smoothMouse[1] += (mouse[1] - smoothMouse[1]) * 0.08;

    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0;
    const bg = GLUtils.hexToRGB(getCSS('--gd-bg', '#0a0a1a'));
    const gridColor = GLUtils.hexToRGB(getCSS('--gd-color', '#ffffff'));
    const glowColor = GLUtils.hexToRGB(getCSS('--gd-glow-color', '#6366f1'));
    const density = parseFloat(getCSS('--gd-density', '30.0'));
    const distortion = parseFloat(getCSS('--gd-distortion', '0.04'));
    const mouseRadius = parseFloat(getCSS('--gd-mouse-radius', '0.2'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uGridColor', '3f', gridColor);
    GLUtils.uniform(gl, prog, 'uGlowColor', '3f', glowColor);
    GLUtils.uniform(gl, prog, 'uDensity', '1f', density);
    GLUtils.uniform(gl, prog, 'uDistortion', '1f', distortion);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', smoothMouse);
    GLUtils.uniform(gl, prog, 'uMouseRadius', '1f', mouseRadius);
    GLUtils.uniform(gl, prog, 'uMouseActive', '1f', mouseActive);

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
