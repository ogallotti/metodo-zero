(function () {
  'use strict';

  const VERT = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const FRAG = `precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uBlend;

// --- 2D Simplex Noise (Ashima Arts) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    val += amp * snoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
    p += vec2(1.7, 9.2);
  }
  return val;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * uSpeed;

  // Mouse influence — soft warp toward cursor position
  vec2 mouse = uMouse * vec2(aspect, 1.0);
  float mouseDist = length(p - mouse);
  float mouseWarp = exp(-mouseDist * 3.0) * 0.15;

  // Create aurora height field from layered simplex noise
  float n1 = fbm(vec2(p.x * 1.5 + t * 0.3, t * 0.1)) * uAmplitude;
  float n2 = fbm(vec2(p.x * 2.5 - t * 0.2, t * 0.15 + 3.0)) * uAmplitude * 0.7;
  float n3 = fbm(vec2(p.x * 0.8 + t * 0.4, t * 0.08 + 7.0)) * uAmplitude * 0.5;

  // Aurora bands — Gaussian height field centered at different vertical positions
  float band1 = exp(-pow((uv.y - 0.65 - n1 * 0.15 - mouseWarp) * 4.0, 2.0));
  float band2 = exp(-pow((uv.y - 0.55 - n2 * 0.12 - mouseWarp) * 5.0, 2.0));
  float band3 = exp(-pow((uv.y - 0.72 - n3 * 0.1 - mouseWarp) * 6.0, 2.0));

  // Vertical streak patterns (aurora curtain folds)
  float streak = snoise(vec2(p.x * 8.0, p.y * 0.5 + t * 0.2));
  streak = pow(max(streak, 0.0), 2.0) * 0.4;

  // Color ramp between the three configurable color stops
  vec3 col1 = uColor1 * band1 * (1.0 + streak);
  vec3 col2 = uColor2 * band2 * (1.0 + streak * 0.5);
  vec3 col3 = uColor3 * band3 * (1.0 + streak * 0.7);

  vec3 aurora = col1 + col2 + col3;

  // Add fine shimmer
  float shimmer = snoise(vec2(p.x * 20.0 + t * 2.0, p.y * 30.0)) * 0.03;
  aurora += shimmer * (band1 + band2 + band3);

  // Vertical exponential falloff toward top and bottom
  float falloff = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.7, uv.y);
  aurora *= falloff;
  aurora *= uBlend + 0.5;

  // Subtle vignette
  float vignette = 1.0 - 0.3 * length((uv - 0.5) * vec2(1.0, 0.7));

  vec3 bg = vec3(0.04, 0.04, 0.1);
  vec3 finalColor = bg + aurora * vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}`;

  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const prog = GLUtils.program(gl, VERT, FRAG);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  const style = getComputedStyle(document.documentElement);
  function getCSSColor(prop, fallback) {
    const val = style.getPropertyValue(prop).trim();
    return val ? GLUtils.hexToRGB(val) : GLUtils.hexToRGB(fallback);
  }

  let mouse = [0.5, 0.5];
  let targetMouse = [0.5, 0.5];
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
  }
  canvas.addEventListener('mousemove', onPointer, { passive: true });
  canvas.addEventListener('touchmove', onPointer, { passive: true });

  function render(time) {
    if (!running) return;
    raf = requestAnimationFrame(render);

    const t = time * 0.001;
    GLUtils.resize(canvas, gl);

    // Smooth mouse
    mouse[0] += (targetMouse[0] - mouse[0]) * 0.05;
    mouse[1] += (targetMouse[1] - mouse[1]) * 0.05;

    const c1 = getCSSColor('--aurora-color-1', '#00d4aa');
    const c2 = getCSSColor('--aurora-color-2', '#7b2ff7');
    const c3 = getCSSColor('--aurora-color-3', '#00b4d8');
    const speed = parseFloat(style.getPropertyValue('--aurora-speed')) || 0.4;
    const amplitude = parseFloat(style.getPropertyValue('--aurora-amplitude')) || 0.6;
    const blend = parseFloat(style.getPropertyValue('--aurora-blend')) || 0.5;

    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', mouse);
    GLUtils.uniform(gl, prog, 'uColor1', '3f', c1);
    GLUtils.uniform(gl, prog, 'uColor2', '3f', c2);
    GLUtils.uniform(gl, prog, 'uColor3', '3f', c3);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uAmplitude', '1f', amplitude);
    GLUtils.uniform(gl, prog, 'uBlend', '1f', blend);

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
