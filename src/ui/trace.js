// Papan surih: tulisan Jawi dirender daripada font sebenar (bukan gambar),
// kemudian liputan surihan jari dikira terhadap bentuk huruf tersebut.
// Ini BUKAN pengecaman tulisan; ia hanya memastikan murid menyurih kebanyakan bentuk.

const FONT = '"Noto Naskh Arabic", serif';
const NEED_COVERAGE = 0.7; // bahagian bentuk huruf yang mesti disurih
const MAX_STRAY = 0.4; // bahagian surihan yang boleh terkeluar jauh dari huruf

export function createTracer(container, text, { onProgress, onDone }) {
  const wrap = document.createElement('div');
  wrap.className = 'trace-board';
  const guide = document.createElement('canvas');
  const ink = document.createElement('canvas');
  guide.className = 'trace-guide';
  ink.className = 'trace-ink';
  wrap.append(guide, ink);
  container.append(wrap);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0;
  let H = 0;
  let brush = 0;
  let samples = []; // titik sampel dalam bentuk huruf
  let near = null; // topeng "dekat huruf" untuk mengesan conteng rawak
  let strokes = [];
  let current = null;
  let finished = false;

  function setup() {
    const rect = wrap.getBoundingClientRect();
    W = Math.round(rect.width * dpr);
    H = Math.round(rect.height * dpr);
    for (const c of [guide, ink]) {
      c.width = W;
      c.height = H;
    }
    const size = Math.min(H * 0.72, (W * 0.88) / Math.max(1, text.length * 0.62));
    brush = Math.max(14 * dpr, size * 0.11);
    const font = `700 ${size}px ${FONT}`;
    const baseX = W / 2;
    const baseY = H * 0.5;

    const draw = (ctx) => {
      ctx.font = font;
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };

    // Panduan: isi lembut + garis putus-putus
    const g = guide.getContext('2d');
    g.clearRect(0, 0, W, H);
    draw(g);
    g.fillStyle = '#E3EBFB';
    g.fillText(text, baseX, baseY);
    g.setLineDash([3 * dpr, 7 * dpr]);
    g.lineWidth = 2.5 * dpr;
    g.strokeStyle = '#8EA8E8';
    g.strokeText(text, baseX, baseY);

    // Topeng bentuk huruf (untuk sampel liputan)
    const m = document.createElement('canvas');
    m.width = W;
    m.height = H;
    const mc = m.getContext('2d', { willReadFrequently: true });
    draw(mc);
    mc.fillStyle = '#000';
    mc.fillText(text, baseX, baseY);
    const glyph = mc.getImageData(0, 0, W, H).data;
    const step = Math.max(3, Math.round(brush / 3));
    samples = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (glyph[(y * W + x) * 4 + 3] > 128) samples.push({ x, y, hit: false });
      }
    }

    // Topeng "dekat huruf": bentuk huruf yang ditebalkan
    mc.clearRect(0, 0, W, H);
    mc.lineJoin = 'round';
    mc.lineWidth = brush * 2.4;
    mc.strokeStyle = '#000';
    mc.fillText(text, baseX, baseY);
    mc.strokeText(text, baseX, baseY);
    near = mc.getImageData(0, 0, W, H).data;

    redraw();
  }

  function isNear(p) {
    const x = Math.round(p.x);
    const y = Math.round(p.y);
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    return near[(y * W + x) * 4 + 3] > 128;
  }

  function score() {
    const r2 = (brush * 0.9) ** 2;
    samples.forEach((s) => (s.hit = false));
    let pts = 0;
    let stray = 0;
    for (const st of strokes) {
      for (const p of st) {
        pts++;
        if (!isNear(p)) stray++;
        for (const s of samples) {
          if (!s.hit && (s.x - p.x) ** 2 + (s.y - p.y) ** 2 <= r2) s.hit = true;
        }
      }
    }
    const coverage = samples.length ? samples.filter((s) => s.hit).length / samples.length : 0;
    return { coverage, stray: pts ? stray / pts : 0 };
  }

  function redraw() {
    const c = ink.getContext('2d');
    c.clearRect(0, 0, W, H);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = brush;
    c.strokeStyle = 'rgba(40, 58, 80, 0.85)';
    for (const st of strokes) {
      c.beginPath();
      st.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      if (st.length === 1) c.lineTo(st[0].x + 0.1, st[0].y);
      c.stroke();
    }
  }

  function evaluate() {
    const { coverage, stray } = score();
    onProgress?.(Math.min(1, coverage / NEED_COVERAGE), stray > MAX_STRAY);
    if (!finished && coverage >= NEED_COVERAGE && stray <= MAX_STRAY) {
      finished = true;
      onDone?.();
    }
  }

  const pos = (e) => {
    const r = ink.getBoundingClientRect();
    return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
  };

  ink.addEventListener('pointerdown', (e) => {
    if (finished || current) return;
    e.preventDefault();
    ink.setPointerCapture(e.pointerId);
    current = { id: e.pointerId, pts: [pos(e)] };
    strokes.push(current.pts);
    redraw();
  });
  ink.addEventListener('pointermove', (e) => {
    if (!current || e.pointerId !== current.id) return;
    const p = pos(e);
    const last = current.pts[current.pts.length - 1];
    if ((p.x - last.x) ** 2 + (p.y - last.y) ** 2 < (2 * dpr) ** 2) return;
    current.pts.push(p);
    redraw();
  });
  const end = (e) => {
    if (!current || e.pointerId !== current.id) return;
    current = null;
    evaluate();
  };
  ink.addEventListener('pointerup', end);
  ink.addEventListener('pointercancel', end);

  // Tunggu font Jawi dimuatkan sebelum mengukur bentuk huruf.
  document.fonts.load(`700 40px ${FONT}`, text).finally(() => requestAnimationFrame(setup));

  return {
    undo() {
      if (finished) return;
      strokes.pop();
      redraw();
      evaluate();
    },
    clear() {
      strokes = [];
      finished = false;
      redraw();
      evaluate();
    },
    resize: setup,
  };
}
