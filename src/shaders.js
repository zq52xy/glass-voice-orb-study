/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: Six local GLSL files extracted 1:1 from the siri27 reference bundle.
OUTPUT: One shared vertex source + named fragment sources for the multi-pass pipeline.
POS: Adapter only; all visual math lives in src/shaders/*.glsl, not here.
*/
(function () {
  const DIR = "./src/shaders/";
  const FRAGMENTS = {
    background: "background.frag.glsl",
    wave: "wave.frag.glsl",
    dots: "dots.frag.glsl",
    compose: "compose.frag.glsl",
    glass: "glass.frag.glsl",
  };

  async function fetchText(file) {
    const response = await fetch(DIR + file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load shader ${file}: ${response.status}`);
    }
    return response.text();
  }

  async function load() {
    const vertex = await fetchText("screen.vert.glsl");
    const names = Object.keys(FRAGMENTS);
    const sources = await Promise.all(names.map((name) => fetchText(FRAGMENTS[name])));
    const fragments = {};
    names.forEach((name, i) => {
      fragments[name] = sources[i];
    });
    return { vertex, fragments };
  }

  window.SIRI_SHADERS = { load };
})();
