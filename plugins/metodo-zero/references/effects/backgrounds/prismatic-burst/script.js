/* Prismatic Burst — Rainbow refraction with chromatic aberration via WebGL */
(function () {
  'use strict';

  var container = document.querySelector('.prb-container');
  var canvas = document.querySelector('.prb-canvas');
  if (!container || !canvas) return;

  var gl = GLUtils.create(canvas);
  if (!gl) return;

  var vertSrc = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';

  var fragSrc = `
    precision highp float;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform float uDispersion;

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
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.1;
        a *= 0.5;
      }
      return v;
    }

    // Spectral color from wavelength-like parameter (0..1)
    vec3 spectral(float t) {
      vec3 c;
      // Approximate visible spectrum
      t = clamp(t, 0.0, 1.0);
      if (t < 0.17) {
        c = mix(vec3(0.5, 0.0, 1.0), vec3(0.0, 0.0, 1.0), t / 0.17); // violet -> blue
      } else if (t < 0.33) {
        c = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), (t - 0.17) / 0.16); // blue -> cyan
      } else if (t < 0.5) {
        c = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (t - 0.33) / 0.17); // cyan -> green
      } else if (t < 0.67) {
        c = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.5) / 0.17); // green -> yellow
      } else if (t < 0.83) {
        c = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.5, 0.0), (t - 0.67) / 0.16); // yellow -> orange
      } else {
        c = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.83) / 0.17); // orange -> red
      }
      return c;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float aspect = uResolution.x / uResolution.y;
      vec2 center = uMouse;
      vec2 p = (uv - center) * vec2(aspect, 1.0);
      float t = uTime * uSpeed;

      float dist = length(p);
      float angle = atan(p.y, p.x);

      // Animated noise for organic movement
      float n1 = fbm(p * 3.0 + t * 0.5);
      float n2 = fbm(p * 5.0 - t * 0.3 + vec2(5.2, 1.3));

      // Chromatic aberration: sample each "wavelength" at slightly different distance
      vec3 col = vec3(0.0);
      float totalWeight = 0.0;

      // Sample 12 spectral bands at different refraction angles
      for (int i = 0; i < 12; i++) {
        float fi = float(i) / 11.0;

        // Each wavelength refracts differently
        float refractOffset = (fi - 0.5) * uDispersion;
        float sampleDist = dist + refractOffset;

        // Radial light pattern with noise
        float rays = 0.0;

        // Main radial rays
        float rayAngle = angle + n1 * 0.5 + t * 0.1;
        rays += pow(abs(sin(rayAngle * 5.0 + t * 0.5)), 8.0) * 0.5;
        rays += pow(abs(sin(rayAngle * 8.0 - t * 0.3 + n2)), 12.0) * 0.3;
        rays += pow(abs(sin(rayAngle * 13.0 + t * 0.7)), 16.0) * 0.2;

        // Radial falloff with pulsation
        float pulse = 1.0 + 0.2 * sin(t * 1.5 + fi * 3.0);
        float radial = exp(-sampleDist * 2.5 * pulse) * uIntensity;

        // Ring highlights
        float ring1 = exp(-pow((sampleDist - 0.3 - 0.05 * sin(t)) * 10.0, 2.0)) * 0.3;
        float ring2 = exp(-pow((sampleDist - 0.5 + 0.03 * sin(t * 1.3)) * 12.0, 2.0)) * 0.2;
        float ring3 = exp(-pow((sampleDist - 0.7 - 0.04 * sin(t * 0.8)) * 15.0, 2.0)) * 0.15;

        float brightness = (radial + radial * rays * 2.0 + ring1 + ring2 + ring3);

        vec3 specCol = spectral(fi);
        col += specCol * brightness;
        totalWeight += brightness;
      }

      // Normalize to prevent overblown values while keeping vibrancy
      col = col / 12.0;

      // Add center glow (white hot)
      float centerGlow = exp(-dist * dist * 20.0) * uIntensity * 0.5;
      col += vec3(centerGlow);

      // Noise sparkles
      float sparkle = noise(vec2(angle * 20.0 + t * 5.0, dist * 30.0));
      sparkle = pow(sparkle, 6.0) * exp(-dist * 3.0) * 0.3 * uIntensity;
      col += vec3(sparkle);

      // Vignette
      float vig = 1.0 - 0.3 * pow(length(uv - 0.5) * 1.4, 2.0);
      col *= vig;

      col = clamp(col, 0.0, 1.0);

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
  var smoothMouse = { x: 0.5, y: 0.5 };

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function frame() {
    if (!isVisible) return;

    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

    GLUtils.resize(canvas, gl);
    var t = (performance.now() - startTime) / 1000;

    var intensity = parseFloat(getCSS('--prb-intensity') || '1.0');
    var speed = parseFloat(getCSS('--prb-speed') || '0.5');
    var dispersion = parseFloat(getCSS('--prb-dispersion') || '0.08');

    GLUtils.uniform(gl, prog, 'uResolution', '2f', [canvas.width, canvas.height]);
    GLUtils.uniform(gl, prog, 'uTime', '1f', t);
    GLUtils.uniform(gl, prog, 'uMouse', '2f', [smoothMouse.x, smoothMouse.y]);
    GLUtils.uniform(gl, prog, 'uIntensity', '1f', intensity);
    GLUtils.uniform(gl, prog, 'uSpeed', '1f', speed);
    GLUtils.uniform(gl, prog, 'uDispersion', '1f', dispersion);

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
