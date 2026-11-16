"""Verify the canonical CARTAN origin without authentication or relaxed TLS."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
import argparse,hashlib,json,urllib.request,urllib.error,urllib.parse

ORIGIN='https://cartan.danielwahnich.dev'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None

def verify(package):
    manifest=json.loads((package/'release-manifest.json').read_text())
    assert manifest['origin']==ORIGIN
    static=package/'.vercel/output/static'
    opener=urllib.request.build_opener(NoRedirect)
    def fetch(path,byte_range=None,origin=ORIGIN):
        headers={'User-Agent':'CARTAN-publication-verification/1.0'}
        if byte_range:headers['Range']=byte_range
        request=urllib.request.Request(origin+path,headers=headers)
        try:response=opener.open(request,timeout=35)
        except urllib.error.HTTPError as error:response=error
        with response:
            data=response.read(27*1024**2)
            return response.status,{k.lower():v for k,v in response.headers.items()},data
    def file_check(item):
        name,expected=item;path='/'+name
        if name.endswith('index.html'):path=path[:-10]
        status,headers,data=fetch(path)
        checks={'public_200':status==200,
                'exact_release_bytes':hashlib.sha256(data).hexdigest()==expected['sha256'],
                'nosniff':headers.get('x-content-type-options')=='nosniff',
                'https_policy':'max-age=' in headers.get('strict-transport-security','')}
        if name.startswith('vendor/'):checks['fixture_not_indexed']='noindex' in headers.get('x-robots-tag','')
        else:checks['not_accidentally_noindexed']='noindex' not in headers.get('x-robots-tag','')
        if name.startswith('assets/'):checks['assets_revalidate']='must-revalidate' in headers.get('cache-control','')
        if name.endswith('.mjs'):checks['module_mime']='javascript' in headers.get('content-type','')
        if name.endswith('index.html'):
            checks['canonical']=('rel="canonical" href="'+ORIGIN+path+'"').encode() in data
            checks['content_security_policy']="default-src 'none'" in headers.get('content-security-policy','')
            checks['html_revalidates']='must-revalidate' in headers.get('cache-control','')
        return {'path':path,'status':status,'bytes':len(data),'checks':checks}
    with ThreadPoolExecutor(max_workers=3) as pool:
        rows=list(pool.map(file_check,[(k,v) for k,v in manifest['files'].items() if k!='404.html']))
    for path in ['/not-a-cartan-page/','/.env.local','/qa/hero-review.html','/release-review.html','/docs/asset-registry.json','/qa/stability-review.html','/assets/vision.jpg','/assets/module.jpg']:
        status,headers,data=fetch(path)
        rows.append({'path':path,'status':status,'checks':{
            'real_404':status==404,'noindex':'noindex' in headers.get('x-robots-tag',''),
            'reviewed_error_page':data==(static/'404.html').read_bytes()}})
    for route in manifest['pages']:
        paths=[route+'index.html']+([route.rstrip('/')] if route!='/' else [])
        for path in paths:
            status,headers,_=fetch(path)
            rows.append({'path':path,'status':status,'checks':{'canonical_redirect':status==308 and headers.get('location')==route}})
    status,headers,_=fetch('/',origin='http://cartan.danielwahnich.dev')
    rows.append({'path':'http://cartan.danielwahnich.dev/','status':status,'checks':{'redirect_to_https':status in [301,308] and headers.get('location')==ORIGIN+'/'}})
    for name in ['cartan-hero-desktop-720p.mp4','CARTAN-Built-to-Change-Revised-Silent-21s-1080p.mp4']:
        path='/assets/cartan/'+name;status,headers,data=fetch(path,'bytes=0-1023')
        rows.append({'path':path,'range':'bytes=0-1023','status':status,'checks':{
            'partial_content':status==206,'content_range':headers.get('content-range','').startswith('bytes 0-1023/'),
            'original_range_bytes':data==(static/path.lstrip('/')).read_bytes()[:1024]}})
    return {'checked_at':datetime.now(timezone.utc).isoformat(),'origin':ORIGIN,
            'authentication':'none','tls':'normal certificate and hostname validation; no bypass',
            'checks':sum(len(r['checks']) for r in rows),'pass':all(all(r['checks'].values()) for r in rows),'requests':rows}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('package',type=Path);parser.add_argument('--receipt',type=Path,required=True);args=parser.parse_args()
    receipt=verify(args.package);args.receipt.parent.mkdir(parents=True,exist_ok=True);args.receipt.write_text(json.dumps(receipt,indent=2)+'\n')
    print(json.dumps({k:v for k,v in receipt.items() if k!='requests'},indent=2))
    if not receipt['pass']:
        print(json.dumps([r for r in receipt['requests'] if not all(r['checks'].values())],indent=2));raise SystemExit(1)
