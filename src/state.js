/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: Discrete UI states (idle / listening / thinking) and press gestures.
OUTPUT: Spring-smoothed channels (waveOpacity, dotsResolved, effectScale, press...) per frame.
POS: 1:1 port of the siri27 spring model; renderer reads derived values, does not animate.
*/
(function () {
  const TAU = Math.PI * 2;
  const EPS = 1e-4;
  const MASS = 1;

  // response/dampingRatio -> 解析阻尼振子参数（siri27 tt()）
  function springParams(response, dampingRatio) {
    const r = Math.max(response, EPS);
    const damp = Math.max(0, dampingRatio);
    const omega = TAU / r;
    return {
      mass: MASS,
      stiffness: MASS * omega * omega,
      damping: 2 * damp * MASS * omega,
      naturalAngularFrequency: omega,
    };
  }

  // 解析积分器（siri27 ct()）：欠阻尼 / 过阻尼 / 临界三分支
  function integrate(value, velocity, target, p, dt) {
    const omega0 = p.stiffness / p.mass;
    const s = p.naturalAngularFrequency;
    const r = p.damping / (2 * p.mass);
    const t = Math.max(dt, 0);
    const c = value - target;
    if (t <= 0 || (c === 0 && velocity === 0)) {
      return [value, velocity];
    }
    let m;
    let pv;
    if (r < s) {
      const f = Math.sqrt(omega0 - r * r);
      const u = Math.exp(-r * t);
      const h = Math.cos(f * t);
      const d = Math.sin(f * t);
      const S = (velocity + r * c) / f;
      const E = c * h + S * d;
      m = u * E;
      pv = u * (-r * E + (-c * f * d + S * f * h));
    } else if (s < r) {
      const f = Math.sqrt(r * r - omega0);
      const u = -r + f;
      const h = -r - f;
      const d = (velocity - h * c) / (u - h);
      const _ = c - d;
      const S = Math.exp(u * t);
      const E = Math.exp(h * t);
      m = d * S + _ * E;
      pv = d * u * S + _ * h * E;
    } else {
      const f = Math.exp(-r * t);
      const u = velocity + r * c;
      const h = c + u * t;
      m = f * h;
      pv = f * (u - r * h);
    }
    return [target + m, pv];
  }

  class Spring {
    constructor(value, response, dampingRatio) {
      this.value = value;
      this.velocity = 0;
      this.target = value;
      this.params = springParams(response, dampingRatio);
    }
    setOptions(response, dampingRatio) {
      this.params = springParams(response, dampingRatio);
    }
    setTarget(target) {
      this.target = target;
    }
    step(dt) {
      const next = integrate(this.value, this.velocity, this.target, this.params, dt);
      this.value = next[0];
      this.velocity = next[1];
      return this.value;
    }
  }

  // siri27 时序常量
  const OPEN = { response: 0.314, dampingRatio: 1 };
  const CLOSE = { response: 0.3, dampingRatio: 1 };
  const STATES = {
    idle: { waveActive: true, fluidDots: false },
    listening: { waveActive: true, fluidDots: false },
    thinking: { waveActive: false, fluidDots: true },
    dialog: { waveActive: false, fluidDots: false },
  };
  const DIALOG = { response: 0.42, dampingRatio: 0.62 };
  const WAVE_PHASE_WRAP = 62.831848;
  const WAVE_SPEED_BASE = -2.5;
  const WAVE_SPEED_AUDIO = -12;
  const AUDIO_DRIVE_SCALE = 0.4;

  function audioDrive(bands) {
    if (!bands) {
      return 0;
    }
    const peak = Math.max(bands.low || 0, bands.mid || 0, bands.high || 0);
    return Math.max(0, Math.min(1, peak * AUDIO_DRIVE_SCALE));
  }

  class SiriState {
    constructor() {
      this.mode = "idle";
      this.waveOpacity = new Spring(1, OPEN.response, OPEN.dampingRatio);
      this.fluidDots = new Spring(-1, 0.5, 0.85); // ±1，dots 出现/退场
      this.effectScale = new Spring(1, 0.5, 1);
      this.press = new Spring(0, 0.2, 1);
      this.dialog = new Spring(0, DIALOG.response, DIALOG.dampingRatio);
      this.derived = {
        waveOpacity: 1,
        waveLayerOpacity: 0.98,
        wavePhase: 0,
        dotsResolved: -1,
        effectScale: 1,
        sharedResolved: 1,
        dotsAppear: 0,
        press: 0,
        dialog: 0,
      };
    }

    select(mode) {
      if (!STATES[mode]) {
        return;
      }
      this.mode = mode;
      const cfg = STATES[mode];
      this.waveOpacity.setOptions(
        cfg.waveActive ? OPEN.response : CLOSE.response,
        OPEN.dampingRatio
      );
      this.waveOpacity.setTarget(cfg.waveActive ? 1 : 0);
      this.fluidDots.setTarget(cfg.fluidDots ? 1 : -1);
      this.effectScale.setTarget(cfg.fluidDots ? 2 / 3 : 1);
      this.dialog.setTarget(mode === "dialog" ? 1 : 0);
    }

    setPressed(pressed) {
      this.press.setTarget(pressed ? 1 : 0);
    }

    step(dt, bands) {
      const wave = this.waveOpacity.step(dt);
      const dots = this.fluidDots.step(dt);
      const scale = this.effectScale.step(dt);
      const press = this.press.step(dt);
      const dialog = this.dialog.step(dt);
      const d = this.derived;
      d.waveOpacity = wave;
      d.waveLayerOpacity = 0.98 * Math.min(1, Math.max(0, wave));
      d.dotsResolved = dots;
      d.effectScale = scale;
      d.wavePhase = (d.wavePhase + (WAVE_SPEED_BASE + WAVE_SPEED_AUDIO * audioDrive(bands)) * dt) % WAVE_PHASE_WRAP;
      if (d.wavePhase < 0) {
        d.wavePhase += WAVE_PHASE_WRAP;
      }
      // orb 在 idle/listening/thinking 三态恒显，容器/wave 的 resolved 维持为 1。
      // 旧式 max(waveResolved, dots, 0) 会在状态切换中段两信号同时过零而塌到 0，
      // 造成暗容器中途变亮再变暗的闪烁 —— 这里恒定为 1 以保证衔接平滑。
      d.sharedResolved = 1;
      d.dotsAppear = Math.max(0, Math.min(1, dots));
      d.press = press;
      d.dialog = dialog;
      return d;
    }
  }

  window.SiriState = SiriState;
})();
