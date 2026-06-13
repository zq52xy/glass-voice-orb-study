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

## GitHub Pages Deployment Addendum

### Work Target

Deploy the published static WebGL app through GitHub Pages from the `main` branch root.

### Done Definition

- GitHub Pages source is configured as `main` branch `/`.
- `.nojekyll` exists at the repository root so GitHub Pages does not run Jekyll processing.
- README includes the public Pages URL.
- Published URL loads `index.html` and the relative `src/` and `assets/` resources.
- Published render avoids framebuffer/texture feedback-loop warnings during initial background loading.
- README includes curated public screenshots and a compact GIF generated from the running app.

### Gates

- GitHub Pages API reports a configured site URL.
- Published URL responds with the public README/site shell after deployment.
- Browser console has no WebGL feedback-loop warnings on page load.
- Preview media exists under `docs/media/` and does not include local-only evidence artifacts.
- Evidence report records the URL and final status.

## z1han Target Alignment Addendum

### Work Target

Align the local glass-orb look and interaction chrome toward `https://www.z1han.com/shader/siriai` without copying its source code or wallpaper assets.

### Transfer Constraints

- Keep only one authorized public background image; do not import target-page wallpapers.
- Keep the background picker as the bottom-left thumbnail + upload control; only the orb effect and bottom hint pill are aligned toward the target.
- Keep the tuning panel exposed by default while effect alignment is still being reviewed; allow `?tuner=0` for clean captures.
- Tune the orb toward transparent liquid glass: softer container, stronger refraction, thin edge highlight, cyan/purple/pink/warm wave band.
- Preserve the existing idle/listening/thinking state model and the current user-provided transition smoothing.

### Gates

- Target reference screenshots exist under `eval/evidence/z1han-target/`.
- README media is regenerated from the current app after tuning.
- Browser capture report has no console warnings.
- `src/*.js` files remain within the project line-count limit.
