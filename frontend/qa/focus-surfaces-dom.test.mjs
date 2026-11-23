// Regression for the actual user-reported viewport focus omission. DOM only;
// native pointer focus and capture are modelled, never claimed as device input.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './interior-dom-fixture.mjs';

function pointer(f,node,type,values={}){
  const event=new f.w.Event(type,{bubbles:true,cancelable:true});
  Object.assign(event,{pointerId:1,button:0,clientX:10,clientY:10,...values});
  node.dispatchEvent(event);return event;
}
function key(f,node,key){node.dispatchEvent(new f.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));}

test('nested drawing and canvas clicks share the pointer-focus policy in both themes',async()=>{
  for(const storedTheme of ['light','dark']){
    const f=await fixture({url:'/laboratory/?camera=interface&layout=separated',storedTheme});
    try{
      const v=f.d.querySelector('#spatial-viewport');
      for(const node of [v.querySelector('svg polygon'),v.querySelector('canvas')]){
        assert.ok(node);key(f,v,'Tab');
        pointer(f,node,'pointerdown');v.focus();
        assert.equal(f.d.activeElement,v,'native focus is retained');
        assert.equal(v.dataset.pointerFocus,'true','pointer scene must use the shared suppression rule');
        pointer(f,node,'pointerup');
        node.dispatchEvent(new f.w.MouseEvent('click',{bubbles:true,detail:0}));
        assert.equal(v.dataset.pointerFocus,'true','completed webview touch remains pointer-originated');
        key(f,v,'ArrowRight');
        assert.equal(v.dataset.pointerFocus,undefined,'keyboard indicator returns without moving focus');
        assert.equal(f.d.documentElement.dataset.focusModality,'keyboard');
        assert.equal(f.d.activeElement,v);
      }
    }finally{await f.close();}
  }
});

test('cancelled scene input and later assistive activation retain visible focus eligibility',async()=>{
  const f=await fixture({url:'/laboratory/'});
  try{
    const v=f.d.querySelector('#spatial-viewport');
    pointer(f,v,'pointerdown');v.focus();pointer(f,v,'pointercancel');
    v.dispatchEvent(new f.w.MouseEvent('click',{bubbles:true,detail:0}));
    assert.equal(v.dataset.pointerFocus,undefined);
    assert.equal(f.d.documentElement.dataset.focusModality,'keyboard');
    pointer(f,v,'pointerdown');pointer(f,v,'pointerup');
    f.w.dispatchEvent(new f.w.Event('blur'));
    v.dispatchEvent(new f.w.MouseEvent('click',{bubbles:true,detail:0}));
    assert.equal(v.dataset.pointerFocus,undefined,'stale gesture cannot survive leaving the window');
  }finally{await f.close();}
});

test('capture loss abandons the transient orbit; normal release commits once',async()=>{
  const f=await fixture({url:'/laboratory/?camera=interface'});
  try{
    const v=f.d.querySelector('#spatial-viewport');let captured=false;
    v.setPointerCapture=()=>{captured=true;};v.hasPointerCapture=()=>captured;
    v.releasePointerCapture=()=>{captured=false;pointer(f,v,'lostpointercapture');};
    const initial=f.w.location.href;
    pointer(f,v,'pointerdown');v.focus();pointer(f,v,'pointermove',{clientX:80});
    captured=false;pointer(f,v,'lostpointercapture');
    pointer(f,v,'pointermove',{clientX:140});pointer(f,v,'pointerup',{clientX:140});
    assert.equal(f.w.location.href,initial,'interrupted drag cannot commit an abandoned camera');
    const length=f.w.history.length;
    pointer(f,v,'pointerdown');pointer(f,v,'pointermove',{clientX:80});pointer(f,v,'pointerup',{clientX:80});
    assert.notEqual(f.w.location.href,initial);assert.equal(f.w.history.length,length);
    const committed=f.w.location.href;pointer(f,v,'lostpointercapture');
    assert.equal(f.w.location.href,committed,'normal post-release capture loss preserves committed state');
    assert.equal(v.dataset.pointerFocus,'true');
  }finally{await f.close();}
});

test('all custom tab stops declare a shared focus policy and native editing/media are excluded',async()=>{
  const f=await fixture({url:'/laboratory/'});
  try{
    const custom=[...f.d.querySelectorAll('[tabindex="0"]')].filter(n=>!n.matches('a,button,input,select,textarea,video,audio'));
    assert.ok(custom.includes(f.d.querySelector('#spatial-viewport')));
    for(const n of custom)assert.ok(n.matches('.table-wrap,[data-focus-surface]'),`${n.id||n.className} has a focus contract`);
    for(const tag of ['input','textarea','select','video','audio']){
      const n=f.d.createElement(tag);n.tabIndex=0;f.d.body.append(n);
      pointer(f,n,'pointerdown');n.focus();assert.equal(n.dataset.pointerFocus,undefined,tag);
    }
    for(const n of f.d.querySelectorAll('.table-wrap,summary,#theme-toggle,[data-camera],[data-component],.instrument-rail a')){
      pointer(f,n,'pointerdown');n.focus();assert.equal(n.dataset.pointerFocus,'true',n.id||n.textContent);
      key(f,n,'Tab');assert.equal(n.dataset.pointerFocus,undefined);
    }
  }finally{await f.close();}
});
