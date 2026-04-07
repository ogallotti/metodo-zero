/* Flickering Grid — WebGL grid of independently flickering squares */
(function () {
  'use strict';

  const canvas = document.getElementById('fg-canvas');
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
uniform float uCellSize;
uniform float uGap;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uMouseRadius;

/* per-cell hash for unique phase */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* second hash for brightness bias */
float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  float aspect = uResolution.x / uResolution.y;

  float cellTotal = uCellSize + uGap;

  /* cell coordinates */
  vec2 cell = floor(pixel / cellTotal);
  vec2 cellUV = mod(pixel, cellTotal);

  /* is this pixel inside the cell (not in the gap)? */
  float inCell = step(cellUV.x, uCellSize) * step(cellUV.y, uCellSize);

  if (inCell < 0.5) {
    gl_FragColor = vec4(uBg, 1.0);
    return;
  }

  /* per-cell unique values */
  float phase = hash(cell) * 6.28318;
  float brightness = hash2(cell);
  float speedMult = 0.6 + hash(cell + 100.0) * 0.8;

  /* flicker: sin wave with unique phase and speed */
  float t = uTime * uSpeed * speedMult;
  float flicker = sin(t + phase) * 0.5 + 0.5;

  /* some cells are "bright" — higher base opacity */
  float base = brightness > 0.8 ? 0.5 : (brightness > 0.5 ? 0.2 : 0.08);
  float alpha = base + flicker * (brightness > 0.8 ? 0.5 : 0.25);

  /* mouse proximity: increase flicker speed and brightness */
  vec2 cellCenter = (cell + 0.5) * cellTotal / uResolution;
  vec2 mouseNorm = uMouse;
  float mouseDist = length((cellCenter - mouseNorm) * vec2(aspect, 1.0));
  float mouseEffect = smoothstep(uMouseRadius, uMouseRadius * 0.2, mouseDist);

  /* faster flicker near mouse */
  float fastFlicker = sin(t * 3.0 + phase * 2.0) * 0.5 + 0.5;
  alpha = mix(alpha, 0.6 + fastFlicker * 0.4, mouseEffect);

  /* color with brightness variation */
  vec3 cellColor = uColor * alpha;

  /* slight warm tint for bright cells near mouse */
  cellColor += vec3(0.1, 0.05, 0.0) * mouseEffect * alpha;

  /* rounded corner: soften cell edges */
  vec2 cellLocal = (cellUV / uCellSize) * 2.0 - 1.0;
  float cornerDist = length(max(abs(cellLocal) - 0.85, 0.0));
  float cornerMask = 1.0 - smoothstep(0.0, 0.15, cornerDist);

  vec3 col = uBg + cellColor * cornerMask;

  /* vignette */
  vec2 uv = gl_FragCoord.xy / uResolution;
  float vig = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
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

  let mouse = [-1.0, -1.0];
  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse = [t.clientX / window.innerWidth, 1.0 - t.clientY / window.innerHeight];
  }
  canvas.addEventListener('mousemove', onPointer);
  canvas.addEventListener('touchmove', onPointer, { passive: true });
  canvas.addEventListener('mouseleave', () => { mouse = [-1.0, -1.0]; });

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    const [w, h, dpr] = GLUtils.resize(canvas, gl);

    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0;
    const bg = GLUtils.hexToRGB(getCSS('--fg-bg', '#0a0a1a'));
    const color = GLUtils.hexToRGB(getCSS('--fg-color', '#6366f1'));
    const cellSize = parseFloat(getCSS('--fg-size', '24.0')) * dpr;
    const gap = parseFloat(getCSS('--fg-gap', '2.0')) * dpr;
    const speed = parseFloat(getCSS('--fg-speed', '1.0'));
    const mouseRadius = parseFloat(getCSS('--fg-mouse-radius', '0.2'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uCellSize', '1f', cellSize);
    GLUtils.uniform(gl, prog, 'uGap', '1f', gap);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
    GLUtils.uniform(gl, prog, 'uMouseRadius', '1f', mouseRadius);

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
