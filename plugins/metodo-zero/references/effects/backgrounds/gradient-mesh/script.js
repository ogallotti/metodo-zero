/* Gradient Mesh — WebGL fragment shader with animated color blobs */
(function () {
  'use strict';

  const canvas = document.getElementById('gm-canvas');
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
uniform float uGrain;
uniform vec3 uBg;

/* hash for grain */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime;
  vec3 col = uBg;

  /* blob 1 */
  vec2 c1 = vec2(
    0.5 * aspect + 0.3 * sin(t * 0.37) * aspect,
    0.5 + 0.3 * cos(t * 0.29)
  );
  float d1 = length(p - c1);
  float b1 = smoothstep(0.55, 0.0, d1);
  col += uColor1 * b1 * 0.7;

  /* blob 2 */
  vec2 c2 = vec2(
    0.5 * aspect + 0.35 * cos(t * 0.43 + 1.5) * aspect,
    0.5 + 0.28 * sin(t * 0.31 + 2.0)
  );
  float d2 = length(p - c2);
  float b2 = smoothstep(0.5, 0.0, d2);
  col += uColor2 * b2 * 0.65;

  /* blob 3 */
  vec2 c3 = vec2(
    0.5 * aspect + 0.25 * sin(t * 0.51 + 3.7) * aspect,
    0.5 + 0.35 * cos(t * 0.23 + 0.8)
  );
  float d3 = length(p - c3);
  float b3 = smoothstep(0.6, 0.0, d3);
  col += uColor3 * b3 * 0.6;

  /* blob 4 */
  vec2 c4 = vec2(
    0.5 * aspect + 0.32 * cos(t * 0.27 + 5.1) * aspect,
    0.5 + 0.3 * sin(t * 0.41 + 4.2)
  );
  float d4 = length(p - c4);
  float b4 = smoothstep(0.45, 0.0, d4);
  col += uColor4 * b4 * 0.55;

  /* blob 5 — mix of color1 & color3 */
  vec2 c5 = vec2(
    0.5 * aspect + 0.28 * sin(t * 0.33 + 6.3) * aspect,
    0.5 + 0.25 * cos(t * 0.47 + 1.1)
  );
  float d5 = length(p - c5);
  float b5 = smoothstep(0.4, 0.0, d5);
  col += mix(uColor1, uColor3, 0.5) * b5 * 0.5;

  /* subtle grain */
  float grain = hash(uv * uResolution + fract(t * 100.0)) - 0.5;
  col += grain * uGrain;

  /* tone map to avoid blowout */
  col = col / (1.0 + col * 0.3);

  gl_FragColor = vec4(col, 1.0);
}`;

  const prog = GLUtils.program(gl, vert, frag);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  /* read CSS custom properties */
  function getCSS(prop, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    return v || fallback;
  }

  let running = true;
  let startTime = performance.now();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mouse tracking */
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

    const speed = parseFloat(getCSS('--gm-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--gm-bg', '#0a0a1a'));
    const c1 = GLUtils.hexToRGB(getCSS('--gm-color-1', '#ff6b6b'));
    const c2 = GLUtils.hexToRGB(getCSS('--gm-color-2', '#4ecdc4'));
    const c3 = GLUtils.hexToRGB(getCSS('--gm-color-3', '#7b68ee'));
    const c4 = GLUtils.hexToRGB(getCSS('--gm-color-4', '#ffa07a'));
    const grain = parseFloat(getCSS('--gm-grain', '0.06'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);
    GLUtils.uniform(gl, prog, 'uColor4', '3f', c4);
    GLUtils.uniform(gl, prog, 'uGrain', '1f', grain);

    GLUtils.draw(gl);
    requestAnimationFrame(frame);
  }

  /* IntersectionObserver — pause when offscreen */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { running = entry.isIntersecting; });
    },
    { threshold: 0.1 }
  );
  observer.observe(canvas);

  requestAnimationFrame(frame);
})();
