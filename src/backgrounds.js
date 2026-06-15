/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: None at load; defines the background manifest + default, builds a picker UI.
OUTPUT: Thumbnail strip (bottom-left) + upload button that call renderer.setBackground.
POS: Background-switching feature; reads window.SIRI_RENDERER, owns no GL state.
*/
(function () {
  const DIR = "./assets/";
  // 背景清单：个人学习用预设；新增背景在这里登记即可。
  const LIST = [
    { file: "aurora-glass-ball.webp", label: "极光" },
    { file: "wwdc26-wallpaper-mac.webp", label: "WWDC26" },
    { file: "4d53de244676405.699d0d046c4dc.webp", label: "雪夜" },
    { file: "96bdad248714663.69fdafdc31e48.webp", label: "AI 面孔" },
    { file: "background-white.png", label: "白色" },
    { file: "background-black.png", label: "黑色" },
  ];
  window.SIRI_DEFAULT_BG = DIR + LIST[0].file;

  const CSS = `
  #siri-bg{position:fixed;left:12px;bottom:14px;z-index:8;display:flex;gap:8px;align-items:center;
    padding:8px;background:rgba(14,12,10,.62);backdrop-filter:blur(12px);border-radius:12px;
    border:1px solid rgba(255,255,255,.1);user-select:none}
  #siri-bg .thumb{width:46px;height:46px;border-radius:8px;background-size:cover;
    background-position:center;cursor:pointer;border:2px solid transparent;opacity:.7;
    transition:opacity .15s,border-color .15s}
  #siri-bg .thumb:hover{opacity:1}
  #siri-bg .thumb.active{opacity:1;border-color:#c7a06a}
  #siri-bg .upload{width:46px;height:46px;border-radius:8px;border:1.5px dashed rgba(255,255,255,.3);
    color:#ddd;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;
    background:rgba(255,255,255,.04)}
  #siri-bg .upload:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.5)}
  #siri-bg input[type=file]{display:none}`;

  function build() {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const bar = document.createElement("div");
    bar.id = "siri-bg";
    LIST.forEach((bg, i) => {
      const url = DIR + bg.file;
      const thumb = document.createElement("div");
      thumb.className = "thumb" + (i === 0 ? " active" : "");
      thumb.title = bg.label;
      thumb.style.backgroundImage = `url("${url}")`;
      thumb.addEventListener("click", () => select(url, thumb));
      bar.appendChild(thumb);
    });

    const upload = document.createElement("label");
    upload.className = "upload";
    upload.title = "上传自定义背景";
    upload.textContent = "+";
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      select(URL.createObjectURL(file), null);
    });
    upload.appendChild(input);
    bar.appendChild(upload);

    document.body.appendChild(bar);
    ["pointerdown", "pointerup"].forEach((ev) =>
      bar.addEventListener(ev, (e) => e.stopPropagation()));
  }

  function select(url, thumb) {
    const r = window.SIRI_RENDERER;
    if (r) {
      r.setBackground(url);
    }
    document.querySelectorAll("#siri-bg .thumb").forEach((t) => t.classList.remove("active"));
    if (thumb) {
      thumb.classList.add("active");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
