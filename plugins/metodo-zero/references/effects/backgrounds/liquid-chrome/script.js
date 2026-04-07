(function () {
  'use strict';

  const VERT = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  // Iterative sine wave domain distortion with 3x3 supersampling
  const FRAG = `precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uBaseColor;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFreqX;
uniform float uFreqY;
uniform float uMouseActive;

vec3 chrome(vec2 fragCoord, float time) {
  vec2 uv = fragCoord / uResolution;
  uv = uv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // Mouse-reactive ripple (point distortion with exponential falloff)
  vec2 mouseUV = uMouse * 2.0 - 1.0;
  mouseUV.x *= uResolution.x / uResolution.y;
  float mouseDist = length(uv - mouseUV);
  float ripple = exp(-mouseDist * 4.0) * uMouseActive * 0.5;
  uv += normalize(uv - mouseUV + 0.001) * sin(mouseDist * 10.0 - time * 3.0) * ripple;

  float t = time * uSpeed;

  // Iterative sine wave domain distortion — 10 iterations
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    uv = vec2(
      sin(uv.y * uFreqX + t + fi * 0.5) * uAmplitude + uv.x,
      cos(uv.x * uFreqY + t * 0.7 + fi * 0.3) * uAmplitude + uv.y
    );
  }

  // Chrome color: baseColor / abs(sin(time - uv.y - uv.x))
  float pattern = abs(sin(t - uv.y - uv.x));
  pattern = max(pattern, 0.008); // prevent division by zero
  vec3 color = uBaseColor / pattern;

  // Tone mapping to keep values in visible range
  color = color / (1.0 + color);

  return color;
}

void main() {
  // 3x3 supersampling for smooth output
  vec3 col = vec3(0.0);
  for (int dx = -1; dx <= 1; dx++) {
    for (int dy = -1; dy <= 1; dy++) {
      vec2 offset = vec2(float(dx), float(dy)) * 0.33;
      col += chrome(gl_FragCoord.xy + offset, uTime);
    }
  }
  col /= 9.0;

  gl_FragColor = vec4(col, 1.0);
}`;

  const canvas = document.getElementById('lc-canvas');
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

    mouse[0] += (targetMouse[0] - mouse[0]) * 0.06;
    mouse[1] += (targetMouse[1] - mouse[1]) * 0.06;
    mouseActive += (targetMouseActive - mouseActive) * 0.04;

    const baseHex = style.getPropertyValue('--lc-base-color').trim() || '#4488ff';
    const baseColor = GLUtils.hexToRGB(baseHex);
    const speed = parseFloat(style.getPropertyValue('--lc-speed')) || 0.4;
    const amplitude = parseFloat(style.getPropertyValue('--lc-amplitude')) || 1.0;
    const freqX = parseFloat(style.getPropertyValue('--lc-frequency-x')) || 3.0;
    const freqY = parseFloat(style.getPropertyValue('--lc-frequency-y')) || 4.0;

    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
    GLUtils.uniform(gl, prog, 'uBaseColor', '3f', baseColor);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uAmplitude', '1f', amplitude);
    GLUtils.uniform(gl, prog, 'uFreqX', '1f', freqX);
    GLUtils.uniform(gl, prog, 'uFreqY', '1f', freqY);
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
