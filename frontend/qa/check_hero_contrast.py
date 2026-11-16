"""Conservative white-frame contrast bound for retained hero layout rectangles.
Uses the checked-in scrim stops, ignores the nav's extra dark background and
screen blending (both improve light-text contrast here). Not pixel-level or
whole-site WCAG certification. Update stops when hero CSS changes.
"""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def interp(t,stops):
 for (a,x),(b,y) in zip(stops,stops[1:]):
  if t<=b:return x+(y-x)*max(0,(t-a)/(b-a))
 return stops[-1][1]
def lum(rgb):
 v=[c/255 for c in rgb];v=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in v]
 return sum(c*w for c,w in zip(v,[.2126,.7152,.0722]))
latest={}
for row in json.loads((ROOT/'revised-hero-browser-results.json').read_text())['reports']:
 if row['kind']=='matrix-layout' and row['mode']=='normal':latest[tuple(row['viewport'])]=row
results=[]
for (w,h),row in latest.items():
 vals=[]
 for t in row['text']:
  if t['text']=='CARTAN':continue
  x=min(w,t['right'])/w;y=t['bottom']/h
  horizontal=([(0,222/255),(.75,191/255),(1,184/255)] if w<768 else [(0,224/255),(.65,199/255),(1,115/255)] if w<=1050 else [(0,224/255),(.38,209/255),(.54,184/255),(.67,115/255),(1,31/255)])
  vertical=([(0,0),(.5,0),(.82,217/255),(1,1)] if w<768 else [(0,0),(.62,0),(.88,230/255),(1,1)])
  topstops=([(0,184/255),(.28,0),(1,0)] if w<768 else [(0,217/255),(.12,184/255),(.26,0),(1,0)])
  left=interp(x,horizontal);bottom=interp(t['y']/h,vertical);top=interp(y,topstops)
  bg=[(255*(1-top)*(1-bottom)+5*bottom)*(1-left)]*3
  fg=list(map(int,re.findall(r'\d+',t['color'])))
  if t['text'] in ['Research','Laboratory','Evidence']:fg=[f*.7+b*.3 for f,b in zip(fg,bg)]
  # Include the film metadata's weaker foreground in the same control rectangle.
  if t['text'].startswith('Watch the concept'):fg=[196,205,211]
  ratio=(lum(fg)+.05)/(lum(bg)+.05);required=3 if float(t['font'][:-2])>=24 else 4.5
  vals.append({'text':t['text'],'ratio_lower_bound':round(ratio,2),'required':required,'pass':ratio>=required})
 results.append({'viewport':[w,h],'worst_case_white_frame':vals})
(ROOT/'revised-hero-contrast.json').write_text(json.dumps(results,indent=2)+'\n')
for row in results:
 print(row['viewport'],'minimum',min(v['ratio_lower_bound'] for v in row['worst_case_white_frame']))
assert all(v['pass'] for row in results for v in row['worst_case_white_frame'])
