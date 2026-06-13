/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: A WebGL2 context plus shader sources and per-pass uniform/texture maps.
OUTPUT: Compiled programs, framebuffer render targets, and full-screen draw helpers.
POS: Low-level GL plumbing for renderer.js; holds no scene or animation logic.
*/
(function () {
  // ---- program 编译 ----
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) || "shader compile error";
      gl.deleteShader(shader);
      throw new Error(log);
    }
    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) || "program link error";
      gl.deleteProgram(program);
      throw new Error(log);
    }
    return { program, uniforms: new Map() };
  }

  function uniformLocation(gl, pass, name) {
    if (!pass.uniforms.has(name)) {
      pass.uniforms.set(name, gl.getUniformLocation(pass.program, name));
    }
    return pass.uniforms.get(name);
  }

  // ---- FBO render target ----
  function createTarget(gl, width, height) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer, texture, width, height };
  }

  function disposeTarget(gl, target) {
    if (!target) {
      return;
    }
    gl.deleteFramebuffer(target.framebuffer);
    gl.deleteTexture(target.texture);
  }

  // ---- uniform / texture 应用 ----
  function applyUniforms(gl, pass, values) {
    for (const name in values) {
      const loc = uniformLocation(gl, pass, name);
      if (loc === null) {
        continue;
      }
      const v = values[name];
      if (typeof v === "number") {
        gl.uniform1f(loc, v);
      } else if (v.length === 2) {
        gl.uniform2f(loc, v[0], v[1]);
      } else if (v.length === 4) {
        gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
      } else if (v.length === 3) {
        gl.uniform3f(loc, v[0], v[1], v[2]);
      }
    }
  }

  function applyTextures(gl, pass, textures) {
    if (!textures) {
      return;
    }
    textures.forEach((entry, unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, entry.texture);
      const loc = uniformLocation(gl, pass, entry.name);
      if (loc !== null) {
        gl.uniform1i(loc, unit);
      }
    });
  }

  window.SiriPipeline = {
    createProgram,
    createTarget,
    disposeTarget,
    applyUniforms,
    applyTextures,
  };
})();
