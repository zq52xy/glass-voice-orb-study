# Source Module Map

## Members

- `shaders.js`: loads the six `shaders/*.glsl` passes (one vertex + five fragments).
- `pipeline.js`: low-level GL plumbing — program compile, FBO render targets, uniform/texture upload.
- `uniforms.js`: per-pass uniform dictionary holding the 1:1 siri27 values; no GL, no animation.
- `state.js`: spring state machine (idle/listening/thinking/dialog) ported from siri27; derives channels.
- `renderer.js`: owns the effect->scene->glass draw order, responsive glass layout, background image, and resize.
- `backgrounds.js`: owns the selectable background preset manifest, picker UI, WWDC26 second preset, and upload path.
- `tuner.js`: default-visible tuning panel for shared visual/layout/caret-glow parameters; hide with `?tuner=0`.
- `audio.js`: microphone permission, FFT low/mid/high band split, and demo fallback.
- `main.js`: gesture wiring, dialog overlay flow, tuner layout/caret-glow sync, frame loop, and renderer/state/audio coordination.
- `styles.css`: page layout, full-screen canvas, responsive dialog/control overlays, accessibility states.
- `shaders/`: the six verbatim GLSL passes extracted from the siri27 bundle.

## Boundaries

- Visual math stays in `shaders/*.glsl`; JS never re-implements shader logic.
- Real uniform values stay in `uniforms.js`; renderer only assembles and uploads them.
- Spring/animation math stays in `state.js`; renderer reads derived channels, does not animate.
- GL resource lifecycle stays in `pipeline.js` + `renderer.js`.
- Browser audio permissions and band sampling stay in `audio.js`.
- UI state transitions stay in `main.js`.
- Background preset additions or removals stay in `backgrounds.js`.
