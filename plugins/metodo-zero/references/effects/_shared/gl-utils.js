/**
 * Minimal WebGL utility for fullscreen shader effects.
 * Used by background effects that need GPU-powered visuals.
 *
 * Usage:
 *   const gl = GLUtils.create(canvas);
 *   const program = GLUtils.program(gl, vertexSrc, fragmentSrc);
 *   GLUtils.fullscreenQuad(gl, program);
 *   // In animation loop:
 *   gl.uniform1f(gl.getUniformLocation(program, 'uTime'), time);
 *   GLUtils.draw(gl);
 */
const GLUtils = (function () {
  'use strict';

  function create(canvas, options) {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: true, ...options })
      || canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true, ...options });
    if (!gl) {
      console.warn('WebGL not supported');
      return null;
    }
    return gl;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function program(gl, vertexSrc, fragmentSrc) {
    const vert = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vert || !frag) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return null;
    }

    gl.useProgram(prog);
    return prog;
  }

  function fullscreenQuad(gl, prog) {
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  }

  function resize(canvas, gl) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const needsResize = canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr);
    if (needsResize) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    return [w, h, dpr];
  }

  function draw(gl) {
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function uniform(gl, prog, name, type, value) {
    const loc = gl.getUniformLocation(prog, name);
    if (loc === null) return;
    switch (type) {
      case '1f': gl.uniform1f(loc, value); break;
      case '2f': gl.uniform2f(loc, value[0], value[1]); break;
      case '3f': gl.uniform3f(loc, value[0], value[1], value[2]); break;
      case '4f': gl.uniform4f(loc, value[0], value[1], value[2], value[3]); break;
      case '1i': gl.uniform1i(loc, value); break;
    }
  }

  function hexToRGB(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  }

  return { create, program, fullscreenQuad, resize, draw, uniform, hexToRGB };
})();
