/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: None at load; defines window.SIRI_PARAMS defaults and builds a control panel.
OUTPUT: A floating dev panel that live-edits window.SIRI_PARAMS (read by uniforms/renderer).
POS: Optional tuning tool; remove this file + its <script> to ship without controls.
*/
(function () {
  // ---- 参数 schema：key / 中文标签 / 区间 / 步长 / 默认值（= siri27 原值）----
  const GROUPS = [
    {
      title: "容器（下半透明渐变）",
      items: [
        { key: "containerStrength", label: "整体暗度", min: 0, max: 1, step: 0.01, def: 0.9 },
        { key: "containerBlack", label: "顶部纯黑高度", min: 0, max: 0.6, step: 0.01, def: 0.25 },
        { key: "containerFade", label: "渐隐跨度", min: 0.1, max: 2, step: 0.01, def: 1 },
        { key: "containerGauss", label: "渐隐陡度", min: 1, max: 16, step: 0.1, def: 8 },
      ],
    },
    {
      title: "玻璃",
      items: [
        { key: "refractAmount", label: "折射强度", min: -120, max: 0, step: 1, def: -56 },
        { key: "glassHeight", label: "折射深度", min: 4, max: 40, step: 1, def: 18 },
        { key: "curvature", label: "曲率", min: 0, max: 1, step: 0.01, def: 1 },
        { key: "hlAmount", label: "高光亮度", min: 0, max: 2, step: 0.01, def: 0.72 },
        { key: "hlHeight", label: "高光宽度", min: 0.5, max: 6, step: 0.1, def: 2.2 },
        { key: "hlCut", label: "高光收束", min: 0, max: 0.95, step: 0.01, def: 0.52 },
      ],
    },
    {
      title: "几何",
      items: [
        { key: "ballWidth", label: "球体大小", min: 60, max: 280, step: 1, def: 128 },
        { key: "margin", label: "边距", min: 0, max: 50, step: 1, def: 20 },
      ],
    },
    {
      title: "光效",
      items: [
        { key: "waveIntensity", label: "波形亮度", min: 1, max: 16, step: 0.1, def: 8 },
        { key: "waveAberration", label: "波形色散", min: 0, max: 1.5, step: 0.01, def: 0.5 },
        { key: "dotGlow", label: "点辉光", min: 0.01, max: 0.15, step: 0.005, def: 0.04 },
      ],
    },
  ];

  const params = {};
  GROUPS.forEach((g) => g.items.forEach((it) => (params[it.key] = it.def)));
  window.SIRI_PARAMS = params;

  const CSS = `
  #siri-tuner{position:fixed;top:12px;right:12px;z-index:9;width:248px;max-height:88vh;
    overflow:auto;background:rgba(14,12,10,.82);backdrop-filter:blur(12px);color:#eee;
    border:1px solid rgba(255,255,255,.12);border-radius:12px;font:12px/1.4 ui-monospace,
    SFMono-Regular,Menlo,monospace;box-shadow:0 8px 28px rgba(0,0,0,.5);user-select:none}
  #siri-tuner header{padding:9px 12px;font-weight:600;letter-spacing:.02em;cursor:pointer;
    display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;
    background:rgba(14,12,10,.92)}
  #siri-tuner header .h{opacity:.5;font-weight:400}
  #siri-tuner .body{padding:4px 12px 10px}
  #siri-tuner.collapsed .body{display:none}
  #siri-tuner h4{margin:12px 0 4px;font-size:11px;opacity:.62;font-weight:600;text-transform:none}
  #siri-tuner .row{margin:7px 0}
  #siri-tuner .row .lab{display:flex;justify-content:space-between;margin-bottom:3px}
  #siri-tuner .row .lab b{font-weight:500;color:#f2f2f2}
  #siri-tuner .row .lab span{opacity:.7;font-variant-numeric:tabular-nums}
  #siri-tuner input[type=range]{width:100%;height:16px;accent-color:#c7a06a;cursor:pointer}
  #siri-tuner .foot{display:flex;gap:6px;margin-top:12px}
  #siri-tuner button{flex:1;padding:6px;border:1px solid rgba(255,255,255,.16);
    background:rgba(255,255,255,.06);color:#eee;border-radius:7px;cursor:pointer;font:inherit}
  #siri-tuner button:hover{background:rgba(255,255,255,.13)}
  #siri-tuner .tip{opacity:.45;margin-top:8px;font-size:10px}`;

  function build() {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const panel = document.createElement("div");
    panel.id = "siri-tuner";
    let rows = `<header><span>Orb 调参</span><span class="h">H 隐藏</span></header><div class="body">`;
    GROUPS.forEach((g) => {
      rows += `<h4>${g.title}</h4>`;
      g.items.forEach((it) => {
        rows += `<div class="row"><div class="lab"><b>${it.label}</b>` +
          `<span id="v-${it.key}">${params[it.key]}</span></div>` +
          `<input type="range" data-k="${it.key}" min="${it.min}" max="${it.max}" ` +
          `step="${it.step}" value="${params[it.key]}"></div>`;
      });
    });
    rows += `<div class="foot"><button id="t-copy">复制参数</button>` +
      `<button id="t-reset">重置</button></div>` +
      `<div class="tip">调好后点「复制参数」，把 JSON 发给我固化进代码。</div></div>`;
    panel.innerHTML = rows;
    document.body.appendChild(panel);

    panel.querySelectorAll("input[type=range]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const k = inp.dataset.k;
        params[k] = parseFloat(inp.value);
        document.getElementById("v-" + k).textContent = params[k];
      });
    });
    panel.querySelector("header").addEventListener("click", () => panel.classList.toggle("collapsed"));
    panel.querySelector("#t-copy").addEventListener("click", (e) => {
      e.stopPropagation();
      const json = JSON.stringify(params, null, 2);
      navigator.clipboard?.writeText(json);
      e.target.textContent = "已复制 ✓";
      setTimeout(() => (e.target.textContent = "复制参数"), 1200);
    });
    panel.querySelector("#t-reset").addEventListener("click", (e) => {
      e.stopPropagation();
      GROUPS.forEach((g) => g.items.forEach((it) => {
        params[it.key] = it.def;
        panel.querySelector(`input[data-k="${it.key}"]`).value = it.def;
        document.getElementById("v-" + it.key).textContent = it.def;
      }));
    });
    // 面板上的指针事件不冒泡到 canvas/window，避免误触发 listening
    ["pointerdown", "pointerup"].forEach((ev) =>
      panel.addEventListener(ev, (e) => e.stopPropagation()));
    window.addEventListener("keydown", (e) => {
      if (e.key === "h" || e.key === "H") panel.classList.toggle("collapsed");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
