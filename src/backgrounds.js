/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: None at load; defines the background manifest + default, builds a picker UI.
OUTPUT: Thumbnail strip (bottom-left) + upload button that call renderer.setBackground.
POS: Background-switching feature; reads window.SIRI_RENDERER, owns no GL state.
*/
(function () {
  const DIR = "./assets/";
  // 背景清单：公开仓库只保留一个个人学习用背景图。新增背景在此登记即可。
  const LIST = [
    { file: "96bdad248714663.69fdafdc31e48.webp", label: "AI \u9762\u5b54" },
  ];

  window.SIRI_DEFAULT_BG = DIR + LIST[0].file;

  const CSS = `
  #siri-bg{position:fixed;left:50%;top:22px;z-index:8;display:flex;gap:10px;align-items:center;
    transform:translateX(-50%);padding:7px 9px;background:transparent;border:0;user-select:none}
  #siri-bg .thumb{width:9px;height:9px;border-radius:999px;background-size:cover;background-position:center;
    cursor:pointer;border:0;opacity:.55;box-shadow:0 0 0 1px rgba(255,255,255,.35);
    transition:opacity .15s,transform .15s,box-shadow .15s}
  #siri-bg .thumb:hover{opacity:1}
  #siri-bg .thumb.active{opacity:1;transform:scale(1.18);box-shadow:0 0 0 2px rgba(255,255,255,.48)}
  #siri-bg .upload{width:9px;height:9px;border-radius:999px;border:0;color:transparent;
    display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0;
    background:rgba(255,255,255,.38);box-shadow:0 0 0 1px rgba(255,255,255,.28)}
  #siri-bg .upload:hover{background:rgba(255,255,255,.72)}
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
