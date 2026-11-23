// API-contract mocks, not shader compilation or a real GPU/browser test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createGLScene} from '../webgl-scene.mjs';
import {sceneMesh,cameraFor} from '../scene-geometry.mjs';
function api({fail=null}={}){
  const allocated=[],deleted=[],uploads=[],draws=[],shaderSources=[];let lost=false;
  const create=kind=>{if(fail===kind)return null;const item={kind};allocated.push(item);return item;};
  const gl={
    createShader:()=>create('shader'),createProgram:()=>create('program'),createBuffer:()=>create('buffer'),createVertexArray:()=>create('vao'),
    deleteShader:o=>deleted.push(o),deleteProgram:o=>deleted.push(o),deleteBuffer:o=>deleted.push(o),deleteVertexArray:o=>deleted.push(o),
    getShaderParameter:()=>fail!=='compile',getProgramParameter:()=>fail!=='link',
    shaderSource:(s,source)=>shaderSources.push(source),getUniformLocation:(_,name)=>name,
    bufferData:(_,data)=>uploads.push(data.length),drawArrays:(_,first,count)=>draws.push(count),
    isContextLost:()=>lost,getError:()=>0,NO_ERROR:0,
  };
  for(const fn of ['compileShader','attachShader','linkProgram','bindVertexArray','bindBuffer','enableVertexAttribArray','vertexAttribPointer','viewport','clearColor','clear','enable','useProgram','uniform2f','uniform1f','uniform1i','uniform3fv'])gl[fn]=()=>{};
  const canvas={width:0,height:0,getContext:()=>gl};
  return {canvas,gl,allocated,deleted,uploads,draws,shaderSources,lose:()=>{lost=true;}};
}
test('context absence and partial allocation failure preserve a clean fallback',()=>{
  assert.equal(createGLScene({getContext:()=>null}),null);
  for(const fail of ['program','shader','compile','link','buffer','vao']){
    const f=api({fail});assert.equal(createGLScene(f.canvas),null);
    assert.deepEqual(new Set(f.deleted),new Set(f.allocated),fail);
  }
});
test('mesh upload is reused, pixels stay bounded and resources are disposed exactly once',()=>{
  const f=api(),renderer=createGLScene(f.canvas),mesh=sceneMesh();
  for(const part of ['module','retention','isolation','support'])assert.equal(renderer.draw(mesh,cameraFor(),part,4000,2400,3),true);
  assert.equal(f.uploads.length,1);assert.deepEqual(f.draws,[1452,1452,1452,1452]);
  assert.ok(f.canvas.width*f.canvas.height<=1800000);
  renderer.draw(sceneMesh('separated'),cameraFor(),null,320,250,3);assert.equal(f.uploads.length,2);
  assert.equal(f.canvas.width,480);assert.equal(f.canvas.height,375);
  f.lose();assert.equal(renderer.draw(mesh,cameraFor(),'module',320,250,1),false);
  renderer.dispose();renderer.dispose();assert.deepEqual(new Set(f.deleted),new Set(f.allocated));assert.equal(f.deleted.length,f.allocated.length);
});
test('appearance changes update the palette uniform without a second geometry upload',()=>{
  const f=api(),uniforms=[];f.gl.uniform1i=(name,value)=>uniforms.push([name,value]);
  const renderer=createGLScene(f.canvas),mesh=sceneMesh(),allocated=f.allocated.length;
  for(const theme of ['light','dark'])assert.equal(renderer.draw(mesh,cameraFor(),'isolation',960,720,1,theme),true);
  assert.deepEqual(uniforms,[['lightTheme',1],['lightTheme',0]]);
  assert.equal(f.uploads.length,1);assert.equal(f.allocated.length,allocated);renderer.dispose();
});
