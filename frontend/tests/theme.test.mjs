import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {normalizeTheme} from '../theme.mjs';
import {sceneMesh,cameraFor,svgScene} from '../scene-geometry.mjs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const html=read('index.html'),bootstrap=html.match(/<script id="theme-init">(.*?)<\/script>/s)[1];
test('light is the explicit default; only an explicit dark value is accepted',()=>{
  for(const value of [null,undefined,'','system','Dark','auto','garbage'])assert.equal(normalizeTheme(value),'light');
  assert.equal(normalizeTheme('dark'),'dark');
  assert.match(html,/<html[^>]+data-theme="light"/);
  assert.ok(html.indexOf('id="theme-init"')<html.indexOf('rel="stylesheet"'));
});
test('prepaint bootstrap resolves saved and blocked storage without querying OS preference',()=>{
  for(const [saved,blocked,expected]of [[null,false,'light'],['dark',false,'dark'],['wrong',false,'light'],['dark',true,'light']]){
    const root={dataset:{}},metas={};
    vm.runInNewContext(bootstrap,{document:{documentElement:root,querySelector:s=>({setAttribute:(_,v)=>{metas[s]=v;}})},
      localStorage:{getItem:key=>{assert.equal(key,'cartan.appearance');if(blocked)throw Error('denied');return saved;}},matchMedia:()=>{throw Error('OS preference must not replace explicit light default');}});
    assert.equal(root.dataset.theme,expected);assert.equal(metas['meta[name="color-scheme"]'],expected);
  }
});
test('author text colors are semantic foregrounds, never literal muted gray',()=>{
  for(const file of ['style.css','interior.css','theme.css']){
    const css=read(file);
    const values=[...css.matchAll(/(?<![\w-])color:([^;}]+)/g)].map(m=>m[1].trim());
    for(const color of values)assert.ok(['var(--ink)','var(--muted)','var(--bg)','inherit','CanvasText','Highlight'].includes(color),`${file}: ${color}`);
  }
  const css=read('theme.css');assert.match(css,/--muted:var\(--ink\)/);
  assert.match(css,/:root\[data-theme="dark"\]\{--bg:#07090b;--ink:#fff/);
  assert.doesNotMatch(css,/transition:|animation:|forced-color-adjust:none/);
  assert.match(css,/\.interface-drawing text\{fill:var\(--ink\)\}/);
});
test('light and dark projections change materials, not coordinates or scientific state',()=>{
  const mesh=sceneMesh('separated'),camera=cameraFor({camera:'interface'});
  const light=svgScene(mesh,camera,960,720,'isolation','light'),dark=svgScene(mesh,camera,960,720,'isolation','dark');
  const points=s=>[...s.matchAll(/points="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(points(light),points(dark));assert.notEqual(light,dark);
  assert.match(light,/class="selected" stroke="#101419"/);assert.match(dark,/class="selected" stroke="#fff"/);
});
