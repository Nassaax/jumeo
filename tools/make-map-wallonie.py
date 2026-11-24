"""Génère data/wallonie-map.json : tracés SVG des 5 provinces wallonnes (+ Bruxelles et Flandre en gris clair)
à partir d'un fichier TopoJSON des provinces belges (source : github.com/arneh61/Belgium-Map, Provincies.json,
données GADM). Utilisé par build.js pour la carte cliquable (tools/map-part.js).

Usage : python3 tools/make-map-wallonie.py <Provincies.json>
"""
import json, math, sys, os

src = json.load(open(sys.argv[1], encoding='utf-8'))
sx, sy = src['transform']['scale']
tx, ty = src['transform']['translate']

# 1. Arcs décodés (coordonnées quantifiées, codage différentiel)
arcs = []
for arc in src['arcs']:
    x = y = 0
    pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)

def arc_pts(i):
    return arcs[i] if i >= 0 else list(reversed(arcs[~i]))

def ring(idx):
    pts = []
    for i in idx:
        a = arc_pts(i)
        pts.extend(a if not pts else a[1:])
    return pts

# 2. Projection simple (équirectangulaire corrigée à 50,5° de latitude), cadrée sur la Wallonie
K = math.cos(math.radians(50.5))
def proj(lon, lat):
    return lon * K, -lat

geoms = src['objects']['layer']['geometries']
wal = [g for g in geoms if g['properties']['NAME_1'] == 'Wallonie']
allx, ally = [], []
for g in wal:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        for r in poly:
            for lon, lat in ring(r):
                X, Y = proj(lon, lat); allx.append(X); ally.append(Y)
minx, maxx, miny, maxy = min(allx), max(allx), min(ally), max(ally)
W = 1000.0
S = W / (maxx - minx)
H = (maxy - miny) * S
PAD = 12

def to_svg(lon, lat):
    X, Y = proj(lon, lat)
    return round((X - minx) * S + PAD, 1), round((Y - miny) * S + PAD, 1)

def path(g):
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    d = []
    for poly in polys:
        for r in poly:
            pts = [to_svg(*p) for p in ring(r)]
            # simplification légère : on saute les points à moins de 1,2 unité du précédent
            out = [pts[0]]
            for p in pts[1:]:
                if abs(p[0] - out[-1][0]) + abs(p[1] - out[-1][1]) >= 1.2:
                    out.append(p)
            d.append('M' + ' '.join(f'{x} {y}' for x, y in out) + 'Z')
    return ''.join(d)

SLUG = {'Brabant Wallon': 'brabant-wallon', 'Hainaut': 'hainaut', 'Liège': 'liege', 'Luxembourg': 'luxembourg', 'Namur': 'namur'}
NOM = {'Brabant Wallon': 'Brabant wallon', 'Hainaut': 'Hainaut', 'Liège': 'Liège', 'Luxembourg': 'Luxembourg', 'Namur': 'Namur'}
out = {'viewBox': f'0 0 {round(W + 2 * PAD)} {round(H + 2 * PAD)}', 'provinces': [], 'others': []}
for g in geoms:
    n = g['properties']['NAME_2']
    if g['properties']['NAME_1'] == 'Wallonie':
        out['provinces'].append({'id': SLUG[n], 'name': NOM[n], 'd': path(g)})
    else:
        out['others'].append(path(g))

# 3. Fonction de projection réutilisable par build.js pour placer les communes
out['proj'] = {'K': K, 'minx': minx, 'miny': miny, 'S': S, 'PAD': PAD}
dest = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'wallonie-map.json')
json.dump(out, open(dest, 'w', encoding='utf-8'), ensure_ascii=False)
print('OK :', dest, out['viewBox'], sum(len(p['d']) for p in out['provinces']), 'caractères')
