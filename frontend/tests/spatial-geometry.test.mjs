import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sceneMesh,cameraFor,fitCamera,project,projectedFaces,hitPart,svgScene,triangleBuffer,PART_NAMES} from '../scene-geometry.mjs';

test('both diagram layouts have finite outward geometry within the resource bound',()=>{
  for(const layout of ['joined','separated']){
    const mesh=sceneMesh(layout),buffer=triangleBuffer(mesh);
    assert.equal(buffer.length/24,484);assert.ok(buffer.every(Number.isFinite));
    assert.deepEqual([...new Set(mesh.map(f=>f.part))].sort(),Object.keys(PART_NAMES).sort());
    for(const f of mesh){
      assert.ok(Math.abs(Math.hypot(...f.normal)-1)<1e-8);
      const [a,b,c]=f.points,u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]);
      const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      assert.ok(cross.reduce((s,n,i)=>s+n*f.normal[i],0)>0,'front-face winding agrees with lighting');
    }
  }
});
test('all preset and orbit extremes retain the whole object at narrow and wide aspect ratios',()=>{
  for(const layout of ['joined','separated'])for(const [width,height]of [[296,250],[366,254],[700,340],[1100,600],[480,480]]){
    const mesh=sceneMesh(layout);
    for(const camera of ['overview','interface','profile'])for(const orbit of [{},{az:175,el:65},{az:-175,el:-15}]){
      const c=fitCamera(mesh,cameraFor({camera,...orbit}),width,height);
      for(const f of mesh)for(const point of f.points){
        const p=project(point,c,width,height);
        assert.ok(p.depth>.1&&p.depth<50);
        assert.ok(p.x>=width*.069&&p.x<=width*.931&&p.y>=height*.099&&p.y<=height*.901);
      }
    }
  }
});
test('picking reaches every relationship in the separated interface view and misses empty space',()=>{
  const mesh=sceneMesh('separated'),camera=cameraFor({camera:'interface'}),parts=new Set();
  for(let y=0;y<720;y+=12)for(let x=0;x<960;x+=12){const part=hitPart(mesh,camera,960,720,x,y);if(part)parts.add(part);}
  assert.deepEqual([...parts].sort(),Object.keys(PART_NAMES).sort());
  assert.equal(hitPart(mesh,camera,960,720,0,0),null);
});
test('static no-JS drawing is exactly the same versioned mesh and default camera',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const body=html.match(/<svg class="module-drawing"[^>]*>(.*?)<\/svg>/s)[1].replace(/^.*?<\/desc>/s,'');
  assert.equal(body===svgScene(sceneMesh(),cameraFor()),true,'regenerate the inspectable static fallback after geometry edits');
});
test('selection changes only light and outline, never mesh positions or authored scientific states',()=>{
  const mesh=sceneMesh(),before=JSON.stringify(mesh);
  const a=svgScene(mesh,cameraFor(),960,720,'retention'),b=svgScene(mesh,cameraFor(),960,720,'isolation');
  const points=s=>[...s.matchAll(/points="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(points(a),points(b));assert.notEqual(a,b);assert.equal(JSON.stringify(mesh),before);
  assert.ok(projectedFaces(mesh,cameraFor(),960,720).length>0);
  const source=readFileSync(new URL('../scene-geometry.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(source,/fetch\(|fixture\.json|loadPinned|observation\./);
});
