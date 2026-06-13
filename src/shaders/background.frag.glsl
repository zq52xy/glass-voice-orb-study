#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform sampler2D uBackground;
uniform vec2 uTextureSize;
uniform vec2 uCanvasSize;
uniform float uBackgroundReady;

out vec4 outColor;

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
	vec3 tint = mix(bottom, top, 1.0 - uv.y);
	return tint + vec3(0.02, 0.035, 0.055) * vignette;
}

void main() {
	vec2 pixel = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
	vec2 uv = pixel / uCanvasSize;
	vec3 image = texture(uBackground, coverUv(uv)).rgb;
	vec3 background = mix(fallbackBackground(uv), image, clamp(uBackgroundReady, 0.0, 1.0));
	outColor = vec4(background, 1.0);
}
