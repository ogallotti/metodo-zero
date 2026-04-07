(function () {
  'use strict';

  const VERT = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const FRAG = `precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

// Film grain noise
float grain(vec2 co, float t) {
  return fract(sin(dot(co + t * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
}

// Rotate 2D coordinates
vec2 rotate2D(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = uTime * uSpeed;

  // Apply rotation
  p = rotate2D(p, uRotation);

  // Scale
  p *= uScale;

  // Layered sine patterns at different frequencies and rotations
  float silk = 0.0;

  // Layer 1: primary wave
  vec2 p1 = rotate2D(p, 0.3 + t * 0.05);
  silk += sin(p1.x * 8.0 + t * 1.2 + sin(p1.y * 4.0 + t * 0.8)) * 0.25;

  // Layer 2: secondary cross-wave
  vec2 p2 = rotate2D(p, -0.5 + t * 0.03);
  silk += sin(p2.y * 6.0 + t * 0.9 + cos(p2.x * 3.0 + t * 0.6)) * 0.2;

  // Layer 3: fine detail
  vec2 p3 = rotate2D(p, 1.2 + t * 0.07);
  silk += sin(p3.x * 12.0 + p3.y * 5.0 + t * 1.5) * 0.15;

  // Layer 4: wide undulation
  vec2 p4 = rotate2D(p, -0.8 + t * 0.02);
  silk += sin(p4.x * 3.0 + sin(p4.y * 2.0 + t * 0.4) * 2.0) * 0.2;

  // Layer 5: micro detail
  vec2 p5 = rotate2D(p, 2.0 - t * 0.04);
  silk += sin(p5.y * 15.0 + p5.x * 8.0 + t * 2.0) * 0.08;

  // Layer 6: broad sweep
  silk += sin(p.x * 2.0 + p.y * 1.5 + t * 0.5 + sin(t * 0.3) * 3.0) * 0.12;

  // Map from [-1,1] to [0,1] range
  silk = silk * 0.5 + 0.5;

  // Create color from base with luminance variation
  vec3 darkColor = uColor * 0.15;
  vec3 brightColor = uColor * 1.2 + vec3(0.1);
  vec3 col = mix(darkColor, brightColor, silk);

  // Add sheen highlights
  float sheen = pow(max(silk, 0.0), 4.0) * 0.3;
  col += vec3(sheen);

  // Film grain
  float n = grain(gl_FragCoord.xy, uTime) * 2.0 - 1.0;
  col += n * uNoiseIntensity;

  // Subtle vignette
  float vig = 1.0 - 0.25 * length(uv - 0.5);
  col *= vig;

  // Clamp
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}`;

  const canvas = document.getElementById('silk-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const gl = GLUtils.create(canvas);
  if (!gl) return;

  const prog = GLUtils.program(gl, VERT, FRAG);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  const style = getComputedStyle(document.documentElement);
  let running = false;
  let raf;

  function render(time) {
    if (!running) return;
    raf = requestAnimationFrame(render);

    const t = time * 0.001;
    GLUtils.resize(canvas, gl);

    const colorHex = style.getPropertyValue('--silk-color').trim() || '#6366f1';
    const color = GLUtils.hexToRGB(colorHex);
    const speed = parseFloat(style.getPropertyValue('--silk-speed')) || 0.3;
    const scale = parseFloat(style.getPropertyValue('--silk-scale')) || 1.0;
    const rotation = parseFloat(style.getPropertyValue('--silk-rotation')) || 0.0;
    const noiseIntensity = parseFloat(style.getPropertyValue('--silk-noise-intensity')) || 0.04;

    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uColor', '3f', color);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uScale', '1f', scale);
    GLUtils.uniform(gl, prog, 'uRotation', '1f', rotation);
    GLUtils.uniform(gl, prog, 'uNoiseIntensity', '1f', noiseIntensity);

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
