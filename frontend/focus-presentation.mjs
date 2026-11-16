// Adapted from Daniel's retained Nisayon pointer-focus finding; see ADR UI 005.
// Keep real focus and reading order. Only actual pointer focus loses its outline.
const CONTROL='button,a[href],summary,.table-wrap,:is(h1,h2,h3,h4,h5,h6)[tabindex="-1"]';
const MODIFIERS=new Set(['Shift','Control','Alt','Meta','CapsLock']);
export function installFocusPresentation(document) {
  const Element=document.defaultView.Element,marked=new Set();
  let pointerMode=false,disposed=false,pointerTarget=null,completedPointer=null;
  const controlOf=target=>target instanceof Element?target.closest(CONTROL):null;
  const clearActivation=()=>{pointerTarget=null;completedPointer=null;};
  const clear=()=>{for(const node of marked) delete node.dataset.pointerFocus;marked.clear();};
  const mark=target=>{
    if(!pointerMode||!(target instanceof Element)||!document.body.contains(target)) return;
    const node=target.closest(CONTROL);
    if(node){node.dataset.pointerFocus='true';marked.add(node);}
  };
  const pointer=event=>{pointerMode=true;pointerTarget=controlOf(event.target);completedPointer=null;document.documentElement.dataset.focusModality='pointer';mark(event.target);};
  const pointerUp=event=>{completedPointer=pointerTarget&&controlOf(event.target)===pointerTarget?pointerTarget:null;pointerTarget=null;};
  const keyboard=()=>{pointerMode=false;clearActivation();document.documentElement.dataset.focusModality='keyboard';clear();};
  const key=event=>{if(!MODIFIERS.has(event.key))keyboard();};
  const click=event=>{
    // Some webviews dispatch a zero-count MouseEvent after a real touch.
    // Pair the completed pointer gesture with its target, then consume it.
    // A later zero-count AT activation has no pending gesture and stays visible.
    const fromPointer=event.detail>0||Boolean(event.pointerType)||Boolean(completedPointer&&controlOf(event.target)===completedPointer);
    if(fromPointer){if(!pointerMode)pointer(event);clearActivation();}
    else keyboard();
  };
  const focus=event=>mark(event.target);
  document.addEventListener('pointerdown',pointer,true);
  document.addEventListener('pointerup',pointerUp,true);
  document.addEventListener('pointercancel',clearActivation,true);
  document.addEventListener('contextmenu',clearActivation,true);
  const legacy=!document.defaultView.PointerEvent;
  if(legacy){document.addEventListener('mousedown',pointer,true);document.addEventListener('mouseup',pointerUp,true);document.addEventListener('touchstart',pointer,{capture:true,passive:true});document.addEventListener('touchend',pointerUp,{capture:true,passive:true});document.addEventListener('touchcancel',clearActivation,true);}
  document.addEventListener('keydown',key,true);
  document.addEventListener('click',click,true);
  document.addEventListener('focusin',focus,true);
  return ()=>{
    if(disposed)return;disposed=true;clear();clearActivation();
    document.removeEventListener('pointerdown',pointer,true);
    document.removeEventListener('pointerup',pointerUp,true);
    document.removeEventListener('pointercancel',clearActivation,true);
    document.removeEventListener('contextmenu',clearActivation,true);
    if(legacy){document.removeEventListener('mousedown',pointer,true);document.removeEventListener('mouseup',pointerUp,true);document.removeEventListener('touchstart',pointer,true);document.removeEventListener('touchend',pointerUp,true);document.removeEventListener('touchcancel',clearActivation,true);}
    document.removeEventListener('keydown',key,true);
    document.removeEventListener('click',click,true);
    document.removeEventListener('focusin',focus,true);
  };
}
