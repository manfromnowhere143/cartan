import {sceneMesh,cameraFor,svgScene,hitPart,clamp} from './scene-geometry.mjs';

/** Owns only drawing and transient pointer preview. Committed state stays in URL.
 * Fallback and GPU use the same mesh, camera, selection and hit-test geometry. */
export function mountSpatialScene({root,commit,window:w=window,loadRenderer=()=>import('./webgl-scene.mjs')}){
  const d=root.ownerDocument,viewport=root.querySelector('#spatial-viewport'),svg=root.querySelector('.module-drawing');
  viewport.tabIndex=0;
  viewport.setAttribute('aria-label','Spatial schematic. Drag horizontally to orbit, or use the view buttons. Arrow keys rotate; Home resets.');
  const canvas=d.createElement('canvas');canvas.className='spatial-canvas';canvas.hidden=true;
  canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive spatial schematic of the module, host and support. Geometry is unverified. The adjacent controls provide every action.');
  viewport.append(canvas);
  const reduced=w.matchMedia('(prefers-reduced-motion: reduce)'),forced=w.matchMedia('(forced-colors: active)');
  let state={},camera=cameraFor(),mesh=sceneMesh(),layout='joined',renderer=null,load=null,raf=0,revision=0,active=false,disposed=false,contextLost=false,unavailable=false,drag=null,draws=0;
  const removers=[];
  const on=(target,name,fn,options)=>{target.addEventListener(name,fn,options);removers.push(()=>target.removeEventListener(name,fn,options));};
  const size=()=>({width:viewport.clientWidth||960,height:viewport.clientHeight||720});
  function draw(){
    if(!active||disposed||d.hidden)return;
    const {width,height}=size();draws++;
    let success=false;
    if(renderer&&state.render!=='drawing'&&!forced.matches&&!w.navigator.connection?.saveData){
      try{success=renderer.draw(mesh,camera,state.part,width,height,w.devicePixelRatio||1);}catch{success=false;}
    }
    if(success){canvas.hidden=false;svg.setAttribute('hidden','');root.dataset.renderer='spatial';}
    else {
      canvas.hidden=true;svg.removeAttribute('hidden');root.dataset.renderer='drawing';
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.innerHTML='<title id="module-drawing-title">Module, host and independent transfer support</title><desc id="module-drawing-desc">A spatial relationship schematic in arbitrary drawing units. No qualified geometry, physical state or operation is depicted.</desc>'+svgScene(mesh,camera,width,height,state.part);
    }
    root.dataset.draws=String(draws);
  }
  function cancel(){
    revision++;if(raf)w.cancelAnimationFrame(raf);raf=0;
    if(drag&&viewport.hasPointerCapture?.(drag.id))viewport.releasePointerCapture(drag.id);
    drag=null;
  }
  async function enhance(){
    if(renderer||load||disposed||contextLost||unavailable||state.render==='drawing'||forced.matches||w.navigator.connection?.saveData||typeof w.WebGL2RenderingContext!=='function')return;
    load=loadRenderer().then(({createGLScene})=>{
      if(disposed||contextLost||!active||state.render==='drawing'||forced.matches||w.navigator.connection?.saveData)return;
      renderer=createGLScene(canvas);unavailable=!renderer;draw();
    }).catch(()=>{renderer=null;unavailable=true;draw();}).finally(()=>{load=null;});
    return load;
  }
  function update(next,{animate=false}={}){
    cancel();state=next;active=!['home','vision'].includes(next.view);
    if(!active)return;
    if((next.layout??'joined')!==layout){layout=next.layout??'joined';mesh=sceneMesh(layout);}
    const target=cameraFor(next),start=camera;
    const angularDistance=Math.max(Math.abs(start.yaw-target.yaw),Math.abs(start.pitch-target.pitch));
    const shouldMove=animate&&angularDistance<=75&&!reduced.matches&&!forced.matches&&state.render!=='drawing'&&!w.navigator.connection?.saveData&&renderer&&
      (Math.abs(start.yaw-target.yaw)>1||Math.abs(start.pitch-target.pitch)>1);
    if(!shouldMove){camera=target;draw();}
    else {
      const token=revision,at=w.performance.now();
      const tick=now=>{
        if(disposed||!active||token!==revision)return;
        const t=Math.min(1,(now-at)/320),k=1-(1-t)**3;
        camera=t===1?target:{...target,yaw:start.yaw+(target.yaw-start.yaw)*k,pitch:start.pitch+(target.pitch-start.pitch)*k};draw();
        raf=t<1?w.requestAnimationFrame(tick):0;
      };raf=w.requestAnimationFrame(tick);
    }
    void enhance();
  }
  on(viewport,'pointerdown',e=>{
    if(!active||e.button!==0)return;cancel();
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:camera,moved:false};
  });
  on(viewport,'pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
    if(!drag.moved&&Math.abs(dx)<5)return;
    if(!drag.moved){drag.moved=true;viewport.setPointerCapture?.(e.pointerId);}
    e.preventDefault();camera={...drag.start,yaw:clamp(drag.start.yaw+dx*.35,-175,175),pitch:clamp(drag.start.pitch+dy*.2,-15,65)};draw();
  });
  on(viewport,'pointerup',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const finished=drag;drag=null;
    if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);
    if(finished.moved){commit({az:Math.round(camera.yaw),el:Math.round(camera.pitch)},{replace:true});return;}
    const rect=viewport.getBoundingClientRect(),{width,height}=size();
    const part=hitPart(mesh,camera,width,height,e.clientX-rect.left,e.clientY-rect.top);
    if(part)commit({part,view:'laboratory',detail:null});
  });
  on(viewport,'pointercancel',()=>{cancel();camera=cameraFor(state);draw();});
  on(viewport,'keydown',e=>{
    if(!active||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;
    e.preventDefault();e.stopPropagation();
    if(e.key==='Home'){commit({camera:'overview',az:undefined,el:undefined});return;}
    const c=cameraFor(state);commit({az:clamp(c.yaw+(e.key==='ArrowLeft'?-15:e.key==='ArrowRight'?15:0),-175,175),el:clamp(c.pitch+(e.key==='ArrowUp'?-8:e.key==='ArrowDown'?8:0),-15,65)},{replace:true});
  });
  on(canvas,'webglcontextlost',e=>{e.preventDefault();contextLost=true;renderer?.dispose();renderer=null;cancel();camera=cameraFor(state);draw();});
  const refresh=()=>{if(active&&!disposed)update(state);};
  on(canvas,'webglcontextrestored',()=>{contextLost=false;unavailable=false;refresh();});
  on(reduced,'change',refresh);on(forced,'change',refresh);
  if(w.navigator.connection?.addEventListener)on(w.navigator.connection,'change',refresh);
  on(d,'visibilitychange',()=>{cancel();if(!d.hidden)refresh();});
  if(typeof w.ResizeObserver==='function'){
    const observer=new w.ResizeObserver(()=>{cancel();camera=cameraFor(state);draw();});observer.observe(viewport);removers.push(()=>observer.disconnect());
  }else on(w,'resize',()=>{cancel();camera=cameraFor(state);draw();});
  return {update,suspend(){active=false;cancel();},dispose(){disposed=true;cancel();renderer?.dispose();renderer=null;removers.forEach(off=>off());canvas.remove();},
    diagnostics:()=>({draws,active,pendingFrame:Boolean(raf),renderer:renderer?'webgl2':'svg',triangles:mesh.reduce((n,f)=>n+f.points.length-2,0)})};
}
