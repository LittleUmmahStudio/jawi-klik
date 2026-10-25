import Phaser from 'phaser';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/900.css';
import '@fontsource/noto-naskh-arabic/700.css';
import './styles.css';
import GardenScene from './game/GardenScene.js';
import { Mission } from './ui/mission.js';
import { unlockAudio, onVoice, setMuted, isMuted, sfx } from './audio.js';
import { loadProgress, saveProgress, resetProgress } from './storage.js';
import { SYLLABLES } from './data/syllables.js';

const $ = (id) => document.getElementById(id);

const ICON_SOUND_ON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON_SOUND_OFF = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON_GEAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.6 4.6-.1-2.2 2-1.6-2-3.4-2.4.9a8 8 0 0 0-1.9-1.1L15.8 3h-4l-.4 2.6a8 8 0 0 0-1.9 1.1l-2.4-.9-2 3.4 2 1.6a8 8 0 0 0 0 2.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.2.8 1.9 1.1l.4 2.6h4l.4-2.6c.7-.3 1.3-.6 1.9-1.1l2.4.9 2-3.4z" fill="currentColor"/></svg>`;

const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

async function boot() {
  let progress = loadProgress();
  if (progress.reduceMotion == null) {
    progress.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  document.body.classList.toggle('reduce-motion', progress.reduceMotion);
  setMuted(progress.muted);

  let manifest = {};
  try {
    manifest = await (await fetch('assets/spritesheets.json')).json();
  } catch {
    // tanpa manifest: watak guna PNG statik
  }

  const world = $('world');
  const size = () => ({ w: world.clientWidth, h: world.clientHeight });
  const { w, h } = size();

  // Kanvas dilukis pada resolusi skrin sebenar (DPR) supaya watak tajam pada telefon.
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: world,
    backgroundColor: '#86DDBA',
    scale: { mode: Phaser.Scale.NONE, width: w * dpr(), height: h * dpr(), zoom: 1 / dpr() },
    render: { antialias: true, roundPixels: false },
    banner: false,
  });
  game.registry.set('dpr', dpr());

  window.addEventListener('resize', () => {
    const s = size();
    game.registry.set('dpr', dpr());
    game.scale.resize(s.w * dpr(), s.h * dpr());
    game.scale.setZoom(1 / dpr());
  });

  const bloomed = progress.done.map((id) => SYLLABLES.findIndex((s) => s.id === id));
  const scene = await new Promise((onReady) => {
    game.scene.add('garden', GardenScene, true, { manifest, reduceMotion: progress.reduceMotion, bloomed, onReady });
  });

  onVoice('start', () => scene.setGuruTalking(true));
  onVoice('end', () => scene.setGuruTalking(false));

  const starCount = $('star-count');
  const setStars = (p, bump) => {
    starCount.textContent = p.stars;
    if (bump) {
      const el = $('stars');
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    }
  };
  setStars(progress);

  const mission = new Mission({
    panel: $('panel'),
    scene,
    progress,
    onProgress: (p) => setStars(p, true),
  });

  // HUD
  const soundBtn = $('btn-sound');
  const renderSound = () => {
    soundBtn.innerHTML = isMuted() ? ICON_SOUND_OFF : ICON_SOUND_ON;
    soundBtn.setAttribute('aria-label', isMuted() ? 'Hidupkan bunyi' : 'Matikan bunyi');
  };
  renderSound();
  soundBtn.addEventListener('click', () => {
    setMuted(!isMuted());
    progress.muted = isMuted();
    saveProgress(progress);
    renderSound();
    sfx('tap');
  });

  $('btn-settings').innerHTML = ICON_GEAR;
  const motion = $('opt-motion');
  motion.checked = progress.reduceMotion;
  $('btn-settings').addEventListener('click', () => ($('settings').hidden = false));
  $('btn-close-settings').addEventListener('click', () => ($('settings').hidden = true));
  motion.addEventListener('change', () => {
    progress.reduceMotion = motion.checked;
    scene.reduceMotion = motion.checked;
    document.body.classList.toggle('reduce-motion', motion.checked);
    saveProgress(progress);
  });
  $('btn-reset').addEventListener('click', () => {
    const fresh = resetProgress(progress);
    Object.assign(progress, fresh);
    scene.resetFlowers();
    setStars(progress);
    $('settings').hidden = true;
    mission.showExplore();
  });

  // Skrin mula: sentuhan pertama membuka audio pada telefon.
  $('btn-start').addEventListener('click', async () => {
    await unlockAudio();
    sfx('tap');
    $('title-screen').classList.add('hide');
    mission.showExplore();
  });
  $('btn-start').disabled = false;
}

boot();
