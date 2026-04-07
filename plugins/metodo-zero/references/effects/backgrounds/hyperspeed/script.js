/* Hyperspeed — WebGL hyperspace speed lines with bloom */
(function () {
  'use strict';

  const canvas = document.getElementById('hs-canvas');
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
uniform float uSpeed;
uniform float uCount;
uniform float uBloom;
uniform vec2 uCenter;
uniform vec2 uMouse;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(float p) {
  return fract(sin(p * 127.1) * 43758.5453);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

/* value noise for streak width modulation */
float vnoise(float p) {
  float i = floor(p);
  float f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), f);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  /* center on configurable point */
  vec2 p = uv - uCenter;
  p.x *= aspect;

  float angle = atan(p.y, p.x);
  float dist = length(p);

  float t = uTime * uSpeed;

  float totalIntensity = 0.0;

  /* radial streaks with noise-modulated width */
  float n = uCount;
  float angleNorm = (angle + PI) / TAU;

  /* layer 1: primary streaks */
  for (float i = 0.0; i < 80.0; i++) {
    if (i >= n) break;

    float streakAngle = (i / n) + hash(i) * 0.02;
    float diff = abs(fract(angleNorm - streakAngle + 0.5) - 0.5);

    /* noise-modulated width */
    float width = 0.003 + vnoise(i * 3.7 + t * 0.5) * 0.004;
    float streak = smoothstep(width, width * 0.1, diff);

    /* radial falloff: bright in middle, fade at center and edges */
    float radial = smoothstep(0.0, 0.15, dist) * smoothstep(1.2, 0.2, dist);

    /* per-streak animation: moving light point */
    float lightPos = fract(t * (0.3 + hash(i + 10.0) * 0.4) + hash(i) * 5.0);
    float lightDist = abs(dist / 1.0 - lightPos);
    float light = smoothstep(0.3, 0.0, lightDist) * 2.0;

    /* brightness variation per streak */
    float brightness = 0.3 + hash(i + 50.0) * 0.7;

    totalIntensity += streak * radial * (0.5 + light) * brightness;
  }

  /* layer 2: broader glow streaks (fewer, wider) */
  float broadCount = floor(n * 0.3);
  for (float i = 0.0; i < 24.0; i++) {
    if (i >= broadCount) break;

    float streakAngle = (i / broadCount) + hash(i + 200.0) * 0.05;
    float diff = abs(fract(angleNorm - streakAngle + 0.5) - 0.5);
    float width = 0.008 + vnoise(i * 5.1 + t * 0.3) * 0.008;
    float streak = smoothstep(width, width * 0.1, diff);
    float radial = smoothstep(0.0, 0.1, dist) * smoothstep(1.5, 0.1, dist);

    totalIntensity += streak * radial * 0.15;
  }

  /* bloom: cube for intense glow */
  float bloom = pow(totalIntensity, 2.0) * uBloom;

  /* center glow */
  float centerGlow = 0.06 / (dist + 0.04);
  centerGlow = min(centerGlow, 3.0);
  float pulse = 0.8 + 0.2 * sin(t * 2.5);
  centerGlow *= pulse;

  /* mouse interaction: subtle brightness near cursor */
  vec2 mp = uMouse - uCenter;
  mp.x *= aspect;
  float mouseDist = length(p - mp);
  float mouseGlow = smoothstep(0.4, 0.0, mouseDist) * 0.2;

  float final = bloom + centerGlow * 0.2 + mouseGlow;

  /* color with slight blue-to-white shift on intensity */
  vec3 streakColor = mix(uColor, vec3(1.0), smoothstep(0.5, 2.0, final) * 0.5);
  vec3 col = uBg + streakColor * final;

  /* vignette */
  float vig = 1.0 - smoothstep(0.3, 1.4, length(uv - 0.5));
  col *= mix(0.3, 1.0, vig);

  /* tone map */
  col = col / (1.0 + col * 0.15);

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

    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0;
    const bg = GLUtils.hexToRGB(getCSS('--hs-bg', '#030014'));
    const color = GLUtils.hexToRGB(getCSS('--hs-color', '#78a0ff'));
    const speed = parseFloat(getCSS('--hs-speed', '1.0'));
    const count = parseFloat(getCSS('--hs-count', '40.0'));
    const bloom = parseFloat(getCSS('--hs-bloom', '1.5'));
    const centerX = parseFloat(getCSS('--hs-center-x', '0.5'));
    const centerY = parseFloat(getCSS('--hs-center-y', '0.5'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uCount', '1f', count);
    GLUtils.uniform(gl, prog, 'uBloom', '1f', bloom);
    GLUtils.uniform(gl, prog, 'uCenter', '2f', [centerX, centerY]);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);

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
