/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: Renderer (dpr/size/time/channels/background) and the computed layout.
OUTPUT: Per-pass uniform value maps, copied 1:1 from the siri27 reference defaults.
POS: Pure uniform dictionary; no GL calls, no animation, no state transitions.
*/
(function () {
  const C = () => window.SIRI_CONTAINER;
  // 关键参数取自可调面板（window.SIRI_PARAMS），缺省回退到 siri27 默认值
  const num = (key, fallback) => {
    const p = window.SIRI_PARAMS;
    return p && typeof p[key] === "number" ? p[key] : fallback;
  };

  function build(r, L) {
    const ch = r.channels;
    const dpr = r.dpr;
    const res = [r.width, r.height];
    const canvas = [r.width, r.height];
    const effectRes = L.effectSize; // wave/dots 画进方形 FBO，分辨率用其自身尺寸
    const anchor = [0.5, 0.5];
    const mouse = [0, 0, 0, 0];
    const audio = ch.audio || { low: 0, mid: 0, high: 0 };

    const wave = {
      uResolution: effectRes,
      uTime: r.time,
      uMouse: mouse,
      uResolved: ch.sharedResolved,
      uLayerOpacity: ch.waveLayerOpacity,
      uUnresolvedScale: 0.05,
      uEffectScale: ch.effectScale,
      uAnchor: anchor,
      uAmplitude: 0.125,
      uFreq: 1,
      uAberrationFreq: 1,
      uWavePhase: r.time,
      uWaveSpeed: -1,
      uWaveScale: 1,
      uAberration: num("waveAberration", 0.5),
      uThickness: 8,
      uIntensity: num("waveIntensity", 8),
      uFalloff: 2.025,
      uEdgeMask: 0,
      uEdgeMaskInset: 0,
      uBandFill: 0,
      uBandFillThickness: 0,
      uSoftness: 3,
      uLow: audio.low * 0.4,
      uMid: audio.mid * 0.4,
      uHigh: audio.high * 0.4,
      uLowAmplitude: 75,
      uLowIntensity: 0,
      uMidAberration: 5,
      uMidAberrationAmplitude: 0,
      uMidBandFill: 70,
      uMidSoftness: 0,
      uHighAberration: 5,
      uHighAberrationAmplitude: 0,
    };

    const dots = {
      uResolution: effectRes,
      uTime: r.time,
      uMouse: mouse,
      uDotsResolved: ch.dotsResolved,
      uEffectScale: ch.effectScale,
      uAnchor: anchor,
      uRotation: 0.7,
      uRingRadius: 0.45,
      uDotRadius: 0.1,
      uPairOffset: 0.085,
      uPairSmoothness: 0.2,
      uSmoothness: 0.2,
      uProgress0: 0,
      uProgress1: 0,
      uProgress2: 0,
      uProgress3: 0,
      uProgress4: 0,
      uProgress5: 0,
      uScaleDuration: 2,
      uScaleStagger: 0.167,
      uScaleMin: 0.001,
      uScaleMax: 0.65,
      uGlowIntensity: num("dotGlow", 0.04),
      uFalloffPower: 0.7,
      uGlowFadeStart: 0,
      uGlowFadeEnd: 0.7,
      uDotsAberration: -0.05,
      uCenterCore: 0.5,
      uDotsScale: 1,
      uAppear: ch.dotsAppear,
    };

    const background = {
      uResolution: res,
      uTextureSize: [r.background.width, r.background.height],
      uCanvasSize: canvas,
      uBackgroundReady: r.background.ready,
    };

    const compose = {
      uResolution: res,
      uCanvasSize: canvas,
      uEffectOrigin: L.effectOrigin,
      uEffectSize: L.effectSize,
      uContainer: num("containerStrength", C().strength) * Math.min(1, Math.max(0, ch.sharedResolved)),
      uContainerBlack: num("containerBlack", C().black),
      uContainerFade: num("containerFade", C().fade),
      uContainerGauss: num("containerGauss", C().gauss),
    };

    const glass = {
      uResolution: res,
      uTextureSize: [r.background.width, r.background.height],
      uPanelSize: L.panelSize,
      uCanvasSize: canvas,
      uPanelOrigin: L.panelOrigin,
      uMarginPx: L.margin,
      uCornerRadius: L.cornerRadius,
      uHeight: num("glassHeight", 18) * dpr,
      uCurvature: num("curvature", 1),
      uRefractAmount: num("refractAmount", -56) * dpr,
      uAngle: 0,
      uGradRadialMix: 0.08,
      uKeyAngle: Math.PI * 0.25,
      uFillAngle: Math.PI * 1.25,
      uHlHeight: num("hlHeight", 2.2) * dpr,
      uHlCut: num("hlCut", 0.52),
      uHlNorm: 8,
      uHlAmount: num("hlAmount", 0.72),
      uHlCurv: 1,
      uBackgroundReady: r.background.ready,
    };

    return { background, wave, dots, compose, glass };
  }

  window.SiriUniforms = { build };
})();
