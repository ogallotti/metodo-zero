/* Ripple Grid — Dot grid with click-spawned ripple waves */
(function () {
  'use strict';

  const canvas = document.getElementById('rg-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  /* Support up to 8 concurrent waves */
  const MAX_WAVES = 8;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uDotColor;
uniform vec3 uWaveColor;
uniform vec3 uBg;
uniform vec2 uMouse;

/* Wave data: xy = origin, z = birth time, w = active flag */
uniform vec4 uWaves[8];
uniform float uWaveCount;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  /* Grid parameters */
  float gridSize = 30.0;
  vec2 gridUV = p * gridSize;
  vec2 cellId = floor(gridUV);
  vec2 cellUV = fract(gridUV) - 0.5;

  /* Base dot */
  float dotRadius = 0.12;
  float dotDist = length(cellUV);

  /* Accumulate wave influence on this dot */
  float waveInfluence = 0.0;
  float waveEnergy = 0.0;

  for (int i = 0; i < 8; i++) {
    if (float(i) >= uWaveCount) break;
    vec4 wave = uWaves[i];
    if (wave.w < 0.5) continue;

    vec2 waveOrigin = vec2(wave.x * aspect, wave.y);
    float birthTime = wave.z;
    float age = uTime - birthTime;

    if (age < 0.0 || age > 4.0) continue;

    /* Wave radius expands over time */
    float waveRadius = age * 0.8;
    float waveWidth = 0.15;

    /* Distance from this grid cell to wave origin */
    vec2 dotWorld = (cellId + 0.5) / gridSize;
    float distToOrigin = length(dotWorld - waveOrigin);

    /* Ripple: ring expanding outward */
    float ringDist = abs(distToOrigin - waveRadius);
    float ripple = smoothstep(waveWidth, 0.0, ringDist);

    /* Fade with age */
    float fadeFactor = 1.0 - age / 4.0;
    fadeFactor = fadeFactor * fadeFactor;

    waveInfluence += ripple * fadeFactor * sin(distToOrigin * 40.0 - age * 8.0) * 0.5;
    waveEnergy += ripple * fadeFactor;
  }

  /* Modify dot size and brightness based on wave */
  float animatedRadius = dotRadius + waveInfluence * 0.15;
  float dot = smoothstep(animatedRadius, animatedRadius - 0.06, dotDist);

  /* Color */
  vec3 col = uBg;

  /* Base dot color */
  vec3 dotCol = mix(uDotColor * 0.3, uDotColor, dot);

  /* Wave adds energy color */
  dotCol = mix(dotCol, uWaveColor, clamp(waveEnergy * 0.6, 0.0, 0.8));

  col = mix(col, dotCol, dot);

  /* Mouse hover proximity glow */
  vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
  vec2 dotWorld = (cellId + 0.5) / gridSize;
  float mouseProx = smoothstep(0.15, 0.0, length(dotWorld - mouseAspect));
  float hoverDot = smoothstep(dotRadius + 0.05, dotRadius - 0.02, dotDist);
  col += uDotColor * mouseProx * hoverDot * 0.4;

  /* Subtle grain */
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  col += grain * 0.015;

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

  /* Wave management */
  const waves = [];
  let waveIndex = 0;
  for (let i = 0; i < MAX_WAVES; i++) {
    waves.push({ x: 0, y: 0, birthTime: -10, active: 0 });
  }

  function spawnWave(x, y) {
    const now = (performance.now() - startTime) / 1000.0;
    waves[waveIndex] = { x, y, birthTime: now, active: 1 };
    waveIndex = (waveIndex + 1) % MAX_WAVES;
  }

  /* Click/touch to spawn waves */
  const container = document.querySelector('.rg-container');
  container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    spawnWave(x, y);
  });
  container.addEventListener('touchstart', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = 1.0 - (touch.clientY - rect.top) / rect.height;
    spawnWave(x, y);
  }, { passive: true });

  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse = [t.clientX / window.innerWidth, 1.0 - t.clientY / window.innerHeight];
  }
  canvas.addEventListener('mousemove', onPointer);
  canvas.addEventListener('touchmove', onPointer, { passive: true });

  /* Auto-spawn a wave to show the effect initially */
  setTimeout(() => spawnWave(0.3, 0.6), 500);
  setTimeout(() => spawnWave(0.7, 0.4), 1500);

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    const speed = parseFloat(getCSS('--rg-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--rg-bg', '#0a0a1a'));
    const dotCol = GLUtils.hexToRGB(getCSS('--rg-dot-color', '#4ecdc4'));
    const waveCol = GLUtils.hexToRGB(getCSS('--rg-wave-color', '#7b68ee'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uDotColor', '3f', dotCol);
    GLUtils.uniform(gl, prog, 'uWaveColor', '3f', waveCol);

    /* Upload wave data */
    let activeCount = 0;
    for (let i = 0; i < MAX_WAVES; i++) {
      const w = waves[i];
      const loc = gl.getUniformLocation(prog, 'uWaves[' + i + ']');
      if (loc) {
        const age = elapsed - w.birthTime;
        const active = (w.active && age < 4.0 && age >= 0) ? 1.0 : 0.0;
        gl.uniform4f(loc, w.x, w.y, w.birthTime, active);
        if (active > 0.5) activeCount++;
      }
    }
    GLUtils.uniform(gl, prog, 'uWaveCount', '1f', activeCount > 0 ? MAX_WAVES : 0);

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
