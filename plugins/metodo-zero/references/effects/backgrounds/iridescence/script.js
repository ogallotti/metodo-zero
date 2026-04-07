(function () {
  'use strict';

  const VERT = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  // Iterative cosine accumulation — produces iridescent color patterns
  const FRAG = `precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uTint;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uMouseActive;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  // Center and scale UVs
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;

  // Mouse shifts UV center
  vec2 mouseShift = (uMouse - 0.5) * vec2(aspect, 1.0) * uMouseActive * 0.3;
  p -= mouseShift;

  float t = uTime * uSpeed;

  // Iterative cosine accumulation — 8 iterations
  // a accumulates cosine values, d accumulates sine values
  float a = 0.0;
  float d = 0.0;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    a += cos(fi - d - a * p.x * uAmplitude + t * 0.5);
    d += sin(p.y * fi * 0.5 + a + t * 0.3);
  }

  // Build color from the accumulated values
  vec3 col = cos(p.xyx * vec3(d, a, d) * 0.5 + vec3(0.0, 2.094, 4.189)) * 0.6 + 0.4;

  // Apply tint — mix the raw iridescence with the configurable tint color
  col = mix(col, col * uTint * 2.0, 0.3);

  // Add subtle noise to prevent banding
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (noise - 0.5) * 0.015;

  // Soft vignette
  float vig = 1.0 - 0.2 * length(uv - 0.5);
  col *= vig;

  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}`;

  const canvas = document.getElementById('iri-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const prog = GLUtils.program(gl, VERT, FRAG);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  const style = getComputedStyle(document.documentElement);

  let mouse = [0.5, 0.5];
  let targetMouse = [0.5, 0.5];
  let mouseActive = 0.0;
  let targetMouseActive = 0.0;
  let running = false;
  let raf;

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    targetMouse = [
      (x - rect.left) / rect.width,
      1.0 - (y - rect.top) / rect.height
    ];
    targetMouseActive = 1.0;
  }

  function onPointerLeave() {
    targetMouseActive = 0.0;
  }

  canvas.addEventListener('mousemove', onPointer, { passive: true });
  canvas.addEventListener('touchmove', onPointer, { passive: true });
  canvas.addEventListener('mouseleave', onPointerLeave, { passive: true });
  canvas.addEventListener('touchend', onPointerLeave, { passive: true });

  function render(time) {
    if (!running) return;
    raf = requestAnimationFrame(render);

    const t = time * 0.001;
    GLUtils.resize(canvas, gl);

    mouse[0] += (targetMouse[0] - mouse[0]) * 0.05;
    mouse[1] += (targetMouse[1] - mouse[1]) * 0.05;
    mouseActive += (targetMouseActive - mouseActive) * 0.04;

    const tintHex = style.getPropertyValue('--iri-tint').trim() || '#6366f1';
    const tint = GLUtils.hexToRGB(tintHex);
    const speed = parseFloat(style.getPropertyValue('--iri-speed')) || 0.3;
    const amplitude = parseFloat(style.getPropertyValue('--iri-amplitude')) || 1.0;

    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
    GLUtils.uniform(gl, prog, 'uTint', '3f', tint);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uAmplitude', '1f', amplitude);
    GLUtils.uniform(gl, prog, 'uMouseActive', '1f', mouseActive);

    GLUtils.draw(gl);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      running = true;
      raf = requestAnimationFrame(render);
    } else {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }
  }, { threshold: 0.01 });
  observer.observe(canvas);
})();
