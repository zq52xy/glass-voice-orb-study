/*
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
INPUT: User gesture starts optional microphone capture.
OUTPUT: Smoothed low/mid/high band levels in [0,1] with demo fallback.
POS: Owns Web Audio setup, FFT band split, and stream cleanup.
*/
(function () {
  class SiriAudioMeter {
    constructor() {
      this.context = null;
      this.analyser = null;
      this.source = null;
      this.stream = null;
      this.freq = new Uint8Array(512);
      this.running = false;
      this.demo = false;
      this.bands = { low: 0, mid: 0, high: 0 };
      this._demoStart = performance.now();
    }

    async start() {
      this.running = true;
      this.demo = false;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.demo = true;
        return;
      }
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.context = this.context || new AudioContextClass({ latencyHint: "interactive" });
        if (this.context.state === "suspended") {
          await this.context.resume();
        }
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.78;
        this.freq = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = this.context.createMediaStreamSource(this.stream);
        this.source.connect(this.analyser);
      } catch (error) {
        this.demo = true;
      }
    }

    stop() {
      this.running = false;
      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }
      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          track.stop();
        }
        this.stream = null;
      }
    }

    sample() {
      const target = this.running ? (this.demo ? this._demoBands() : this._micBands()) : { low: 0, mid: 0, high: 0 };
      const b = this.bands;
      b.low += (target.low - b.low) * 0.22;
      b.mid += (target.mid - b.mid) * 0.22;
      b.high += (target.high - b.high) * 0.22;
      return b;
    }

    _bandAverage(from, to) {
      let sum = 0;
      for (let i = from; i < to; i += 1) {
        sum += this.freq[i];
      }
      return sum / Math.max(1, (to - from) * 255);
    }

    _micBands() {
      if (!this.analyser) {
        return { low: 0.2, mid: 0.2, high: 0.2 };
      }
      this.analyser.getByteFrequencyData(this.freq);
      const n = this.freq.length;
      const low = this._bandAverage(0, Math.floor(n * 0.08));
      const mid = this._bandAverage(Math.floor(n * 0.08), Math.floor(n * 0.4));
      const high = this._bandAverage(Math.floor(n * 0.4), n);
      return {
        low: Math.min(1, Math.pow(low * 2.6, 0.8)),
        mid: Math.min(1, Math.pow(mid * 3.2, 0.8)),
        high: Math.min(1, Math.pow(high * 4.0, 0.8)),
      };
    }

    _demoBands() {
      const t = (performance.now() - this._demoStart) / 1000;
      return {
        low: 0.35 + 0.25 * Math.sin(t * 2.1),
        mid: 0.4 + 0.3 * Math.sin(t * 3.7 + 1.0),
        high: 0.3 + 0.25 * Math.sin(t * 6.3 + 2.0),
      };
    }
  }

  window.SiriAudioMeter = SiriAudioMeter;
})();
