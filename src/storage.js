// Kemajuan disimpan setempat pada peranti sahaja (tiada akaun, tiada nama murid).
const KEY = 'jawiklik.v1';

const blank = () => ({ stars: 0, done: [], reduceMotion: null, muted: false });

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank();
  } catch {
    return blank();
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storan disekat (mod peribadi): game tetap berjalan tanpa simpan
  }
}

export function resetProgress(p) {
  const fresh = { ...blank(), reduceMotion: p.reduceMotion, muted: p.muted };
  saveProgress(fresh);
  return fresh;
}
