"""Authenticated Vercel readback. No authorization material enters the receipt."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,subprocess
import argparse
p=argparse.ArgumentParser(description=__doc__);p.add_argument('package',type=Path);p.add_argument('--deployment',required=True);p.add_argument('--receipt-dir',type=Path,required=True);a=p.parse_args()
BASE=a.receipt_dir.resolve();BASE.mkdir(parents=True,exist_ok=True);PACKAGE=a.package.resolve();DEPLOYMENT=a.deployment
assert DEPLOYMENT.startswith('https://cartan-') and DEPLOYMENT.endswith('-daniels-projects-ca65133a.vercel.app'),'Use an inspected CARTAN deployment hostname'
assert json.loads((PACKAGE/'.vercel/project.json').read_text())['projectId']=='prj_yxSRyqClUe89HnLu7H2oQ39TPV5I'
manifest=json.loads((PACKAGE/'release-manifest.json').read_text())
out=BASE/'candidate-http';out.mkdir(exist_ok=True)
def fetch(path):
    target=out/hashlib.sha256(path.encode()).hexdigest()
    r=subprocess.run(['vercel','curl',path,'--deployment',DEPLOYMENT,'--scope','daniels-projects-ca65133a','--','--silent','--show-error','--compressed','--max-time','40','--dump-header','-','--output',str(target)],cwd=PACKAGE,capture_output=True,text=True,timeout=70)
    if r.returncode:raise RuntimeError('Request failed: '+path)
    blocks=[b for b in r.stdout.replace('\r','').split('\n\n') if b.startswith('HTTP/')]
    if not blocks:raise RuntimeError('No HTTP status: '+path)
    lines=blocks[-1].splitlines();status=int(lines[0].split()[1]);headers={k.lower():v.strip() for s in lines[1:] if ':' in s for k,v in [s.split(':',1)]}
    return status,headers,target.read_bytes()
def verify_file(item):
    name,expected=item
    path='/'+name
    if name.endswith('index.html'):path=path[:-10]
    status,h,data=fetch(path)
    checks={'status':status==200,'sha256':hashlib.sha256(data).hexdigest()==expected['sha256'],'mime_not_sniffed':h.get('x-content-type-options')=='nosniff','noindex_alternate_host':'noindex' in h.get('x-robots-tag','')}
    if name.endswith('.mjs'):checks['module_mime']='javascript' in h.get('content-type','')
    if name.endswith('index.html'):
        checks['csp']="default-src 'none'" in h.get('content-security-policy','')
        checks['canonical_origin']='https://cartan.danielwahnich.dev' in data.decode()
    return {'path':path,'status':status,'bytes':len(data),'checks':checks}
items=[item for item in manifest['files'].items() if item[0]!='404.html']
with ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(verify_file,items))
for path in ['/not-a-cartan-page/','/.env.local','/qa/hero-review.html','/release-review.html','/docs/asset-registry.json']:
    status,h,data=fetch(path);rows.append({'path':path,'status':status,'checks':{'real_404':status==404,'noindex':'noindex' in h.get('x-robots-tag','')}})
for path,destination in [('/index.html','/'),('/research','/research/'),('/research/index.html','/research/')]:
    status,h,data=fetch(path);rows.append({'path':path,'status':status,'checks':{'canonical_redirect':status==308 and h.get('location')==destination}})
status,h,data=fetch('/assets/cartan/cartan-hero-desktop-720p.mp4')
rows.append({'path':'/assets/cartan/cartan-hero-desktop-720p.mp4','checks':{'range_support':h.get('accept-ranges')=='bytes'}})
receipt={'deployment':DEPLOYMENT,'access':'authenticated Vercel CLI; not evidence of public custom-domain availability','requests':rows,'checks':sum(len(r['checks']) for r in rows),'pass':all(all(r['checks'].values()) for r in rows)}
(BASE/'candidate-http.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({k:receipt[k] for k in ['deployment','access','checks','pass']},indent=2))
if not receipt['pass']:
    print(json.dumps([r for r in rows if not all(r['checks'].values())],indent=2));raise SystemExit(1)
