"""Icônes et image de partage de la démo Lux, à partir de son logo (PNG fond blanc).
Usage : python3 tools/demo_lux_images.py <logo.png> <dossier de sortie>
"""
import os, sys
from PIL import Image, ImageDraw

logo_path, out = sys.argv[1], sys.argv[2]
logo = Image.open(logo_path).convert('RGB')
w, h = logo.size
px = logo.load()

# Le symbole (maison dans les orbites) est à gauche : on cherche la première bande blanche verticale.
def col_has_ink(x):
    return any(sum(px[x, y]) < 600 for y in range(0, h, 2))
cols = [col_has_ink(x) for x in range(w)]
start = next(x for x in range(w) if cols[x])
end = start
gap = 0
for x in range(start, w):
    if cols[x]:
        end, gap = x, 0
    else:
        gap += 1
        if gap > w * 0.02:
            break
sym = logo.crop((start, 0, end + 1, h))
bb = Image.eval(sym, lambda v: 255 - v).getbbox()
sym = sym.crop(bb)

def square(size, ratio, bg=(255, 255, 255)):
    img = Image.new('RGB', (size, size), bg)
    s = sym.copy()
    k = size * ratio / max(s.size)
    s = s.resize((max(1, round(s.width * k)), max(1, round(s.height * k))), Image.LANCZOS)
    img.paste(s, ((size - s.width) // 2, (size - s.height) // 2))
    return img

os.makedirs(os.path.join(out, 'icons'), exist_ok=True)
square(64, .9).save(os.path.join(out, 'favicon.png'))
square(180, .8).save(os.path.join(out, 'apple-touch-icon.png'))
square(192, .8).save(os.path.join(out, 'icons', 'icon-192.png'))
square(512, .8).save(os.path.join(out, 'icons', 'icon-512.png'))
square(512, .6).save(os.path.join(out, 'icons', 'maskable-512.png'))

# Image de partage 1200×630 : logo sur blanc, bande bleu nuit et filet jaune en bas.
og = Image.new('RGB', (1200, 630), (255, 255, 255))
d = ImageDraw.Draw(og)
d.rectangle((0, 560, 1200, 630), fill=(11, 36, 65))
d.rectangle((0, 552, 1200, 560), fill=(242, 183, 5))
k = 960 / logo.width
big = logo.resize((960, round(logo.height * k)), Image.LANCZOS)
og.paste(big, ((1200 - big.width) // 2, (552 - big.height) // 2))
og.save(os.path.join(out, 'og-image.jpg'), quality=88)
print('OK : icônes et image de partage de la démo')
