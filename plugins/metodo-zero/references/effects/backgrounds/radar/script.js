/* Radar — Rotating sweep with concentric rings and blips */
(function () {
  'use strict';

  const canvas = document.getElementById('rd-canvas');
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

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define NUM_RINGS 5
#define NUM_BLIPS 12

/* Hash for blip positions */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 center = vec2(0.5 * aspect, 0.5);
  vec2 p = vec2(uv.x * aspect, uv.y) - center;

  float t = uTime;

  /* Polar coordinates */
  float r = length(p);
  float angle = atan(p.y, p.x);
  if (angle < 0.0) angle += TWO_PI;

  /* Radar radius */
  float radarRadius = 0.4;

  vec3 col = uBg;

  /* Background grid — subtle */
  float gridR = fract(r * 25.0);
  float gridLine = smoothstep(0.02, 0.0, abs(gridR - 0.5)) * 0.03;
  if (r < radarRadius) col += uColor * gridLine;

  /* Cross-hairs */
  float crossH = smoothstep(0.002, 0.0, abs(p.y)) * smoothstep(radarRadius, 0.0, r) * 0.06;
  float crossV = smoothstep(0.002, 0.0, abs(p.x)) * smoothstep(radarRadius, 0.0, r) * 0.06;
  col += uColor * (crossH + crossV);

  /* Concentric rings */
  for (int i = 1; i <= NUM_RINGS; i++) {
    float ringR = float(i) * radarRadius / float(NUM_RINGS);
    float ringDist = abs(r - ringR);
    float ring = smoothstep(0.003, 0.0, ringDist);
    col += uColor * ring * 0.15;
  }

  /* Outer boundary ring */
  float outerRing = smoothstep(0.004, 0.0, abs(r - radarRadius));
  col += uColor * outerRing * 0.4;

  /* Rotating sweep line */
  float sweepAngle = mod(t * 1.5, TWO_PI);
  float angleDiff = mod(angle - sweepAngle + TWO_PI, TWO_PI);

  /* Sweep trail — fades over about 90 degrees */
  float sweepTrail = 1.0 - angleDiff / (PI * 0.5);
  sweepTrail = clamp(sweepTrail, 0.0, 1.0);
  sweepTrail = pow(sweepTrail, 2.0);

  /* Only inside radar */
  float insideRadar = smoothstep(radarRadius + 0.01, radarRadius - 0.01, r);
  col += uColor * sweepTrail * insideRadar * 0.2;

  /* Sweep line itself */
  float sweepLine = smoothstep(0.03, 0.0, angleDiff) * insideRadar;
  col += uColor * sweepLine * 0.6;

  /* Blips — static positions, revealed by sweep */
  for (int i = 0; i < NUM_BLIPS; i++) {
    float fi = float(i);

    /* Deterministic blip position */
    float blipAngle = hash(vec2(fi, 0.0)) * TWO_PI;
    float blipR = hash(vec2(fi, 1.0)) * radarRadius * 0.85 + radarRadius * 0.1;
    vec2 blipPos = vec2(cos(blipAngle), sin(blipAngle)) * blipR;

    /* Blip visibility: bright when sweep passes, then fades */
    float blipAngleN = mod(blipAngle + TWO_PI, TWO_PI);
    float blipDeltaAngle = mod(sweepAngle - blipAngleN + TWO_PI, TWO_PI);
    float blipAge = blipDeltaAngle / TWO_PI; /* 0 = just swept, 1 = about to be swept again */
    float blipBrightness = exp(-blipAge * 4.0);

    /* Some blips blink randomly */
    float blink = 0.7 + 0.3 * sin(t * (2.0 + fi * 0.5) + fi * 3.0);
    blipBrightness *= blink;

    /* Draw blip */
    float blipDist = length(p - blipPos);
    float blipDot = smoothstep(0.008, 0.002, blipDist);
    float blipGlow = exp(-blipDist * 80.0) * 0.3;

    col += uColor * (blipDot + blipGlow) * blipBrightness;
  }

  /* Center dot */
  float centerDot = smoothstep(0.008, 0.003, r);
  float centerPulse = 0.7 + 0.3 * sin(t * 3.0);
  col += uColor * centerDot * centerPulse;

  /* Scanline effect */
  float scanline = sin(gl_FragCoord.y * 1.5) * 0.02 + 0.98;
  col *= scanline;

  /* Slight CRT curvature vignette */
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.8;
  col *= max(vig, 0.0);

  /* Grain */
  float grain = hash(gl_FragCoord.xy + fract(t * 43.0)) - 0.5;
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

  function frame() {
    if (!running) { requestAnimationFrame(frame); return; }

    GLUtils.resize(canvas, gl);

    const speed = parseFloat(getCSS('--rd-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--rd-bg', '#060a0f'));
    const color = GLUtils.hexToRGB(getCSS('--rd-color', '#00ff88'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);

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
