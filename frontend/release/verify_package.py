from pathlib import Path
from html.parser import HTMLParser
import argparse,base64,hashlib,json,re,xml.etree.ElementTree as ET
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
class Document(HTMLParser):
 def __init__(self,text):
  super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
def verify(package):
 meta=json.loads((ROOT/'seo.json').read_text());static=package/'.vercel/output/static';config=json.loads((package/'.vercel/output/config.json').read_text());receipt=json.loads((package/'release-manifest.json').read_text());checks=[]
 def check(name,condition):
  checks.append({'name':name,'pass':bool(condition)})
  if not condition:raise AssertionError(name)
 check('exact public file allowlist',set(receipt['files'])=={str(p.relative_to(static)) for p in static.rglob('*') if p.is_file()})
 check('sealed routing configuration',hashlib.sha256((package/'.vercel/output/config.json').read_bytes()).hexdigest()==receipt['config_sha256'])
 check('eight real routes',len(meta['pages'])==8)
 titles=[];descs=[]
 for view,p in meta['pages'].items():
  raw=(static/p['path'].lstrip('/')/'index.html').read_text();d=Document(raw);url=meta['origin']+p['path'];titles.append(re.search(r'<title>(.*?)</title>',raw)[1]);descs.append(p['description'])
  check(view+' canonical',[(a.get('href')) for t,a in d.tags if t=='link' and a.get('rel')=='canonical']==[url])
  check(view+' active static content',[a.get('data-view') for t,a in d.tags if t=='section' and 'surface' in a.get('class','') and 'hidden' not in a]==[view])
  check(view+' semantic heading',bool(re.search(r'<section[^>]*data-view="'+view+r'"[^>]*>.*?<h1\b',raw,re.S)))
  if view!='home':check(view+' static return path',any(t=='a' and a.get('id')=='view-back' and 'hidden' not in a for t,a in d.tags))
  graph=re.search(r'<script id="structured-data" type="application/ld\+json">(.*?)</script>',raw,re.S)[1]
  check(view+' graph identity',json.loads(graph)['@graph'][-1]['url']==url)
  digest="sha256-"+base64.b64encode(hashlib.sha256(graph.encode()).digest()).decode()
  check(view+' CSP covers structured data',digest in config['routes'][0]['headers']['Content-Security-Policy'])
  theme=re.search(r'<script id="theme-init">(.*?)</script>',raw,re.S)[1]
  theme_hash='sha256-'+base64.b64encode(hashlib.sha256(theme.encode()).digest()).decode()
  check(view+' CSP covers theme without unsafe-inline',theme_hash in config['routes'][0]['headers']['Content-Security-Policy'] and 'unsafe-inline' not in config['routes'][0]['headers']['Content-Security-Policy'])
  check(view+' light default before scripts',any(t=='html' and a.get('data-theme')=='light' for t,a in d.tags))
  check(view+' stable native appearance switch',any(t=='button' and a.get('id')=='theme-toggle' and a.get('role')=='switch' and a.get('aria-label')=='Dark appearance' and a.get('aria-checked')=='false' and 'hidden' in a for t,a in d.tags))
  check(view+' theme resolves before styles',raw.index('id="theme-init"')<raw.index('rel="stylesheet"'))
  check(view+' one theme-color metadata',sum(t=='meta' and a.get('name')=='theme-color' for t,a in d.tags)==1)
  check(view+' no filesystem URLs','/Users/' not in raw and 'file://' not in raw)
  check(view+' deferred hero source',all('src' not in a and 'loop' in a and 'playsinline' in a and 'muted' in a for t,a in d.tags if t=='video' and a.get('id')=='hero-video'))
  for t,a in d.tags:
   for key in ('src','href','srcset','poster'):
    value=a.get(key,'')
    if value.startswith('/'):
     path=urlsplit(value).path;resolved=static/path.lstrip('/')
     check(view+' local reference '+value,resolved.exists() or path in [p['path'] for p in meta['pages'].values()])
 check('unique titles/descriptions',len(set(titles))==8 and len(set(descs))==8)
 sitemap=ET.parse(static/'sitemap.xml');locs=[n.text for n in sitemap.findall('.//{*}loc')]
 check('exact sitemap scope',set(locs)=={meta['origin']+p['path'] for p in meta['pages'].values()})
 check('robots permits render resources','Allow: /' in (static/'robots.txt').read_text())
 check('no fabricated freshness',not sitemap.findall('.//{*}lastmod'))
 check('404 noindex','noindex' in (static/'404.html').read_text() and config['routes'][-1]['status']==404)
 check('404 shares default and saved appearance','data-theme="light"' in (static/'404.html').read_text() and theme in (static/'404.html').read_text() and '/theme.css' in (static/'404.html').read_text())
 check('preview noindex',any(r.get('missing') and r.get('headers',{}).get('X-Robots-Tag')=='noindex, nofollow' for r in config['routes']))
 check('no private/obsolete artifacts',not any(p in '/'.join(receipt['files']) for p in ['qa/','docs/','.env','memory/','hero-loop','film-review.mp4','validate.py']))
 for rel,value in receipt['files'].items():check('sealed bytes '+rel,hashlib.sha256((static/rel).read_bytes()).hexdigest()==value['sha256'])
 for rel in ['vendor/cartan/v1/fixture.json','assets/cartan-logo.png','assets/scenes/assembly.png']+[str(p.relative_to(ROOT)) for p in (ROOT/'assets/cartan').glob('*')]:check('source asset bytes '+rel,(ROOT/rel).read_bytes()==(static/rel).read_bytes())
 check('artifact bound',receipt['bytes']<31*1024**2)
 return checks
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('package',type=Path);a=p.parse_args();checks=verify(a.package);(a.package/'package-verification.json').write_text(json.dumps(checks,indent=2)+'\n');print(f'{len(checks)} package assertions passed')
