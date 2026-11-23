"""Loopback-only release review. Adds a QA harness, never changes release bytes.

No dependency, publication or browser automation. --profile slow is an explicitly
approximate server throttle: 40ms/request, 1MiB/s/body, unthrottled local CPU.
"""
import argparse, http.server, json, time
from pathlib import Path
from urllib.parse import urlsplit, unquote

QA = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('package', type=Path)
parser.add_argument('--port', type=int, default=4181)
parser.add_argument('--profile', choices=['local', 'slow'], default='local')
parser.add_argument('--report-dir', default='interior-2026-11-23')
args = parser.parse_args()
ROOT = (args.package / '.vercel/output/static').resolve()
assert ROOT.is_dir()
REPORTS = (QA / args.report_dir).resolve()
assert REPORTS.is_relative_to(QA) and REPORTS.is_dir()

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/qa/interior-review.html':
            file = QA / 'interior-review.html'
        elif path == '/qa/interior-probe.mjs':
            file = QA / 'interior-probe.mjs'
        elif path == '/qa/profile':
            data = json.dumps({'profile': args.profile, 'package': args.package.name,
                               'cpu': 'unthrottled', 'cache': 'no-store', 'reportDirectory': args.report_dir}).encode()
            self.send_response(200); self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data))); self.end_headers()
            self.wfile.write(data); return
        else:
            file = (ROOT / path.lstrip('/')).resolve()
            if not file.is_relative_to(ROOT): self.send_error(403); return
            if file.is_dir(): file = file / 'index.html'
        status = 200 if file.is_file() else 404
        if status == 404: file = ROOT / '404.html'
        data = file.read_bytes()
        mime = {'.html':'text/html; charset=utf-8', '.mjs':'text/javascript',
                '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml',
                '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp',
                '.mp4':'video/mp4'}.get(file.suffix, 'application/octet-stream')
        start, end = 0, len(data)-1
        requested = self.headers.get('Range', '')
        if status == 200 and requested.startswith('bytes='):
            try:
                left, right = requested[6:].split('-')
                start = int(left); end = min(int(right) if right else end, end)
                if not 0 <= start <= end: raise ValueError()
                status = 206
            except ValueError: self.send_error(416); return
        total = len(data); data = data[start:end+1]
        if args.profile == 'slow': time.sleep(.04)
        self.send_response(status); self.send_header('Content-Type', mime)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Accept-Ranges', 'bytes')
        if status == 206: self.send_header('Content-Range', f'bytes {start}-{end}/{total}')
        self.end_headers()
        try:
            for offset in range(0, len(data), 65536):
                self.wfile.write(data[offset:offset+65536])
                if args.profile == 'slow': time.sleep(65536 / 1048576)
        except (BrokenPipeError, ConnectionResetError): pass

    def do_POST(self):
        if self.path != '/qa/interior-report': self.send_error(404); return
        size = int(self.headers.get('Content-Length', 0))
        if not 0 < size <= 500000: self.send_error(413); return
        report = json.loads(self.rfile.read(size))
        report['server_profile'] = args.profile
        report['package'] = args.package.name
        path = REPORTS / f'browser-{time.time_ns()}.json'
        path.write_text(json.dumps(report, indent=2)+'\n')
        self.send_response(204); self.end_headers()

print(f'Local CARTAN candidate: http://127.0.0.1:{args.port}/\nReview: http://127.0.0.1:{args.port}/qa/interior-review.html', flush=True)
http.server.ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
