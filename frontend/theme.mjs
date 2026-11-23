// Appearance is independent of route/selection and never restarts media.
export const THEME_KEY='cartan.appearance';
export const normalizeTheme=value=>value==='dark'?'dark':'light';
export function installTheme({document:d=document,window:w=window}={}){
  const root=d.documentElement,button=d.querySelector('#theme-toggle');
  let sessionOnly=false;
  function apply(value,{persist=false}={}){
    const theme=normalizeTheme(value),changed=root.dataset.theme!==theme;
    root.dataset.theme=theme;
    d.querySelector('meta[name="color-scheme"]')?.setAttribute('content',theme);
    d.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#07090b':'#ffffff');
    button?.setAttribute('aria-checked',String(theme==='dark'));
    if(persist)try{w.localStorage.setItem(THEME_KEY,theme);sessionOnly=false;}catch{sessionOnly=true;}
    if(changed)d.dispatchEvent(new w.CustomEvent('cartan:themechange',{detail:{theme}}));
  }
  const toggle=()=>apply(root.dataset.theme==='dark'?'light':'dark',{persist:true});
  const storage=e=>{
    if(e.key!==THEME_KEY&&e.key!==null)return;
    try{if(e.storageArea&&e.storageArea!==w.localStorage)return;}catch{return;}
    sessionOnly=false;
    apply(e.key===null?'light':e.newValue);
  };
  const restore=()=>{if(sessionOnly)return;try{apply(w.localStorage.getItem(THEME_KEY));}catch{/* Retain the session choice. */}};
  apply(root.dataset.theme);if(button){button.hidden=false;button.addEventListener('click',toggle);}
  w.addEventListener('storage',storage);w.addEventListener('pageshow',restore);
  return {dispose(){button?.removeEventListener('click',toggle);w.removeEventListener('storage',storage);w.removeEventListener('pageshow',restore);}};
}
