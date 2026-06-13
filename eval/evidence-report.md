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
  - public tuner hidden unless `?tuner=1`;
  - background picker restored as the bottom-left thumbnail + upload control after user clarification;
  - bottom prompt restyled as a translucent pill;
  - wave palette shifted toward cyan, purple, pink, and warm white;
  - wave softness/intensity and glass refraction/highlight tuned toward the reference;
  - container darkening reduced for a more transparent liquid-glass sphere.
- Preserved existing local state-machine changes: exposed `window.SIRI_STATE`, cross-faded wave/dots, and held `sharedResolved = 1` to avoid transition flicker.
- Regenerated README media after tuning:
  - `docs/media/desktop-idle.png`
  - `docs/media/desktop-listening.png`
  - `docs/media/desktop-thinking.png`
  - `docs/media/mobile-idle.png`
  - `docs/media/orb-demo.gif` (360x360, 52 frames, 217376 bytes)
- Capture report from the successful pass had no console warnings; transient JSON report was removed from public media.
- JS line-count check: every `src/*.js` file is <= 200 lines; `src/renderer.js` is exactly 200 lines.
- Final status: first-pass effect alignment complete; background replacement remains a local feature rather than a target-page visual match.

## Background Picker Restore

- User clarified that the important alignment target is the orb special effect, not copying the target page background or removing local background replacement.
- Restored `src/backgrounds.js` to the bottom-left thumbnail picker with upload control.
- Kept the z1han-inspired effect tuning: softer liquid-glass container, stronger refraction/highlight, and cyan/purple/pink/warm wave palette.
- README media was regenerated after this restore.
- Final status: pass.
