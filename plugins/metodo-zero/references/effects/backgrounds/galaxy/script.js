/* Galaxy — Spiral galaxy with log-spiral arms, star scatter, and color temperature */
(function () {
  'use strict';

  const canvas = document.getElementById('gx-canvas');
  if (!canvas) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const vert = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const frag = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uArmColor;
uniform vec3 uBg;

#define PI 3.14159265359
#define NUM_ARMS 4.0

/* Hash for star positions */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* 2D noise for arm perturbation */
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

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * 0.08;

  /* Rotate entire galaxy slowly */
  float ca = t;
  float sa = sin(ca), co = cos(ca);
  p = mat2(co, -sa, sa, co) * p;

  /* Polar coordinates */
  float r = length(p);
  float angle = atan(p.y, p.x);

  vec3 col = uBg;

  /* Core glow */
  float coreGlow = exp(-r * 8.0) * 1.2;
  col += uCoreColor * coreGlow;

  /* Spiral arms using log-spiral equation: theta = a + b * ln(r) */
  float spiralTightness = 0.4;
  float armWidth = 0.5;

  float armDensity = 0.0;
  for (float arm = 0.0; arm < NUM_ARMS; arm++) {
    float armOffset = arm * 2.0 * PI / NUM_ARMS;
    float spiralAngle = angle - log(max(r, 0.001)) / spiralTightness + armOffset;

    /* Perturb the arm with noise */
    float perturbation = noise(vec2(r * 5.0 + arm * 10.0, t * 2.0)) * 0.5;
    spiralAngle += perturbation;

    /* Distance to arm centerline */
    float armDist = abs(mod(spiralAngle + PI, 2.0 * PI) - PI);

    /* Arm width increases with radius */
    float width = armWidth * (0.3 + r * 0.7);
    float armBright = smoothstep(width, 0.0, armDist) * exp(-r * 2.5);
    armDensity += armBright;
  }

  armDensity = min(armDensity, 1.0);

  /* Color temperature gradient: blue core to warm edges */
  vec3 armCol = mix(uCoreColor, uArmColor, smoothstep(0.0, 0.6, r));
  col += armCol * armDensity * 0.6;

  /* Stars — scattered points */
  float starBrightness = 0.0;
  for (float layer = 0.0; layer < 3.0; layer++) {
    vec2 starGrid = p * (80.0 + layer * 40.0);
    vec2 id = floor(starGrid);
    vec2 f = fract(starGrid) - 0.5;

    float h = hash(id + layer * 100.0);
    vec2 starPos = (vec2(hash(id + 0.1), hash(id + 0.2)) - 0.5) * 0.8;

    float d = length(f - starPos);
    float size = 0.02 + h * 0.03;

    /* Only show some stars */
    if (h > 0.6) {
      /* Stars are brighter near spiral arms */
      float armInfluence = 0.3 + armDensity * 0.7;
      float twinkle = 0.7 + 0.3 * sin(h * 100.0 + uTime * (1.0 + h * 3.0));
      float star = smoothstep(size, 0.0, d) * armInfluence * twinkle;
      starBrightness += star;
    }
  }

  /* Star color based on radius (temperature) */
  vec3 starCol = mix(vec3(0.8, 0.85, 1.0), vec3(1.0, 0.9, 0.7), smoothstep(0.0, 0.5, r));
  col += starCol * starBrightness * 0.8;

  /* Nebula dust — soft colored clouds */
  float dust = noise(p * 4.0 + t * 0.5) * noise(p * 8.0 - t * 0.3);
  dust *= armDensity;
  col += mix(uCoreColor, uArmColor, dust) * dust * 0.2;

  /* Vignette */
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 2.0;
  col *= max(vig, 0.0);

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

    const speed = parseFloat(getCSS('--gx-speed', '1.0'));
    const elapsed = prefersReduced ? 0 : (performance.now() - startTime) / 1000.0 * speed;

    const bg = GLUtils.hexToRGB(getCSS('--gx-bg', '#020208'));
    const core = GLUtils.hexToRGB(getCSS('--gx-core-color', '#aaccff'));
    const arm = GLUtils.hexToRGB(getCSS('--gx-arm-color', '#ff8844'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uCoreColor', '3f', core);
    GLUtils.uniform(gl, prog, 'uArmColor', '3f', arm);

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
