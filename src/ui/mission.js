import { SYLLABLES, LETTER_POOL, LINES } from '../data/syllables.js';
import { playVoice, stopVoice, hasVoice, sfx } from '../audio.js';
import { saveProgress } from '../storage.js';
import { createTracer } from './trace.js';

const STEPS = ['Dengar', 'Baca', 'Eja', 'Surih'];

const ICON_SPEAKER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...children.filter((c) => c != null));
  return el;
}

const jawi = (text, cls = '') => h('span', { class: `jawi ${cls}`, dir: 'rtl', lang: 'ms-Arab' }, text);

export class Mission {
  constructor({ panel, scene, progress, onProgress }) {
    this.panel = panel;
    this.scene = scene;
    this.progress = progress;
    this.onProgress = onProgress;
    this.busy = false;
    this.tracer = null;
    scene.setHandlers({ guruTap: () => this.start(), sfx });
    new ResizeObserver(() => this.relayout()).observe(panel);
  }

  // ---------- susun atur ----------

  relayout(focus) {
    const hud = document.getElementById('hud').getBoundingClientRect().bottom;
    const panel = window.innerHeight - this.panel.getBoundingClientRect().top;
    if (focus) this.focus = focus;
    this.scene.setLayout({ hud, panel }, this.focus);
  }

  render(mode, ...nodes) {
    this.panel.dataset.mode = mode;
    this.panel.replaceChildren(...nodes);
    this.relayout(mode === 'explore' ? 'garden' : 'guru');
  }

  say(text) {
    const line = h('p', { class: 'guru-line' }, text);
    this.panel.querySelector('.guru-line')?.replaceWith(line);
    if (!this.voicePlaying) {
      this.scene.setGuruTalking(true);
      clearTimeout(this.talkTimer);
      this.talkTimer = setTimeout(() => !this.voicePlaying && this.scene.setGuruTalking(false), 1400);
    }
    return line;
  }

  // ---------- mod teroka ----------

  showExplore() {
    stopVoice();
    this.scene.setInteractive(true);
    const all = this.progress.done.length >= SYLLABLES.length;
    const fresh = this.progress.done.length === 0;
    const text = all ? LINES.allDone : fresh ? LINES.intro : LINES.again;
    this.render(
      'explore',
      h('div', { class: 'speaker-row' }, h('span', { class: 'who' }, 'Guru Jawi'), h('span', { class: 'hint' }, 'Sentuh laluan untuk berjalan')),
      h('p', { class: 'guru-line' }, text),
      h('button', { class: 'btn btn-primary', onclick: () => this.start() }, all ? 'Main semula' : 'Mula misi'),
    );
  }

  async start() {
    if (this.busy) return;
    this.busy = true;
    sfx('tap');
    if (this.progress.done.length >= SYLLABLES.length) {
      this.progress.done = [];
      saveProgress(this.progress);
      this.scene.resetFlowers();
    }
    this.target = SYLLABLES.find((s) => !this.progress.done.includes(s.id));
    this.scene.setInteractive(false);
    await this.scene.walkToGuru();
    this.busy = false;
    this.voiceReady = await hasVoice(this.target);
    this.stepListen();
  }

  frame(stepIndex, instruction, ...body) {
    const dots = h(
      'ol',
      { class: 'steps' },
      ...STEPS.map((s, i) => h('li', { class: i < stepIndex ? 'done' : i === stepIndex ? 'now' : '' }, s)),
    );
    return [dots, h('p', { class: 'guru-line' }, instruction), ...body];
  }

  speakerButton(label = 'Dengar') {
    return h(
      'button',
      { class: 'btn btn-audio', onclick: () => this.playTarget() },
      h('span', { class: 'icon', html: ICON_SPEAKER }),
      label,
    );
  }

  async playTarget() {
    sfx('tap');
    this.voicePlaying = true;
    const res = await playVoice(this.target);
    this.voicePlaying = false;
    this.heard = true;
    this.panel.querySelector('[data-after-listen]')?.removeAttribute('disabled');
    if (res.missing) this.showMissingAudio();
  }

  showMissingAudio() {
    if (this.panel.querySelector('.note')) return;
    const note = h('p', { class: 'note' }, `Rakaman suara belum ada. Minta guru sebut “${this.target.rumi}” dahulu.`);
    this.panel.querySelector('.guru-line')?.after(note);
  }

  // ---------- 1. Dengar & Sebut ----------

  stepListen() {
    this.heard = false;
    const s = this.target;
    this.render(
      'mission',
      ...this.frame(
        0,
        LINES.listen,
        h('div', { class: 'word-card' }, jawi(s.jawi, 'big'), this.voiceReady ? null : h('span', { class: 'rumi' }, s.rumi)),
        h(
          'div',
          { class: 'row' },
          this.speakerButton(),
          h(
            'button',
            {
              class: 'btn btn-primary',
              'data-after-listen': true,
              disabled: true,
              onclick: () => {
                // Penanda cubaan sahaja, bukan bukti sebutan tepat.
                sfx('tap');
                this.stepRead();
              },
            },
            'Saya sudah sebut',
          ),
        ),
      ),
    );
    this.playTarget();
  }

  // ---------- 2. Baca & Pilih ----------

  stepRead() {
    const s = this.target;
    const others = shuffle(SYLLABLES.filter((x) => x.id !== s.id)).slice(0, 2);
    const options = shuffle([s, ...others]);
    let wrong = 0;
    const hint = h('p', { class: 'rumi-hint', hidden: this.voiceReady }, `Bunyi: “${s.rumi}”`);
    const cards = options.map((o) =>
      h(
        'button',
        {
          class: 'answer-card',
          onclick: (e) => {
            const card = e.currentTarget;
            if (o.id === s.id) {
              sfx('success');
              card.classList.add('correct');
              cards.forEach((c) => (c.disabled = true));
              this.say(LINES.correct);
              setTimeout(() => this.stepSpell(), 1300);
            } else {
              wrong++;
              sfx('soft');
              card.classList.remove('shake');
              void card.offsetWidth;
              card.classList.add('shake');
              this.say(wrong === 1 ? LINES.wrongOnce : LINES.wrongMore);
              if (wrong >= 2) {
                hint.hidden = false;
                cards[options.indexOf(s)].classList.add('glow');
              }
            }
          },
        },
        jawi(o.jawi),
      ),
    );
    this.render('mission', ...this.frame(1, LINES.read, h('div', { class: 'row' }, this.speakerButton('Dengar lagi')), hint, h('div', { class: 'cards' }, ...cards)));
    if (this.voiceReady) this.playTarget();
  }

  // ---------- 3. Eja & Susun ----------

  stepSpell() {
    const s = this.target;
    const extra = shuffle(LETTER_POOL.filter((l) => !s.letters.includes(l)))[0];
    const chips = shuffle([...s.letters, extra]);
    const placed = s.letters.map(() => null);
    let wrong = 0;

    const answer = h('div', { class: 'spell-answer' }, jawi('', 'big'));
    // dir=rtl: slot pertama (huruf pertama) berada paling kanan
    const slots = s.letters.map((_, i) => h('div', { class: 'slot', 'data-slot': i }));
    const chipEls = chips.map((letter) => {
      const el = h('button', { class: 'chip' }, jawi(letter));
      el.letter = letter;
      return el;
    });

    const nextEmpty = () => placed.findIndex((p) => p === null);
    const update = () => {
      answer.firstChild.textContent = placed.filter(Boolean).join('');
    };

    const tryPlace = (chip, slotIndex) => {
      if (slotIndex < 0 || placed[slotIndex]) return false;
      if (s.letters[slotIndex] !== chip.letter) {
        wrong++;
        sfx('soft');
        chip.classList.remove('shake');
        void chip.offsetWidth;
        chip.classList.add('shake');
        if (wrong >= 2) {
          this.say('Mula dari kanan. Pilih huruf yang pertama.');
          const want = s.letters[nextEmpty()];
          chipEls.find((c) => c.letter === want && !c.disabled)?.classList.add('glow');
        } else {
          this.say('Cuba huruf lain, ya.');
        }
        return false;
      }
      sfx('tap');
      placed[slotIndex] = chip.letter;
      slots[slotIndex].replaceChildren(jawi(chip.letter));
      slots[slotIndex].classList.add('filled');
      chip.disabled = true;
      chip.classList.add('used');
      chipEls.forEach((c) => c.classList.remove('glow'));
      update();
      if (nextEmpty() === -1) {
        sfx('success');
        answer.classList.add('correct');
        this.say(`Bagus! ${s.jawi} dibaca “${s.rumi}”.`);
        setTimeout(() => this.stepTrace(), 1600);
      }
      return true;
    };

    chipEls.forEach((chip) => enableDrag(chip, slots, (slotIndex) => tryPlace(chip, slotIndex ?? nextEmpty())));

    this.render(
      'mission',
      ...this.frame(
        2,
        LINES.spell,
        answer,
        h('div', { class: 'slots', dir: 'rtl' }, ...slots),
        h('div', { class: 'chips', dir: 'rtl' }, ...chipEls),
      ),
    );
  }

  // ---------- 4. Surih ----------

  stepTrace() {
    const s = this.target;
    const bar = h('div', { class: 'progress' }, h('span'));
    const msg = h('p', { class: 'trace-msg' }, 'Ikut garis putus-putus.');
    const board = h('div', { class: 'trace-area' });
    const undo = h('button', { class: 'btn btn-soft', onclick: () => this.tracer?.undo() }, 'Undur');
    const clear = h('button', { class: 'btn btn-soft', onclick: () => this.tracer?.clear() }, 'Padam');
    this.render('trace', ...this.frame(3, LINES.trace, board, bar, msg, h('div', { class: 'row' }, undo, clear)));
    this.scene.avatarWrite();
    this.tracer = createTracer(board, s.jawi, {
      onProgress: (p, messy) => {
        bar.firstChild.style.width = `${Math.round(p * 100)}%`;
        msg.textContent = messy ? 'Cuba ikut bentuk huruf, ya.' : p > 0.6 ? 'Hampir siap!' : 'Ikut garis putus-putus.';
      },
      onDone: () => {
        sfx('success');
        bar.classList.add('full');
        msg.textContent = 'Siap!';
        undo.disabled = clear.disabled = true;
        setTimeout(() => this.finish(), 1100);
      },
    });
  }

  // ---------- Ganjaran ----------

  finish() {
    const s = this.target;
    this.tracer = null;
    if (!this.progress.done.includes(s.id)) this.progress.done.push(s.id);
    this.progress.stars += 1;
    saveProgress(this.progress);
    this.onProgress(this.progress);
    this.scene.bloomFlower(SYLLABLES.indexOf(s));
    this.scene.celebrate();
    this.scene.guruPoint();
    sfx('bloom');
    this.render(
      'reward',
      h('div', { class: 'reward-star', 'aria-hidden': true }, '★'),
      h('p', { class: 'guru-line' }, LINES.finish),
      h('div', { class: 'word-card small' }, jawi(s.jawi, 'big')),
      h('button', { class: 'btn btn-primary', onclick: () => this.showExplore() }, 'Teruskan'),
    );
  }
}

// Seret cip huruf ke slot; sentuh sahaja (tanpa seret) = letak pada slot kosong seterusnya.
function enableDrag(chip, slots, drop) {
  let ghost = null;
  let start = null;
  chip.addEventListener('pointerdown', (e) => {
    if (chip.disabled || start) return;
    e.preventDefault();
    chip.setPointerCapture(e.pointerId);
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  chip.addEventListener('pointermove', (e) => {
    if (!start || e.pointerId !== start.id) return;
    if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
      const r = chip.getBoundingClientRect();
      ghost = chip.cloneNode(true);
      ghost.classList.add('ghost');
      ghost.style.width = `${r.width}px`;
      ghost.style.height = `${r.height}px`;
      document.body.append(ghost);
      chip.classList.add('lifting');
    }
    if (ghost) {
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      slots.forEach((s) => s.classList.toggle('over', hit(s, e)));
    }
  });
  const end = (e) => {
    if (!start || e.pointerId !== start.id) return;
    start = null;
    chip.classList.remove('lifting');
    slots.forEach((s) => s.classList.remove('over'));
    if (ghost) {
      ghost.remove();
      ghost = null;
      const target = slots.findIndex((s) => hit(s, e));
      if (target >= 0) drop(target);
    } else if (e.type === 'pointerup') {
      drop(null);
    }
  };
  chip.addEventListener('pointerup', end);
  chip.addEventListener('pointercancel', end);
}

function hit(el, e) {
  const r = el.getBoundingClientRect();
  const pad = 14;
  return e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
}
