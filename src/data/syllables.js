// Suku kata tertutup vokal A (contoh awal daripada nota guru).
// PERLU DISEMAK GURU sebelum digunakan dalam kelas: ejaan, sebutan dan audio.
// `letters` mengikut urutan tulisan (kanan ke kiri): huruf pertama ialah yang paling kanan.
export const SYLLABLES = [
  { id: 'a_bas', rumi: 'bas', jawi: 'بس', letters: ['ب', 'س'], audio: 'audio/voice/a_bas.mp3' },
  { id: 'a_jam', rumi: 'jam', jawi: 'جم', letters: ['ج', 'م'], audio: 'audio/voice/a_jam.mp3' },
  { id: 'a_cat', rumi: 'cat', jawi: 'چت', letters: ['چ', 'ت'], audio: 'audio/voice/a_cat.mp3' },
  { id: 'a_gam', rumi: 'gam', jawi: 'ݢم', letters: ['ݢ', 'م'], audio: 'audio/voice/a_gam.mp3' },
];

export const LETTER_POOL = [...new Set(SYLLABLES.flatMap((s) => s.letters))];

export const LINES = {
  intro: 'Assalamualaikum! Bunyi Jawi di taman telah hilang. Sentuh saya untuk mula!',
  again: 'Sentuh saya untuk misi seterusnya.',
  allDone: 'Hebat! Semua bunga sudah mekar. Sentuh saya untuk main semula.',
  listen: 'Dengar, kemudian sebut.',
  read: 'Dengar bunyi. Pilih kad yang betul.',
  spell: 'Susun huruf menjadi suku kata.',
  trace: 'Surih tulisan Jawi dengan jari.',
  correct: 'Bagus! Cuba sebut sekali lagi.',
  wrongOnce: 'Hampir! Dengar bunyi ini lagi.',
  wrongMore: 'Mari cuba dengan petunjuk.',
  finish: 'Hebat! Taman semakin ceria!',
};
