const $=s=>document.querySelector(s),frame=$('#frame'),reports=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function load(){
  const [w,h]=$('#size').value.split('x').map(Number),scale=Math.min(1,(innerWidth-32)/w);
  frame.style.width=w+'px';frame.style.height=h+'px';frame.style.transform=`scale(${scale})`;
  $('#stage').style.width=w*scale+'px';$('#stage').style.height=h*scale+'px';
  const loaded=new Promise(resolve=>frame.onload=resolve);
  frame.src='/qa/frame?mode='+$('#mode').value+'&revision='+Date.now();await loaded;await wait(600);
  $('#status').textContent='Loaded '+$('#size').value+' / '+$('#mode').value;
}
async function check(){
  const w=frame.contentWindow,d=w.document,checks=[];
  const add=(name,pass,details)=>checks.push({name,pass:Boolean(pass),details});
  const click=selector=>{const n=d.querySelector(selector);if(!n)throw Error('Missing '+selector);n.click();};
  const routeLinks={laboratory:'/laboratory/',question:'/research/',evidence:'/evidence/',interruption:'/interruption/',comparison:'/comparison/',sources:'/sources/',vision:'/vision/'};
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
  const hero=d.querySelector('#hero-video'),staticPolicy=w.innerWidth<768||w.innerWidth/w.innerHeight<1||['reduced','save-data'].includes($('#mode').value);
  if(staticPolicy)add('Excluded policy has no hero source or attachments',!hero.hasAttribute('src')&&w.__qa.requests.length===0);
  if(!d.querySelector('#motion-toggle').hidden&&['playing','loading'].includes(d.querySelector('.hero').dataset.playback))click('#motion-toggle');
  const initialTime=hero.currentTime;
  for(const [view,path] of Object.entries(routeLinks)){
    click('a[href="'+path+'"]');await wait(30);
    add(view+' active view and focus',d.querySelector('.surface.active')?.dataset.view===view&&d.activeElement.matches('h1,h2'));
    add(view+' no entrance animation',d.getAnimations().length===0);
    add(view+' dark root',w.getComputedStyle(d.documentElement).backgroundColor==='rgb(7, 9, 11)');
    add(view+' no horizontal overflow',d.documentElement.scrollWidth<=w.innerWidth);
    if(view==='laboratory'){
      const img=d.querySelector('.study-art img');await img.decode().catch(()=>{});
      const before=rect(img),style=w.getComputedStyle(img);
      for(const b of d.querySelectorAll('[data-component]')){b.click();await wait(20);add(b.dataset.component+' stable image',JSON.stringify(before)===JSON.stringify(rect(img))&&d.getAnimations().length===0);}
      add('Explorer image has no compositor effects',style.mixBlendMode==='normal'&&style.opacity==='1'&&style.filter==='none'&&style.transform==='none');
      const b=d.querySelector('[data-component]');b.focus({focusVisible:true});const focused=w.getComputedStyle(b);
      add('Focus does not fill or shadow control',focused.backgroundColor==='rgba(0, 0, 0, 0)'&&focused.boxShadow==='none');
    }
    if(view==='evidence'){for(const b of d.querySelectorAll('[data-evidence]')){b.click();add('Honest '+b.dataset.evidence,d.querySelectorAll('.outcome-line b').length===3&&[...d.querySelectorAll('.outcome-line b')].every(n=>n.textContent==='Not measured'));}}
  }
  click('.brand');add('Returning home preserves pause',hero.paused&&Math.abs(hero.currentTime-initialTime)<.1);
  click('.film-open');add('Film opens paused with focus',d.querySelector('#film-dialog').open&&d.querySelector('#film-video').paused&&d.activeElement.id==='film-close');
  click('#film-close');add('Film close restores trigger focus',d.activeElement.matches('.film-open'));
  add('No runtime errors',w.__qa.errors.length===0,w.__qa.errors);
  const report={at:new Date().toISOString(),viewport:$('#size').value,mode:$('#mode').value,checks,cls:w.__qa.shifts,ua:navigator.userAgent};reports.push(report);
  $('#results').textContent=JSON.stringify(report,null,2);$('#status').textContent=checks.filter(c=>c.pass).length+'/'+checks.length+' passed';
  await fetch('/qa/stability-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reports})});
}
$('#load').onclick=load;$('#check').onclick=check;
$('#matrix').onclick=async()=>{for(const [size,mode] of [['1440x900','normal'],['1280x720','normal'],['768x1024','normal'],['390x844','normal'],['320x740','normal'],['3440x1440','normal'],['1440x900','reduced'],['1440x900','save-data'],['1440x900','denied'],['1440x900','missing']]){$('#size').value=size;$('#mode').value=mode;await load();await check();}};
await load();
