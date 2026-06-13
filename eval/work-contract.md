# Siri Effect Work Contract

## Work Target

Prepare the project for non-commercial public release by keeping a single authorized background preset and excluding local-only assets.

## Parent Contract

`eval/visual-contract.md`

## Core User Paths

1. Load the page and see the single public preset background with the centered glass sphere.
2. Confirm the bottom-left background picker exposes only the public preset plus upload control.
3. Press and release to verify listening/thinking states still work after the preset update.

## Done Definition

- `src/backgrounds.js` references only the single public preset file.
- Extra personal background images are excluded from the future GitHub tree.
- Script cache query values are bumped so the in-app browser gets the latest preset manifest.
- Desktop and mobile screenshots are refreshed.
- Evidence report records the background preset update and checks.

## Invariants

- Do not alter the extracted `src/shaders/*.glsl` visual math for this background-manifest change.
- The glass sphere must remain centered and circular.
- Background images must use cover-fit and preserve the existing upload path.
- Keep code-native text and controls.

## Gates

- Browser console has no errors.
- Background preset source check reports no missing files.
- Canvas pixel sampling reports nonblank output.
- Screenshots exist for desktop and mobile.
- Interaction path can be triggered with pointer or keyboard.

## Evidence Required

- `eval/evidence/siri-desktop.png`
- `eval/evidence/siri-mobile.png`
- `eval/evidence/render-check.json`
- `eval/evidence-report.md`

## Human Review

The user should review whether the default preset and preset ordering are the desired art direction.

## Baseline Policy

No reference baseline update is allowed for this manifest-only background preset change.
