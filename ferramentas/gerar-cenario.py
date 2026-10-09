"""
Gera as camadas do cenário do topo do site (assets/svg/cenario-*.svg).
Cada camada é um "azulejo" horizontal que emenda sem costura, para rolar em loop.
Uso: python ferramentas/gerar-cenario.py
"""
import math
import os
import random

SAIDA = os.path.join(os.path.dirname(__file__), '..', 'assets', 'svg')


def n(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')


def salvar(nome, w, h, corpo):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w}" height="{h}" preserveAspectRatio="none">{corpo}</svg>\n')
    with open(os.path.join(SAIDA, nome), 'w', encoding='utf-8') as f:
        f.write(svg)
    print(nome, len(svg) // 1024, 'KB')


# --- Serra do Mar (duas cadeias de morros) ------------------------------------
def serra():
    w, h = 1600, 200
    tras = ('M0 112 C120 64 210 38 310 58 S470 128 570 98 S770 22 890 48 '
            'S1070 138 1190 108 S1420 36 1520 74 S1480 160 1600 112 V200 H0Z')
    frente = ('M0 150 C100 122 180 100 262 114 S424 162 524 140 S704 88 824 104 '
              'S1004 166 1124 150 S1364 94 1462 118 S1500 180 1600 150 V200 H0Z')
    corpo = (f'<path fill="#22804b" d="{tras}"/>'
             f'<path fill="#1b7042" d="{frente}"/>')
    salvar('cenario-serra.svg', w, h, corpo)


# --- Cidade: prédios da orla + Ponte Pênsil de São Vicente --------------------
def ponte(bx, deck):
    """Silhueta lateral da Ponte Pênsil (vão central entre duas torres)."""
    t1, t2, topo, flecha = bx + 130, bx + 490, deck - 118, deck - 14
    p = []
    # tabuleiro
    p.append(f'<rect x="{bx - 20}" y="{deck - 2}" width="{640 + 40}" height="9"/>')
    p.append(f'<rect x="{bx - 20}" y="{deck + 7}" width="{640 + 40}" height="3" opacity=".6"/>')
    # torres (pórticos com capitel)
    for tx in (t1, t2):
        p.append(f'<path d="M{tx - 9} {deck + 10} L{tx - 7} {topo} H{tx + 7} L{tx + 9} {deck + 10}Z"/>')
        p.append(f'<rect x="{tx - 12}" y="{topo - 8}" width="24" height="9" rx="2"/>')
        p.append(f'<rect x="{tx - 4}" y="{topo - 16}" width="8" height="9" rx="2"/>')
        p.append(f'<rect x="{tx - 10}" y="{topo + 30}" width="20" height="4"/>')
    # cabos: vão central (parábola) e estais até as ancoragens
    ctrl = 2 * flecha - topo  # controle da quadrática para a flecha desejada
    cabos = (f'M{t1} {topo} Q{(t1 + t2) / 2} {ctrl} {t2} {topo} '
             f'M{bx} {deck} Q{bx + 80} {deck - 40} {t1} {topo} '
             f'M{bx + 640} {deck} Q{bx + 560} {deck - 40} {t2} {topo}')
    p.append(f'<path d="{cabos}" fill="none" stroke="currentColor" stroke-width="3.2"/>')
    # pendurais
    pend = []
    for i in range(1, 18):
        t = i / 18
        x = t1 + (t2 - t1) * t
        y = (1 - t) ** 2 * topo + 2 * t * (1 - t) * ctrl + t ** 2 * topo
        pend.append(f'M{n(x)} {n(y)}V{deck}')
    p.append(f'<path d="{"".join(pend)}" stroke="currentColor" stroke-width="1.3" opacity=".8"/>')
    return ''.join(p)


def cidade():
    w, h = 2000, 220
    rnd = random.Random(1994)
    chao = 204
    predios, luzes = [], []
    x = 10
    while x < 1060:
        larg = rnd.randint(34, 70)
        alt = rnd.randint(60, 150) if rnd.random() > 0.25 else rnd.randint(30, 60)
        y = chao - alt
        predios.append(f'<rect x="{x}" y="{y}" width="{larg}" height="{alt + 2}"/>')
        if alt > 90 and rnd.random() > 0.5:  # caixa d'água / antena
            predios.append(f'<rect x="{x + larg // 2 - 5}" y="{y - 8}" width="10" height="9"/>')
        # janelas acesas
        for jy in range(y + 10, chao - 10, 14):
            for jx in range(x + 6, x + larg - 8, 11):
                if rnd.random() < 0.16:
                    luzes.append(f'M{jx} {jy}h4v6h-4z')
        x += larg + rnd.randint(2, 14)
    corpo = (
        '<g fill="#0e4b2a" color="#0e4b2a">'
        + ''.join(predios)
        + ponte(1260, chao - 12)
        + f'<rect x="0" y="{chao}" width="{w}" height="{h - chao}"/>'
        + '</g>'
        + f'<path fill="#ebf2b3" opacity=".35" d="{"".join(luzes)}"/>'
    )
    salvar('cenario-cidade.svg', w, h, corpo)


# --- Orla: coqueiros, postes e mureta -----------------------------------------
def folha(cx, cy, ang, comp, larg, caida):
    a = math.radians(ang)
    tx, ty = cx + math.cos(a) * comp, cy + math.sin(a) * comp + caida
    mx, my = cx + math.cos(a) * comp * 0.5, cy + math.sin(a) * comp * 0.5 - comp * 0.18
    px, py = -math.sin(a) * larg, math.cos(a) * larg
    return (f'M{n(cx)} {n(cy)}Q{n(mx + px)} {n(my + py)} {n(tx)} {n(ty)}'
            f'Q{n(mx - px)} {n(my - py)} {n(cx)} {n(cy)}Z')


def coqueiro(x, base, alt, incl, rnd):
    topo_x, topo_y = x + incl, base - alt
    tronco = (f'M{x - 6} {base}Q{n(x + incl * 0.2)} {n(base - alt * 0.5)} {n(topo_x - 2.5)} {n(topo_y)}'
              f'H{n(topo_x + 2.5)}Q{n(x + incl * 0.2 + 7)} {n(base - alt * 0.5)} {x + 6} {base}Z')
    folhas = []
    for ang in (-170, -140, -105, -75, -40, -10, 20, 160):
        ang += rnd.uniform(-8, 8)
        comp = alt * rnd.uniform(0.32, 0.42)
        caida = comp * (0.35 if abs(math.cos(math.radians(ang))) > 0.5 else 0.1)
        folhas.append(folha(topo_x, topo_y, ang, comp, comp * 0.16, caida))
    return f'<path d="{tronco}{"".join(folhas)}"/>'


def orla():
    # 60 unidades de folga acima dos coqueiros mais altos para as folhas não serem cortadas
    w, h = 1400, 230
    rnd = random.Random(13)
    base = 210
    els = []
    for x, alt, incl in ((90, 120, 18), (150, 92, -14), (520, 132, 22), (860, 104, -18), (915, 140, 12), (1240, 116, 16)):
        els.append(coqueiro(x, base, alt, incl, rnd))
    for x in (330, 700, 1090):  # postes
        els.append(f'<path d="M{x - 2} {base}V{base - 96}q0-10 10-10h16v4h-14q-6 0-6 6V{base}z"/>'
                   f'<rect x="{x + 18}" y="{base - 108}" width="14" height="6" rx="3"/>')
    mureta = f'<rect x="0" y="{base - 6}" width="{w}" height="{h - base + 6}"/>'
    balaustres = ''.join(f'<rect x="{x}" y="{base - 22}" width="4" height="18"/>' for x in range(0, w, 18))
    corrimao = f'<rect x="0" y="{base - 26}" width="{w}" height="5" rx="2"/>'
    corpo = f'<g fill="#083a1e">{"".join(els)}{balaustres}{corrimao}{mureta}</g>'
    salvar('cenario-orla.svg', w, h, corpo)


if __name__ == '__main__':
    serra()
    cidade()
    orla()
