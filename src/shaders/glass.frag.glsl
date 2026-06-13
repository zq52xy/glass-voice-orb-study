#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform sampler2D uSceneTexture;
uniform sampler2D uBackground;

uniform vec2 uTextureSize;
uniform vec2 uPanelSize;
uniform vec2 uCanvasSize;
uniform vec2 uPanelOrigin;
uniform float uMarginPx;
uniform float uCornerRadius;

uniform float uHeight;
uniform float uCurvature;
uniform float uRefractAmount;
uniform float uAngle;
uniform float uGradRadialMix;

uniform float uKeyAngle;
uniform float uFillAngle;
uniform float uHlHeight;
uniform float uHlCut;
uniform float uHlNorm;
uniform float uHlAmount;
uniform float uHlCurv;

uniform float uBackgroundReady;

out vec4 outColor;

float saturate(float x) {
	return clamp(x, 0.0, 1.0);
}

vec2 rotate2d(vec2 v, float a) {
	float c = cos(a);
	float s = sin(a);
	return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

vec2 coverUv(vec2 canvasUv) {
	vec2 pixel = canvasUv * uCanvasSize;
	float cover = max(uCanvasSize.x / uTextureSize.x, uCanvasSize.y / uTextureSize.y);
	vec2 fitted = uTextureSize * cover;
	vec2 offset = (fitted - uCanvasSize) * 0.5;
	return clamp((pixel + offset) / fitted, vec2(0.0), vec2(1.0));
}

vec3 fallbackBackground(vec2 uv) {
	float vignette = smoothstep(0.95, 0.12, distance(uv, vec2(0.5)));
	vec3 top = vec3(0.015, 0.018, 0.022);
	vec3 bottom = vec3(0.0, 0.0, 0.0);
	return mix(bottom, top, 1.0 - uv.y) + vec3(0.02, 0.035, 0.055) * vignette;
}

vec3 sampleBackground(vec2 canvasUv) {
	vec3 image = texture(uBackground, coverUv(canvasUv)).rgb;
	return mix(fallbackBackground(canvasUv), image, clamp(uBackgroundReady, 0.0, 1.0));
}

vec3 sampleScene(vec2 canvasUv) {
	return texture(uSceneTexture, vec2(canvasUv.x, 1.0 - canvasUv.y)).rgb;
}

float supercircleDistance(vec2 p, vec2 b, float n, vec2 param) {
	const float c = 1.528665;
	float an = abs(n);
	float ac = an * c;
	float m10 = mix(ac, an, max(param.x, param.y));
	vec2 v14 = (p - b) + vec2(m10);
	vec2 q = abs(max(vec2(0.0), (p - b) / max(ac, 0.0001) + vec2(1.0)));
	float l = length(q);
	float qmax = max(q.x, q.y);
	float qmin = min(q.x, q.y);
	float ratio = (qmax == 0.0) ? 0.0 : saturate(qmin / qmax);
	float poly = ((((-0.926054 * ratio + 3.15601) * ratio - 3.64122) * ratio + 1.26803) * ratio + 0.268531);
	float dCorner = (l + 1.0) - 1.0 / (1.0 - ratio * ratio * saturate(l) * poly);
	float dFar = length(max(vec2(0.0), q * c - vec2(0.528665))) * 0.654166 + 0.345834;
	float d57 = mix(dCorner, dFar, param.x);
	float d58 = mix(dCorner, dFar, param.y);
	float s = (q.y > q.x) ? 1.0 : -1.0;
	float t65 = saturate((0.5 - s) + s * ratio);
	float dist = mix(d57, d58, t65) - 1.0;
	float emin = min(max(v14.x, v14.y), 0.0);
	return emin + ac * dist;
}

vec2 cornerParam(vec2 halfSize, float r) {
	if (r < 0.0001) return vec2(0.0);
	return clamp((vec2(1.528665) - halfSize / r) / 0.528665, vec2(0.0), vec2(1.0));
}

float shapeDistance(vec2 p, vec2 halfSize, float cornerRadius) {
	float r = min(cornerRadius, min(halfSize.x, halfSize.y));
	if (r < 0.5) {
		vec2 dd = abs(p) - halfSize;
		return length(max(dd, vec2(0.0))) + min(max(dd.x, dd.y), 0.0);
	}
	return supercircleDistance(abs(p), halfSize, r, cornerParam(halfSize, r));
}

vec2 shapeGradient(vec2 p, vec2 halfSize, float cornerRadius, float radialMix) {
	float r = min(cornerRadius, min(halfSize.x, halfSize.y));
	vec2 param = cornerParam(halfSize, r);
	float ac = mix(r * 1.528665, r, max(param.x, param.y));
	vec2 pf = abs(p);
	vec2 v = max(vec2(0.0), (pf - halfSize) + vec2(ac));
	vec2 g = (v.x + v.y > 0.00001)
		? normalize(v)
		: ((pf.x - halfSize.x > pf.y - halfSize.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
	vec2 cornerGrad = g * sign(p);
	vec2 centerRadial = normalize(vec2(p.x, halfSize.x * p.y / max(halfSize.y, 0.001)) + vec2(0.00001));
	return normalize(mix(cornerGrad, centerRadial, radialMix));
}

float refractionProfile(float t, float curvature) {
	float flatProfile = 1.0 - 0.2929 * (t < 1.0 ? 1.0 : 0.0);
	float circular = sqrt(max(1.0 - (1.0 - t) * (1.0 - t), 0.0));
	return mix(flatProfile, circular, curvature);
}

vec2 refractedUv(vec2 baseUv, float d, vec2 grad) {
	float t = clamp(-d / max(uHeight, 0.001), 0.0, 1.0);
	float mag = 1.0 - refractionProfile(t, uCurvature);
	vec2 dir = rotate2d(grad, uAngle);
	return baseUv + (uRefractAmount * mag * dir) / uCanvasSize;
}

float highlightLobe(float dist, float aa, vec2 n, float h, vec2 dir, float cut, float curv) {
	if (dist < -5.0) return 0.0;
	float t = saturate(dist / max(h, 0.001));
	float profile = mix(t < 1.0 ? 1.0 : 0.0, 1.0 - t, curv);
	float band = saturate(dist / aa + 0.5) * saturate((h - dist) / aa + 0.5) * profile;
	float angular = saturate((dot(dir, n) - cut) / max(1.0 - cut, 0.001));
	return band * angular;
}

float highlightBand(float d, vec2 grad) {
	float glen = max(length(grad), 0.0001);
	float dist = -d / glen;
	vec2 n = grad / glen;
	float aa = max(fwidth(dist), 0.0001);
	vec2 kdir = vec2(cos(uKeyAngle), sin(uKeyAngle));
	vec2 fdir = vec2(cos(uFillAngle), sin(uFillAngle));
	float key = highlightLobe(dist, aa, n, uHlHeight, kdir, uHlCut, uHlCurv);
	float fill = highlightLobe(dist, aa, n, uHlHeight, fdir, uHlCut, uHlCurv);
	float keyN = key / (1.0 + (1.0 - key) * uHlNorm);
	float fillN = fill / (1.0 + (1.0 - fill) * uHlNorm);
	return keyN + fillN;
}

vec4 glassFragment(vec2 pixel) {
	vec2 panelUv = (pixel - uPanelOrigin) / uPanelSize;
	vec2 inQuad = step(vec2(0.0), panelUv) * step(panelUv, vec2(1.0));
	if (inQuad.x * inQuad.y < 0.5) return vec4(0.0);

	vec2 halfSize = uPanelSize * 0.5 - vec2(uMarginPx);
	vec2 p = (panelUv - vec2(0.5)) * uPanelSize;
	float d = shapeDistance(p, halfSize, uCornerRadius);
	float alpha = 1.0 - smoothstep(-1.0, 1.0, d);
	if (alpha <= 0.001) return vec4(0.0);

	vec2 grad = shapeGradient(p, halfSize, uCornerRadius, uGradRadialMix);
	vec2 baseUv = (uPanelOrigin + panelUv * uPanelSize) / uCanvasSize;
	vec2 rUv = clamp(refractedUv(baseUv, d, grad), vec2(0.0), vec2(1.0));

	// glass = refraction + highlight ONLY — no face color (no saturation/black/luma/tint),
	// so it looks like untouched glass over whatever is behind it.
	vec3 col = sampleScene(rUv);
	col += vec3(highlightBand(d, grad) * uHlAmount);
	return vec4(col, alpha);
}

void main() {
	vec2 pixel = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
	vec2 canvasUv = pixel / uCanvasSize;
	// outside the glass: original photo (so the dark container stays INSIDE the glass and never
	// spills past it). The container + wave/dots live in the scene and are only seen refracted inside.
	vec3 background = sampleBackground(canvasUv);
	vec4 glass = glassFragment(pixel);
	vec3 finalColor = mix(background, clamp(glass.rgb, 0.0, 1.25), saturate(glass.a));
	outColor = vec4(finalColor, 1.0);
}
