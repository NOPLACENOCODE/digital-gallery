/* ---------- Tiny chiptune-style sound effects ----------
   Square waves + slight detune + tight envelopes = lo-fi 8-bit feel.
   Volumes kept low so they don't take over the page.
*/

(function () {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // One square-wave note, slightly detuned with a second oscillator for that
  // lo-fi flutter / chip-fidelity character. Tight envelope keeps it crisp
  // but avoids the worst clicks.
  function note({ freq, durationMs, volume = 0.15, delayMs = 0, type = 'square', detune = 7, glide = null }) {
    const c = getCtx();
    if (!c) return;
    try {
      const start = c.currentTime + delayMs / 1000;
      const duration = durationMs / 1000;
      const end = start + duration;

      const gain = c.createGain();
      gain.connect(c.destination);
      gain.gain.setValueAtTime(0, start);
      // very short attack — keeps the punchy chiptune transient
      gain.gain.linearRampToValueAtTime(volume, start + 0.003);
      // sharp tail, no long fade — classic NES/GB feel
      gain.gain.linearRampToValueAtTime(0, end);

      // Two oscillators detuned a few cents apart give that slightly
      // unstable, console-y warble.
      [-detune, detune].forEach((d) => {
        const osc = c.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        osc.detune.setValueAtTime(d, start);
        if (glide != null) osc.frequency.linearRampToValueAtTime(glide, end);
        osc.connect(gain);
        osc.start(start);
        osc.stop(end + 0.02);
      });
    } catch (e) {
      console.error('[audio]', e);
    }
  }

  // ADD — quick 2-note rise (collected-item vibe). Volume halved.
  window.audioBlip = function () {
    note({ freq: 660, durationMs: 50, volume: 0.03 }); // E5
    note({ freq: 988, durationMs: 70, volume: 0.03, delayMs: 50 }); // B5
  };

  // REMOVE — quick 2-note fall. Volume halved.
  window.audioBlop = function () {
    note({ freq: 660, durationMs: 50, volume: 0.03 }); // E5
    note({ freq: 440, durationMs: 70, volume: 0.03, delayMs: 50 }); // A4
  };

  // CHECKOUT — short victory arpeggio (C E G C). Volume at 70%.
  window.audioKaching = function () {
    note({ freq: 523, durationMs: 70, volume: 0.091 }); // C5
    note({ freq: 659, durationMs: 70, volume: 0.091, delayMs: 70 }); // E5
    note({ freq: 784, durationMs: 70, volume: 0.091, delayMs: 140 }); // G5
    note({ freq: 1047, durationMs: 180, volume: 0.105, delayMs: 210 }); // C6
  };

  // COIN — the classic Mario "coin" pattern: B5 → E6, square waves
  window.audioTink = function () {
    note({ freq: 988, durationMs: 50, volume: 0.13 }); // B5
    note({ freq: 1319, durationMs: 200, volume: 0.13, delayMs: 50 }); // E6
  };
})();
