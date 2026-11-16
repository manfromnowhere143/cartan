// Presentation media only. No scientific or hardware authority.
export function staticReason({reducedMotion,saveData,effectiveType}) {
  if(reducedMotion)return 'reduced-motion';
  if(saveData)return 'save-data';
  if(/^(slow-)?2g$/.test(effectiveType??''))return 'slow-connection';
  return null;
}
export function heroSourceFor({width,effectiveType}) {
  return width<768||effectiveType==='3g'
    ? '/assets/cartan/cartan-hero-mobile-540p.mp4'
    : '/assets/cartan/cartan-hero-desktop-720p.mp4';
}
export function createHeroController({video,source,policy,render}) {
  let phase='poster',reason=null,token=0,hasFrame=false,frameRequest=null;
  let userPaused=false,blocked=false,disposed=false;
  const active=()=>{const p=policy();return !disposed&&!staticReason(p)&&p.visible&&p.inView&&!p.filmOpen;};
  const publish=()=>render({phase,reason,hasFrame,attached:video.hasAttribute('src')});
  const cancelFrame=()=>{if(frameRequest!==null)video.cancelVideoFrameCallback?.(frameRequest);frameRequest=null;};
  const stop=()=>{token++;cancelFrame();video.autoplay=false;video.pause();};
  function revealFrame(){
    if(hasFrame){phase='playing';publish();return;}
    if(frameRequest!==null)return;
    const epoch=token;
    const reveal=()=>{
      if(epoch!==token)return;
      frameRequest=null;
      if(!active()||userPaused||!['loading','playing'].includes(phase))return;
      phase='playing';hasFrame=true;publish();
    };
    if(typeof video.requestVideoFrameCallback==='function')frameRequest=video.requestVideoFrameCallback(reveal);
    else reveal();
  }
  function unload(){
    stop();hasFrame=false;
    if(video.hasAttribute('src')){video.removeAttribute('src');video.load();}
  }
  function suspend(){
    if(phase==='playing'||phase==='loading'){phase='paused';stop();publish();}
  }
  function pause(){userPaused=true;suspend();}
  async function play({restart=false}={}){
    if(!active()||userPaused)return;
    reason=null;phase='loading';const epoch=++token;
    video.muted=true;video.defaultMuted=true;video.loop=true;video.playbackRate=1;video.autoplay=true;
    if(!video.hasAttribute('src'))video.src=typeof source==='function'?source(policy()):source;
    // Native loop normally handles this. The ended fallback keeps the painted
    // layer in place; it never crossfades to a poster between repetitions.
    if(restart)video.currentTime=0;
    publish();
    try{
      await video.play();
      if(epoch!==token)return;
      if(!active()||userPaused){suspend();return;}
      revealFrame();
    }catch{
      if(epoch!==token)return;
      blocked=true;phase='blocked';reason='playback-unavailable';unload();publish();
    }
  }
  function sync(){
    if(disposed)return;
    const p=policy(),exclusion=staticReason(p);
    if(exclusion){phase='static';reason=exclusion;unload();publish();return;}
    reason=null;
    if(phase==='static'){phase=userPaused?'paused':'poster';publish();}
    if(!active()){suspend();return;}
    if(userPaused||blocked||phase==='playing'||phase==='loading')return;
    if(p.autoplayDenied){blocked=true;phase='blocked';reason='autoplay-denied';publish();return;}
    void play({restart:video.ended||phase==='ended'});
  }
  function toggle(){
    if(disposed||staticReason(policy()))return;
    if(phase==='playing'||phase==='loading')pause();
    else{userPaused=false;blocked=false;void play({restart:video.ended||phase==='ended'});}
  }
  const ended=()=>{
    if(phase==='static'||!video.hasAttribute('src')||disposed)return;
    phase='ended';reason=null;
    if(active()&&!userPaused&&!blocked)void play({restart:true});
    else publish();
  };
  const nativePlaying=()=>{
    if(!active()||userPaused||!['loading','playing'].includes(phase)){video.pause();return;}
    revealFrame();
  };
  const nativePause=()=>{
    if(!video.paused||!['loading','playing'].includes(phase)||video.ended)return;
    // A pause requested by the browser while visible is also respected.
    if(active())userPaused=true;
    phase='paused';token++;cancelFrame();video.autoplay=false;publish();
  };
  const failure=()=>{
    if(!video.hasAttribute('src')||disposed)return;
    blocked=true;phase='blocked';reason='media-unavailable';unload();publish();
  };
  video.addEventListener('ended',ended);video.addEventListener('playing',nativePlaying);
  video.addEventListener('pause',nativePause);video.addEventListener('error',failure);
  video.autoplay=false;video.muted=true;video.defaultMuted=true;video.loop=true;publish();
  return {sync,pause,suspend,toggle,
    dispose(){disposed=true;phase='disposed';unload();video.removeEventListener('ended',ended);video.removeEventListener('playing',nativePlaying);video.removeEventListener('pause',nativePause);video.removeEventListener('error',failure);},
  };
}
