/* Light Pillar — Vertical beam with glow and flickering edges via WebGL */
(function () {
  'use strict';

  var container = document.querySelector('.lpl-container');
  var canvas = document.querySelector('.lpl-canvas');
  if (!container || !canvas) return;

  var gl = GLUtils.create(canvas);
  if (!gl) return;

  var vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

  var fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uTopColor;
    uniform vec3 uBottomColor;
    uniform float uWidth;
    uniform float uGlow;
    uniform float uRotation;
    uniform float uSpeed;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

      float t = uTime * uSpeed;

      // Apply rotation
      float rad = uRotation * 3.14159 / 180.0;
      float cs = cos(rad);
      float sn = sin(rad);
      vec2 rp = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);

      // Mouse influence: subtly shift pillar position
      float mouseShift = (uMouse.x - 0.5) * 0.08;
      rp.x -= mouseShift;

      // Beam core — Gaussian falloff from center line
      float beamWidth = uWidth * 0.5;

      // Noise on beam edges for flickering
      float edgeNoise = fbm(vec2(rp.y * 8.0 + t * 2.0, t * 0.5)) * 0.03;
      float edgeNoise2 = fbm(vec2(rp.y * 15.0 - t * 1.5, t * 0.3 + 5.0)) * 0.015;

      float dist = abs(rp.x) - edgeNoise - edgeNoise2;

      // Core beam
      float core = exp(-pow(dist / (beamWidth * 0.3), 2.0));

      // Inner glow
      float innerGlow = exp(-pow(dist / (beamWidth * 0.8), 2.0));

      // Outer glow
      float outerGlow = exp(-pow(dist / (beamWidth * 2.0), 2.0)) * uGlow;

      // Wide atmospheric glow
      float atmoGlow = exp(-pow(dist / (beamWidth * 5.0), 2.0)) * uGlow * 0.3;

      // Vertical color gradient
      float vertGrad = uv.y;
      vec3 beamColor = mix(uBottomColor, uTopColor, vertGrad);

      // Combine layers
      vec3 col = vec3(0.0);

      // Atmospheric glow — very wide, subtle
      col += beamColor * atmoGlow * 0.15;

      // Outer glow
      col += beamColor * outerGlow * 0.3;

      // Inner glow
      col += beamColor * innerGlow * 0.5;

      // Core — white-hot center
      vec3 coreColor = mix(beamColor, vec3(1.0), 0.7);
      col += coreColor * core * 0.8;

      // Volumetric rays — subtle horizontal streaks
      float rays = noise(vec2(rp.x * 50.0, rp.y * 2.0 + t * 0.3));
      rays = pow(rays, 3.0) * innerGlow * 0.2;
      col += beamColor * rays;

      // Particle sparkles along the beam
      float sparkle = noise(vec2(rp.x * 100.0 + t * 10.0, rp.y * 80.0 + t * 3.0));
      sparkle = pow(sparkle, 8.0) * core * 0.5;
      col += vec3(1.0) * sparkle;

      // Pulsation
      float pulse = 1.0 + 0.05 * sin(t * 2.0) + 0.03 * sin(t * 5.3);
      col *= pulse;

      // Vignette
      float vig = 1.0 - 0.4 * pow(length(uv - 0.5) * 1.4, 2.0);
      col *= vig;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  var prog = GLUtils.program(gl, vertSrc, fragSrc);
  if (!prog) return;
  GLUtils.fullscreenQuad(gl, prog);

  var animId = null;
  var isVisible = true;
  var startTime = performance.now();
  var mouse = { x: 0.5, y: 0.5 };

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame() {
    if (!isVisible) return;

    GLUtils.resize(canvas, gl);
    var t = (performance.now() - startTime) / 1000;

    var topCol = GLUtils.hexToRGB(getCSS('--lpl-top-color') || '#00d4ff');
    var botCol = GLUtils.hexToRGB(getCSS('--lpl-bottom-color') || '#7c3aed');
    var width = parseFloat(getCSS('--lpl-width') || '0.15');
    var glow = parseFloat(getCSS('--lpl-glow') || '1.0');
    var rotation = parseFloat(getCSS('--lpl-rotation') || '0');
    var speed = parseFloat(getCSS('--lpl-speed') || '0.5');

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', [mouse.x, mouse.y]);
    GLUtils.uniform(gl, prog, 'uTopColor', '3f', topCol);
    GLUtils.uniform(gl, prog, 'uBottomColor', '3f', botCol);
    GLUtils.uniform(gl, prog, 'uWidth', '1f', width);
    GLUtils.uniform(gl, prog, 'uGlow', '1f', glow);
    GLUtils.uniform(gl, prog, 'uRotation', '1f', rotation);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);

    GLUtils.draw(gl);
    animId = requestAnimationFrame(frame);
  }

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  });
  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (touch.clientY - rect.top) / rect.height;
  }, { passive: true });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) frame();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
    }
  });

  frame();
})();
