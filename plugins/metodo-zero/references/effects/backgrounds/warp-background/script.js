/* Warp Background — WebGL 3D starfield with depth layers and streaks */
(function () {
  'use strict';

  const canvas = document.getElementById('wrp-canvas');
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
uniform float uDensity;
uniform float uTrail;
uniform vec2 uMouse;

#define NUM_LAYERS 4

/* hash for star positions */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  return vec2(hash(p), hash(p + 71.37));
}

/*
 * Render one star layer at a given depth.
 * Stars are placed in a grid with jitter, then streaked along
 * the direction from center to simulate warp motion.
 */
float starLayer(vec2 uv, float depth, float t, float density) {
  float stars = 0.0;
  float scale = 6.0 + depth * 8.0;
  float speed = (1.0 / (depth + 0.3)) * 0.3;

  /* scroll along Z axis */
  vec2 scrollUV = uv * scale;
  scrollUV.y += t * speed;

  vec2 cell = floor(scrollUV);
  vec2 cellUV = fract(scrollUV);

  /* check 3x3 neighborhood for nearby stars */
  for (float ox = -1.0; ox <= 1.0; ox++) {
    for (float oy = -1.0; oy <= 1.0; oy++) {
      vec2 neighbor = cell + vec2(ox, oy);
      vec2 starPos = hash2(neighbor);

      /* skip some stars based on density */
      if (hash(neighbor + 500.0) > density) continue;

      /* star position with jitter */
      vec2 offset = starPos - cellUV + vec2(ox, oy);

      /* streak: elongate in the direction from center */
      vec2 dir = normalize(uv + 0.001);
      float streakLen = (1.0 / (depth + 0.3)) * uTrail * 0.08;
      float along = dot(offset, dir);
      float perp = length(offset - dir * along);

      /* star shape: elongated in radial direction */
      float streakDist = length(vec2(along / (1.0 + streakLen), perp));

      /* star brightness */
      float size = 0.03 + hash(neighbor + 200.0) * 0.04;
      size /= (depth + 0.5);
      float brightness = smoothstep(size, size * 0.2, streakDist);

      /* twinkle */
      float twinkle = sin(t * 2.0 + hash(neighbor) * 6.28) * 0.3 + 0.7;
      brightness *= twinkle;

      /* depth fade */
      brightness *= 1.0 / (depth * 0.5 + 0.5);

      stars += brightness;
    }
  }

  return stars;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);
  float t = uTime * uSpeed;

  /* mouse offset: slight parallax */
  vec2 mouseOffset = (uMouse - 0.5) * 0.05;

  float totalStars = 0.0;

  /* render multiple depth layers */
  for (int i = 0; i < NUM_LAYERS; i++) {
    float depth = float(i) * 0.25 + 0.1;
    vec2 layerUV = uv + mouseOffset * (1.0 / (depth + 0.3));
    totalStars += starLayer(layerUV, depth, t, uDensity);
  }

  totalStars = min(totalStars, 2.0);

  /* center glow */
  float centerDist = length(uv);
  float glow = 0.02 / (centerDist + 0.15);
  glow = min(glow, 0.5);

  vec3 col = uBg;
  col += uColor * totalStars;
  col += uColor * glow * 0.3;

  /* subtle blue fog at distance */
  float fog = smoothstep(0.0, 0.8, centerDist);
  col += vec3(0.01, 0.02, 0.05) * fog;

  /* vignette */
  float vig = 1.0 - smoothstep(0.4, 1.2, centerDist);
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
    const bg = GLUtils.hexToRGB(getCSS('--wrp-bg', '#000008'));
    const color = GLUtils.hexToRGB(getCSS('--wrp-color', '#aaccff'));
    const speed = parseFloat(getCSS('--wrp-speed', '1.0'));
    const density = parseFloat(getCSS('--wrp-density', '0.5'));
    const trail = parseFloat(getCSS('--wrp-trail', '0.7'));

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', elapsed);
    GLUtils.uniform(gl, prog, 'uBg', '3f', bg);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uDensity', '1f', density);
    GLUtils.uniform(gl, prog, 'uTrail', '1f', trail);
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
