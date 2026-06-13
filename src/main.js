/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: DOM controls, pointer/keyboard gestures, renderer, state machine, audio meter.
OUTPUT: idle/listening/thinking transitions driving the siri27 glass render loop.
POS: App coordinator only; rendering, state, and audio internals stay in siblings.
*/
(function () {
  const canvas = document.querySelector("#siri-canvas");
  const control = document.querySelector("#siri-control");
  const status = document.querySelector("#siri-status");
  const renderer = new window.SiriRenderer(canvas);
  window.SIRI_RENDERER = renderer; // 供背景切换器调用 setBackground
  const state = new window.SiriState();
  const meter = new window.SiriAudioMeter();
  let releaseTimer = 0;
  let lastFrame = performance.now();
  let startTime = performance.now();

  function setMessage(text, hiddenText) {
    control.textContent = text;
    status.textContent = hiddenText || text;
    control.dataset.active = String(state.mode !== "idle");
  }

  async function enterListening(event) {
    if (event) {
      event.preventDefault();
    }
    if (state.mode === "listening") {
      return;
    }
    window.clearTimeout(releaseTimer);
    state.select("listening");
    state.setPressed(true);
    setMessage("Release to send", "Listening.");
    await meter.start();
  }

  function enterThinking(event) {
    if (event) {
      event.preventDefault();
    }
    if (state.mode !== "listening") {
      return;
    }
    meter.stop();
    state.select("thinking");
    state.setPressed(false);
    setMessage("Thinking...", "Thinking.");
    releaseTimer = window.setTimeout(() => {
      state.select("idle");
      setMessage("Hold to speak", "Idle.");
    }, 2800);
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const channels = state.step(dt);
    channels.audio = meter.sample();
    renderer.setFrame(channels, (now - startTime) / 1000);
    renderer.render();
    requestAnimationFrame(frame);
  }

  function onKeyDown(event) {
    if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
      enterListening(event);
    }
  }

  function onKeyUp(event) {
    if (event.code === "Space" || event.code === "Enter") {
      enterThinking(event);
    }
  }

  async function boot() {
    try {
      await renderer.init();
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

  canvas.addEventListener("pointerdown", enterListening);
  control.addEventListener("pointerdown", enterListening);
  window.addEventListener("pointerup", enterThinking);
  window.addEventListener("pointercancel", enterThinking);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("contextmenu", (event) => event.preventDefault());

  boot();
})();
