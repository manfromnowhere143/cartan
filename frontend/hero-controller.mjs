// Presentation media only. This controller has no scientific or hardware authority.
export function staticReason({width, aspect, reducedMotion, saveData}) {
  if (reducedMotion) return 'reduced-motion';
  if (saveData) return 'save-data';
  if (width < 768) return 'mobile';
  // Keep every supplied shot's working area within the landscape composition.
  if (aspect < 1.5 || aspect > 2) return 'framing';
  return null;
}
export function createHeroController({video, source, policy, render}) {
  let phase='poster', reason=null, attempted=false, token=0, hasFrame=false;
  const active=()=>{const p=policy();return !staticReason(p)&&p.visible&&p.inView&&!p.filmOpen;};
  const publish=()=>render({phase,reason,hasFrame,attached:video.hasAttribute('src')});
  const stop=()=>{token++;video.autoplay=false;video.pause();};
  function unload() {
    stop();hasFrame=false;
    if(video.hasAttribute('src')) {video.removeAttribute('src');video.load();}
  }
  function pause() {
    if(phase==='playing'||phase==='loading') {phase='paused';stop();publish();}
  }
  async function play({replay=false}={}) {
    if(!active()) {sync();return;}
    if(phase==='ended'&&!replay) return;
    attempted=true;reason=null;phase='loading';
    const epoch=++token;
    video.muted=true;video.defaultMuted=true;video.loop=false;video.playbackRate=1;
    if(replay) {hasFrame=false;video.currentTime=0;}
    video.autoplay=true;
    if(!video.hasAttribute('src')) video.src=source;
    publish();
    try {
      await video.play();
      if(epoch!==token) return;
      if(!active()||phase==='paused') {pause();return;}
      phase='playing';hasFrame=true;publish();
    } catch {
      if(epoch!==token) return;
      phase='blocked';reason='playback-unavailable';unload();publish();
    }
  }
  function sync() {
    const p=policy(), exclusion=staticReason(p);
    if(exclusion) {phase='static';reason=exclusion;unload();publish();return;}
    reason=null;
    if(phase==='static') {phase='poster';publish();}
    if(!active()) {pause();return;}
    if(!attempted) {
      // Where exposed, a denied policy can avoid even the metadata request.
      if(p.autoplayDenied) {attempted=true;phase='blocked';reason='autoplay-denied';publish();}
      else void play();
    }
  }
  function toggle() {
    if(phase==='playing'||phase==='loading') pause();
    else void play({replay:phase==='ended'});
  }
  const ended=()=>{
    if(phase==='static'||!video.hasAttribute('src')) return;
    phase='ended';reason=null;stop();hasFrame=false;publish();
  };
  const nativePlaying=()=>{
    if(!active()||!['loading','playing'].includes(phase)) {video.pause();return;}
    phase='playing';hasFrame=true;publish();
  };
  const nativePause=()=>{
    if(!['loading','playing'].includes(phase)||video.ended) return;
    phase='paused';token++;video.autoplay=false;publish();
  };
  const failure=()=>{
    if(!video.hasAttribute('src')) return;
    phase='blocked';reason='media-unavailable';unload();publish();
  };
  video.addEventListener('ended',ended);
  video.addEventListener('playing',nativePlaying);
  video.addEventListener('pause',nativePause);
  video.addEventListener('error',failure);
  video.autoplay=false;video.muted=true;publish();
  return {sync,pause,toggle,
    dispose(){unload();video.removeEventListener('ended',ended);video.removeEventListener('playing',nativePlaying);video.removeEventListener('pause',nativePause);video.removeEventListener('error',failure);},
  };
}
