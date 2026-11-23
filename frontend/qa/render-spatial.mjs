// Drawing review only. librsvg output is not a browser/page screenshot.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sceneMesh,cameraFor,svgScene,GEOMETRY_VERSION} from '../scene-geometry.mjs';
const root=new URL('../',import.meta.url),out=new URL('spatial-2026-11-23/',import.meta.url);
await mkdir(out,{recursive:true});
const defaultDrawing=svgScene(sceneMesh(),cameraFor());
if(process.argv.includes('--update-static')){
  const file=new URL('index.html',root),html=await readFile(file,'utf8');
  await writeFile(file,html.replace(/(<svg class="module-drawing"[^>]*>.*?<\/desc>).*?(<\/svg>)/s,(_,a,b)=>a+defaultDrawing+b));
}
const pictures={};
for(const [name,state]of Object.entries({joined:{},separated:{layout:'separated',camera:'interface'},profile:{camera:'profile'},phone:{layout:'separated',camera:'interface'}})){
  const width=name==='phone'?320:960,height=name==='phone'?360:720;
  const picture=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#07090b"/>${svgScene(sceneMesh(state.layout),cameraFor(state),width,height,'retention')}</svg>`;
  await writeFile(new URL(name+'.svg',out),picture);pictures[name]=createHash('sha256').update(picture).digest('hex');
}
await writeFile(new URL('geometry-manifest.json',out),JSON.stringify({version:GEOMETRY_VERSION,units:'arbitrary drawing units',physicalGeometry:'unverified',kind:'explanatory spatial schematic',triangles:484,geometrySHA256:createHash('sha256').update(await readFile(new URL('scene-geometry.mjs',root))).digest('hex'),pictures,limitations:'Original relationship drawing. No qualified CAD, material, trajectory, sensing, simulation or physical-state reconstruction.'},null,2)+'\n');
