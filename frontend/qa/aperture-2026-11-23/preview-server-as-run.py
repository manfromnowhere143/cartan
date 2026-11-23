from pathlib import Path
import http.server,json,mimetypes
from urllib.parse import urlsplit,unquote
root=Path(Path('/private/tmp/cartan-aperture-current-path').read_text())/'package-reviewed/.vercel/output'
headers=json.loads((root/'config.json').read_text())['routes'][0]['headers'];static=(root/'static').resolve()
class Handler(http.server.BaseHTTPRequestHandler):
 def do_GET(self):
  p=(static/unquote(urlsplit(self.path).path).lstrip('/')).resolve()
  if not p.is_relative_to(static):self.send_error(403);return
  if p.is_dir():p=p/'index.html'
  code=200 if p.is_file() else 404
  if code==404:p=static/'404.html'
  data=p.read_bytes();total=len(data);start,end=0,total-1
  r=self.headers.get('Range','')
  if code==200 and r.startswith('bytes='):
   try:
    a,b=r[6:].split('-');start=int(a);end=min(int(b) if b else end,end)
    if not 0<=start<=end:raise ValueError()
    code=206;data=data[start:end+1]
   except ValueError:self.send_error(416);return
  self.send_response(code)
  for k,v in headers.items():self.send_header(k,v)
  self.send_header('Content-Type','text/javascript' if p.suffix=='.mjs' else mimetypes.guess_type(str(p))[0] or 'application/octet-stream')
  self.send_header('Content-Length',str(len(data)));self.send_header('Accept-Ranges','bytes');self.send_header('X-Robots-Tag','noindex')
  if code==206:self.send_header('Content-Range',f'bytes {start}-{end}/{total}')
  self.end_headers()
  try:self.wfile.write(data)
  except (BrokenPipeError,ConnectionResetError):pass
 def log_message(self,*a):pass
print('CARTAN aperture candidate http://127.0.0.1:4191/laboratory/ — exact packaged CSP',flush=True)
http.server.ThreadingHTTPServer(('127.0.0.1',4191),Handler).serve_forever()
