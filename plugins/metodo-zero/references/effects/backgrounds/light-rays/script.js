/* Light Rays — WebGL volumetric god-ray effect */
(function () {
  'use strict';

  const canvas = document.getElementById('lr-canvas');
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
uniform vec2 uSource;
uniform float uIntensity;
uniform float uDecay;
uniform float uDust;
uniform vec2 uMouse;

#define SAMPLES 64
#define PI 3.14159265359

/* hash functions for noise */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

/* value noise */
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

/* fbm for ray variation */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  vec2 source = uSource;

  /* radial blur / god-ray accumulation */
  vec2 deltaUV = (uv - source) / float(SAMPLES);
  float decay = uDecay;
  float weight = 1.0;
  float illumination = 0.0;

  vec2 sampleUV = uv;

  for (int i = 0; i < SAMPLES; i++) {
    sampleUV -= deltaUV;

    /* per-sample noise creates ray structure */
    vec2 noiseCoord = sampleUV * 8.0 + uTime * 0.1;
    float n = fbm(noiseCoord);

    /* angle from source to create radial pattern */
    vec2 diff = sampleUV - source;
    diff.x *= aspect;
    float angle = atan(diff.y, diff.x);

    /* radial ray pattern via angular modulation */
    float rays = 0.0;
    rays += sin(angle * 7.0 + uTime * 0.3) * 0.5 + 0.5;
    rays += sin(angle * 13.0 - uTime * 0.2) * 0.3 + 0.3;
    rays += sin(angle * 23.0 + uTime * 0.15) * 0.2 + 0.2;
    rays *= n;

    /* attenuate by distance from source */
    float dist = length(diff);
    float atten = smoothstep(1.5, 0.0, dist);

    illumination += rays * atten * weight;
    weight *= decay;
  }

  illumination /= float(SAMPLES);
  illumination *= uIntensity * 4.0;

  /* source glow */
  vec2 d = uv - source;
  d.x *= aspect;
  float sourceDist = length(d);
  float glow = 0.08 / (sourceDist + 0.03);
  glow = min(glow, 4.0);

  /* dust particles */
  float dust = 0.0;
  if (uDust > 0.01) {
    for (float i = 0.0; i < 30.0; i++) {
      vec2 pos = vec2(
        hash2(vec2(i, 0.0)),
        hash2(vec2(0.0, i))
      );
      /* animate particles */
      pos.x += sin(uTime * 0.3 + i * 2.1) * 0.05;
      pos.y += cos(uTime * 0.25 + i * 1.7) * 0.08 + uTime * 0.01;
      pos = fract(pos);

      float pdist = length((uv - pos) * vec2(aspect, 1.0));
      float size = 0.001 + hash2(vec2(i, i)) * 0.002;
      float sparkle = smoothstep(size, size * 0.3, pdist);
      /* brighter near source */
      float srcProx = smoothstep(0.8, 0.0, length(pos - source));
      dust += sparkle * (0.3 + srcProx * 0.7);
    }
    dust *= uDust;
  }

  /* mouse glow */
  vec2 mp = uMouse - source;
  mp.x *= aspect;
  vec2 uvFromSrc = uv - source;
  uvFromSrc.x *= aspect;
  float mouseProx = smoothstep(0.4, 0.0, length(uvFromSrc - mp));

  /* combine */
  float total = illumination + glow * 0.15 + dust + mouseProx * 0.15;

  vec3 col = uBg + uColor * total;

  /* vignette */
  float vig = 1.0 - smoothstep(0.3, 1.5, length(uv - 0.5));
  col *= mix(0.4, 1.0, vig);

  /* tone map */
  col = col / (1.0 + col * 0.25);

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
    const bg = GLUtils.hexToRGB(getCSS('--lr-bg', '#050510'));
    const color = GLUtils.hexToRGB(getCSS('--lr-color', '#ffd080'));
    const sourceX = parseFloat(getCSS('--lr-source-x', '0.5'));
    const sourceY = parseFloat(getCSS('--lr-source-y', '0.85'));
    const intensity = parseFloat(getCSS('--lr-intensity', '1.2'));
    const decay = parseFloat(getCSS('--lr-decay', '0.96'));
    const dust = parseFloat(getCSS('--lr-dust', '0.3'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uSource', '2f', [sourceX, sourceY]);
    GLUtils.uniform(gl, prog, 'uIntensity', '1f', intensity);
    GLUtils.uniform(gl, prog, 'uDecay', '1f', decay);
    GLUtils.uniform(gl, prog, 'uDust', '1f', dust);
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
