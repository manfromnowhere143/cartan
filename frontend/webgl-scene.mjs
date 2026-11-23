// One depth-tested mesh pass. No texture, post-processing or idle frame loop.
import {triangleBuffer,fitCamera} from './scene-geometry.mjs';
const VERT=`#version 300 es
precision highp float;
layout(location=0) in vec3 position; layout(location=1) in vec3 normal;
layout(location=2) in float tone; layout(location=3) in float part;
uniform vec2 angles; uniform float cameraDistance; uniform float aspect; uniform vec3 target;
out vec3 n; out float material; flat out float group;
vec3 turn(vec3 p){float cy=cos(angles.x),sy=sin(angles.x),ct=cos(angles.y),st=sin(angles.y);float x=cy*p.x-sy*p.z,z=sy*p.x+cy*p.z;return vec3(x,ct*p.y-st*z,st*p.y+ct*z);}
void main(){vec3 p=turn(position-target);float d=cameraDistance-p.z;n=turn(normal);material=tone;group=part;gl_Position=vec4(p.x*2.46/aspect,p.y*2.46,1.004008*d-.2004008,d);}`;
const FRAG=`#version 300 es
precision highp float;
in vec3 n; in float material; flat in float group; uniform float selected; out vec4 color;
void main(){vec3 N=normalize(n),L=normalize(vec3(-.5,.85,1.));float diffuse=max(dot(N,L),0.);float rim=max(dot(N,normalize(vec3(1.,.2,-.4))),0.);float spec=pow(max(dot(N,normalize(L+vec3(0.,0.,1.))),0.),55.)*.25;float v=material*(.45+diffuse*.8)+rim*.1+spec+(abs(group-selected)<.1?.09:0.);color=vec4(clamp(vec3(v*.88,v*.94,v),.0,1.),1.);}`;
export function createGLScene(canvas){
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false});
  if(!gl)return null;
  const owned=[];
  function shader(type,source){const s=gl.createShader(type);if(!s)throw new Error('Shader allocation failed');owned.push(['shader',s]);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Scene shader unavailable');return s;}
  let program,buffer,vao;const uniforms={};let count=0,lastMesh=null;
  const dispose=()=>{for(const [kind,item]of owned.splice(0)){if(kind==='shader')gl.deleteShader(item);if(kind==='program')gl.deleteProgram(item);if(kind==='buffer')gl.deleteBuffer(item);if(kind==='vao')gl.deleteVertexArray(item);}};
  try{
    program=gl.createProgram();if(!program)throw new Error('Program allocation failed');owned.push(['program',program]);
    gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Scene program unavailable');
    buffer=gl.createBuffer();if(buffer)owned.push(['buffer',buffer]);
    vao=gl.createVertexArray();if(vao)owned.push(['vao',vao]);
    if(!buffer||!vao)throw new Error('Geometry allocation failed');
    gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    for(const [location,size,offset]of [[0,3,0],[1,3,3],[2,1,6],[3,1,7]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,32,offset*4);}
    for(const name of ['angles','cameraDistance','aspect','target','selected'])uniforms[name]=gl.getUniformLocation(program,name);
  }catch{dispose();return null;}
  return {
    draw(mesh,camera,part,width,height,dpr){
      camera=fitCamera(mesh,camera,width,height);
      const ratio=Math.min(dpr,1.5,Math.sqrt(1800000/(width*height)));
      const w=Math.max(1,Math.floor(width*ratio)),h=Math.max(1,Math.floor(height*ratio));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      if(gl.isContextLost())return false;
      gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.useProgram(program);gl.bindVertexArray(vao);
      if(mesh!==lastMesh){const vertices=triangleBuffer(mesh);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);count=vertices.length/8;lastMesh=mesh;}
      gl.uniform2f(uniforms.angles,camera.yaw*Math.PI/180,camera.pitch*Math.PI/180);gl.uniform1f(uniforms.cameraDistance,camera.distance);
      gl.uniform1f(uniforms.aspect,width/height);gl.uniform3fv(uniforms.target,camera.target);gl.uniform1f(uniforms.selected,['module','retention','isolation','support'].indexOf(part));
      gl.drawArrays(gl.TRIANGLES,0,count);return gl.getError()===gl.NO_ERROR;
    },dispose,
  };
}
