// Actual SVG drawing output, not a page/browser screenshot.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sceneMesh,cameraFor,svgScene,GEOMETRY_VERSION} from '../scene-geometry.mjs';
const root=new URL('../',import.meta.url),out=new URL('theme-2026-11-23/',import.meta.url);
await mkdir(out,{recursive:true});
if(process.argv.includes('--update-static')){
  const file=new URL('index.html',root),html=await readFile(file,'utf8');
  await writeFile(file,html.replace(/(<svg class="module-drawing"[^>]*>.*?<\/desc>).*?(<\/svg>)/s,(_,a,b)=>a+svgScene(sceneMesh(),cameraFor())+b));
}
const pictures={};
for(const theme of ['light','dark'])for(const state of [
  {name:'module',part:'module'},
  {name:'interface',part:'isolation',camera:'interface',layout:'separated'},
  {name:'narrow',part:'isolation',camera:'interface',layout:'separated',width:320,height:360},
]){
  const width=state.width??960,height=state.height??720,name=theme+'-'+state.name;
  const picture=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${theme==='light'?'#fff':'#07090b'}"/>${svgScene(sceneMesh(state.layout),cameraFor(state),width,height,state.part,theme)}</svg>`;
  await writeFile(new URL(name+'.svg',out),picture);pictures[name]=createHash('sha256').update(picture).digest('hex');
}
await writeFile(new URL('geometry-manifest.json',out),JSON.stringify({version:GEOMETRY_VERSION,kind:'Explanatory drawing; not a page screenshot or CAD',geometrySHA256:createHash('sha256').update(await readFile(new URL('scene-geometry.mjs',root))).digest('hex'),meshSHA256:createHash('sha256').update(JSON.stringify({joined:sceneMesh(),separated:sceneMesh('separated')})).digest('hex'),pictures},null,2)+'\n');
