/* Noise — WebGL animated film grain with scanlines and chromatic aberration */
(function () {
  'use strict';

  const canvas = document.getElementById('nz-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBg;
uniform float uIntensity;
uniform float uScanlines;
uniform float uSpeed;
uniform float uChromatic;

/*
 * High-quality hash functions for organic film grain.
 * Uses three different seeds to avoid visible patterns.
 */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash3(vec2 p) {
  return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
}

/*
 * Multi-octave noise for organic grain texture.
 * Avoids pixelated look by blending scales.
 */
float grainNoise(vec2 uv, float t) {
  float seed = floor(t * 12.0); /* change 12x per second for film flicker */
  vec2 p = uv * uResolution;

  /* coarse grain */
  float g1 = hash(floor(p * 0.5) + seed * 7.31) - 0.5;
  /* medium grain */
  float g2 = hash2(floor(p) + seed * 3.17) - 0.5;
  /* fine grain */
  float g3 = hash3(floor(p * 2.0) + seed * 11.43) - 0.5;

  /* blend for organic feel: more fine, less coarse */
  return g1 * 0.25 + g2 * 0.5 + g3 * 0.25;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float t = uTime * uSpeed;

  /* base background with subtle gradient */
  vec3 bg = uBg;
  float vignette = 1.0 - smoothstep(0.3, 1.4, length(uv - 0.5));
  bg *= mix(0.7, 1.0, vignette);

  /* subtle underlying color wash */
  bg += vec3(0.03, 0.01, 0.06) * smoothstep(0.8, 0.0, length(uv - vec2(0.3, 0.3)));
  bg += vec3(0.05, 0.01, 0.03) * smoothstep(0.8, 0.0, length(uv - vec2(0.7, 0.7)));

  /* grain */
  float grain = grainNoise(uv, t) * uIntensity;

  /* chromatic aberration on the grain */
  float grainR = grain;
  float grainG = grain;
  float grainB = grain;
  if (uChromatic > 0.0001) {
    vec2 offset = (uv - 0.5) * uChromatic;
    grainR = grainNoise(uv + offset, t) * uIntensity;
    grainB = grainNoise(uv - offset, t) * uIntensity;
  }

  vec3 col = bg + vec3(grainR, grainG, grainB);

  /* scanlines */
  if (uScanlines > 0.001) {
    float scanline = sin(gl_FragCoord.y * 1.5) * 0.5 + 0.5;
    scanline = smoothstep(0.4, 0.6, scanline);
    col -= scanline * uScanlines;

    /* subtle horizontal flicker band */
    float band = smoothstep(0.0, 0.02, abs(fract(uv.y + t * 0.7) - 0.5));
    col -= (1.0 - band) * uScanlines * 0.3;
  }

  /* subtle overall chromatic fringing at edges */
  if (uChromatic > 0.0001) {
    vec2 dir = (uv - 0.5) * uChromatic * 3.0;
    float edgeDist = length(uv - 0.5);
    float edgeFactor = smoothstep(0.2, 0.7, edgeDist);
    col.r += edgeFactor * 0.02;
    col.b -= edgeFactor * 0.02;
  }

  col = clamp(col, 0.0, 1.0);

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

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0;
    const bg = GLUtils.hexToRGB(getCSS('--nz-bg', '#0a0a1a'));
    const intensity = parseFloat(getCSS('--nz-intensity', '0.15'));
    const scanlines = parseFloat(getCSS('--nz-scanlines', '0.08'));
    const speed = parseFloat(getCSS('--nz-speed', '1.0'));
    const chromatic = parseFloat(getCSS('--nz-chromatic', '0.003'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uIntensity', '1f', intensity);
    GLUtils.uniform(gl, prog, 'uScanlines', '1f', scanlines);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uChromatic', '1f', chromatic);

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
