/** CARTAN spatial-schematic/1.0.0. Graphic units only. No qualified CAD.
 * Mesh positions explain relationships. Separation is a diagram layout, never
 * a physical trajectory. This module has no fixture, sensor or command access. */
export const GEOMETRY_VERSION='spatial-schematic/1.0.0';
export const PART_NAMES={module:'Module envelope',retention:'Host retention',isolation:'Electrical boundary',support:'Transfer support'};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const unit=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function bevelBox(center,size,bevel,part,tone=.38){
  const e=size.map(v=>v/2),b=Math.min(bevel,...e.map(v=>v*.48)),faces=[];
  function face(points){
    let n=unit(cross(sub(points[1],points[0]),sub(points[2],points[0])));
    const middle=points[0].map((_,i)=>points.reduce((sum,p)=>sum+p[i],0)/points.length);
    if(dot(n,middle)<0){points.reverse();n=n.map(v=>-v);}
    faces.push({part,tone,normal:n,points:points.map(p=>p.map((v,i)=>v+center[i]))});
  }
  for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
    const [u,v]=[0,1,2].filter(i=>i!==axis);
    face([[-1,-1],[1,-1],[1,1],[-1,1]].map(([su,sv])=>{const p=[0,0,0];p[axis]=sign*e[axis];p[u]=su*(e[u]-b);p[v]=sv*(e[v]-b);return p;}));
  }
  for(let a=0;a<3;a++)for(let d=a+1;d<3;d++)for(const sa of [-1,1])for(const sd of [-1,1]){
    const z=3-a-d;
    face([[0,-1],[1,-1],[1,1],[0,1]].map(([edge,sz])=>{const p=[0,0,0];p[a]=sa*(e[a]-(edge?b:0));p[d]=sd*(e[d]-(edge?0:b));p[z]=sz*(e[z]-b);return p;}));
  }
  for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){
    const signs=[x,y,z];face([0,1,2].map(axis=>e.map((v,i)=>signs[i]*(v-(axis===i?0:b)))));
  }
  return faces;
}
export function sceneMesh(layout='joined'){
  const separated=layout==='separated',faces=[];
  const add=(center,size,bevel,part,tone)=>faces.push(...bevelBox(center,size,bevel,part,tone));
  const mz=separated ? .58 : 0,hz=separated ? -2.1 : -1.5,sy=separated ? -1.65 : -1.08;
  // A generic envelope and inset plane; no invented internal equipment.
  add([0,0,mz],[2.5,1.55,2.3],.11,'module',.39);
  add([0,0,1.159+mz],[2.16,1.21,.065],.04,'module',.22);
  add([0,.79,mz],[2.05,.055,1.85],.025,'module',.29);
  // Four bars make the host relationship legible from either side.
  for(const x of [-1.55,1.55])add([x,0,hz],[.24,2.18,.32],.045,'retention',.50);
  for(const y of [-1,1])add([0,y,hz],[2.9,.24,.32],.045,'retention',.50);
  // A featureless boundary marker: deliberately no pins, circuit or latch teeth.
  add([0,-.05,hz+.19],[1.12,.68,.07],.035,'isolation',.28);
  for(const x of [-1.32,1.32])add([x,sy,.06],[.22,.20,2.85],.035,'support',.40);
  add([0,sy,-1.12],[2.75,.20,.26],.035,'support',.40);
  return faces;
}
export function cameraFor(state={}){
  const preset={overview:[-32,24,6.9],interface:[145,15,7.1],profile:[-86,12,7.1]}[state.camera??'overview'];
  return {yaw:state.az??preset[0],pitch:state.el??preset[1],distance:preset[2],target:[0,-.15,-.25]};
}
export function rotate(p,camera){
  const y=camera.yaw*Math.PI/180,t=camera.pitch*Math.PI/180,cy=Math.cos(y),sy=Math.sin(y),ct=Math.cos(t),st=Math.sin(t);
  const x=cy*p[0]-sy*p[2],z=sy*p[0]+cy*p[2];
  return [x,ct*p[1]-st*z,st*p[1]+ct*z];
}
export function project(point,camera,width,height){
  const p=rotate(sub(point,camera.target),camera),depth=camera.distance-p[2],s=height*1.23/depth;
  return {x:width/2+p[0]*s,y:height/2-p[1]*s,depth};
}
// Frame the whole relationship, including on a narrow screen. Graphic framing
// never changes mesh coordinates or the authored scientific state.
export function fitCamera(mesh,camera,width,height){
  let distance=3.5;
  for(const face of mesh)for(const point of face.points){
    const [x,y,z]=rotate(sub(point,camera.target),camera);
    distance=Math.max(distance,z+Math.abs(x)*height*1.23/(width*.43),z+Math.abs(y)*1.23/.40);
  }
  return {...camera,distance};
}
export function projectedFaces(mesh,camera,width,height){
  camera=fitCamera(mesh,camera,width,height);
  return mesh.map(face=>({...face,projected:face.points.map(p=>project(p,camera,width,height))})).filter(face=>{
    const [a,b,c]=face.projected;return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)<0;
  }).sort((a,b)=>b.projected.reduce((s,p)=>s+p.depth,0)/b.points.length-a.projected.reduce((s,p)=>s+p.depth,0)/a.points.length);
}
export function hitPart(mesh,camera,width,height,x,y){
  const faces=projectedFaces(mesh,camera,width,height).reverse();
  for(const face of faces){
    const ps=face.projected;
    for(let i=1;i<ps.length-1;i++){
      const tri=[ps[0],ps[i],ps[i+1]],signs=tri.map((a,j)=>{const b=tri[(j+1)%3];return (b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x);});
      if(signs.every(s=>s<=.001)||signs.every(s=>s>=-.001))return face.part;
    }
  }
  return null;
}
export function svgScene(mesh,camera,width=960,height=720,part='module'){
  const light=unit([-.5,.85,1]),rim=unit([1,.2,-.4]);
  const polygons=projectedFaces(mesh,camera,width,height).map(face=>{
    const n=rotate(face.normal,camera),diff=Math.max(0,dot(n,light)),edge=Math.max(0,dot(n,rim));
    const v=clamp(face.tone*(.45+diff*.8)+edge*.1+(part===face.part ? .09 : 0),.06,.85);
    const fill='#'+[v*.88,v*.94,v].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');
    const points=face.projected.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return `<polygon data-geometry="${face.part}"${part===face.part?' class="selected" stroke="#9cabb6"':''} points="${points}" fill="${fill}"/>`;
  }).join('');
  return `<g stroke="#414c55" stroke-width=".55" stroke-linejoin="round">${polygons}</g>`;
}
export function triangleBuffer(mesh){
  const rows=[];const parts=Object.keys(PART_NAMES);
  for(const f of mesh)for(let i=1;i<f.points.length-1;i++)for(const p of [f.points[0],f.points[i],f.points[i+1]])rows.push(...p,...f.normal,f.tone,parts.indexOf(f.part));
  return new Float32Array(rows);
}
