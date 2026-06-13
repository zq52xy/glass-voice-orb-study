# Glass Voice Orb Project Map

## Purpose

This project is a non-commercial WebGL study of a liquid-glass voice orb. A transparent glass sphere refracts the selected image, carries a horizontal glint, and hosts a spectral wave or six-dot thinking ring inside it.

## Tech Stack

- Static HTML, CSS, and plain JavaScript (no build step, no framework).
- WebGL2 multi-pass pipeline: effect FBO -> scene FBO -> glass on the default framebuffer.
- Web Audio API for optional microphone-driven low/mid/high bands.
- Six local GLSL passes in `src/shaders/`, adapted from a shader reference for study.
- Background presets are registered in `src/backgrounds.js` and loaded from `assets/`.

## Modules

- `src/`: shader loading, GL plumbing, background presets, uniform dictionary, spring state, audio, render loop.
- `src/shaders/`: the six verbatim GLSL passes (vertex + background/wave/dots/compose/glass).
- `docs/`: content quality contract for bilingual public release documentation and attribution language.
- `eval/`: visual rendering contract, work contract, and local evidence.

## Licensing

- Public distribution is non-commercial study only.
- Keep attribution and restrictions in `NOTICE.md` and `LICENSE`.
- Root Git metadata keeps local-only assets ignored and text files normalized to LF.
- Public web deployment uses GitHub Pages from `main` branch `/`; `.nojekyll` disables Jekyll processing.

## Quality Gates

- Check `eval/visual-contract.md` before changing visible rendering behavior.
- Update touched file headers and the relevant `CLAUDE.md` map when responsibilities change.
- Evidence for visual changes lives under `eval/evidence/`.
