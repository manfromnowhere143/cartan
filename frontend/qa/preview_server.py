"""Loopback-only review server with byte ranges and explicit QA fixtures.
No QA switches or monkey patches are shipped in the production application.
"""
import http.server,json,re,sys
from pathlib import Path
from urllib.parse import urlsplit,parse_qs,unquote
ROOT=Path(__file__).resolve().parent.parent
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def do_GET(self):
  parsed=urlsplit(self.path)
  if parsed.path=='/qa/frame':
   mode=parse_qs(parsed.query).get('mode',['normal'])[0]
   if mode not in ['normal','reduced','save-data','denied','poster','missing']:self.send_error(400);return
   init="""<base href="/"><script>
window.__qa={mode:MODE,errors:[],requests:[],requestContexts:[],events:[],shifts:0};
addEventListener('error',e=>{if(e.message)__qa.errors.push(e.message);});
addEventListener('unhandledrejection',e=>__qa.errors.push(String(e.reason)));
try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)__qa.shifts+=e.value;}).observe({type:'layout-shift',buffered:true});}catch{}
const origMatch=window.matchMedia.bind(window);
if(['reduced','poster'].includes(__qa.mode)) window.matchMedia=q=>q.includes('prefers-reduced-motion')?Object.assign(new EventTarget(),{matches:true,media:q,onchange:null,addListener(){},removeListener(){}}):origMatch(q);
if(__qa.mode==='save-data') Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{saveData:true})});
if(__qa.mode==='denied') HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('QA autoplay refusal','NotAllowedError'));};
const origSet=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'src');
Object.defineProperty(HTMLMediaElement.prototype,'src',{...origSet,set(value){__qa.requests.push(value);__qa.requestContexts.push({src:value,width:innerWidth,clientWidth:document.documentElement.clientWidth,visualWidth:visualViewport?.width,mobile:matchMedia("(max-width: 767px)").matches,heroWidth:document.querySelector(".hero")?.clientWidth,heroHeight:document.querySelector(".hero")?.clientHeight});origSet.set.call(this,__qa.mode==='missing'&&this.id==='hero-video'?'/qa/missing-video.mp4':value);}});
addEventListener('DOMContentLoaded',()=>{
 const v=document.querySelector('#hero-video');
 for(const name of ['play','playing','pause','ended','error'])v.addEventListener(name,()=>__qa.events.push({name,time:v.currentTime,at:performance.now(),muted:v.muted}));
 const label=document.createElement('span');label.id='qa-fixture-label';label.style='position:fixed;right:8px;top:100px;font:10px monospace;color:white;background:#111;z-index:50;padding:4px';label.textContent='QA / '+__qa.mode;document.body.append(label);
});
</script>""".replace('MODE',json.dumps(mode))
   body=(ROOT/'index.html').read_text().replace('<head>','<head>'+init).encode()
   self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
  file=(ROOT/unquote(parsed.path).lstrip('/')).resolve()
  if not file.is_relative_to(ROOT):self.send_error(403);return
  if file.is_file() and self.headers.get('Range'):
   size=file.stat().st_size;match=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers['Range'])
   if not match:self.send_error(416);return
   start=int(match[1]);end=min(int(match[2]) if match[2] else size-1,size-1)
   if start>end:self.send_error(416);return
   self.send_response(206);self.send_header('Content-Type',self.guess_type(str(file)));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(end-start+1));self.end_headers()
   with file.open('rb') as f:
    f.seek(start);remaining=end-start+1
    try:
     while remaining:
      chunk=f.read(min(65536,remaining));self.wfile.write(chunk);remaining-=len(chunk)
    except (BrokenPipeError,ConnectionResetError):pass
   return
  super().do_GET()
 def do_POST(self):
  if self.path not in ['/qa/report','/qa/stability-report','/qa/focus-motion-report']:self.send_error(404);return
  length=int(self.headers.get('Content-Length','0'))
  if length>300000:self.send_error(413);return
  names={'/qa/report':'revised-hero-browser-results.json','/qa/stability-report':'stability-browser-results.json','/qa/focus-motion-report':'focus-motion-browser-results.json'}
  report=json.loads(self.rfile.read(length));path=ROOT/'qa'/names[self.path]
  path.write_text(json.dumps(report,indent=2)+'\n');self.send_response(204);self.end_headers()
if __name__=='__main__':
 port=int(sys.argv[1]) if len(sys.argv)>1 else 4178
 print(f'CARTAN local review http://127.0.0.1:{port}/qa/stability-review.html',flush=True)
 http.server.ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()
