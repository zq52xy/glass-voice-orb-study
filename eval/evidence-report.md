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

## GitHub Publication Prep

- Initialized local Git repository on branch `main`.
- Added `.gitattributes` to normalize text files to LF and keep image formats binary.
- Confirmed `.local/`, `eval/evidence/`, and `diag-*.png` are ignored before publication.
- Secret scan command checked common token, password, private-key, and GitHub token patterns; no matches were returned.
- First local release commit created: `71a194b Initial non-commercial WebGL study release`.
- Installed GitHub CLI `gh` 2.94.0 through WinGet.
- GitHub CLI authentication completed for account `zq52xy`.
- Public repository created: https://github.com/zq52xy/glass-voice-orb-study
- Remote configured: `origin` -> `https://github.com/zq52xy/glass-voice-orb-study.git`.
- Default branch verified: `main`.
- Remote `main` initially verified at `1b43a007072fce5e97eaa83a8b78c89863d0df2c`.
- Final status: published.

## GitHub Pages Deployment

- Added `.nojekyll` at the repository root for GitHub Pages static serving.
- Updated `README.md` with the public online demo URL.
- Updated `eval/work-contract.md` with the GitHub Pages deployment addendum.
- Configured GitHub Pages source through GitHub API: `main` branch, `/` root.
- GitHub Pages API reported `status: built`, `https_enforced: true`.
- Published URL: https://zq52xy.github.io/glass-voice-orb-study/
- HTTP checks returned 200 for the homepage, `src/main.js`, `src/shaders/glass.frag.glsl`, and the public background `.webp`.
- Final status: deployed.

## Post-Deployment WebGL Warning Fix

- Initial online browser check reported WebGL feedback-loop warnings while the background image was still loading.
- Root cause: the temporary background fallback sampled `sceneTarget.texture` while rendering into `sceneTarget.framebuffer`.
- Fixed `src/renderer.js` to use a dedicated 1x1 fallback texture until the real background is ready.
- Bumped script cache query values in `index.html` from `v=9` to `v=10`.
- Updated `eval/work-contract.md` to require no feedback-loop warnings on GitHub Pages load.
- Verified Pages rebuilt successfully and `https://zq52xy.github.io/glass-voice-orb-study/?v=10` opened with no new console warning output.
- Final status: deployed and warning-free on page load.

## README Preview Media

- Generated public preview assets under `docs/media/` from the running local app using Playwright and Pillow/ffmpeg.
- Screenshot outputs:
  - `docs/media/desktop-idle.png` (1280x720)
  - `docs/media/desktop-listening.png` (1280x720)
  - `docs/media/desktop-thinking.png` (1280x720)
  - `docs/media/mobile-idle.png` (780x1688)
- GIF output: `docs/media/orb-demo.gif` (360x360, 52 frames, 217376 bytes).
- Capture report from the successful pass had no console warnings; the transient report file was not kept in public media.
- Updated `README.md` with the GIF, desktop state table, and mobile preview image.
- Final status: ready for GitHub README and Pages.

## z1han Visual Target Alignment

- Visual target inspected: https://www.z1han.com/shader/siriai
- Target screenshots captured locally under `eval/evidence/z1han-target/`:
  - `target-desktop-idle.png`
  - `target-desktop-hold.png`
  - `target-desktop-release.png`
  - `target-mobile-idle.png`
- Applied transfer constraints, not source-code copying:
  - public tuner restored as default-visible, with `?tuner=0` for clean captures;
  - background picker restored as the bottom-left thumbnail + upload control after user clarification;
  - bottom prompt restyled as a translucent pill;
  - wave shader restored toward the target spectrum-triangle color and white-clip bloom behavior;
  - wave softness/fill, glass refraction/highlight, and container defaults tuned toward the reference;
  - container defaults restored to the target source values: black `.25`, fade `1`, gauss `8`, strength `.9`.
- Preserved existing local state-machine changes: exposed `window.SIRI_STATE`, cross-faded wave/dots, and held `sharedResolved = 1` to avoid transition flicker.
- Regenerated README media after tuning:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 229592 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- JS line-count check: every `src/*.js` file is <= 200 lines; `src/renderer.js` is exactly 200 lines.
- Final status: first-pass effect alignment complete; background replacement remains a local feature rather than a target-page visual match.

## Background Picker Restore

- User clarified that the important alignment target is the orb special effect, not copying the target page background or removing local background replacement.
- Restored `src/backgrounds.js` to the bottom-left thumbnail picker with upload control.
- Kept the z1han-inspired effect tuning: softer liquid-glass container, stronger refraction/highlight, and cyan/purple/pink/warm wave palette.
- README media was regenerated after this restore.
- Final status: pass.

## Direct Target Source Inspection

- Inspected publicly served frontend source from `https://www.z1han.com/shader/siriai`.
- Confirmed the page exposes readable module files, including `/shader/siriai/js/main.js`, `/shader/siriai/js/renderer.js`, `/shader/siriai/js/state.js`, and shader modules under `/shader/siriai/js/shaders/`.
- Used the exposed source as visual/parameter reference only; no target wallpaper assets were imported.
- Restored tuning controls by default because the user needs live parameter review during effect matching.
- Updated local wave defaults toward the target `bloom` preset: strong band fill, white clipping, spectrum-triangle color, lower line thickness, and target glass/container defaults.
- Bumped script cache query values to `v=16`.
- Runtime verification wrote:
  - `eval/evidence/siri-v16-tuner.png`
  - `eval/evidence/siri-v16-idle-check.png`
- Runtime check confirmed default-visible tuner, bottom-left background picker, one preset thumbnail, upload control, `waveBandFill: 30000`, `waveWhiteClip: 1`, `containerStrength: 0.9`, and no console warnings/errors.
- Regenerated README media with `?tuner=0` clean capture:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 229592 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.

## Dialog Close Spring Follow-Up

- User reported that the moment where the input container returns to the glass ball felt stiff.
- Updated `src/state.js` so dialog opening and closing use separate spring options:
  - open remains springy for expansion;
  - close uses a faster, lower-damping spring for visible return energy.
- Updated `src/renderer.js` to allow a small controlled negative dialog morph during close instead of hard-clamping at `0`.
- Exposed `dialogCloseBounce` as `收起回弹` in the tuning panel.
- Updated `src/main.js` to blur focused dialog content before setting `aria-hidden`, removing the close-time accessibility warning.
- Bumped script cache query values to `v=20`.
- Runtime verification wrote:
  - `eval/evidence/siri-v20-close-spring.png`
  - `eval/evidence/siri-v20-close-spring-check.json`
- Runtime check confirmed:
  - close spring raw value crossed below zero (`minRaw: -0.1289`);
  - rendered panel width compressed below idle width before settling (`148.74` vs idle `171.58`);
  - final dialog value returned near zero;
  - ask, reply, and long-press listening paths still work;
  - browser console warnings/errors were empty.
- JS line-count check: every `src/*.js` file remains <= 200 lines.
- Final status: pass.

## Dialog Close Pause Removal

- User clarified that the return-to-glass-ball moment should not pause at the compressed point.
- Root cause: v20 rendered close motion used a hard negative clamp, so the spring could move below the visual limit while the rendered shape stayed pinned at the same minimum size.
- Updated `src/renderer.js` to replace the hard close clamp with continuous `tanh` soft compression.
- Updated `src/state.js` to use a smaller, faster close spring (`response: 0.3`, `dampingRatio: 0.78`) so the return keeps energy without holding.
- Reduced default `dialogCloseBounce` from `0.055` to `0.032` and kept it tunable as `收起回弹`.
- Bumped script cache query values to `v=21`.
- Runtime verification wrote:
  - `eval/evidence/siri-v21-close-no-pause.png`
  - `eval/evidence/siri-v21-close-no-pause-check.json`
- Runtime check confirmed:
  - close spring still crossed below zero (`minRaw: -0.0187`);
  - rendered compression is lighter (`minPanelW: 161.13` vs idle `171.43`);
  - minimum-size hold was removed (`maxConsecutiveNearMin: 1`);
  - final dialog value returned to zero;
  - ask, reply, and long-press listening paths still work;
  - browser console warnings/errors were empty.
- Final status: pass.

## Dialog Height And Preset Restore

- User requested the default dialog height be set to `110` and reported one preset wallpaper was missing.
- Confirmed the public preset list had three entries while `.local/open-source-excluded/assets/` contained one additional duplicated PNG pair:
  - `aurora-glass-ball.png`
  - `玻璃球-0401-14-2.png`
- Hash check confirmed both local PNGs are identical, so only one compressed public asset was produced.
- Generated `assets/aurora-glass-ball.webp` from the local authorized PNG source; final size is `393614` bytes.
- Updated `src/backgrounds.js` to expose four presets:
  - `雪街`
  - `雪夜`
  - `极光`
  - `AI 面孔`
- Updated `src/renderer.js` fallback dialog height to `110`.
- Updated `src/tuner.js` default `dialogHeight` to `110`.
- Bumped script cache query values to `v=22`.
- Runtime verification wrote:
  - `eval/evidence/siri-v22-dialog-height-110.png`
  - `eval/evidence/siri-v22-aurora-preset.png`
  - `eval/evidence/siri-v22-height-preset-check.json`
- Runtime check confirmed:
  - four preset thumbnails plus upload;
  - restored `aurora-glass-ball.webp` preset selected and loaded with `background.ready === 1`;
  - ask panel size `500.08 x 150.00`, matching `dialogHeight 110` plus `20px` top/bottom margin;
  - tuning panel `window.SIRI_PARAMS.dialogHeight === 110`;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=22`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 191746 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.

## Projection And Default Wallpaper

- User provided a reference image emphasizing:
  - bottom caustic projection under the glass;
  - external feathered black shadow outside the glass;
  - the newly added wallpaper should become the default image.
- Updated `src/backgrounds.js` so `aurora-glass-ball.webp` / `极光` is the first and default preset.
- Updated `src/shaders/glass.frag.glsl` with shape-aware projection math:
  - `outsideProjection()` adds an exterior feathered black projection around the current glass shape;
  - the same function adds a warm white/gold bottom caustic with a small cool core;
  - projection uses `uPanelOrigin`, `uPanelSize`, `uMarginPx`, and `uCornerRadius`, so it follows both ball and dialog morph states.
- Updated `src/tuner.js` and `src/uniforms.js` to expose:
  - `shadowAmount` / `外部阴影` default `0.46`;
  - `causticAmount` / `底部焦散` default `0.56`.
- Bumped script cache query values to `v=23`.
- Runtime verification wrote:
  - `eval/evidence/siri-v23-caustic-shadow-default.png`
  - `eval/evidence/siri-v23-caustic-shadow-dialog.png`
  - `eval/evidence/siri-v23-caustic-shadow-check.json`
- Runtime check confirmed:
  - default background `./assets/aurora-glass-ball.webp`;
  - active preset title `极光`;
  - four presets remain available;
  - shadow and caustic controls exist in the tuner;
  - dialog morph still opens with a `500 x 150` panel;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=23`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 289710 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.

## Round Caustic And Projection Offset Controls

- User clarified that the bottom caustic should not be a flat strip; it should be rounder, similar to the external shadow, and both shadow/caustic need vertical-position controls.
- Updated `src/shaders/glass.frag.glsl`:
  - caustic now uses the glass shape short edge as its radius base instead of stretching across the full panel width;
  - caustic is now a round/near-round warm light pool with a smaller cool core;
  - exterior shadow now includes a circular soft-disk component in addition to the rim feather;
  - both projections read vertical offsets from uniforms.
- Updated `src/tuner.js` with:
  - `shadowOffsetY` / `阴影上下`;
  - `causticOffsetY` / `焦散上下`.
- Updated `src/uniforms.js` to pass `uShadowOffsetY` and `uCausticOffsetY`.
- Bumped script cache query values to `v=24`.
- Runtime verification wrote:
  - `eval/evidence/siri-v24-round-caustic-default.png`
  - `eval/evidence/siri-v24-round-caustic-dialog.png`
  - `eval/evidence/siri-v24-round-caustic-check.json`
- Runtime check confirmed:
  - default background remained `极光`;
  - four presets remained available;
  - ask dialog still opens with a `500 x 150` panel;
  - `阴影上下` and `焦散上下` controls exist;
  - controls updated `window.SIRI_PARAMS.shadowOffsetY` and `window.SIRI_PARAMS.causticOffsetY`;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=24`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 304202 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.

## Unified Shape Projection

- User clarified that the external shadow vertical offset was only moving the newly added shadow layer, while the prior feather still behaved like a container expansion; the new caustic/shadow also did not follow the morphing container together.
- Updated `src/shaders/glass.frag.glsl`:
  - replaced the split rim-plus-disk shadow with one shifted rounded-shape distance field;
  - made `shadowOffsetY` move the entire projected shadow field instead of only one sub-layer;
  - kept the caustic centered under the same morphing container and based it on the short edge, with only limited aspect stretch for dialog mode;
  - lowered the default exterior shadow strength to reduce the black-block look in dialog mode.
- Updated `src/tuner.js` and `src/uniforms.js` default `shadowAmount` to `0.38`.
- Bumped script cache query values to `v=25`.
- Runtime verification wrote:
  - `eval/evidence/siri-v25-shape-projection-idle.png`
  - `eval/evidence/siri-v25-shape-projection-dialog.png`
  - `eval/evidence/siri-v25-shape-projection-check.json`
- Runtime check confirmed:
  - default background is `aurora-glass-ball.webp`;
  - active preset title is `极光`;
  - four presets remain available;
  - ask dialog still opens with a `500 x 150` panel;
  - `shadowOffsetY`, `causticOffsetY`, `shadowAmount`, and `causticAmount` are present;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=25&tuner=0`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 683019 bytes)
- Capture report from the successful pass had no console warnings:
  - `eval/evidence/readme-media-v25-capture-report.json`
- Final status: pass.

## Projection Default Parameters

- User supplied approved tuning values from the tuner panel and requested using them as defaults.
- Updated `src/tuner.js` defaults:
  - `shadowAmount` / `外部阴影`: `0.4`;
  - `causticAmount` / `底部焦散`: `1.6`;
  - `shadowOffsetY` / `阴影上下`: `0.3`;
  - `causticOffsetY` / `焦散上下`: `-1`.
- Updated `src/uniforms.js` fallback values to the same four numbers.
- Bumped script cache query values to `v=26`.
- Runtime verification wrote:
  - `eval/evidence/siri-v26-default-params-idle.png`
  - `eval/evidence/siri-v26-default-params-dialog.png`
  - `eval/evidence/siri-v26-default-params-check.json`
- Runtime check confirmed:
  - all four `window.SIRI_PARAMS` values match the requested defaults;
  - all four tuner slider values match the requested defaults;
  - default background remains `aurora-glass-ball.webp`;
  - active preset title remains `极光`;
  - four presets remain available;
  - ask dialog still opens with a `500 x 150` panel;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=26&tuner=0`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 678161 bytes)
- Capture report from the successful pass had no console warnings:
  - `eval/evidence/readme-media-v26-capture-report.json`
- Final status: pass.

## Reply Copy And Projection Boundary Softness

- Applied browser annotation for `p#siri-answer`:
  - reply text changed from `我在这里。` to `我是智能助手，有什么可以帮到您？`;
  - reply answer padding left/right changed from `30px` to `0px`;
  - visible reply answer opacity changed from `1` to `0.9`.
- Updated `src/main.js` so the real listening/reply flow uses a shared `DEFAULT_REPLY` string.
- Updated `src/styles.css` so reply opacity is separate from ask opacity.
- Added projection boundary softness:
  - `src/tuner.js` exposes `projectionSoftness` / `边界柔化`;
  - `src/uniforms.js` passes `uProjectionSoftness`;
  - `src/shaders/glass.frag.glsl` uses `uProjectionSoftness` to widen the glass edge alpha blend and soften the shadow/bright-interior boundary.
- Default `projectionSoftness` is `4.2` with range `1-12` and step `0.1`.
- Bumped script cache query values to `v=27`.
- Runtime verification wrote:
  - `eval/evidence/siri-v27-reply-softness.png`
  - `eval/evidence/siri-v27-reply-softness-check.json`
- Runtime check confirmed:
  - actual long-press reply flow displays `我是智能助手，有什么可以帮到您？`;
  - answer padding left/right are `0px`;
  - answer opacity is `0.9`;
  - `边界柔化` slider exists with value `4.2`, range `1-12`, and step `0.1`;
  - `uProjectionSoftness` uniform value is `4.2` at DPR 1;
  - ask dialog still opens with a `500 x 150` panel;
  - browser console warnings/errors were empty.
- Regenerated README media from `?media=1&v=27&tuner=0`:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 670534 bytes)
- Capture report from the successful pass had no console warnings:
  - `eval/evidence/readme-media-v27-capture-report.json`
- Final status: pass.

## Dialog Morph Restore

- User pointed out the reference includes a glass morph into a UI dialog container.
- Continued source-based comparison with target `ask-flow.js`, `state.js`, `renderer.js`, and `siri27.css`.
- Added a local `dialog` state spring so the WebGL panel morphs from a circular orb into a `460x150` glass dialog container.
- Updated renderer layout to interpolate panel width/height and effect FBO size during the morph.
- Added center DOM overlay for ask/reply text inside the glass material.
- Updated interaction flow:
  - short click opens the ask container;
  - long press enters listening;
  - submit or voice release folds into thinking, then expands into reply.
- Exposed `dialogWidth` and `dialogHeight` in the tuning panel.
- Bumped script cache query values to `v=18`.
- Runtime verification wrote:
  - `eval/evidence/siri-v18-dialog-ask.png`
  - `eval/evidence/siri-v18-dialog-reply.png`
- Runtime check confirmed short click opens ask dialog, submit folds into thinking and expands into reply, long press still enters listening, and no console warnings/errors.
- Regenerated README media:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 195463 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.

## Background Presets And Dialog Polish

- Restored two older personal background presets from `.local/open-source-excluded/assets/` into `assets/`:
  - `assets/0808bb244676405.699d0d0469a67.webp`
  - `assets/4d53de244676405.699d0d046c4dc.webp`
- Updated `src/backgrounds.js` to expose three public personal presets plus upload.
- Added orb breathing scale via renderer layout, with `breathAmount` and `breathSpeed` exposed in the tuning panel.
- Increased dialog spring dynamics by lowering dialog damping and allowing slight visual overshoot.
- Updated ask container styling toward the supplied reference image:
  - left gradient glowing caret;
  - right microphone line icon;
  - dialog opacity breathing;
  - transparent native caret so the custom glow carries the cursor signal.
- Bumped script cache query values to `v=19`.
- Runtime verification wrote:
  - `eval/evidence/siri-v19-idle-bg-presets.png`
  - `eval/evidence/siri-v19-ask-polish.png`
  - `eval/evidence/siri-v19-reply-polish.png`
- Runtime check confirmed default background `雪街`, three thumbnail presets, upload input, background texture ready, orb breathing panel-size delta, ask dialog focus, gradient glow caret, mic icon, transparent native caret, reply flow, and no console warnings in media capture.
- Regenerated README media:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 200388 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Updated README/NOTICE/docs wording from singular background asset to plural background presets while preserving non-commercial/no-standalone-reuse restrictions.
- Final status: pass.

## Target Phase And Glass Highlight Follow-Up

- Continued direct source comparison against the target frontend modules.
- Found two remaining effect-code deltas:
  - target `state.js` advances `wavePhase` from state using base speed `-2.5` and audio drive up to `-12`;
  - target `glass-composite.frag.glsl` uses pure white rim highlight, while the local version still had an added cyan/pink rim tint.
- Updated local `state.js`, `main.js`, and `uniforms.js` so wave phase is state/audio-driven instead of raw render time.
- Updated `src/shaders/glass.frag.glsl` to remove the local colored rim and use the target-style white highlight only.
- Bumped script cache query values to `v=17`.
- Runtime verification wrote `eval/evidence/siri-v17-phase-glass.png`.
- Runtime check confirmed idle mode, default-visible tuner, bottom-left background picker, upload control, changing `wavePhase`, and no console warnings/errors.
- Regenerated README media with `?tuner=0&v=17` clean capture:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 256718 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- Final status: pass.
