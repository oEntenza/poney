"""
Vetoriza o logo Poney (PNG em 2 cores) com potrace e salva os caminhos em JSON.
Uso: python vetorizar-logo.py LOGO-PONEY.png saida.json [escala]
  escala < 1 gera um traçado mais leve (o site usa 0.2 para o logo e a pintura dos ônibus)
Requer: pip install pillow numpy potracer
"""
import sys, json
import numpy as np
from PIL import Image
import potrace

SRC, OUT = sys.argv[1], sys.argv[2]
UP = 3
SCALE = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0  # <1 gives a lighter, simplified trace
im = Image.open(SRC).convert('RGBA')
if SCALE != 1.0:
    im = im.resize((round(im.width * SCALE), round(im.height * SCALE)), Image.LANCZOS)
a = np.array(im).astype(int)
rgb, alpha = a[..., :3], a[..., 3]
is_green = (rgb[..., 1] - rgb[..., 0]) > 40

def layer(mask_color):
    # alpha restricted to one colour, upscaled smoothly, then thresholded
    al = np.where(mask_color, alpha, 0).astype(np.uint8)
    big = Image.fromarray(al).resize((al.shape[1] * UP, al.shape[0] * UP), Image.BICUBIC)
    return np.array(big) > 127

def fmt(v):
    s = f"{v / UP:.1f}"
    return s.rstrip('0').rstrip('.') if '.' in s else s

def to_path(mask, keep=lambda cx: True):
    bm = potrace.Bitmap(~mask)  # potracer treats True as background
    plist = bm.trace(turdsize=30, alphamax=1.0, opticurve=True, opttolerance=0.25)
    parts = []
    for curve in plist:
        xs = [curve.start_point.x] + [s.end_point.x for s in curve.segments]
        if not keep((min(xs) + max(xs)) / 2 / UP):
            continue
        sp = curve.start_point
        d = [f"M{fmt(sp.x)} {fmt(sp.y)}"]
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{fmt(seg.c.x)} {fmt(seg.c.y)}L{fmt(seg.end_point.x)} {fmt(seg.end_point.y)}")
            else:
                d.append(f"C{fmt(seg.c1.x)} {fmt(seg.c1.y)} {fmt(seg.c2.x)} {fmt(seg.c2.y)} {fmt(seg.end_point.x)} {fmt(seg.end_point.y)}")
        d.append("Z")
        parts.append("".join(d))
    return "".join(parts)

green = to_path(layer(is_green))
gray = to_path(layer(~is_green), keep=lambda cx: cx < 560 * SCALE)  # first horse only
json.dump({"w": im.size[0], "h": im.size[1], "green": green, "gray": gray}, open(OUT, "w"))
print(len(green), len(gray))
