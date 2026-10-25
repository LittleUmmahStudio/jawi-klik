"""Repack AI-generated 8-frame sprite sheets into an exact 4x2 grid.

Each figure is detected as a connected alpha region (not by naive grid
cutting), then every frame is placed so that the head centre (x) and the
lowest foot pixel (y) sit on the same anchor in every cell. All sheets of
one character share the same scale and cell size, so they can be swapped
in-game without the character jumping or changing size.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

COLS, ROWS = 4, 2
ALPHA_MIN = 24          # pixels fainter than this are treated as empty
NOISE_AREA = 40         # stray specks smaller than this are dropped
HEAD_FRAC = 0.16        # top part of the figure used to find the head centre
PAD = 12                # empty margin kept around the widest frame


def load(path):
    im = np.array(Image.open(path).convert("RGBA"))
    im[im[..., 3] < ALPHA_MIN] = 0  # also wipes hidden colour under alpha 0
    return im


def figures(im):
    """Return 8 boolean masks, one per figure, in reading order."""
    mask = im[..., 3] > 0
    lab, n = ndimage.label(mask, structure=np.ones((3, 3)))
    areas = ndimage.sum(mask, lab, range(1, n + 1))
    order = np.argsort(areas)[::-1]
    seeds = [i + 1 for i in order[:COLS * ROWS]]
    if len(seeds) < COLS * ROWS or areas[order[COLS * ROWS - 1]] < 0.2 * areas[order[0]]:
        raise SystemExit("figures touch each other; cannot separate automatically")
    cents = {s: ndimage.center_of_mass(mask, lab, s) for s in seeds}
    groups = {s: lab == s for s in seeds}
    # attach small detached bits (motion lines, loose fingers) to nearest figure
    for i in order[COLS * ROWS:]:
        if areas[i] < NOISE_AREA:
            continue
        cy, cx = ndimage.center_of_mass(mask, lab, i + 1)
        near = min(seeds, key=lambda s: (cents[s][0] - cy) ** 2 + (cents[s][1] - cx) ** 2)
        groups[near] |= lab == i + 1
    ys = sorted(seeds, key=lambda s: cents[s][0])
    rows = [sorted(ys[r * COLS:(r + 1) * COLS], key=lambda s: cents[s][1]) for r in range(ROWS)]
    return [groups[s] for row in rows for s in row]


def measure(m):
    yy, xx = np.nonzero(m)
    top, bottom = yy.min(), yy.max()
    head = m[top:top + max(1, int((bottom - top) * HEAD_FRAC))]
    hx = np.nonzero(head.any(axis=0))[0]
    return dict(top=top, bottom=bottom, left=xx.min(), right=xx.max(),
                head_x=(hx.min() + hx.max()) / 2, head_w=hx.max() - hx.min() + 1)


def main(spec_path, src_root, out_root):
    spec = json.loads(Path(spec_path).read_text())
    manifest = {}
    for char, cfg in spec.items():
        sheets = {}
        for name, src in cfg["sheets"].items():
            im = load(Path(src_root) / src)
            ms = figures(im)
            sheets[name] = (im, ms, [measure(m) for m in ms])
        # common scale: match the reference sheet on both head width and body
        # height (AI output drifts a little in proportions between sheets)
        ref = sheets[cfg["ref"]][2]
        k = cfg["height_px"] / np.median([m["bottom"] - m["top"] for m in ref])
        target_head = k * np.median([m["head_w"] for m in ref])
        target_h = cfg["height_px"]
        placed = {}
        ext = dict(l=0, r=0, up=0)
        for name, (im, ms, meas) in sheets.items():
            scale = np.sqrt(target_head / np.median([m["head_w"] for m in meas])
                            * target_h / np.median([m["bottom"] - m["top"] for m in meas]))
            frames = []
            for m, me in zip(ms, meas):
                rgba = im.copy()
                rgba[~m] = 0
                crop = rgba[me["top"]:me["bottom"] + 1, me["left"]:me["right"] + 1]
                img = Image.fromarray(crop)
                img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))),
                                 Image.LANCZOS)
                ax = (me["head_x"] - me["left"]) * scale  # anchor x inside crop
                frames.append((img, ax))
                ext["l"] = max(ext["l"], ax)
                ext["r"] = max(ext["r"], img.width - ax)
                ext["up"] = max(ext["up"], img.height)
            placed[name] = frames
        half = int(np.ceil(max(ext["l"], ext["r"]))) + PAD
        cw, ch = half * 2, int(np.ceil(ext["up"])) + PAD * 2
        cw += cw % 2
        ch += ch % 2
        foot_y = ch - PAD
        for name, frames in placed.items():
            sheet = Image.new("RGBA", (cw * COLS, ch * ROWS), (0, 0, 0, 0))
            for i, (img, ax) in enumerate(frames):
                c, r = i % COLS, i // COLS
                sheet.alpha_composite(img, (c * cw + round(half - ax), r * ch + foot_y - img.height))
            out = Path(out_root) / cfg["out_dir"] / f"{name}.png"
            out.parent.mkdir(parents=True, exist_ok=True)
            sheet.save(out, optimize=True)
            manifest[name] = dict(
                file=f"assets/spritesheets/{cfg['out_dir']}/{name}.png",
                frameWidth=cw, frameHeight=ch, frames=COLS * ROWS, columns=COLS, rows=ROWS,
                originX=0.5, originY=round(foot_y / ch, 4),
                fps=cfg["fps"][name], loop=cfg["loop"][name])
            print(f"{name}: {cw*COLS}x{ch*ROWS} cell {cw}x{ch} -> {out.stat().st_size//1024} KB")
    Path(out_root).parent.joinpath("spritesheets.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main(*sys.argv[1:4])
