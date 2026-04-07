/* Prism — Light refraction/dispersion with chromatic aberration */
(function () {
  'use strict';

  const canvas = document.getElementById('pr-canvas');
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

#define PI 3.14159265359

/* Noise for light source variation */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* SDF for a triangle prism cross-section */
float sdTriangle(vec2 p, float size) {
  float k = sqrt(3.0);
  p.x = abs(p.x) - size;
  p.y = p.y + size / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * size, 0.0);
  return -length(p) * sign(p.y);
}

/* Sample the light field at a given UV with wavelength-dependent refraction */
float lightField(vec2 uv, float t, float wavelength) {
  /* Light beams from upper-left */
  float beamAngle = -0.3 + sin(t * 0.2) * 0.1;
  vec2 beamDir = vec2(cos(beamAngle), sin(beamAngle));
  vec2 beamPerp = vec2(-beamDir.y, beamDir.x);

  float beam = 0.0;

  /* Multiple light beams */
  for (float i = 0.0; i < 5.0; i++) {
    float offset = (i - 2.0) * 0.12 + sin(t * 0.3 + i * 1.3) * 0.03;
    float d = dot(uv - vec2(-0.3, 0.3) - beamPerp * offset, beamPerp);
    float beamWidth = 0.015 + 0.005 * sin(t + i);

    /* Beam intensity falls off from center */
    float b = exp(-d * d / (beamWidth * beamWidth));

    /* Only the part entering from left */
    float entry = smoothstep(-0.8, -0.2, dot(uv, beamDir));
    beam += b * entry;
  }

  /* Prism geometry — rotating triangle */
  float rot = t * 0.15;
  float sr = sin(rot), cr = cos(rot);
  vec2 prismUV = mat2(cr, -sr, sr, cr) * uv;
  float prismDist = sdTriangle(prismUV, 0.25);

  /* Refraction: bend UVs based on prism distance and wavelength */
  float inside = smoothstep(0.01, -0.01, prismDist);
  float edge = smoothstep(0.05, 0.0, abs(prismDist));

  /* Chromatic dispersion — each wavelength bends differently */
  float refractAngle = wavelength * 0.15 * uIntensity;
  vec2 refractOffset = vec2(sin(refractAngle + rot), cos(refractAngle + rot)) * 0.1;

  /* After prism: dispersed beams */
  float exitSide = smoothstep(-0.1, 0.3, dot(uv, beamDir));
  vec2 dispersedUV = uv + refractOffset * inside * exitSide;

  float dispersed = 0.0;
  for (float i = 0.0; i < 5.0; i++) {
    float offset = (i - 2.0) * 0.12;
    float d = dot(dispersedUV - vec2(-0.3, 0.3) - beamPerp * offset, beamPerp);
    float beamWidth = 0.02 + wavelength * 0.008;
    dispersed += exp(-d * d / (beamWidth * beamWidth));
  }

  /* Combine: original beam * (1-inside) + dispersed * exitSide */
  float result = beam * (1.0 - inside * 0.7) + dispersed * exitSide * inside * 0.5;

  /* Edge glow on prism */
  result += edge * 0.3;

  return result;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  float t = uTime;
  vec3 col = uBg;

  /* Sample each color channel at different wavelengths */
  float r = lightField(uv, t, -1.0);  /* Red — least refraction */
  float g = lightField(uv, t, 0.0);   /* Green — middle */
  float b = lightField(uv, t, 1.0);   /* Blue — most refraction */

  /* Rainbow dispersion band */
  vec3 rainbow = vec3(r, g, b) * uIntensity;
  col += rainbow * 0.6;

  /* Additional spectral colors between RGB */
  float orange = lightField(uv, t, -0.5) * 0.3;
  float cyan = lightField(uv, t, 0.5) * 0.3;
  float violet = lightField(uv, t, 1.5) * 0.25;

  col += vec3(orange, orange * 0.6, 0.0);
  col += vec3(0.0, cyan * 0.7, cyan);
  col += vec3(violet * 0.6, 0.0, violet);

  /* Prism body — subtle fill */
  float rot2 = t * 0.15;
  float s2 = sin(rot2), c2 = cos(rot2);
  vec2 prismUV2 = mat2(c2, -s2, s2, c2) * uv;
  float pd = sdTriangle(prismUV2, 0.25);
  float prismBody = smoothstep(0.01, -0.01, pd) * 0.08;
  col += vec3(0.3, 0.3, 0.4) * prismBody;

  /* Subtle background sparkle */
  float sparkle = hash(gl_FragCoord.xy + fract(t * 10.0));
  sparkle = pow(sparkle, 20.0) * 0.3;
  col += vec3(sparkle);

  /* Tone mapping */
  col = col / (1.0 + col * 0.2);

  /* Vignette */
  vec2 vuv = gl_FragCoord.xy / uResolution;
  float vig = 1.0 - dot(vuv - 0.5, vuv - 0.5) * 1.5;
  col *= vig;

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

    const speed = parseFloat(getCSS('--pr-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;
    const intensity = parseFloat(getCSS('--pr-intensity', '1.0'));

    const bg = GLUtils.hexToRGB(getCSS('--pr-bg', '#080812'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uIntensity', '1f', intensity);

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
