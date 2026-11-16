"""Build only the public CARTAN surface, with static HTML for each real route."""
from pathlib import Path
import argparse,base64,hashlib,html,json,re,shutil,subprocess
ROOT=Path(__file__).resolve().parents[1]
def build(target):
 target=target.resolve();target.mkdir(parents=True,exist_ok=True)
 assert not any(target.iterdir()),'Use an empty release directory; never replace an existing release'
 out=target/'.vercel/output';static=out/'static';static.mkdir(parents=True)
 meta=json.loads((ROOT/'seo.json').read_text());origin=meta['origin'];pages=meta['pages']
 runtime=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {SITE,graphFor} from "+json.dumps((ROOT/'routes.mjs').as_uri())+";console.log(JSON.stringify({site:SITE,graphs:Object.fromEntries(Object.keys(SITE.pages).map(v=>[v,graphFor(v)]))}))"],text=True))
 assert runtime['site']==meta,'Source/runtime metadata drift'
 source=(ROOT/'index.html').read_text();hashes=[]
 for view,p in pages.items():
  text=source.replace('data-view="home"','data-view="'+view+'"',1).replace('<html lang="en"','<html class="has-router" lang="en"',1)
  def surface(m):
   tag=m[0];name=re.search(r'data-view="([^"]+)"',tag)[1]
   tag=re.sub(r'\sactive(?=[ "])','',tag)
   if name==view:tag=re.sub('class="([^"]+)"',lambda x:'class="'+x[1]+' active"',tag)
   else:tag=tag[:-1]+' hidden inert>'
   return tag
  text=re.sub(r'<section\b[^>]*class="surface\b[^>]*>',surface,text)
  if view!='home':
   pattern=r'(<section[^>]*data-view="'+view+r'".*?)(</section>)'
   text=re.sub(pattern,lambda m:re.sub(r'<h2(\b[^>]*>)(.*?)</h2>',r'<h1\1\2</h1>',m[1],count=1,flags=re.S)+m[2],text,flags=re.S)
  url=origin+p['path'];esc=lambda v:html.escape(v,quote=True)
  graph=json.dumps(runtime['graphs'][view],ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
  hashes.append("'sha256-"+base64.b64encode(hashlib.sha256(graph.encode()).digest()).decode()+"'")
  metadata='\n'.join([
   '<title>'+esc(p['title'])+'</title>',
   '<meta name="description" content="'+esc(p['description'])+'">',
   '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
   '<link rel="canonical" href="'+url+'">',
   '<meta name="author" content="Daniel Wahnich">',
   '<meta property="og:type" content="website">','<meta property="og:site_name" content="CARTAN">','<meta property="og:locale" content="en_US">',
   '<meta property="og:title" content="'+esc(p['title'])+'">','<meta property="og:description" content="'+esc(p['description'])+'">','<meta property="og:url" content="'+url+'">',
   '<meta property="og:image" content="'+origin+meta['image']+'">','<meta property="og:image:width" content="1920">','<meta property="og:image:height" content="1080">','<meta property="og:image:alt" content="'+esc(meta['imageAlt'])+'">',
   '<meta name="twitter:card" content="summary_large_image">','<meta name="twitter:title" content="'+esc(p['title'])+'">','<meta name="twitter:description" content="'+esc(p['description'])+'">','<meta name="twitter:image" content="'+origin+meta['image']+'">','<meta name="twitter:image:alt" content="'+esc(meta['imageAlt'])+'">',
   '<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml" sizes="any">','<link rel="manifest" href="/site.webmanifest">','<meta name="theme-color" content="#07090b">',
   '<script id="structured-data" type="application/ld+json">'+graph+'</script>'
  ])
  text=re.sub(r'<title>.*?</title>|<meta name="description"[^>]*>|<link rel="icon"[^>]*>','',text)
  text=text.replace('</head>',metadata+'\n</head>')
  path=static/p['path'].lstrip('/')/'index.html';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text)
 assets=['style.css','app.mjs','adapter.mjs','contract-adapter.mjs','hero-controller.mjs','routes.mjs','assets/cartan-logo.png','assets/module.jpg','assets/vision.jpg','assets/icons/favicon.svg','vendor/cartan/v1/fixture.json']
 assets += ['assets/cartan/'+n for n in ['cartan-hero-desktop-720p.mp4','cartan-hero-poster.jpg','cartan-hero-poster-mobile.jpg','CARTAN-Built-to-Change-Revised-Silent-21s-1080p.mp4']]
 for rel in assets:
  dest=static/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/rel,dest)
 (static/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n')
 (static/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+origin+p['path']+'</loc></url>\n' for p in pages.values())+'</urlset>\n')
 (static/'site.webmanifest').write_text(json.dumps({'id':'/','name':'CARTAN — Spacecraft serviceability research','short_name':'CARTAN','start_url':'/','scope':'/','display':'browser','background_color':'#07090b','theme_color':'#07090b','icons':[{'src':'/assets/icons/favicon.svg','sizes':'any','type':'image/svg+xml','purpose':'any'}]},indent=2)+'\n')
 (static/'llms.txt').write_text('# CARTAN\n\n> Spacecraft serviceability research by Daniel Wahnich.\n\n## Research boundaries\n\nThe public interface presents proposed methods, concept imagery and an explicitly synthetic fixture. It does not establish flight hardware, validated mechanics, physical safety or comparative performance. Missing and unmeasured outcomes are not zero.\n\n## Pages\n\n'+''.join('- ['+p['title']+']('+origin+p['path']+'): '+p['description']+'\n' for p in pages.values())+'\nThis optional machine-readable guide is not a ranking mechanism or evidence source.\n')
 (static/'404.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — CARTAN</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/style.css"></head><body><main class="workspace"><p class="eyebrow">CARTAN / 404</p><h1>This page is not here.</h1><p><a class="action" href="/">Return to CARTAN ↗</a></p></main></body></html>')
 csp="default-src 'none'; script-src 'self' "+' '.join(hashes)+"; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests"
 routes=[{'src':'/.*','headers':{'Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()','Strict-Transport-Security':'max-age=31536000','Cache-Control':'public, max-age=0, must-revalidate'},'continue':True},
 {'src':'/.*','missing':[{'type':'host','value':'cartan.danielwahnich.dev'}],'headers':{'X-Robots-Tag':'noindex, nofollow'},'continue':True},
 {'src':'/vendor/.*','headers':{'X-Robots-Tag':'noindex','Cache-Control':'public, max-age=3600'},'continue':True},
 {'src':'/assets/.*','headers':{'Cache-Control':'public, max-age=86400'},'continue':True}]
 for p in pages.values():
  path=p['path'];routes.append({'src':path+'index\\.html','status':308,'headers':{'Location':path}})
  if path!='/':routes.append({'src':path.rstrip('/'),'status':308,'headers':{'Location':path}})
  routes.append({'src':path,'dest':path+'index.html'})
 routes.extend([{'handle':'filesystem'},{'src':'/.*','status':404,'dest':'/404.html','headers':{'X-Robots-Tag':'noindex'}}])
 (out/'config.json').write_text(json.dumps({'version':3,'routes':routes},indent=2)+'\n')
 (target/'vercel.json').write_text('{"framework":null}\n')
 files={str(p.relative_to(static)):{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(static.rglob('*')) if p.is_file()}
 receipt={'origin':origin,'pages':[p['path'] for p in pages.values()],'files':files,'bytes':sum(x['bytes'] for x in files.values()),'config_sha256':hashlib.sha256((out/'config.json').read_bytes()).hexdigest()}
 (target/'release-manifest.json').write_text(json.dumps(receipt,indent=2)+'\n')
 print(json.dumps({'package':str(target),'pages':len(pages),'files':len(files),'bytes':receipt['bytes']},indent=2))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('target',type=Path);build(parser.parse_args().target)
