/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: DOM controls, dialog overlay, tuner parameter events, renderer, state, audio.
OUTPUT: idle/listening/thinking/dialog transitions plus synchronized dialog overlay layout.
POS: App coordinator only; keeps DOM overlay geometry aligned with renderer layout parameters.
*/
(function () {
  const canvas = document.querySelector("#siri-canvas");
  const control = document.querySelector("#siri-control");
  const status = document.querySelector("#siri-status");
  const dialog = document.querySelector("#siri-dialog");
  const askForm = document.querySelector("#siri-ask");
  const askInput = document.querySelector("#siri-input");
  const answer = document.querySelector("#siri-answer");
  const renderer = new window.SiriRenderer(canvas);
  window.SIRI_RENDERER = renderer;
  const state = new window.SiriState();
  window.SIRI_STATE = state;
  const meter = new window.SiriAudioMeter();
  const LONG_PRESS_MS = 360;
  const DEFAULT_DIALOG_WIDTH = 460;
  const DEFAULT_REPLY = "我是智能助手，有什么可以帮到您？";
  let releaseTimer = 0;
  let pressTimer = 0;
  let clickArmed = false;
  let lastFrame = performance.now();
  let startTime = performance.now();

  function responsiveDialogWidth() {
    const viewportW = window.innerWidth || document.documentElement.clientWidth || DEFAULT_DIALOG_WIDTH;
    const maxDialogW = Math.max(1, viewportW - 48);
    const responsiveW = Math.min(Math.max(viewportW * 0.44, 320), 560, maxDialogW);
    const tunedW = window.SIRI_PARAMS && typeof window.SIRI_PARAMS.dialogWidth === "number"
      ? window.SIRI_PARAMS.dialogWidth
      : DEFAULT_DIALOG_WIDTH;
    return tunedW === DEFAULT_DIALOG_WIDTH ? responsiveW : Math.min(Math.max(tunedW, 260), maxDialogW);
  }

  function syncDialogLayout() {
    document.documentElement.style.setProperty("--dialog-inline", `${responsiveDialogWidth()}px`);
  }

  function setMessage(text, hiddenText) {
    control.textContent = text;
    status.textContent = hiddenText || text;
    control.dataset.active = String(state.mode !== "idle");
  }

  function setDialog(mode, text) {
    if (mode === "idle" && dialog.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    dialog.dataset.mode = mode;
    dialog.setAttribute("aria-hidden", String(mode === "idle"));
    answer.textContent = text || "";
  }

  function closeDialog() {
    window.clearTimeout(releaseTimer);
    meter.stop();
    state.select("idle");
    state.setPressed(false);
    setDialog("idle");
    setMessage("Hold to speak", "Idle.");
  }

  function openAsk() {
    window.clearTimeout(releaseTimer);
    meter.stop();
    state.select("dialog");
    state.setPressed(false);
    setDialog("ask");
    setMessage("Close", "Ask.");
    window.setTimeout(() => askInput.focus({ preventScroll: true }), 180);
  }

  function openReply(text) {
    state.select("dialog");
    state.setPressed(false);
    setDialog("reply", text);
    setMessage("Ask again", "Reply.");
  }

  function enterThinking(replyText) {
    meter.stop();
    state.select("thinking");
    state.setPressed(false);
    setDialog("idle");
    setMessage("Thinking...", "Thinking.");
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => openReply(replyText || DEFAULT_REPLY), 1200);
  }

  async function enterListening() {
    if (state.mode === "listening") {
      return;
    }
    window.clearTimeout(releaseTimer);
    setDialog("idle");
    state.select("listening");
    state.setPressed(true);
    setMessage("Release to send", "Listening.");
    await meter.start();
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const audio = meter.sample();
    const channels = state.step(dt, audio);
    channels.audio = audio;
    renderer.setFrame(channels, (now - startTime) / 1000);
    renderer.render();
    requestAnimationFrame(frame);
  }

  function onPointerDown(event) {
    if (dialog.contains(event.target)) {
      return;
    }
    event.preventDefault();
    if (state.mode === "dialog") {
      closeDialog();
      return;
    }
    clickArmed = true;
    window.clearTimeout(pressTimer);
    pressTimer = window.setTimeout(() => {
      clickArmed = false;
      enterListening();
    }, LONG_PRESS_MS);
  }

  function onPointerUp(event) {
    if (dialog.contains(event.target)) {
      return;
    }
    event.preventDefault();
    window.clearTimeout(pressTimer);
    if (state.mode === "listening") {
      enterThinking(DEFAULT_REPLY);
    } else if (clickArmed) {
      openAsk();
    }
    clickArmed = false;
  }

  function onKeyDown(event) {
    if (event.target === askInput) {
      return;
    }
    if (event.key === "Escape" && state.mode === "dialog") {
      closeDialog();
      return;
    }
    if ((event.code === "Space" || event.code === "Enter") && !event.repeat && state.mode !== "dialog") {
      event.preventDefault();
      enterListening();
    }
  }

  function onKeyUp(event) {
    if (event.target === askInput) {
      return;
    }
    if ((event.code === "Space" || event.code === "Enter") && state.mode === "listening") {
      event.preventDefault();
      enterThinking(DEFAULT_REPLY);
    }
  }

  askForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = askInput.value.trim();
    if (!question) {
      return;
    }
    askInput.blur();
    enterThinking(`关于“${question}”，${DEFAULT_REPLY}`);
  });
  ["pointerdown", "pointerup"].forEach((type) => dialog.addEventListener(type, (event) => event.stopPropagation()));
  canvas.addEventListener("pointerdown", onPointerDown);
  control.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", () => {
    clickArmed = false;
    window.clearTimeout(pressTimer);
    if (state.mode === "listening") {
      enterThinking(DEFAULT_REPLY);
    }
  });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", syncDialogLayout, { passive: true });
  window.addEventListener("siri-params-change", syncDialogLayout);
  window.addEventListener("contextmenu", (event) => event.preventDefault());

  async function boot() {
    try {
      await renderer.init();
      syncDialogLayout();
      setDialog("idle");
      setMessage("Hold to speak", "Idle.");
      startTime = performance.now();
      lastFrame = startTime;
      frame();
    } catch (error) {
      setMessage("WebGL unavailable", "WebGL renderer failed.");
      status.textContent = error.message;
      console.error(error);
    }
  }

  boot();
})();
