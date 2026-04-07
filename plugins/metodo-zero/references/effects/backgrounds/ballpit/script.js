/* Ballpit — Metaball blobs with mouse repulsion */
(function () {
  'use strict';

  const canvas = document.getElementById('bp-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  /* Generate ball data as uniform arrays — 12 balls */
  const NUM_BALLS = 12;

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

#define NUM_BALLS 12

/* Ball positions computed in shader for simplicity */
vec2 ballPos(int i, float t) {
  float fi = float(i);
  float angle = fi * 0.7 + t * (0.3 + fi * 0.05);
  float rx = 0.3 + 0.15 * sin(fi * 1.3 + t * 0.2);
  float ry = 0.25 + 0.12 * cos(fi * 0.9 + t * 0.15);
  return vec2(
    0.5 + rx * sin(angle + fi * 2.1),
    0.5 + ry * cos(angle * 0.8 + fi * 1.7)
  );
}

float ballRadius(int i) {
  float fi = float(i);
  return 0.06 + 0.04 * sin(fi * 1.7 + 0.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime;

  /* Metaball field: sum of (radius^2 / distance^2) */
  float field = 0.0;
  vec3 colorWeight = vec3(0.0);
  float totalWeight = 0.0;

  for (int i = 0; i < NUM_BALLS; i++) {
    vec2 bPos = ballPos(i, t);

    /* Mouse repulsion */
    vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
    vec2 bPosAspect = vec2(bPos.x * aspect, bPos.y);
    vec2 toMouse = bPosAspect - mouseAspect;
    float mDist = length(toMouse);
    if (mDist < 0.3) {
      float repel = (0.3 - mDist) * 0.15;
      bPos += normalize(toMouse) * repel / vec2(aspect, 1.0);
    }

    vec2 bAspect = vec2(bPos.x * aspect, bPos.y);
    float r = ballRadius(i);
    float d = length(p - bAspect);
    float contribution = (r * r) / (d * d + 0.0001);
    field += contribution;

    /* Color per ball */
    float fi = float(i);
    float colorIdx = mod(fi, 3.0);
    vec3 ballColor;
    if (colorIdx < 1.0) ballColor = uColor1;
    else if (colorIdx < 2.0) ballColor = uColor2;
    else ballColor = uColor3;

    colorWeight += ballColor * contribution;
    totalWeight += contribution;
  }

  vec3 col = uBg;

  /* Threshold for metaball surface */
  float threshold = 1.0;
  if (field > threshold) {
    vec3 blobColor = colorWeight / totalWeight;

    /* Smooth edge */
    float edge = smoothstep(threshold, threshold + 0.3, field);

    /* Inner glow — brighter at high field values */
    float inner = smoothstep(threshold, threshold + 2.0, field);
    vec3 surfaceCol = mix(blobColor * 0.6, blobColor, inner);

    /* Specular-like highlight at very dense areas */
    float spec = smoothstep(3.0, 6.0, field) * 0.4;
    surfaceCol += vec3(spec);

    col = mix(col, surfaceCol, edge);
  }

  /* Subtle ambient glow around balls */
  float ambientField = smoothstep(0.3, 1.0, field) * 0.15;
  vec3 ambientColor = colorWeight / max(totalWeight, 0.001);
  col += ambientColor * ambientField * (1.0 - smoothstep(threshold, threshold + 0.1, field));

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

    const speed = parseFloat(getCSS('--bp-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--bp-bg', '#0a0a1a'));
    const c1 = GLUtils.hexToRGB(getCSS('--bp-color-1', '#ff6b6b'));
    const c2 = GLUtils.hexToRGB(getCSS('--bp-color-2', '#4ecdc4'));
    const c3 = GLUtils.hexToRGB(getCSS('--bp-color-3', '#ffe66d'));

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
