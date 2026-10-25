// Audio: sebutan guru (fail MP3 rakaman sebenar) + efek bunyi lembut.
// Tiada TTS: jika rakaman belum ada, game memberitahu dan guru "bercakap" tanpa suara.

const SFX_FILES = {
  tap: 'audio/sfx/tap_soft.mp3',
  success: 'audio/sfx/success_chime.mp3',
  bloom: 'audio/sfx/flower_bloom.mp3',
};

let ctx = null;
let muted = false;
let current = null; // { el, resolve }
const available = new Map(); // url -> boolean
const sfxBuffers = {};
const listeners = { start: [], end: [] };

export function onVoice(event, fn) {
  listeners[event].push(fn);
}

function emit(event, payload) {
  listeners[event].forEach((fn) => fn(payload));
}

// Pelayan dev mungkin pulangkan index.html (200) untuk fail tiada, jadi semak jenis kandungan.
async function exists(url) {
  if (available.has(url)) return available.get(url);
  let ok = false;
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    ok = res.ok && (res.headers.get('content-type') || '').startsWith('audio');
  } catch {
    ok = false;
  }
  available.set(url, ok);
  return ok;
}

// Mesti dipanggil daripada sentuhan pengguna (butang Mula) supaya audio dibenarkan pada telefon.
export async function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC && !ctx) ctx = new AC();
  if (ctx && ctx.state === 'suspended') await ctx.resume().catch(() => {});
  for (const [name, url] of Object.entries(SFX_FILES)) {
    if (await exists(url)) {
      try {
        const data = await (await fetch(url)).arrayBuffer();
        sfxBuffers[name] = await ctx.decodeAudioData(data);
      } catch {
        // guna bunyi sintesis
      }
    }
  }
}

export function setMuted(value) {
  muted = value;
  if (muted) stopVoice();
}

export function isMuted() {
  return muted;
}

export function stopVoice() {
  if (!current) return;
  const { el, resolve } = current;
  current = null;
  el.pause();
  el.currentTime = 0;
  emit('end');
  resolve();
}

export async function hasVoice(syllable) {
  return exists(syllable.audio);
}

// Mainkan sebutan. Elak tindihan: sebutan lama dihentikan dahulu.
// Pulangkan { played: boolean }. Jika tiada rakaman, guru tetap "bercakap" seketika.
export async function playVoice(syllable) {
  stopVoice();
  const ok = await exists(syllable.audio);
  if (!ok || muted) {
    emit('start', { silent: true });
    await new Promise((r) => setTimeout(r, 1200));
    emit('end');
    return { played: false, missing: !ok };
  }
  const el = new Audio(syllable.audio);
  return new Promise((resolve) => {
    const done = () => {
      if (current && current.el === el) {
        current = null;
        emit('end');
      }
      resolve({ played: true });
    };
    current = { el, resolve: () => resolve({ played: true }) };
    el.addEventListener('ended', done);
    el.addEventListener('error', () => {
      available.set(syllable.audio, false);
      done();
    });
    emit('start', { silent: false });
    el.play().catch(done);
  });
}

function tone(freqs, { dur = 0.18, gap = 0.09, type = 'sine', vol = 0.12 } = {}) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    const t = t0 + i * gap;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  });
}

const SYNTH = {
  tap: () => tone([660], { dur: 0.08, type: 'triangle', vol: 0.08 }),
  success: () => tone([784, 988, 1319], { dur: 0.35, gap: 0.08 }),
  soft: () => tone([440, 392], { dur: 0.2, gap: 0.1, type: 'triangle', vol: 0.06 }),
  bloom: () => tone([523, 659, 784, 1047], { dur: 0.5, gap: 0.07, vol: 0.1 }),
  step: () => tone([180], { dur: 0.05, type: 'triangle', vol: 0.03 }),
};

export function sfx(name) {
  if (!ctx || muted) return;
  const buf = sfxBuffers[name];
  if (buf) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    return;
  }
  SYNTH[name]?.();
}
