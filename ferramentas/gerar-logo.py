"""
Gera os SVGs do logo (assets/svg/logo-*.svg, cavalo.svg, favicon.svg) a partir do JSON
criado por vetorizar-logo.py.
Uso: python gerar-logo.py caminhos.json ../assets/svg
"""
import json, sys, os
P = json.load(open(sys.argv[1])); OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
G, H = P["green"], P["gray"]
GREEN, GRAY = "#336F51", "#657983"
# horse 2 and 3 are copies of horse 1 shifted right (measured from the raster)
HORSES = [(0, 0), (538, 1), (1077.5, 1)]

def horses(fill, ids=True, n=3):
    first = f'<path id="cavalo" fill="{fill}" d="{H}"/>' if ids else f'<path fill="{fill}" d="{H}"/>'
    uses = "".join(f'<use href="#cavalo" x="{x}" y="{y}"/>' for x, y in HORSES[1:n])
    return first + uses

def write(name, body, vb, title):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-labelledby="t">'
           f'<title id="t">{title}</title>{body}</svg>\n')
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(svg)
    print(name, len(svg) // 1024, "KB")

# 1) stacked logo, original colours
write("logo-poney.svg", f'<path fill="{GREEN}" d="{G}"/>{horses(GRAY)}', "0 0 1868 866", "Poney Turismo")
# 2) white version for dark backgrounds
write("logo-poney-branco.svg", f'<g fill="#fff"><path d="{G}"/>{horses("#fff")}</g>', "0 0 1868 866", "Poney Turismo")
# 3) horizontal lockup: two horses + wordmark (like the 2020 header logo)
s = 250 / 597  # horses (y 268..865) scaled to wordmark height
hx = -41 * s
horiz = (f'<g transform="translate({hx:.1f} {-268 * s:.1f}) scale({s:.4f})">{horses(GRAY, n=2)}</g>'
         f'<path transform="translate({(1140 - 41) * s + 50:.1f} 0)" fill="{GREEN}" d="{G}"/>')
w = (1140 - 41) * s + 50 + 1868
write("logo-poney-horizontal.svg", horiz, f"0 0 {w:.0f} 250", "Poney Turismo")
# 4) single horse (icon / favicon base) — horse 1 bbox ~ x 41..600, y 268..865
write("cavalo.svg", f'<path fill="{GRAY}" d="{H}"/>', "30 258 590 615", "Cavalo Poney")
# 5) favicon: white horse on brand-green rounded square
fav = (f'<rect width="640" height="640" rx="140" fill="#135E33"/>'
       f'<g transform="translate(52 -150) scale(0.8375)"><path fill="#fff" d="{H}"/></g>')
write("favicon.svg", fav, "0 0 640 640", "Poney Turismo")
