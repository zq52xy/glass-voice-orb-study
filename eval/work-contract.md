# Siri Effect Work Contract

## Work Target

Prepare the project for non-commercial public release with authorized personal background presets and no target-page wallpaper assets.

## Parent Contract

`eval/visual-contract.md`

## Core User Paths

1. Load the page and see an authorized public preset background with the centered glass sphere.
2. Confirm the bottom-left background picker exposes the restored public presets plus upload control.
3. Press and release to verify listening/thinking states still work after the preset update.

## Done Definition

- `src/backgrounds.js` references only authorized personal preset files.
- Target-page wallpaper assets are excluded from the future GitHub tree.
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

- Keep only authorized personal background presets; do not import target-page wallpapers.
- Keep the background picker as the bottom-left thumbnail + upload control; only the orb effect and bottom hint pill are aligned toward the target.
- Keep the tuning panel exposed by default while effect alignment is still being reviewed; allow `?tuner=0` for clean captures.
- Tune the orb toward transparent liquid glass: softer container, stronger refraction, thin edge highlight, cyan/purple/pink/warm wave band.
- Restore the target-style glass morph path: click opens an input dialog container, submit/voice release folds into thinking, then expands into a reply container.
- Preserve the existing idle/listening/thinking state model and the current user-provided transition smoothing.

### Gates

- Target reference screenshots exist under `eval/evidence/z1han-target/`.
- README media is regenerated from the current app after tuning.
- Browser capture report has no console warnings.
- `src/*.js` files remain within the project line-count limit.

## Dialog Close Spring Addendum

### Work Target

Make the input/reply container feel springy when it collapses back into the glass ball, avoiding a hard clamp at the orb boundary.

### Done Definition

- Closing from ask/reply uses a dedicated dialog-close spring, not the same clamp-only path as opening.
- Renderer allows a small controlled close overshoot before settling back to the circular orb.
- The close overshoot is tunable without breaking existing width/height controls.
- Script cache query values are bumped so GitHub Pages receives the updated behavior.

### Gates

- Runtime check confirms dialog value crosses below zero during close and the rendered panel size settles back to the idle ball.
- Runtime check confirms the rendered close curve does not plateau at the minimum compressed size.
- Short-click ask, close-to-idle, submit-to-reply, and long-press listening paths still work.
- Browser capture has no console warnings or WebGL errors.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v20-close-spring.png`
- `eval/evidence/siri-v20-close-spring-check.json`
- `eval/evidence/siri-v21-close-no-pause.png`
- `eval/evidence/siri-v21-close-no-pause-check.json`
- `eval/evidence-report.md`

## Dialog Height And Preset Restore Addendum

### Work Target

Set the default dialog container height to `110` and restore the missing authorized preset wallpaper.

### Done Definition

- Renderer fallback `dialogHeight` is `110`.
- Tuning panel default `dialogHeight` is `110`.
- Background picker exposes four authorized presets plus upload.
- The restored preset is published as a compressed WebP asset, not the original large local PNG.
- Script cache query values are bumped so GitHub Pages receives the updated defaults.

### Gates

- Runtime check confirms the ask panel height is approximately `110 + margin * 2`.
- Runtime check confirms four preset thumbnails and the restored preset loads with `background.ready === 1`.
- Browser console has no warnings or errors.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v22-dialog-height-110.png`
- `eval/evidence/siri-v22-aurora-preset.png`
- `eval/evidence/siri-v22-height-preset-check.json`

## Projection And Default Wallpaper Addendum

### Work Target

Use the newly added `极光` preset as the default wallpaper and add the reference-style bottom caustic projection plus external feathered black shadow to the glass surface.

### Done Definition

- `aurora-glass-ball.webp` is the first/default background preset.
- The glass shader draws a soft black exterior projection around the shape.
- The glass shader draws a warm bottom caustic projection below the shape.
- Shadow and caustic strength are exposed in the tuning panel.
- The projection follows both the idle ball and the expanded dialog shape.
- Script cache query values are bumped so GitHub Pages receives the updated shader.

### Gates

- Runtime check confirms default background is `极光`.
- Runtime check confirms four presets remain available.
- Runtime check confirms shadow/caustic tuning controls exist.
- Idle and dialog screenshots exist for review.
- Browser console has no warnings or errors.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v23-caustic-shadow-default.png`
- `eval/evidence/siri-v23-caustic-shadow-dialog.png`
- `eval/evidence/siri-v23-caustic-shadow-check.json`

## Round Caustic And Projection Offset Addendum

### Work Target

Make the bottom caustic projection rounder, closer to the external soft shadow shape, and expose vertical position controls for both the exterior shadow and caustic.

### Done Definition

- Caustic sizing is based on the glass short edge instead of being stretched by panel width.
- Exterior shadow includes a circular soft-disk component.
- Tuning panel exposes vertical offset controls for shadow and caustic.
- Uniforms pass both offset controls to the glass shader.
- Script cache query values are bumped so GitHub Pages receives the updated shader.

### Gates

- Runtime check confirms `阴影上下` and `焦散上下` controls exist and update `window.SIRI_PARAMS`.
- Idle and dialog screenshots exist for review.
- Browser console has no warnings or errors.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v24-round-caustic-default.png`
- `eval/evidence/siri-v24-round-caustic-dialog.png`
- `eval/evidence/siri-v24-round-caustic-check.json`

## Unified Shape Projection Addendum

### Work Target

Make the external shadow and bottom caustic behave like projections of the same morphing glass container, instead of separate fixed layers that drift or flatten during the ball-to-dialog transition.

### Done Definition

- The external shadow is based on the shifted rounded-shape distance field, so vertical offset moves the whole projected shadow.
- The old rim feather and newer soft shadow are unified into one shape-driven projection.
- The bottom caustic follows the same container center/short-edge basis and uses only limited aspect stretch during dialog morph.
- Existing shadow/caustic strength and vertical-position controls remain exposed.
- Script cache query values are bumped so GitHub Pages receives the updated shader.

### Gates

- Runtime check confirms the default `aurora-glass-ball.webp` background and four presets.
- Runtime check confirms the ask dialog still opens with the `500 x 150` panel.
- Runtime check confirms `shadowOffsetY`, `causticOffsetY`, `shadowAmount`, and `causticAmount` are present.
- Idle and dialog screenshots exist for review.
- Browser capture has no console warnings or errors.
- README media is regenerated from the current app.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v25-shape-projection-idle.png`
- `eval/evidence/siri-v25-shape-projection-dialog.png`
- `eval/evidence/siri-v25-shape-projection-check.json`
- `eval/evidence/readme-media-v25-capture-report.json`

## Projection Default Parameters Addendum

### Work Target

Use the user-approved tuning values as the default projection parameters for the glass effect.

### Done Definition

- `shadowAmount` defaults to `0.4`.
- `causticAmount` defaults to `1.6`.
- `shadowOffsetY` defaults to `0.3`.
- `causticOffsetY` defaults to `-1`.
- Tuner defaults and shader uniform fallbacks use the same values.
- Script cache query values are bumped so GitHub Pages receives the updated defaults.

### Gates

- Runtime check confirms all four `window.SIRI_PARAMS` values match the requested defaults.
- Runtime check confirms all four tuner slider values match the requested defaults.
- Runtime check confirms the ask dialog still opens with the `500 x 150` panel.
- Idle and dialog screenshots exist for review.
- Browser capture has no console warnings or errors.
- README media is regenerated from the current app.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v26-default-params-idle.png`
- `eval/evidence/siri-v26-default-params-dialog.png`
- `eval/evidence/siri-v26-default-params-check.json`
- `eval/evidence/readme-media-v26-capture-report.json`

## Reply Copy And Projection Boundary Softness Addendum

### Work Target

Apply the browser annotation for the reply text and reduce the visible hard edge between the exterior shadow and the bright glass interior, with a tunable softness control.

### Done Definition

- Default reply text changes from `我在这里。` to `我是智能助手，有什么可以帮到您？`.
- Reply answer padding is `0px` left/right.
- Reply answer visible opacity is `0.9`.
- Glass edge alpha uses a tunable `projectionSoftness` value.
- The tuning panel exposes `projectionSoftness` as `边界柔化`.
- Uniform fallback and tuner default for `projectionSoftness` are both `4.2`.
- Script cache query values are bumped so GitHub Pages receives the updated behavior.

### Gates

- Runtime check confirms the real reply flow displays the new copy.
- Runtime check confirms answer padding left/right are `0px` and opacity is `0.9`.
- Runtime check confirms the `边界柔化` slider exists with value `4.2`, range `1-12`, and step `0.1`.
- Runtime check confirms `uProjectionSoftness` is passed to the shader.
- Browser capture has no console warnings or errors.
- README media is regenerated from the current app.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v27-reply-softness.png`
- `eval/evidence/siri-v27-reply-softness-check.json`
- `eval/evidence/readme-media-v27-capture-report.json`

## Reply Padding Cache Bust Addendum

### Work Target

Ensure the already-updated reply padding rule reaches GitHub Pages users by cache-busting the stylesheet, not only the scripts.

### Done Definition

- `index.html` loads `src/styles.css` with a version query.
- Script query values are bumped consistently with the stylesheet query.
- The source `.siri-answer` padding rule remains `0`.
- No temporary browser annotation attributes are copied into source.

### Gates

- Runtime check confirms the loaded stylesheet URL includes `styles.css?v=28`.
- Runtime check confirms the real reply flow has padding left/right `0px`.
- Runtime check confirms the real reply flow keeps opacity `0.9`.
- Runtime check confirms reply text remains `我是智能助手，有什么可以帮到您？`.
- Browser capture has no console warnings or errors.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v28-css-cache-bust-reply.png`
- `eval/evidence/siri-v28-css-cache-bust-check.json`

## README Media Refresh Addendum

### Work Target

Refresh the GitHub README and curated preview media so the repository landing page reflects the current `v=28` glass orb, reply container, and tuning surface.

### Done Definition

- README preview text states the assets are captured from the current GitHub Pages build with the tuning panel hidden.
- README desktop preview includes idle, listening, thinking, and reply states.
- README feature list mentions the morphing reply container.
- README feature list mentions tunable shadow, caustic, offsets, and boundary softness.
- README GIF is regenerated from the current app and includes the reply container segment.
- README screenshots are regenerated from the current app.
- Public media remains under `docs/media/`.

### Gates

- Capture report confirms `?media=1&v=28&tuner=0`.
- Capture report confirms `styles.css?v=28`.
- Capture report has no console warnings or errors.
- GIF dimensions and frame count are recorded.
- README references only existing media files.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/readme-media-v28-capture-report.json`
- `docs/media/desktop-idle.png`
- `docs/media/desktop-listening.png`
- `docs/media/desktop-thinking.png`
- `docs/media/desktop-reply.png`
- `docs/media/mobile-idle.png`
- `docs/media/orb-demo.gif`

## Solid Background Presets Addendum

### Work Target

Add white and black solid backgrounds to the existing preset picker while preserving the current default background and public README media.

### Done Definition

- White and black backgrounds are stored as local assets under `assets/`.
- `src/backgrounds.js` exposes the two new presets after the existing personal presets.
- The default background remains `极光`.
- Script and stylesheet query values are bumped to `v=30`.
- README feature wording covers both personal and solid-color presets.
- README screenshots and GIF are regenerated with the updated preset strip.

### Gates

- Runtime check confirms six preset thumbnails: `极光`, `雪街`, `雪夜`, `AI 面孔`, `白色`, `黑色`.
- Runtime check confirms white and black preset selections load with `background.ready === 1`.
- Browser capture has no console warnings or errors.
- GIF dimensions and frame count are recorded.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v30-solid-background-presets-check.json`
- `eval/evidence/siri-v30-solid-background-presets.png`
- `eval/evidence/siri-v30-white-background.png`
- `eval/evidence/siri-v30-black-background.png`
- `eval/evidence/readme-media-v30-capture-report.json`
- `docs/media/desktop-idle.png`
- `docs/media/desktop-listening.png`
- `docs/media/desktop-thinking.png`
- `docs/media/desktop-reply.png`
- `docs/media/mobile-idle.png`
- `docs/media/orb-demo.gif`

## Light Boundary Softness Retarget Addendum

### Work Target

Retarget the exposed softness control away from the glass container outline and onto the visible light/shadow boundary indicated by the user screenshot.

### Done Definition

- Glass shape alpha returns to the original fixed `smoothstep(-1.0, 1.0, d)` edge.
- `projectionSoftness` no longer softens the whole capsule outline.
- `projectionSoftness` softens the white highlight band edge.
- `projectionSoftness` softens exterior shadow and caustic lower-mask transitions.
- Tuning label changes from `边界柔化` to `光影边界`.
- Script and stylesheet query values are bumped to `v=29`.
- README feature wording uses light/shadow boundary softness.
- README media is regenerated from the current app.

### Gates

- Runtime check confirms the ask container opens and still uses the `500 x 150` panel.
- Runtime check confirms the `光影边界` slider exists with value `4.2`, range `1-12`, and step `0.1`.
- Runtime check confirms shader source restored fixed alpha edge and removed alpha-edge softness.
- Runtime check confirms shader source applies `uProjectionSoftness` to highlight/projection math.
- Browser capture has no console warnings or errors.
- GIF dimensions and frame count are recorded.
- `src/*.js` files remain within the project line-count limit.

### Evidence Required

- `eval/evidence/siri-v29-light-boundary-ask.png`
- `eval/evidence/siri-v29-light-boundary-check.json`
- `eval/evidence/readme-media-v29-capture-report.json`
- `docs/media/desktop-idle.png`
- `docs/media/desktop-listening.png`
- `docs/media/desktop-thinking.png`
- `docs/media/desktop-reply.png`
- `docs/media/mobile-idle.png`
- `docs/media/orb-demo.gif`
