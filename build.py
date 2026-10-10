#!/usr/bin/env python3
"""Build Ubuntu Bible: regenerate sw.js (cache VERSION + precache list), zip the PWA,
and produce a single-file preview (all CSS/JS/icons inlined)."""
import base64, json, pathlib, re, zipfile

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT.parent / 'dist'
OUT.mkdir(exist_ok=True)

version = re.search(r"VERSION:\s*'([^']+)'", (ROOT / 'js/core.js').read_text()).group(1)
assets = ['./', 'index.html', 'manifest.webmanifest', 'css/style.css', 'js/core.js', 'js/tools.js', 'js/outputs.js', 'js/outputs2.js',
          *[f'js/data/d{i}.js' for i in range(1, 10)], 'js/shell.js', 'js/app.js', 'js/cat.js',
          'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png']

sw = f"""/* Ubuntu Bible service worker — bump VERSION on every release */
const VERSION = 'ubuntu-bible-v{version}';
const ASSETS = {json.dumps(assets, indent=2)};

self.addEventListener('install', e => {{
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
}});
self.addEventListener('activate', e => {{
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
}});
self.addEventListener('fetch', e => {{
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {{
    e.respondWith(fetch(req).then(r => {{ const c = r.clone(); caches.open(VERSION).then(x => x.put('index.html', c)); return r; }})
      .catch(() => caches.match('index.html', {{ ignoreSearch: true }})));
    return;
  }}
  e.respondWith(caches.match(req, {{ ignoreSearch: true }}).then(hit => hit || fetch(req).then(r => {{
    if (r.ok) {{ const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }}
    return r;
  }})));
}});
"""
(ROOT / 'sw.js').write_text(sw)

# zip
zp = OUT / 'ubuntu-bible.zip'
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in sorted(ROOT.rglob('*')):
        rel = p.relative_to(ROOT).parts
        if p.is_file() and not any(x.startswith('.') or x in ('__pycache__', 'docs') for x in rel) and p.suffix != '.pyc' and p.name != 'maskable.svg':
            z.write(p, 'ubuntu-bible/' + p.relative_to(ROOT).as_posix())

# single-file preview
html = (ROOT / 'index.html').read_text()
svg_uri = 'data:image/svg+xml;base64,' + base64.b64encode((ROOT / 'icons/icon.svg').read_bytes()).decode()
png_uri = 'data:image/png;base64,' + base64.b64encode((ROOT / 'icons/apple-touch-icon.png').read_bytes()).decode()
html = html.replace('<link rel="manifest" href="manifest.webmanifest">\n', '')
html = html.replace('href="icons/icon.svg"', f'href="{svg_uri}"').replace('src="icons/icon.svg"', f'src="{svg_uri}"')
html = html.replace('href="icons/apple-touch-icon.png"', f'href="{png_uri}"')
html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + (ROOT / 'css/style.css').read_text() + '\n</style>')
def inline(m):
    src = (ROOT / m.group(1)).read_text().replace('</script', '<\\/script')
    return '<script>\n' + src + '\n</script>'
html = html.replace('<script src="js/core.js"></script>', '<script>window.UB_INLINE=true;</script>\n<script src="js/core.js"></script>')
html = re.sub(r'<script src="([^"]+)"></script>', inline, html)
(OUT / 'index.html').write_text(html)
print('version', version, '| zip', zp.stat().st_size // 1024, 'KB | preview', (OUT / 'index.html').stat().st_size // 1024, 'KB')
