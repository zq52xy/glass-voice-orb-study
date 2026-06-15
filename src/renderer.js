/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: Canvas, loaded shaders, background image, and per-frame state/audio channels.
OUTPUT: Three-FBO glass-refraction render of the siri27 effect onto the canvas.
POS: Owns draw order and responsive glass layout; DOM overlays mirror these viewport clamps.
*/
(function () {
  const P = window.SiriPipeline;
  const DPR_CAP = 2;
  // siri27 布局常量（可被 window.SIRI_PARAMS 覆盖）
  const EXPANDED_W = 128; // Lt
  const MARGIN = 20; // Mt
  const EFFECT_SCALE_PX = 1.18; // kt
  const DIALOG_W = 460;
  const DIALOG_H = 110;
  const CORNER_MAX = 44;
  const CONTAINER = { black: 0.25, fade: 1, gauss: 8, strength: 0.9 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const param = (key, fallback) => {
    const p = window.SIRI_PARAMS;
    return p && typeof p[key] === "number" ? p[key] : fallback;
  };
  const ballWidth = () => param("ballWidth", EXPANDED_W);
  const effectPx = (dpr) => Math.max(1, Math.round(ballWidth() * EFFECT_SCALE_PX * dpr));

  class SiriRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext("webgl2", { antialias: false, alpha: false, preserveDrawingBuffer: true });
      this.passes = {};
      this.effectTarget = null;
      this.sceneTarget = null;
      this.background = { texture: null, width: 1, height: 1, ready: 0 };
      const gl = this.gl;
      this.fallbackTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.fallbackTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([16, 14, 12, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.dpr = 1; this.width = 1; this.height = 1;
      this.time = 0; this.channels = null;
    }

    async init() {
      if (!this.gl) throw new Error("WebGL2 is not available in this browser.");
      const gl = this.gl;
      const { vertex, fragments } = await window.SIRI_SHADERS.load();
      for (const name in fragments) {
        this.passes[name] = P.createProgram(gl, vertex, fragments[name]);
      }
      this.vao = gl.createVertexArray();
      this.setBackground(window.SIRI_DEFAULT_BG || "./assets/96bdad248714663.69fdafdc31e48.webp");
      this.resize();
      window.addEventListener("resize", () => this.resize(), { passive: true });
    }

    setBackground(url) {
      const gl = this.gl;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const old = this.background.texture;
        this.background = { texture, width: image.width, height: image.height, ready: 1 };
        if (old) gl.deleteTexture(old);
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      };
      image.src = url;
    }

    resize() {
      const gl = this.gl;
      this.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const width = Math.max(1, Math.floor(this.canvas.clientWidth * this.dpr));
      const height = Math.max(1, Math.floor(this.canvas.clientHeight * this.dpr));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.width = width;
      this.height = height;
      this._ensureTargets(this._layout());
      gl.viewport(0, 0, width, height);
    }

    _layout() {
      const press = this.channels ? this.channels.press : 0;
      const rawDialog = this.channels ? this.channels.dialog || 0 : 0;
      const closeBounce = param("dialogCloseBounce", 0.032);
      const dialog = rawDialog < 0 ? -closeBounce * Math.tanh(-rawDialog / closeBounce) : Math.min(1.08, rawDialog);
      const open = Math.max(0, Math.min(1, dialog));
      const breathe = Math.sin(this.time * param("breathSpeed", 1.65)) * param("breathAmount", 0.028) * (1 - open);
      const a = 1 + press * 0.018 + breathe;
      const margin = param("margin", MARGIN) * this.dpr;
      const base = ballWidth() * this.dpr * a;
      const viewportW = this.width / this.dpr;
      const maxDialogW = Math.max(1, viewportW - 48);
      const responsiveDialogW = Math.min(clamp(viewportW * 0.44, 320, 560), maxDialogW);
      const tunedDialogW = param("dialogWidth", DIALOG_W);
      const requestedDialogW = tunedDialogW === DIALOG_W ? responsiveDialogW : tunedDialogW;
      const minDialogW = Math.min(260, maxDialogW);
      const dw = clamp(requestedDialogW, minDialogW, maxDialogW) * this.dpr;
      const dh = param("dialogHeight", DIALOG_H) * this.dpr;
      const innerW = base + (dw - base) * dialog;
      const innerH = base + (dh - base) * dialog;
      const panelW = innerW + margin * 2;
      const panelH = innerH + margin * 2;
      const effectW = Math.max(1, Math.round(innerW * EFFECT_SCALE_PX));
      const effectH = Math.max(1, Math.round(innerH * EFFECT_SCALE_PX));
      const half = Math.min(innerW, innerH) * 0.5;
      const corner = Math.min(half, half + (CORNER_MAX * this.dpr - half) * Math.max(0, dialog));
      const cx = (this.width - panelW) * 0.5;
      const cy = (this.height - panelH) * 0.5;
      const panelCenterY = cy + panelH * 0.5;
      return {
        margin,
        cornerRadius: corner,
        panelOrigin: [cx, cy],
        panelSize: [panelW, panelH],
        effectOrigin: [(this.width - effectW) * 0.5, panelCenterY - effectH * 0.5],
        effectSize: [effectW, effectH],
      };
    }

    _ensureTargets(L) {
      const gl = this.gl;
      const ew = L ? L.effectSize[0] : effectPx(this.dpr);
      const eh = L ? L.effectSize[1] : ew;
      if (!this.effectTarget || this.effectTarget.width !== ew || this.effectTarget.height !== eh) {
        P.disposeTarget(gl, this.effectTarget);
        this.effectTarget = P.createTarget(gl, ew, eh);
      }
      if (!this.sceneTarget || this.sceneTarget.width !== this.width || this.sceneTarget.height !== this.height) {
        P.disposeTarget(gl, this.sceneTarget);
        this.sceneTarget = P.createTarget(gl, this.width, this.height);
      }
    }

    setFrame(channels, time) {
      this.channels = channels;
      this.time = time;
    }

    _draw(pass, uniforms, textures) {
      const gl = this.gl;
      gl.useProgram(pass.program);
      gl.bindVertexArray(this.vao);
      P.applyUniforms(gl, pass, uniforms);
      P.applyTextures(gl, pass, textures);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    _premultBlend(on) {
      const gl = this.gl;
      if (!on) {
        gl.disable(gl.BLEND);
        return;
      }
      gl.enable(gl.BLEND);
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    render() {
      if (!this.channels) {
        return;
      }
      const gl = this.gl;
      const L = this._layout();
      this._ensureTargets(L);
      const u = window.SiriUniforms.build(this, L);
      const bg = this.background.texture || this.fallbackTexture;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.effectTarget.framebuffer);
      gl.viewport(0, 0, this.effectTarget.width, this.effectTarget.height);
      this._premultBlend(false);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this._premultBlend(true);
      if (this.channels.waveLayerOpacity > 0.001) this._draw(this.passes.wave, u.wave);
      if (this.channels.dotsAppear > 0.001) this._draw(this.passes.dots, u.dots);
      this._premultBlend(false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneTarget.framebuffer);
      gl.viewport(0, 0, this.width, this.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this._draw(this.passes.background, u.background, [{ name: "uBackground", texture: bg }]);
      this._premultBlend(true);
      this._draw(this.passes.compose, u.compose, [
        { name: "uEffectTexture", texture: this.effectTarget.texture },
      ]);
      this._premultBlend(false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.width, this.height);
      this._draw(this.passes.glass, u.glass, [
        { name: "uSceneTexture", texture: this.sceneTarget.texture },
        { name: "uBackground", texture: bg },
      ]);
    }
  }

  window.SiriRenderer = SiriRenderer;
  window.SIRI_CONTAINER = CONTAINER;
})();
