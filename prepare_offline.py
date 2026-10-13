"""Generate the offline worker after each Flutter web build. No user data is read."""
import base64
import hashlib
import json
import sys
from pathlib import Path

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent
paths = [root / name for name in ('index.html','offline.css','offline.js','manifest.json','flutter_bootstrap.js','flutter.js','main.dart.js','favicon.png','version.json')]
for folder in ('assets','icons','canvaskit'):
    paths.extend(p for p in (root / folder).rglob('*') if p.is_file() and not p.name.endswith(('.symbols','.map')))
files = []
size = 0
for path in sorted(paths):
    blob = path.read_bytes()
    if path.suffix in ('.html','.js','.css','.json','.frag') or path.name == 'NOTICES':
        blob = blob.replace(b'\r\n', b'\n')
        path.write_bytes(blob)
    size += len(blob)
    files.append({'url':path.relative_to(root).as_posix(),'integrity':'sha256-' + base64.b64encode(hashlib.sha256(blob).digest()).decode()})
template = (root / 'offline-worker.template.js').read_text(encoding='utf-8')
revision = hashlib.sha256((json.dumps(files) + template).encode()).hexdigest()[:16]
worker = template.replace('__REVISION__',revision).replace('__FILES__',json.dumps(files,separators=(',',':')))
(root / 'sw.js').write_bytes(worker.encode('utf-8'))
print(json.dumps({'revision':revision,'files':len(files),'megabytes':round(size / 1048576,1)}))
