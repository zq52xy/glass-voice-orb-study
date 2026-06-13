#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uMouse;

uniform float uResolved;
uniform float uLayerOpacity;
uniform float uUnresolvedScale;
uniform float uEffectScale;
uniform vec2 uAnchor;

uniform float uAmplitude;
uniform float uFreq;
uniform float uAberrationFreq;
uniform float uWavePhase;
uniform float uWaveSpeed;
uniform float uWaveScale;
uniform float uAberration;
uniform float uThickness;
uniform float uIntensity;
uniform float uFalloff;
uniform float uEdgeMask;
uniform float uEdgeMaskInset;
uniform float uBandFill;
uniform float uBandFillThickness;
uniform float uSoftness;
uniform float uLow;
uniform float uMid;
uniform float uHigh;
uniform float uLowAmplitude;
uniform float uLowIntensity;
uniform float uMidAberration;
uniform float uMidAberrationAmplitude;
uniform float uMidBandFill;
uniform float uMidSoftness;
uniform float uHighAberration;
uniform float uHighAberrationAmplitude;
uniform float uWhiteClip;

out vec4 outColor;

float saturate(float value) {
	return clamp(value, 0.0, 1.0);
}

vec3 spectrumTri(float t) {
	return clamp(vec3(abs(t - 3.0) - 1.0, 2.0 - abs(t - 2.0), 2.0 - abs(t - 4.0)), 0.0, 1.0);
}

float smoothUnit(float value) {
	return value * value * (3.0 - 2.0 * value);
}

void main() {
	vec2 gid = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
	float tw = mod(uWavePhase, 62.831848) * uWaveSpeed;
	float lo = saturate(uLow);
	float md = saturate(uMid);
	float hi = saturate(uHigh);
	float res = saturate(uResolved);

	float c52 = uThickness * 0.01;
	float c55 = (lo * uLowIntensity + uIntensity) * 0.01;
	float c58 = max(0.0, md * uMidSoftness + uSoftness);
	float c61 = (md * uMidBandFill + uBandFill) * 0.0001;
	float c64 = (uLowAmplitude * 0.01) * lo + uAmplitude;
	float c68 = c64 + md * uMidAberrationAmplitude + hi * uHighAberrationAmplitude;
	float c72 = (md * uMidAberration + uAberration) + hi * uHighAberration;
	float c73 = c72 * res;
	float c76 = lo * 14.0;
	float c75 = md * 10.0 + 4.0;
	float n77 = mix(0.1, c52, res);
	float n78 = mix(0.1, c55, res);
	float n80 = (res * 0.01) * c58;
	float n81 = mix(c75, 1.0, res);
	float omr = 1.0 - res;

	vec2 uv = (gid + 0.5) * 2.0 / uResolution - 1.0;
	float aspect = uResolution.x / uResolution.y;
	uv.x *= aspect;
	vec2 q = uv - vec2(aspect, 1.0) * (uAnchor * 2.0 - 1.0);
	float ws = max(uWaveScale * uEffectScale, 0.01);
	vec2 p = q / ws;
	float base = mix(0.14, uUnresolvedScale, res);
	float r = length(p);
	float edge = max(r - base, 0.0);
	float aC = max(aspect, 1.0);
	float px = p.x / aC;
	float cw = min(abs(px * 0.9), 1.0);
	float cw2 = pow(cos(cw * 1.5707964), 2.0);
	float eps = 0.0001;
	float atArg = atan(px * eps) * aC / eps;
	float waveBase = (cw2 * res * c68) * sin(atArg * uFreq + tw);
	float negBase = -c73;
	float atArg2 = atArg * uAberrationFreq + tw;
	float py = p.y;
	float n80sq = n80 * n80;
	float bft = max(uBandFillThickness, 0.0001);
	float n139 = (c61 * res) * n78;
	float env68 = cw2 * c68;
	vec2 mouseUv = uMouse.xy / max(uResolution, vec2(1.0));
	float mouseLift = uMouse.z * 0.035 * exp(-pow((mouseUv.x * 2.0 - 1.0) * 2.4, 2.0));

	vec3 colAcc = vec3(0.0);
	vec3 wSum = vec3(0.0);
	for (int i = 0; i < 4; i += 1) {
		float fi = float(i);
		float t13 = fi * 0.33333334;
		vec3 hue = mix(vec3(1.0), spectrumTri(fi), vec3(res));
		wSum += hue;
		float ph = atArg2 + mix(negBase, c73, t13);
		float w2 = env68 * sin(ph) + mouseLift;
		float dist = mix(edge, abs(py - w2), res);
		float rad = sqrt(dist * dist + n80sq) + n77;
		float k = dist * 0.02;
		float soft = mix(1.0 / (k * k + 1.0), 1.0, res);
		float glowL = (soft * n78) / rad;
		float band = max(0.0, max(py - max(waveBase, w2), min(waveBase, w2) - py));
		float fill = n139 / (band + bft);
		colAcc += (hue * n81) * (fill + glowL);
	}
	vec3 col = colAcc / max(wSum, vec3(0.0001));

	float tail = omr * (c76 + 4.0);
	float dC = mix(edge, abs(py - waveBase), res);
	float radC = dC + n77;
	float kC = dC * 0.02;
	float softC = mix(1.0 / (kC * kC + 1.0), 1.0, res);
	float cg = (n78 * 0.5 * (softC + tail)) / radC;
	vec3 cgl = pow(vec3(cg) + col, vec3(1.5));

	float ndcY = gid.y * 2.0 / uResolution.y - 1.0;
	float emC = max(clamp(uEdgeMask, 0.0, 1.0), 0.0001);
	float emMask = clamp((abs(ndcY) - 1.0 + clamp(uEdgeMaskInset, 0.0, 1.0)) / (-emC), 0.0, 1.0);
	emMask = smoothUnit(emMask);
	float fall = exp(-pow(px * uFalloff, 2.0));
	col = cgl * mix(1.0, emMask * fall, res) * res * saturate(uLayerOpacity);

	float m = max(max(col.r, col.g), col.b);
	vec3 huePreserved = col * ((m > 1.0) ? (1.0 / m) : 1.0);
	col = mix(huePreserved, min(col, vec3(1.0)), clamp(uWhiteClip, 0.0, 1.0));

	float alpha = saturate(max(max(col.r, col.g), col.b) * 1.15);
	outColor = vec4(col, alpha);
}
