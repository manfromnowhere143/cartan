import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const css=read('style.css'),app=read('app.mjs'),html=read('index.html');
// Parse nested CSS blocks so a hover rule outside a capability query fails.
function rules(text,parents=[]){
  text=text.replace(/\/\*[\s\S]*?\*\//g,'');const out=[];let start=0;
  while(start<text.length){
    const open=text.indexOf('{',start);if(open<0)break;
    const selector=text.slice(start,open).trim();let depth=1,end=open+1;
    for(;end<text.length&&depth;end++){if(text[end]==='{')depth++;else if(text[end]==='}')depth--;}
    assert.equal(depth,0,'balanced CSS blocks');const body=text.slice(open+1,end-1);
    if(selector.startsWith('@'))out.push(...rules(body,[...parents,selector]));
    else out.push({selector,body,parents});start=end;
  }return out;
}
const parsed=rules(css);
test('route and component changes cannot blank, translate or animate a surface',()=>{
  assert.doesNotMatch(app,/\.animate\s*\(|startViewTransition|currentTransition/);
  assert.doesNotMatch(css,/backdrop-filter|mix-blend-mode|data-view=laboratory/);
  for(const r of parsed.filter(r=>/opacity\s*:/.test(r.body))) {
    assert.doesNotMatch(r.selector,/\.surface|\.study-art|\.site-header|:focus|:hover/);
  }
});
test('keyboard focus stays visible without a white fill, shadow or geometry change',()=>{
  const focus=parsed.filter(r=>r.selector.includes('a:focus-visible'));
  assert.ok(focus.length);
  for(const r of focus){assert.match(r.body,/outline:2px solid/);assert.doesNotMatch(r.body,/background|box-shadow|transform|padding|margin|opacity/);}
  assert.doesNotMatch(app,/\.blur\s*\(/,'do not remove focus to hide the symptom');
});
test('hover is restricted to fine pointers and never moves or fills controls',()=>{
  const hover=parsed.filter(r=>r.selector.includes(':hover'));assert.ok(hover.length);
  for(const r of hover){
    assert.ok(r.parents.some(p=>p.includes('(hover:hover)')&&p.includes('(pointer:fine)')));
    assert.doesNotMatch(r.body,/background|opacity|transform|box-shadow|transition|filter|padding|margin/);
  }
});
test('public controls use bounded decorative SVGs, with no glyph pictograms',()=>{
  assert.doesNotMatch(html+app,/[↗↻▷Ⅱ×←]/);
  const icons=[...html.matchAll(/<svg\b[^>]*>/g)];assert.ok(icons.length>=20);
  for(const [tag] of icons){assert.match(tag,/aria-hidden="true"/);assert.match(tag,/focusable="false"/);assert.match(tag,/width="16" height="16"/);}
  assert.match(html,/class="control-label">Play motion/);
  assert.match(app,/motionButton\.setAttribute\('aria-label',label\)/);
});
test('explorer and horizon avoid the rejected imagery without removing concept labels',()=>{
  const explorer=html.match(/<div class="study-art">([\s\S]*?)<\/div>/)[1];
  assert.match(explorer,/cartan-hero-poster\.jpg/);assert.doesNotMatch(explorer,/module\.jpg|loading="lazy"/);
  assert.match(html,/assets\/scenes\/assembly\.png/);assert.doesNotMatch(html,/assets\/vision\.jpg/);
  assert.match(html,/GENERATED ASSEMBLY CONCEPT \/ UNVALIDATED/);
});

test('only actual pointer-marked focus suppresses an outline, with forced colors preserved',()=>{
  const suppress=parsed.filter(r=>r.selector.includes('[data-pointer-focus="true"]'));
  assert.equal(suppress.length,1);assert.match(suppress[0].selector,/:focus/);
  assert.ok(suppress[0].parents.includes('@media(forced-colors:none)'));
  assert.match(read('focus-presentation.mjs'),/pointerdown/);assert.doesNotMatch(read('focus-presentation.mjs'),/\.blur\s*\(/);
  assert.match(app,/installFocusPresentation\(document\)/);
});
test('mobile cinema cannot be hidden by a width rule or crop the supplied action',()=>{
  for(const r of parsed.filter(r=>r.selector.includes('video')&&r.body.includes('display:none'))){
    assert.ok(r.parents.some(p=>p.includes('prefers-reduced-motion')));
  }
  assert.match(css,/aspect-ratio:16\/9/);assert.match(css,/object-fit:contain/);
  assert.match(html,/<video id="hero-video"[^>]* playsinline loop preload="none"/);
});
