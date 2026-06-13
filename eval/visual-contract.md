# Siri Visual Rendering Contract

## Target

Faithfully preserve the adapted glass-orb shader pipeline: a transparent
glass sphere floating over a selectable background preset. The sphere refracts the selected image and carries a
horizontal highlight glint; a dark container inside the glass hosts the Siri effect — a spectral
wave (idle/listening) or a six-dot ring (thinking). The glass itself is uncolored: it only
refracts and highlights, so the photo stays pure outside the sphere.

## Provenance

Shaders and uniform values are adapted from a study reference. Public attribution and distribution
restrictions live in `NOTICE.md` and `LICENSE`.

## Surface

- `index.html` full-screen canvas + bottom status control.
- `src/shaders/*.glsl` six real passes (vertex, background, wave, dots, compose, glass).
- Background preset images under `assets/`, selected through `src/backgrounds.js`.
- Viewports: desktop square ~1250x1250, landscape ~1440x900, mobile ~390x844.
- Interaction states: idle, press-and-hold listening, release thinking, return to idle.

## Pipeline (must hold)

1. effect FBO (square): wave (idle/listening) or dots (thinking).
2. scene FBO (full canvas): effect composited over the dark container.
3. default framebuffer: glass pass refracts the scene through a centered circular shape and
   composites over the background photo.

## Core User Paths

1. Open the page and see a glass sphere over the default background preset with a horizontal glint.
2. Hold pointer / touch / Space / Enter to enter listening; a spectral wave fills the sphere,
   reacting to microphone (or demo) amplitude.
3. Release to enter thinking; a six-dot ring appears inside the sphere, then returns to idle.

## Invariants

- The glass sphere stays circular (never stretched) and centered across all viewports.
- Outside the sphere shows only the background photo; the dark container never spills past the glass.
- Glass refracts and highlights only — it must not tint or recolor the scene.
- Selected background preset loads via cover-fit before the glass reads it (fallback gradient until ready).
- Bottom status text stays readable and does not overlap the sphere.
- No console shader compile/link errors.

## Gates

- Browser screenshots for desktop idle/listening/thinking and mobile idle.
- Console error check after load and after interaction.
- Circular-undistorted check across square, landscape, and mobile viewports.
- Interaction test for press/release state transitions (hold then release, not instant click —
  springs need transition time).

## Warnings

- Microphone permission may be unavailable; demo amplitude fallback is acceptable.
- WebGL2 and a square RGBA8 FBO path are required.
- Spring transitions take time; capture state screenshots after the transition settles.

## Review

Human review judges: glass realism, glint intensity, wave color/character, dot-ring taste, and
overall similarity to the three reference screenshots.

## Evidence

Output screenshots and checks live under `eval/evidence/`; the reference baselines are
`reference-siri27.png`, `reference-siri27-active.png`, `reference-siri27-thinking.png`.

## Baseline Policy

Reference screenshots may be replaced only when the target reference or requested art direction
changes. Output screenshots are refreshed each verification pass. Failed checks must be diagnosed
before any baseline or threshold change.
