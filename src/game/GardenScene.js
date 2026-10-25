import Phaser from 'phaser';

// Koordinat dunia = piksel imej bg_sound_garden.png (940 × 1672).
const WORLD_W = 940;
const WORLD_H = 1672;
const VIEW_W = 820; // lebar dunia yang kelihatan pada telefon (tepi kiri/kanan dipotong sedikit)

// Kawasan boleh dilalui: dataran bulat + laluan atas (ke jambatan) + laluan bawah.
const PLAZA = { x: 470, y: 985, rx: 215, ry: 105 };
const CHAINS = {
  up: { radius: 50, pts: [{ x: 455, y: 870 }, { x: 450, y: 760 }, { x: 370, y: 640 }, { x: 290, y: 520 }] },
  down: { radius: 45, pts: [{ x: 515, y: 1090 }, { x: 560, y: 1180 }] },
};

const GURU_POS = { x: 375, y: 975 };
const MEET_POS = { x: 525, y: 1000 }; // tempat avatar berdiri ketika bercakap dengan guru
const AVATAR_START = { x: 380, y: 650 };
const FLOWER_POS = [
  { x: 300, y: 795 },
  { x: 690, y: 850 },
  { x: 700, y: 1120 },
  { x: 610, y: 1175 },
];
const TREE_HIT = new Phaser.Geom.Rectangle(600, 280, 340, 320);

const AVATAR_HEIGHT = 165; // tinggi watak dalam koordinat dunia
const GURU_HEIGHT = 195;
const WALK_SPEED = 230; // piksel dunia sesaat

function inPlaza(p) {
  const dx = (p.x - PLAZA.x) / PLAZA.rx;
  const dy = (p.y - PLAZA.y) / PLAZA.ry;
  return dx * dx + dy * dy <= 1;
}

function nearestOnSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const t = Phaser.Math.Clamp(((p.x - a.x) * abx + (p.y - a.y) * aby) / (abx * abx + aby * aby), 0, 1);
  return { x: a.x + abx * t, y: a.y + aby * t };
}

// Kenal pasti kawasan sesuatu titik: { name: 'plaza' } atau { name: 'up'|'down', seg }.
function regionOf(p) {
  if (inPlaza(p)) return { name: 'plaza' };
  let best = null;
  for (const [name, chain] of Object.entries(CHAINS)) {
    for (let i = 0; i < chain.pts.length - 1; i++) {
      const q = nearestOnSegment(p, chain.pts[i], chain.pts[i + 1]);
      const d = Phaser.Math.Distance.BetweenPoints(p, q);
      if (d <= chain.radius && (!best || d < best.d)) best = { name, seg: i, d };
    }
  }
  return best;
}

// Laluan ringkas melalui simpang supaya avatar tidak memotong rumput/air.
function route(from, to) {
  const a = regionOf(from) || { name: 'plaza' };
  const b = regionOf(to);
  if (!b) return null;
  if (a.name === b.name) return [to];
  const pts = [];
  if (a.name !== 'plaza') {
    const chain = CHAINS[a.name].pts;
    for (let i = a.seg; i >= 0; i--) pts.push(chain[i]);
  }
  if (b.name !== 'plaza') {
    const chain = CHAINS[b.name].pts;
    for (let i = 0; i <= b.seg; i++) pts.push(chain[i]);
  }
  pts.push(to);
  return pts;
}

export default class GardenScene extends Phaser.Scene {
  constructor() {
    super('garden');
    this.handlers = { guruTap: () => {} };
    this.interactive = true;
    this.reduceMotion = false;
    this.walking = null;
    this.layout = { hud: 0, panel: 0 };
    this.focus = { x: PLAZA.x, y: 880 };
  }

  init(data) {
    this.manifest = data.manifest;
    this.reduceMotion = !!data.reduceMotion;
    this.bloomed = data.bloomed || [];
    this.onReady = data.onReady;
  }

  preload() {
    this.load.image('bg', 'assets/backgrounds/bg_sound_garden.png');
    this.load.image('avatar_static', 'assets/characters/char_player_idle.png');
    this.load.image('guru_static', 'assets/characters/char_npc_teacher.png');
    this.missingSheets = new Set();
    for (const [key, m] of Object.entries(this.manifest)) {
      this.load.spritesheet(key, m.file, { frameWidth: m.frameWidth, frameHeight: m.frameHeight });
    }
    this.load.on('loaderror', (file) => this.missingSheets.add(file.key));
  }

  create() {
    this.add.image(0, 0, 'bg').setOrigin(0).setDepth(-1000);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    for (const [key, m] of Object.entries(this.manifest)) {
      if (this.missingSheets.has(key)) continue;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: m.frames - 1 }),
        frameRate: m.fps,
        repeat: m.loop ? -1 : 0,
      });
    }

    this.avatar = this.makeCharacter('avatar', AVATAR_START, AVATAR_HEIGHT);
    this.guru = this.makeCharacter('guru', GURU_POS, GURU_HEIGHT);
    this.playAnim(this.avatar, 'avatar_idle');
    this.playAnim(this.guru, 'guru_idle');

    this.flowers = FLOWER_POS.map((p, i) => this.makeFlower(p, this.bloomed.includes(i)));
    this.bubble = this.makeBubble();

    this.marker = this.add.circle(0, 0, 26).setStrokeStyle(5, 0xffffff, 0.9).setVisible(false);

    this.input.on('pointerdown', (pointer) => this.onTap(pointer));
    this.scale.on('resize', () => this.applyCamera(true));
    this.applyCamera(true);
    this.onReady?.(this);
  }

  // ---------- watak ----------

  makeCharacter(who, pos, height) {
    const sheetKey = `${who}_idle`;
    const hasSheets = !this.missingSheets.has(sheetKey) && this.textures.exists(sheetKey);
    let sprite;
    if (hasSheets) {
      const m = this.manifest[sheetKey];
      sprite = this.add.sprite(pos.x, pos.y, sheetKey, 0).setOrigin(m.originX, m.originY);
      sprite.baseScale = height / (m.frameHeight - 24); // 24 = ruang tepi atas+bawah dalam sel
    } else {
      // Fallback: PNG statik jika sprite sheet tidak dapat dimuatkan.
      sprite = this.add.image(pos.x, pos.y, `${who}_static`).setOrigin(0.5, 1);
      sprite.baseScale = height / sprite.height;
    }
    sprite.who = who;
    sprite.hasSheets = hasSheets;
    this.placeCharacter(sprite);
    return sprite;
  }

  // Kesan 2.5D: lebih jauh (atas) = kecil sedikit; susunan lapisan ikut kedudukan y.
  placeCharacter(sprite) {
    const depthScale = Phaser.Math.Clamp(0.82 + ((sprite.y - 600) / 600) * 0.3, 0.78, 1.12);
    sprite.setScale(sprite.baseScale * depthScale);
    sprite.setDepth(sprite.y);
  }

  playAnim(sprite, key, onDone) {
    if (!sprite.hasSheets || !this.anims.exists(key)) {
      if (onDone) this.time.delayedCall(600, onDone);
      return;
    }
    sprite.play(key, true);
    if (onDone) sprite.once('animationcomplete', onDone);
  }

  // ---------- objek ----------

  makeFlower(p, open) {
    const c = this.add.container(p.x, p.y).setDepth(p.y);
    const g = this.add.graphics().setScale(1.7);
    c.add(g);
    c.g = g;
    c.open = open;
    this.drawFlower(c);
    return c;
  }

  drawFlower(c) {
    const g = c.g;
    g.clear();
    g.lineStyle(5, 0x4fa77f, 1);
    g.lineBetween(0, 0, 0, -38);
    g.fillStyle(0x6fcf9f, 1);
    g.fillEllipse(-10, -16, 18, 9);
    g.fillEllipse(10, -24, 18, 9);
    if (c.open) {
      g.fillStyle(0xffad9e, 1);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        g.fillCircle(Math.cos(a) * 14, -48 + Math.sin(a) * 14, 11);
      }
      g.fillStyle(0xffdb6b, 1);
      g.fillCircle(0, -48, 10);
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(-3, -51, 3);
    } else {
      g.fillStyle(0xffad9e, 1);
      g.fillEllipse(0, -46, 16, 22);
      g.fillStyle(0x86ddba, 1);
      g.fillTriangle(-9, -40, 9, -40, 0, -52);
    }
  }

  bloomFlower(index) {
    const c = this.flowers[index];
    if (!c || c.open) return;
    c.open = true;
    this.drawFlower(c);
    if (this.reduceMotion) return;
    c.setScale(0.3);
    this.tweens.add({ targets: c, scale: 1, duration: 700, ease: 'Back.Out' });
    this.sparkle(c.x, c.y - 48);
  }

  resetFlowers() {
    this.flowers.forEach((c) => {
      c.open = false;
      this.drawFlower(c);
    });
  }

  sparkle(x, y, color = 0xffdb6b) {
    if (this.reduceMotion) return;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const s = this.add.star(x, y, 5, 4, 9, color).setDepth(5000);
      this.tweens.add({
        targets: s,
        x: x + Math.cos(a) * 60,
        y: y + Math.sin(a) * 60,
        alpha: 0,
        scale: 0.4,
        duration: 800,
        ease: 'Cubic.Out',
        onComplete: () => s.destroy(),
      });
    }
  }

  makeBubble() {
    const c = this.add.container(0, 0).setDepth(4000);
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.lineStyle(4, 0x8ea8e8, 1);
    g.fillRoundedRect(-36, -26, 72, 46, 20);
    g.strokeRoundedRect(-36, -26, 72, 46, 20);
    g.fillTriangle(-8, 18, 8, 18, 0, 32);
    g.fillStyle(0x7ac8f5, 1);
    [-17, 0, 17].forEach((dx) => g.fillCircle(dx, -3, 6));
    c.add(g);
    this.positionBubble(c);
    if (!this.reduceMotion) {
      c.bob = this.tweens.add({ targets: g, y: -8, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
    return c;
  }

  positionBubble(c = this.bubble) {
    c.setPosition(this.guru.x + 20, this.guru.y - this.guru.displayHeight * 0.95 - 30);
  }

  showBubble(visible) {
    this.bubble.setVisible(visible);
  }

  noteBurst() {
    if (this.reduceMotion) return;
    for (let i = 0; i < 5; i++) {
      const n = this.add
        .text(700 + Math.random() * 180, 420 + Math.random() * 100, i % 2 ? '♪' : '♫', {
          fontSize: '44px',
          color: '#FFDB6B',
          stroke: '#283A50',
          strokeThickness: 4,
        })
        .setDepth(5000);
      this.tweens.add({
        targets: n,
        y: n.y - 140,
        alpha: 0,
        duration: 1300,
        delay: i * 120,
        ease: 'Sine.Out',
        onComplete: () => n.destroy(),
      });
    }
  }

  // ---------- input & pergerakan ----------

  setHandlers(handlers) {
    Object.assign(this.handlers, handlers);
  }

  setInteractive(on) {
    this.interactive = on;
    this.showBubble(on);
  }

  onTap(pointer) {
    if (!this.interactive) return;
    const p = { x: pointer.worldX, y: pointer.worldY };
    if (this.guru.getBounds().contains(p.x, p.y) || this.bubble.getBounds().contains(p.x, p.y)) {
      this.handlers.guruTap();
      return;
    }
    if (TREE_HIT.contains(p.x, p.y)) {
      this.handlers.sfx?.('bloom');
      this.noteBurst();
      return;
    }
    const path = route(this.avatar, p);
    if (!path) return;
    this.showMarker(p);
    this.walk(path);
  }

  showMarker(p) {
    this.marker.setPosition(p.x, p.y).setVisible(true).setAlpha(1).setScale(0.6).setDepth(p.y - 1);
    this.tweens.add({ targets: this.marker, scale: 1.2, alpha: 0, duration: 500 });
  }

  walk(points) {
    if (this.walking) this.walking.stop();
    return new Promise((resolve) => {
      const step = () => {
        const next = points.shift();
        if (!next) {
          this.walking = null;
          this.playAnim(this.avatar, 'avatar_idle');
          resolve();
          return;
        }
        const dist = Phaser.Math.Distance.BetweenPoints(this.avatar, next);
        if (dist < 2) return step();
        // Sprite asal menghadap kiri; cermin bila bergerak ke kanan.
        this.avatar.setFlipX(next.x > this.avatar.x + 1);
        this.playAnim(this.avatar, 'avatar_walk_side');
        this.walking = this.tweens.add({
          targets: this.avatar,
          x: next.x,
          y: next.y,
          duration: (dist / WALK_SPEED) * 1000,
          onUpdate: () => this.placeCharacter(this.avatar),
          onComplete: step,
          onStop: () => resolve(),
        });
      };
      step();
    });
  }

  async walkToGuru() {
    const path = route(this.avatar, MEET_POS);
    await this.walk(path || [MEET_POS]);
    this.avatar.setFlipX(false); // hadap guru (di sebelah kiri)
  }

  setGuruTalking(on) {
    this.playAnim(this.guru, on ? 'guru_talk' : 'guru_idle');
  }

  guruPoint() {
    this.playAnim(this.guru, 'guru_point', () => this.playAnim(this.guru, 'guru_idle'));
  }

  avatarWrite() {
    this.playAnim(this.avatar, 'avatar_writing', () => this.playAnim(this.avatar, 'avatar_idle'));
  }

  celebrate() {
    this.sparkle(this.avatar.x, this.avatar.y - AVATAR_HEIGHT * 0.9, 0xffdb6b);
  }

  // ---------- kamera ----------

  // hud/panel dalam piksel skrin (CSS); dunia kelihatan di antara kedua-duanya.
  setLayout(layout, focus, animate = true) {
    this.layout = layout;
    // span = tinggi dunia (piksel) yang mesti kelihatan di atas panel; null = seluruh taman
    if (focus === 'guru') this.focus = { x: (GURU_POS.x + MEET_POS.x) / 2, y: GURU_POS.y - 85, span: 300 };
    else if (focus === 'garden') this.focus = { x: PLAZA.x, y: 880, span: null };
    this.applyCamera(!animate);
  }

  applyCamera(instant) {
    const cam = this.cameras.main;
    const { width, height } = this.scale.gameSize;
    const dpr = this.registry.get('dpr') || 1;
    const hud = this.layout.hud * dpr;
    const panel = this.layout.panel * dpr;
    const base = Math.max(width / VIEW_W, height / WORLD_H);
    // Ketika misi, zum masuk supaya kamera boleh bergerak dan watak kekal kelihatan di atas panel.
    const span = this.focus.span;
    const zoom = span ? Phaser.Math.Clamp((height - panel - hud) / span, base * 1.3, base * 2.6) : base;
    const targetScreenY = (hud + (height - panel)) / 2;
    const cx = this.focus.x;
    const cy = this.focus.y + (height / 2 - targetScreenY) / zoom;
    if (instant || this.reduceMotion) {
      cam.setZoom(zoom);
      cam.centerOn(cx, cy);
    } else {
      cam.zoomTo(zoom, 450, 'Sine.easeInOut', true);
      cam.pan(cx, cy, 450, 'Sine.easeInOut', true);
    }
  }
}
