#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform sampler2D uEffectTexture;
uniform vec2 uCanvasSize;
uniform vec2 uEffectOrigin;
uniform vec2 uEffectSize;
uniform float uContainer;        // dark-container strength (0 = off)
uniform float uContainerBlack;   // gy where the solid-black zone ends (= Dynamic-Island height)
uniform float uContainerFade;    // gaussian fade span below the black zone
uniform float uContainerGauss;   // gaussian falloff steepness

out vec4 outColor;

void main() {
	vec2 pixel = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
	vec2 effectUv = (pixel - uEffectOrigin) / uEffectSize;
	vec2 inRect = step(vec2(0.0), effectUv) * step(effectUv, vec2(1.0));
	if (inRect.x * inRect.y < 0.5) discard;

	// premultiplied effect (wave/dots = vec4(col, max(col)))
	vec4 effect = texture(uEffectTexture, vec2(effectUv.x, 1.0 - effectUv.y));

	// Dark container (premultiplied black = (0,0,0,a)). The top band — from the very top down to
	// the Dynamic-Island height (uContainerBlack) — is SOLID black (alpha=1) so it seamlessly
	// continues the hardware island's black. Below that it fades out with a GAUSSIAN falloff
	// (not linear) for a soft, eased transition into the scene.
	float gy = clamp(effectUv.y, 0.0, 1.0);
	float t = clamp((gy - uContainerBlack) / max(uContainerFade, 0.001), 0.0, 1.0);
	float vfade = (gy <= uContainerBlack) ? 1.0 : exp(-uContainerGauss * t * t); // solid black → gaussian fade
	float edgeLR = smoothstep(0.0, 0.14, min(effectUv.x, 1.0 - effectUv.x)); // soften left/right only
	float containerA = clamp(uContainer, 0.0, 1.0) * vfade * edgeLR;

	// effect OVER container, both premultiplied (container.rgb = 0)
	float invEffectA = 1.0 - effect.a;
	vec3 outRGB = effect.rgb;
	float outA = effect.a + containerA * invEffectA;
	outColor = vec4(outRGB, outA);
}
