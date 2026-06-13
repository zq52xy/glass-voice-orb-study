# Siri Glass-Ball Evidence Report

## Summary

Recreated the adapted glass-orb pipeline: a transparent glass sphere over a selectable background preset, with a
spectral wave (idle/listening) and a six-dot ring (thinking) hosted inside the glass. The prior
pass had shipped a wrong implementation (six white dots on black, no glass, no background) and
self-reported "Pass"; that has been replaced.

Outcome: pass. Three states and three viewports verified against the reference screenshots with
zero console errors.

## Background Preset Update

- Updated `src/backgrounds.js` to match the current real assets.
- Kept one personal background asset in the public tree: `assets/96bdad248714663.69fdafdc31e48.webp`.
- Moved extra personal background images and diagnostic screenshots to `.local/open-source-excluded/`.
- Current public preset: `AI 面孔`.
- Bumped script query versions to `v=9` in `index.html`.

## What Changed vs. the Prior Pass

- Prior: single-pass `siri shader toy.txt` rendering six luminous dots on a black canvas.
- Now: WebGL2 multi-pass pipeline (effect FBO -> scene FBO -> glass) using the adapted
  shaders + their 1:1 uniform values, refracting the selected preset background through a centered glass sphere.

## Provenance (source-faithful, not eyeballed)

- Attribution and distribution restrictions are recorded in `NOTICE.md` and `LICENSE`.
- The six GLSL passes + 71 uniform defaults + layout constants + the spring model were adapted
  into local source files for this non-commercial study.
- Layout constants recovered: expanded width 128, margin 20, effect scale 1.18, container
  {black .25, fade 1, gauss 8, strength .9}; glass {height 18*dpr, refract -56*dpr, hlAmount .72,
  keyAngle 45deg, fillAngle 225deg, cornerRadius = inner/2 -> circle}.

## Pipeline

1. effect FBO (square): `dots.frag` (thinking) or `wave.frag` (idle/listening).
2. scene FBO (canvas): `compose.frag` lays the effect over the dark container.
3. default framebuffer: `glass.frag` refracts the scene through a centered circle and composites
   over the cover-fit preset image from `src/backgrounds.js`.

## Checks Run

- Desktop square 1250x1250: idle, listening, thinking captured.
- Landscape 1440x900 and mobile 390x844: glass stays circular, centered, undistorted.
- Console error check after load and interaction: 0 errors.
- Background preset cover-fit and `uBackgroundReady` gate verified.
- Background preset manifest check: one public entry, file exists.
- Background picker UI check: one thumbnail, Chinese title renders correctly.
- JS line counts: every `src/*.js` file <= 200 lines.

## Outputs

- `eval/evidence/siri-desktop.png` (idle), `siri-listening.png` (wave), `siri-thinking.png` (dots).
- `eval/evidence/siri-mobile.png`.
- `eval/evidence/render-check.json`.
- `eval/evidence/background-presets-check.json`.
- `eval/evidence/background-ui-check.json`.
- Local evidence files under `eval/evidence/`.

## State -> Reference Match

- idle vs `reference-siri27.png`: dark glass sphere + horizontal glint. Match.
- listening vs `reference-siri27-active.png`: spectral wave (audio-reactive). Match.
- thinking vs `reference-siri27-thinking.png`: six-dot ring inside the sphere. Match.

## Failures / Fixes During Work

- Effect passes initially rendered black inside the glass: `uResolution` for wave/dots was set to
  the full canvas size instead of the square effect-FBO size, squashing the field into a corner.
  Fixed by passing the effect-target resolution to those two passes (`src/uniforms.js`).

## Human Review

Residual taste calls for the user: glint brightness vs. reference, wave color saturation, dot-ring
size, and whether mic reactivity should be stronger.

## Baseline Decision

Reference baselines (`reference-siri27*.png`) were not modified. Output screenshots were refreshed
to the new glass-ball implementation. No thresholds were loosened to pass.

## Final Status

Pass.

## Notes

- `siri shader toy.txt` (the older 7XlXD4 dots shader) is no longer wired into the app; kept as a
  user-provided reference artifact.

## Source Attribution Documentation Update

- Added `docs/quality-rubric.md` as the content contract for public release documentation.
- Updated `README.md` to point shader/source attribution to `NOTICE.md` and explicitly mention Shadertoy provenance.
- Updated `NOTICE.md` to include `https://www.shadertoy.com/view/7XlXD4`.
- Kept the additional WebGL implementation reference in `NOTICE.md` because current local shader work still reflects adapted study material.
- Reviewed `README.md`, `NOTICE.md`, `LICENSE`, `CLAUDE.md`, and `docs/quality-rubric.md` for consistent non-commercial/source-available language.
- Final status: Pass; human review remains whether to keep broad provenance or rewrite the shader implementation before narrowing attribution.

## Bilingual Documentation Update

- Updated `README.md` and `NOTICE.md` with paired English and Chinese public-facing text.
- Added a Chinese explanatory section to `LICENSE`; the English license text remains governing.
- Updated `docs/quality-rubric.md` to require English/Chinese consistency for purpose, attribution, asset rights, and license restrictions.
- Updated `CLAUDE.md` to reflect bilingual public release documentation.
- Final status: Pass.
